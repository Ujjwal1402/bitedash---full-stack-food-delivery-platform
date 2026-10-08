import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const requestCounts = new Map<string, RateLimitRecord>();

export function rateLimiter(maxRequests = 100, windowMs = 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    const record = requestCounts.get(ip);

    if (!record || now > record.resetTime) {
      requestCounts.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    if (record.count >= maxRequests) {
      res.status(429).json({
        success: false,
        error: 'Too many requests. Please slow down and try again shortly.',
      });
      return;
    }

    record.count++;
    next();
  };
}
