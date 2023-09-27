import { Response } from "express";

export const successResponse = (
  res: Response,
  data: any,
  code: number = 200
) => {
  return res.status(code).json({
    status: code,
    success: true,
    data,
  });
};
