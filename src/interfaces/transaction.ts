import { Schema } from "mongoose";

export interface ITransaction extends Document {
  transactionType: string;
  transactionAmount: number;
  transactionDescription: string;
  transactionAccount: string;
  transactionOwner: typeof Schema.Types.ObjectId;
}
