import { Model } from "mongoose";
import { ITransaction } from "../interfaces/transaction";

export class TransactionRepository {
  private transactionModel: Model<ITransaction>;
  constructor({ transactionModel }: { transactionModel: Model<ITransaction> }) {
    this.transactionModel = transactionModel;
  }
  async createTransaction(transaction: ITransaction): Promise<ITransaction> {
    return this.transactionModel.create(transaction);
  }
}
