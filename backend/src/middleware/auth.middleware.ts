import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.ts';
import { UserRole } from '../../../shared/types/index.ts';

export interface AuthenticatedUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Authentication required. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err: any) {
    res.status(401).json({ success: false, error: 'Invalid or expired authentication token.' });
  }
}

export function requireRoles(...allowedRoles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Forbidden. Role '${req.user.role}' does not have permission to access this resource.`,
      });
      return;
    }

    next();
  };
}
