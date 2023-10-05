import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { CustomError } from "../exceptions/customError";
import { UserRepository } from "../repositories/userRepository";
import { ILoginUser, IUser } from "../interfaces/user";
import { successResponse } from "../responses/successResponse";
import { JWT_SECRET } from "../config/env";
import { sendEmail } from "../utils/emailSender";

export class AuthController {
  private userRepository: UserRepository;
  constructor({ userRepository }: { userRepository: UserRepository }) {
    this.userRepository = userRepository;
  }

  register = asyncErrorHandler(
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

      const foundUser = (await this.userRepository.findUserByEmail(
        user.email
      )) as IUser;

      if (foundUser) {
        return next(new CustomError("User already exists", 409));
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      const createdUser = (await this.userRepository.createUser(user)) as any;
      const token = jwt.sign({ email: createdUser.email }, JWT_SECRET, {
        expiresIn: "1d",
      });
      const userWithToken = {
        _id: createdUser._id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
        token,
      };
      successResponse(res, userWithToken, 201);
    }
  );

  login = asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: ILoginUser = req.body;
      if (!user.email || !user.password) {
        return next(new CustomError("Email and password are required", 400));
      }

      const foundUser = (await this.userRepository.findUserByEmail(
        user.email
      )) as any;

      if (!foundUser) {
        return next(new CustomError("User not found", 404));
      }

      const isPasswordValid = await bcrypt.compare(
        user.password,
        foundUser.password
      );

      if (!isPasswordValid) {
        return next(new CustomError("Invalid credentials", 401));
      }

      const token = jwt.sign({ email: foundUser.email }, JWT_SECRET, {
        expiresIn: "1d",
      });
      const userWithToken = {
        _id: foundUser._id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        email: foundUser.email,
        token,
      };
      successResponse(res, userWithToken, 200);
    }
  );

  forgotPassword = asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email } = req.body;
      if (!email) {
        return next(new CustomError("Email is required", 400));
      }

      const foundUser = (await this.userRepository.findUserByEmail(
        email
      )) as IUser;

      if (!foundUser) {
        return next(new CustomError("User not found", 404));
      }

      const token = jwt.sign({ email: foundUser.email }, JWT_SECRET, {
        expiresIn: "1d",
      });
      sendEmail({
        email,
        token,
        emailType: "forgotPassword",
        subject: "Forget Password",
        username: foundUser.firstName,
      });
      successResponse(res, { message: "Email sent" }, 200);
    }
  );
}
