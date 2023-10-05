import express from "express";
import { AuthController } from "../controllers/authController";
import { User } from "../models/User";
import { UserRepository } from "../repositories/userRepository";

export const AuthRouter = express.Router();

const userRepository = new UserRepository({ userModel: User });
const authController = new AuthController({ userRepository });

AuthRouter.post("/register", authController.register.bind(authController));
AuthRouter.post("/login", authController.login.bind(authController));
AuthRouter.post(
  "/forgot-password",
  authController.forgotPassword.bind(authController)
);
