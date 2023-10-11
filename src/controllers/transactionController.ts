import { Request, Response, NextFunction } from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { CustomError } from "../exceptions/customError";
import { TransactionRepository } from "../repositories/transactionRepository";
import { successResponse } from "../responses/successResponse";
import { UserRepository } from "../repositories/userRepository";
import { IUser } from "../interfaces/user";
import { AccountRepository } from "../repositories/accountRepository";
import { createTransactionValidateInput } from "../validators/transactionValidation";
import { EventRepository } from "../repositories/eventRepository";
import { EVENT_TYPES } from "../constants";

export class TransactionController {
  private transactionRepository: TransactionRepository;
  private userRepository: UserRepository;
  private accountRepository: AccountRepository;
  private eventRepository: EventRepository;
  constructor({
    transactionRepository,
    userRepository,
    accountRepository,
    eventRepository,
  }: {
    transactionRepository: TransactionRepository;
    userRepository: UserRepository;
    accountRepository: AccountRepository;
    eventRepository: EventRepository;
  }) {
    this.transactionRepository = transactionRepository;
    this.userRepository = userRepository;
    this.accountRepository = accountRepository;
    this.eventRepository = eventRepository;
  }

  createTransaction = asyncErrorHandler(
    async (req: Request | any, res: Response, next: NextFunction) => {
      const validationResult = (await createTransactionValidateInput(
        req.body
      )) as any;
      if (validationResult?.status === "fail") {
        return next(validationResult);
      }
      const foundUser = (await this.userRepository.findUserByEmail(
        req.user.email
      )) as IUser | any;

      if (!foundUser) {
        return next(new CustomError("User not found", 404));
      }

      const account = await this.accountRepository.findAccountByAccountNumber(
        validationResult.transactionAccount
      );

      if (!account) {
        return next(new CustomError("Account not found", 404));
      }
      if (validationResult.transactionType === "debit") {
        if (account.accountBalance < validationResult.transactionAmount) {
          return next(
            new CustomError("Insufficient funds to complete transaction", 400)
          );
        } else {
          await this.accountRepository.updateAccountBalance(
            -validationResult.transactionAmount,
            validationResult.transactionAccount
          );
        }
      } else if (validationResult.transactionType === "credit") {
        await this.accountRepository.updateAccountBalance(
          validationResult.transactionAmount,
          validationResult.transactionAccount
        );
      } else {
        return next(new CustomError("Invalid transaction type", 400));
      }
      validationResult.transactionOwner = foundUser._id;
      const createdTransaction =
        await this.transactionRepository.createTransaction(validationResult);
      await this.eventRepository.createEvent({
        ...req.body,
        owner: foundUser._id,
        eventName: EVENT_TYPES.TRANSACTION_CREATED,
        eventData: { ...req.body },
      });
      successResponse(
        res,
        {
          message: "Transaction was created successfully",
          data: createdTransaction,
        },
        201
      );
    }
  );
}
