import { Model } from "mongoose";
import { IUser } from "../interfaces/user";
export class UserRepository {
  private userModel: Model<IUser>;
  constructor({ userModel }: { userModel: Model<IUser> }) {
    this.userModel = userModel;
  }
  async createUser(user: IUser): Promise<IUser> {
    return this.userModel.create(user);
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return this.userModel.findOne({ email });
  }

  async updateUser(id: string, user: IUser): Promise<IUser | null | any> {
    return this.userModel.updateOne({ _id: id }, user);
  }
}
