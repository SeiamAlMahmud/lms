import { NextFunction, Request, Response } from "express";
import { UserRole, UserStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../errors/AppError";
import { verifyAccessToken } from "../utils/token";

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user || user.status !== UserStatus.ACTIVE) {
      return next(new AppError("Unauthorized", 401));
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch {
    return next(new AppError("Invalid token", 401));
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403));
    }

    next();
  };
};

export const forbidRoles = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (req.user && roles.includes(req.user.role)) {
      return next(new AppError("Forbidden for this role", 403));
    }

    next();
  };
};
