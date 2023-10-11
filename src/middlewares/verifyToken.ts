import { Request, Response, NextFunction } from "express";
import { IUser } from "../interfaces/user";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import { CustomError } from "../exceptions/customError";

export const verifyToken = (
  req: Request | any,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];

    if (token) {
      jwt.verify(token, JWT_SECRET as string, (err: any, user: IUser) => {
        if (err) {
          next(new CustomError("Token expired", 403));
          return;
        }
        req.user = user as IUser;
        next();
      });
    } else {
      next(new CustomError("Unauthorized", 401));
    }
  } else {
    next(new CustomError("Unauthorized", 401));
  }
};
