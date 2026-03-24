import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

const signToken = (id: string, email: string): string => {
  return jwt.sign({ id, email }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE,
  } as jwt.SignOptions);
};

export const registerUser = async (input: RegisterInput): Promise<{ user: IUser; token: string }> => {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const user = await User.create({
    name: input.name,
    email: input.email,
    password: input.password,
  });

  const token = signToken(user._id.toString(), user.email);
  return { user, token };
};

export const loginUser = async (input: LoginInput): Promise<{ user: IUser; token: string }> => {
  // Explicitly select password (select: false in schema)
  const user = await User.findOne({ email: input.email }).select('+password');

  if (!user || !(await user.comparePassword(input.password))) {
    // Generic message — don't reveal whether email or password was wrong
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = signToken(user._id.toString(), user.email);
  return { user, token };
};

export const getUserById = async (id: string): Promise<IUser> => {
  const user = await User.findById(id);
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  return user;
};
