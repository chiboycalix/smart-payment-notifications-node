import express from "express";
import { AccountController } from "../controllers/accountController";
import { Account } from "../models/Account";
import { AccountRepository } from "../repositories/accountRepository";
import { verifyToken } from "../middlewares/verifyToken";
import { UserRepository } from "../repositories/userRepository";
import { User } from "../models/User";

export const AccountRouter = express.Router();
const userRepository = new UserRepository({ userModel: User });
const accountRepository = new AccountRepository({ accountModel: Account });
const accountController = new AccountController({
  accountRepository,
  userRepository,
});

AccountRouter.post(
  "/",
  verifyToken,
  accountController.createAccount.bind(accountController)
);
