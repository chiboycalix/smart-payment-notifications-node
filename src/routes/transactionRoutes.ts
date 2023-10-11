import express from "express";
import { AccountController } from "../controllers/accountController";
import { Account } from "../models/Account";
import { AccountRepository } from "../repositories/accountRepository";
import { verifyToken } from "../middlewares/verifyToken";
import { UserRepository } from "../repositories/userRepository";
import { User } from "../models/User";
import { TransactionController } from "../controllers/transactionController";
import { TransactionRepository } from "../repositories/transactionRepository";
import { Transaction } from "../models/Transaction";
import { EventRepository } from "../repositories/eventRepository";
import { Event } from "../models/Event";

export const TransactionRouter = express.Router();
const userRepository = new UserRepository({ userModel: User });
const accountRepository = new AccountRepository({ accountModel: Account });
const eventRepository = new EventRepository({ eventModel: Event });

const transactionRepository = new TransactionRepository({
  transactionModel: Transaction,
});

const transactionController = new TransactionController({
  transactionRepository,
  userRepository,
  accountRepository,
  eventRepository,
});

TransactionRouter.post(
  "/",
  verifyToken,
  transactionController.createTransaction.bind(transactionController)
);
