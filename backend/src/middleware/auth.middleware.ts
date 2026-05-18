// JWT authentication middleware for protected API routes.
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { USER_ROLES } from "../constants/domain";
import { MESSAGES } from "../constants/messages";
import { AuthRequest, JwtPayload } from "../types";

const isJwtPayload = (payload: string | jwt.JwtPayload): payload is JwtPayload => {
  return (
    typeof payload !== "string" &&
    typeof payload.id === "string" &&
    USER_ROLES.includes(payload.role)
  );
};

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : undefined;

  if (!token) {
    res.status(401).json({ message: MESSAGES.AUTH_TOKEN_REQUIRED });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    res.status(500).json({ message: MESSAGES.JWT_SECRET_MISSING });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (!isJwtPayload(decoded)) {
      res.status(401).json({ message: MESSAGES.INVALID_AUTH_TOKEN });
      return;
    }

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: MESSAGES.INVALID_AUTH_TOKEN });
  }
};
