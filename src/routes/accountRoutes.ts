import express from "express";
import { AccountController } from "../controllers/accountController";
import { Account } from "../models/Account";
import { AccountRepository } from "../repositories/accountRepository";
import { verifyToken } from "../middlewares/verifyToken";
import { UserRepository } from "../repositories/userRepository";
import { User } from "../models/User";
import { EventRepository } from "../repositories/eventRepository";
import { Event } from "../models/Event";

export const AccountRouter = express.Router();
const userRepository = new UserRepository({ userModel: User });
const accountRepository = new AccountRepository({ accountModel: Account });
const eventRepository = new EventRepository({ eventModel: Event });

const accountController = new AccountController({
  accountRepository,
  userRepository,
  eventRepository,
});

AccountRouter.post(
  "/",
  verifyToken,
  accountController.createAccount.bind(accountController)
);
