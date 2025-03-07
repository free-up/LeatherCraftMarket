
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export interface AuthRequest extends Request {
  user?: { isAdmin: boolean }
}

// Проверка пароля администратора
export function verifyPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

// Создание JWT токена
export function generateToken(): string {
  return jwt.sign({ isAdmin: true }, JWT_SECRET, { expiresIn: '24h' });
}

// Middleware для проверки токена
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Требуется авторизация" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Токен недействителен или истек срок действия" });
    }
    
    req.user = user as { isAdmin: boolean };
    next();
  });
}
