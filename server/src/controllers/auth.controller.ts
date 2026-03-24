import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import * as AuthService from '../services/auth.service';
import { env } from '../config/env';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { user, token } = await AuthService.registerUser(req.body);

  res
    .status(201)
    .cookie('token', token, COOKIE_OPTIONS)
    .json(
      ApiResponse.success('Account created successfully', {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      }),
    );
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, token } = await AuthService.loginUser(req.body);

  res
    .status(200)
    .cookie('token', token, COOKIE_OPTIONS)
    .json(
      ApiResponse.success('Login successful', {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      }),
    );
});

// @desc    Logout user — clear auth cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res
    .status(200)
    .clearCookie('token', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    .json(ApiResponse.success('Logged out successfully'));
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  // req.user is set by the protect middleware
  const user = await AuthService.getUserById(req.user!.id);

  res.status(200).json(
    ApiResponse.success('User fetched successfully', {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }),
  );
});
