import { IUser } from "../interfaces/user";
import { Document, Schema, model, Model } from "mongoose";

export interface IUserDocument extends IUser, Document {}
export type IUserModel = Model<IUserDocument>;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const User: IUserModel = model<IUserDocument, IUserModel>(
  "User",
  userSchema
);
