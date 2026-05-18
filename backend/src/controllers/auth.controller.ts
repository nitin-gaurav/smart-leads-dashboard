import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { User, UserDocument } from "../models/user.model";
import { UserRole } from "../types";

const PASSWORD_MIN_LENGTH = 6;
const BCRYPT_SALT_ROUNDS = 10;

interface AuthBody {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

const createToken = (user: Pick<UserDocument, "_id" | "role">): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"];

  if (!jwtSecret || !expiresIn) {
    throw new Error("JWT configuration is incomplete");
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

const toSafeUser = (user: UserDocument) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const register = async (
  req: Request<unknown, unknown, AuthBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || password.length < PASSWORD_MIN_LENGTH) {
      res.status(400).json({
        message: "Name, email, and a password of at least 6 characters are required",
      });
      return;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
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
  req: Request<unknown, unknown, AuthBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      res.status(401).json({ message: "Invalid credentials" });
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
