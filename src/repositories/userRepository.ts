import { User } from "../models/User";
import { IUser, ILoginUser } from "../interfaces/user";
export class UserRepository {
  static async createUser(user: IUser): Promise<IUser> {
    return User.create(user);
  }

  static async findUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }
}
