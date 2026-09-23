import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../database/connection.js';
import { User, JWTPayload } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRY = '7d';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createUser(email: string, username: string, password: string): Promise<User> {
  const id = uuidv4();
  const password_hash = await hashPassword(password);
  
  const result = await query(
    `INSERT INTO users (id, email, username, password_hash) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, email, username, avatar_url, created_at, updated_at`,
    [id, email, username, password_hash]
  );
  
  return {
    ...result.rows[0],
    password_hash: '', // Don't return hash
  };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await query(
    'SELECT id, email, username, password_hash, avatar_url, created_at, updated_at FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await query(
    'SELECT id, email, username, avatar_url, created_at, updated_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

export function generateToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function blacklistToken(token: string): Promise<void> {
  const decoded = jwt.decode(token) as any;
  if (decoded?.exp) {
    const expiresAt = new Date(decoded.exp * 1000);
    await query(
      'INSERT INTO token_blacklist (token, expires_at) VALUES ($1, $2)',
      [token, expiresAt]
    );
  }
}

export async function isTokenBlacklisted(token: string): Promise<boolean> {
  const result = await query(
    'SELECT 1 FROM token_blacklist WHERE token = $1 AND expires_at > NOW()',
    [token]
  );
  return result.rows.length > 0;
}

export async function authenticateUser(email: string, password: string): Promise<{ user: User; token: string } | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const validPassword = await verifyPassword(password, user.password_hash);
  if (!validPassword) return null;

  const token = generateToken(user.id, user.email);

  return {
    user: { ...user, password_hash: '' },
    token,
  };
}
