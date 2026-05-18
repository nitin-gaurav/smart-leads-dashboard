// Auth controllers for registration and login.
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { MESSAGES } from "../constants/messages";
import { User, UserDocument } from "../models/user.model";
import { IAuthBody, ISafeUser } from "../types";

const PASSWORD_MIN_LENGTH = 6;
const BCRYPT_SALT_ROUNDS = 10;

const createToken = (user: Pick<UserDocument, "_id" | "role">): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"];

  if (!jwtSecret || !expiresIn) {
    throw new Error(MESSAGES.JWT_CONFIG_MISSING);
  }

  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    jwtSecret,
    { expiresIn }
  );
};

const toSafeUser = (user: UserDocument): ISafeUser => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const register = async (
  req: Request<unknown, unknown, IAuthBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || password.length < PASSWORD_MIN_LENGTH) {
      res.status(400).json({
        message: MESSAGES.USER_REQUIRED_FIELDS,
      });
      return;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: MESSAGES.EMAIL_EXISTS });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      token: createToken(user),
      user: toSafeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request<unknown, unknown, IAuthBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: MESSAGES.LOGIN_REQUIRED_FIELDS });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: MESSAGES.INVALID_CREDENTIALS });
      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      res.status(401).json({ message: MESSAGES.INVALID_CREDENTIALS });
      return;
    }

    res.status(200).json({
      token: createToken(user),
      user: toSafeUser(user),
    });
  } catch (error) {
    next(error);
  }
};
