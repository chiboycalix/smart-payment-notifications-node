import express from "express";
import { AuthController } from "../controllers/authController";
import { User } from "../models/User";
import { UserRepository } from "../repositories/userRepository";
import { EventRepository } from "../repositories/eventRepository";
import { Event } from "../models/Event";

export const AuthRouter = express.Router();

const userRepository = new UserRepository({ userModel: User });
const eventRepository = new EventRepository({ eventModel: Event });

const authController = new AuthController({ userRepository, eventRepository });

AuthRouter.post("/register", authController.register.bind(authController));
AuthRouter.post("/login", authController.login.bind(authController));
AuthRouter.post(
  "/forgot-password",
  authController.forgotPassword.bind(authController)
);
AuthRouter.post(
  "/reset-password",
  authController.resetPassword.bind(authController)
);
