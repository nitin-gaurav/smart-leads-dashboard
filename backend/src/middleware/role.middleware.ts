import { NextFunction, Response } from "express";
import { AuthRequest, UserRole } from "../types";

export const requireRole = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  };
};
