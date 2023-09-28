import { AuthController } from "../controllers/authController";
import express from "express";

export const AuthRouter = express.Router();

AuthRouter.post("/register", AuthController.register);
AuthRouter.post("/login", AuthController.login);
