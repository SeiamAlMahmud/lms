import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { AppError } from "../errors/AppError";

export const validateRequest =
  (schema: AnyZodObject) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      return next(new AppError("Validation failed", 400, result.error.flatten()));
    }

    req.body = result.data.body;
    req.query = result.data.query;
    req.params = result.data.params;
    next();
  };
