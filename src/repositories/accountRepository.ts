import { Model } from "mongoose";
import { IAccount } from "../interfaces/account";

export class AccountRepository {
  private accountModel: Model<IAccount>;
  constructor({ accountModel }: { accountModel: Model<IAccount> }) {
    this.accountModel = accountModel;
  }
  async createAccount(account: IAccount): Promise<IAccount> {
    return this.accountModel.create(account);
  }

  async findAccountByAccountNumber(accountNumber: string): Promise<IAccount> {
    return this.accountModel.findOne({ accountNumber });
  }

  async updateAccountBalance(
    amount: number,
    accountNumber: string
  ): Promise<IAccount> {
    return this.accountModel.findOneAndUpdate(
      { accountNumber },
      { $inc: { accountBalance: amount } },
      { new: true }
    );
  }
}
