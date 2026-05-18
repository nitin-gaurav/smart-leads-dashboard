import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, JwtPayload } from "../types";

const isJwtPayload = (payload: string | jwt.JwtPayload): payload is JwtPayload => {
  return (
    typeof payload !== "string" &&
    typeof payload.id === "string" &&
    (payload.role === "admin" || payload.role === "sales")
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
    res.status(401).json({ message: "Authentication token is required" });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    res.status(500).json({ message: "JWT_SECRET is not configured" });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (!isJwtPayload(decoded)) {
      res.status(401).json({ message: "Invalid authentication token" });
      return;
    }

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid authentication token" });
  }
};
