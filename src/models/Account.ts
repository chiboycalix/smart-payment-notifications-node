import { IAccount } from "../interfaces/account";
import { Document, Schema, model, Model } from "mongoose";

export interface IAccountDocument extends IAccount, Document {}
export type IAccountModel = Model<IAccountDocument>;

const accountSchema = new Schema(
  {
    accountName: { type: String, required: true },
    accountNumber: { type: String, required: true, unique: true },
    accountBalance: { type: Number, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Account: IAccountModel = model<IAccountDocument, IAccountModel>(
  "Account",
  accountSchema
);
