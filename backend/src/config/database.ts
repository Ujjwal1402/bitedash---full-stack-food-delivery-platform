import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import { config } from './env.ts';

interface QueryResult<T = any> {
  rows: T[];
  insertId: number;
  affectedRows: number;
}

class DatabaseManager {
  private mode: 'mysql' | 'sqlite' = 'sqlite';
  private mysqlPool: mysql.Pool | null = null;
  private sqliteDb: SqlJsDatabase | null = null;
  private sqliteFilePath: string = path.resolve(process.cwd(), 'database', 'bitedash.sqlite');
  private initialized = false;

  public async init(): Promise<void> {
    if (this.initialized) return;

    // Check if MySQL connection is explicitly enabled or reachable
    if (process.env.MYSQL_HOST) {
      try {
        console.log(`[DB] Attempting connection to MySQL at ${config.mysql.host}:${config.mysql.port}...`);
        const pool = mysql.createPool({
          host: config.mysql.host,
          port: config.mysql.port,
          user: config.mysql.user,
          password: config.mysql.password,
          database: config.mysql.database,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
        });

        // Test connection
        const conn = await pool.getConnection();
        conn.release();
        this.mysqlPool = pool;
        this.mode = 'mysql';
        console.log('[DB] Connected to MySQL successfully.');
        this.initialized = true;
        await this.runMigrationsAndSeeds();
        return;
      } catch (err: any) {
        console.warn(`[DB] MySQL connection failed (${err.message}). Falling back to embedded relational SQL engine.`);
      }
    }

    // SQLite fallback with sql.js
    console.log('[DB] Initializing embedded relational SQLite database...');
    const dataDir = path.dirname(this.sqliteFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const SQL = await initSqlJs();
    if (fs.existsSync(this.sqliteFilePath)) {
      const fileBuffer = fs.readFileSync(this.sqliteFilePath);
      this.sqliteDb = new SQL.Database(fileBuffer);
      console.log('[DB] Loaded existing relational SQLite database.');
    } else {
      this.sqliteDb = new SQL.Database();
      console.log('[DB] Created fresh relational SQLite database.');
    }

    // Enable foreign keys in SQLite
    this.sqliteDb.run('PRAGMA foreign_keys = ON;');
    this.mode = 'sqlite';
    this.initialized = true;

    await this.runMigrationsAndSeeds();
  }

  private inTransaction = false;

  private saveSqlite(): void {
    if (this.inTransaction) return;
    if (this.mode === 'sqlite' && this.sqliteDb) {
      try {
        const data = this.sqliteDb.export();
        fs.writeFileSync(this.sqliteFilePath, Buffer.from(data));
      } catch (err) {
        console.error('[DB] Failed to persist SQLite data:', err);
      }
    }
  }

  public async runMigrationsAndSeeds(): Promise<void> {
    const migrationsPath = path.resolve(process.cwd(), 'database', 'migrations', '001_initial_schema.sql');
    const seedsPath = path.resolve(process.cwd(), 'database', 'seeds', '001_seed_data.sql');

    // Check if tables already exist
    const checkTables = await this.query<{ name: string }>(
      this.mode === 'mysql'
        ? "SELECT table_name as name FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'users'"
        : "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
    );

    if (checkTables.length > 0) {
      console.log('[DB] Database tables already initialized.');
      return;
    }

    console.log('[DB] Running initial migrations...');
    if (fs.existsSync(migrationsPath)) {
      let migrationSql = fs.readFileSync(migrationsPath, 'utf-8');
      if (this.mode === 'sqlite') {
        migrationSql = this.adaptSqlForSqlite(migrationSql);
      }
      await this.runRawScript(migrationSql);
      console.log('[DB] Migration complete.');
    }

    console.log('[DB] Running initial seed data...');
    if (fs.existsSync(seedsPath)) {
      let seedSql = fs.readFileSync(seedsPath, 'utf-8');
      if (this.mode === 'sqlite') {
        seedSql = this.adaptSqlForSqlite(seedSql);
      }
      await this.runRawScript(seedSql);
      console.log('[DB] Seed data loaded successfully.');
    }

    this.saveSqlite();
  }

  private adaptSqlForSqlite(sql: string): string {
    return sql
      .replace(/INT AUTO_INCREMENT PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
      .replace(/DECIMAL\(\d+,\s*\d+\)/gi, 'NUMERIC')
      .replace(/ON UPDATE CURRENT_TIMESTAMP/gi, '')
      .replace(/ENGINE\s*=\s*InnoDB/gi, '')
      .replace(/INDEX\s+\w+\s*\([^)]+\),?/gi, '') // SQLite handles indices separately
      .replace(/,\s*\);/g, ');');
  }

  private async runRawScript(sql: string): Promise<void> {
    if (this.mode === 'mysql' && this.mysqlPool) {
      const conn = await this.mysqlPool.getConnection();
      try {
        const statements = sql
          .split(';')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
        for (const statement of statements) {
          await conn.query(statement);
        }
      } finally {
        conn.release();
      }
    } else if (this.sqliteDb) {
      this.sqliteDb.exec(sql);
      this.saveSqlite();
    }
  }

  public async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.initialized) await this.init();

    if (this.mode === 'mysql' && this.mysqlPool) {
      const [rows] = await this.mysqlPool.query(sql, params);
      return rows as T[];
    }

    if (!this.sqliteDb) throw new Error('Database not initialized');

    try {
      const stmt = this.sqliteDb.prepare(sql);
      stmt.bind(params);
      const rows: T[] = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject() as unknown as T);
      }
      stmt.free();
      return rows;
    } catch (err: any) {
      console.error('[DB Query Error]', err.message, 'SQL:', sql, 'Params:', params);
      throw err;
    }
  }

  public async queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    return rows.length > 0 ? rows[0] : null;
  }

  public async execute(sql: string, params: any[] = []): Promise<{ insertId: number; affectedRows: number }> {
    if (!this.initialized) await this.init();

    if (this.mode === 'mysql' && this.mysqlPool) {
      const [result]: any = await this.mysqlPool.execute(sql, params);
      return {
        insertId: result.insertId || 0,
        affectedRows: result.affectedRows || 0,
      };
    }

    if (!this.sqliteDb) throw new Error('Database not initialized');

    try {
      this.sqliteDb.run(sql, params);
      const insertIdResult = this.sqliteDb.exec('SELECT last_insert_rowid() as id');
      const insertId =
        insertIdResult.length > 0 && insertIdResult[0].values.length > 0
          ? (insertIdResult[0].values[0][0] as number)
          : 0;

      const affectedResult = this.sqliteDb.exec('SELECT changes() as affected');
      const affectedRows =
        affectedResult.length > 0 && affectedResult[0].values.length > 0
          ? (affectedResult[0].values[0][0] as number)
          : 1;

      this.saveSqlite();
      return { insertId, affectedRows };
    } catch (err: any) {
      console.error('[DB Execute Error]', err.message, 'SQL:', sql, 'Params:', params);
      throw err;
    }
  }

  public async transaction<T>(callback: (trx: DatabaseManager) => Promise<T>): Promise<T> {
    if (!this.initialized) await this.init();

    if (this.mode === 'mysql' && this.mysqlPool) {
      const conn = await this.mysqlPool.getConnection();
      await conn.beginTransaction();
      try {
        const trxProxy = {
          query: async (sql: string, params: any[] = []) => {
            const [rows] = await conn.query(sql, params);
            return rows as any;
          },
          queryOne: async (sql: string, params: any[] = []) => {
            const [rows]: any = await conn.query(sql, params);
            return rows.length > 0 ? rows[0] : null;
          },
          execute: async (sql: string, params: any[] = []) => {
            const [res]: any = await conn.execute(sql, params);
            return { insertId: res.insertId, affectedRows: res.affectedRows };
          },
        } as unknown as DatabaseManager;

        const result = await callback(trxProxy);
        await conn.commit();
        return result;
      } catch (err) {
        await conn.rollback();
        throw err;
      } finally {
        conn.release();
      }
    }

    // SQLite transaction
    if (!this.sqliteDb) throw new Error('Database not initialized');
    this.inTransaction = true;
    this.sqliteDb.run('BEGIN TRANSACTION;');
    try {
      const result = await callback(this);
      try {
        this.sqliteDb.run('COMMIT;');
      } catch {
        // Already committed
      }
      this.inTransaction = false;
      this.saveSqlite();
      return result;
    } catch (err: any) {
      try {
        this.sqliteDb.run('ROLLBACK;');
      } catch {
        // SQLite may auto-rollback on constraint errors
      }
      this.inTransaction = false;
      throw err;
    }
  }

  public getMode(): 'mysql' | 'sqlite' {
    return this.mode;
  }
}

export const db = new DatabaseManager();
