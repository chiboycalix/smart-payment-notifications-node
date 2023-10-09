import { Request, Response, NextFunction } from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { CustomError } from "../exceptions/customError";
import { AccountRepository } from "../repositories/accountRepository";
import { successResponse } from "../responses/successResponse";
import { UserRepository } from "../repositories/userRepository";
import { IUser } from "../interfaces/user";
import { createAccountValidateInput } from "../validators/accountValidation";

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
      const validationResult = (await createAccountValidateInput(
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

      const isAccountExist =
        await this.accountRepository.findAccountByAccountNumber(
          validationResult.accountNumber
        );
      if (isAccountExist) {
        return next(
          new CustomError(
            "Account with this account number already exists",
            409
          )
        );
      }
      validationResult.owner = foundUser._id;
      const createdAccount =
        await this.accountRepository.createAccount(validationResult);
      successResponse(
        res,
        { message: "Account was created successfully", data: createdAccount },
        201
      );
    }
  );
}
