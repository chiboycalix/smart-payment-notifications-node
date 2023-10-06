import { Request, Response, NextFunction } from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { CustomError } from "../exceptions/customError";
import { AccountRepository } from "../repositories/accountRepository";
import { successResponse } from "../responses/successResponse";
import { UserRepository } from "../repositories/userRepository";
import { IUser } from "../interfaces/user";

export class AccountController {
  private accountRepository: AccountRepository;
  private userRepository: UserRepository;
  constructor({
    accountRepository,
    userRepository,
  }: {
    accountRepository: AccountRepository;
    userRepository: UserRepository;
  }) {
    this.accountRepository = accountRepository;
    this.userRepository = userRepository;
  }

  createAccount = asyncErrorHandler(
    async (req: Request | any, res: Response, next: NextFunction) => {
      const account = req.body;

      if (
        !account.accountName ||
        !account.accountNumber ||
        !account.accountBalance
      ) {
        return next(
          new CustomError(
            "account name, account balance, and account number are required",
            400
          )
        );
      }
      const foundUser = (await this.userRepository.findUserByEmail(
        req.user.email
      )) as IUser | any;

      if (!foundUser) {
        return next(new CustomError("User not found", 404));
      }
      account.owner = foundUser._id;
      const createdAccount =
        await this.accountRepository.createAccount(account);
      successResponse(
        res,
        { message: "Account was created successfully", data: createdAccount },
        201
      );
    }
  );
}
