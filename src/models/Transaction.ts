import { ITransaction } from "../interfaces/transaction";
import { Document, Schema, model, Model } from "mongoose";

export interface ITransactionDocument extends ITransaction, Document {}
export type ITransactionModel = Model<ITransactionDocument>;

const transactionSchema = new Schema(
  {
    transactionOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transactionAccount: { type: String, required: true },
    transactionAmount: { type: Number, required: true },
    transactionType: { type: String, required: true },
    transactionDescription: { type: String, required: true },
  },
  { timestamps: true }
);

export const Transaction: ITransactionModel = model<
  ITransactionDocument,
  ITransactionModel
>("Transaction", transactionSchema);
