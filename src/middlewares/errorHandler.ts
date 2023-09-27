import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
dotenv.config();

export const devErrors = (res: Response, error: any) => {
  res.status(error.statusCode).json({
    message: error.message,
    status: "fail",
    error: error,
    stack: error.stack,
  });
};

export const testErrors = (res: Response, error: any) => {
  res.status(error.statusCode).json({
    message: error.message,
    status: "test",
    error: error,
    stack: error.stack,
  });
};

export const prodErrors = (res: Response, error: any) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      message: error.message,
      status: error.statusCode,
    });
  } else {
    res.status(500).json({
      message: "Internal Server Error",
      status: "error",
    });
  }
};
export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "fail";
  error.message = error.message || "Internal Server Error";
  if (process.env.NODE_ENV === "test") {
    testErrors(res, error);
  }
  if (process.env.NODE_ENV === "development") {
    devErrors(res, error);
  }
  if (process.env.NODE_ENV === "production") {
    prodErrors(res, error);
  }
};
