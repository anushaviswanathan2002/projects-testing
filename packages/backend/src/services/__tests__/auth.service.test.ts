import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import * as authService from '../auth.service';
import * as connection from '../../database/connection';

// Mock the database
vi.mock('../../database/connection', () => ({
  query: vi.fn(),
}));

describe('Auth Service', () => {
  describe('Password hashing and verification', () => {
    it('should hash a password', async () => {
      const password = 'mySecurePassword123';
      const hash = await authService.hashPassword(password);
      expect(hash).not.toEqual(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should verify a correct password', async () => {
      const password = 'mySecurePassword123';
      const hash = await authService.hashPassword(password);
      const isValid = await authService.verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject an incorrect password', async () => {
      const password = 'mySecurePassword123';
      const wrongPassword = 'differentPassword';
      const hash = await authService.hashPassword(password);
      const isValid = await authService.verifyPassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });
  });

  describe('JWT token operations', () => {
    it('should generate a valid token', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const email = 'test@example.com';
      const token = authService.generateToken(userId, email);
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    });

    it('should verify a valid token', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const email = 'test@example.com';
      const token = authService.generateToken(userId, email);
      const payload = authService.verifyToken(token);
      expect(payload).not.toBeNull();
      expect(payload?.userId).toBe(userId);
      expect(payload?.email).toBe(email);
    });

    it('should return null for invalid token', () => {
      const payload = authService.verifyToken('invalid.token.here');
      expect(payload).toBeNull();
    });
  });
});
