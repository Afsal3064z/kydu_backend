// @ts-nocheck

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import isLoggedIn from '../../src/middlewares/authMiddleware.ts';

// Mocking dotenv.config() to prevent side effects during testing
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

describe('isLoggedIn middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should return 401 if no token provided', () => {
    isLoggedIn(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized: No token provided." });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token format is invalid', () => {
    req.headers.authorization = 'invalidToken';
    isLoggedIn(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized: Invalid token format." });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    req.headers.authorization = 'Bearer invalidToken';
    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      throw new Error('Invalid token');
    });
    isLoggedIn(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized: Invalid token." });
    expect(next).not.toHaveBeenCalled();
  });

  it('should set req.user and call next() if token is valid', () => {
    req.headers.authorization = 'Bearer validToken';
    const decodedToken = { userId: '123' };
    jest.spyOn(jwt, 'verify').mockReturnValueOnce(decodedToken);
    isLoggedIn(req as Request, res as Response, next);
    expect(req.user).toEqual(decodedToken);
    expect(next).toHaveBeenCalled();
  });
});
