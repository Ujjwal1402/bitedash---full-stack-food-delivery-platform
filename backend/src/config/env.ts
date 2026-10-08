import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'bitedash-super-secret-production-key-2026',
  jwtExpiresIn: '7d',
  mysql: {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER || 'bitedash',
    password: process.env.MYSQL_PASSWORD || 'bitedash123',
    database: process.env.MYSQL_DATABASE || 'bitedash_db',
  },
  geminiApiKey: process.env.GEMINI_API_KEY || '',
};
