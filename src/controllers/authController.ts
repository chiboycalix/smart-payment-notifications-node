import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { CustomError } from "../exceptions/customError";
import { UserRepository } from "../repositories/userRepository";
import { IUser } from "../interfaces/user";
import { successResponse } from "../responses/successResponse";

dotenv.config();
export class AuthController {
  static register = asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: IUser = req.body;

      if (!user.email || !user.password || !user.firstName || !user.lastName) {
        return next(
          new CustomError(
            "Email, password, firstName and lastName are required",
            400
          )
        );
      }
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      const createdUser = (await UserRepository.createUser(user)) as any;
      const token = jwt.sign(
        { email: createdUser.email },
        process.env.JWT_SECRET
      );
      const userWithToken = {
        _id: createdUser._id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
        token,
      };
      if (!createdUser) {
        return next(new CustomError("User not created", 500));
      }
      successResponse(res, userWithToken, 201);
    }
  );
}
