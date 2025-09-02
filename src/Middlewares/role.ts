import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";

export const checkRole = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden : No permission.." });
    }
    next();
  };
};
