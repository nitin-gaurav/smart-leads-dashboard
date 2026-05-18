// Role authorization middleware for restricted API routes.
import { NextFunction, Response } from "express";
import { MESSAGES } from "../constants/messages";
import { AuthRequest, UserRole } from "../types";

export const requireRole = (
  ...roles: UserRole[]
): ((req: AuthRequest, res: Response, next: NextFunction) => void) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: MESSAGES.FORBIDDEN });
      return;
    }

    next();
  };
};
