import { Schema } from "mongoose";
export interface IAccount extends Document {
  accountName: string;
  accountNumber: string;
  accountBalance: number;
  owner: typeof Schema.Types.ObjectId;
}
