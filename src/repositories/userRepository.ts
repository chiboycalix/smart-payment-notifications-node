import { User } from "../models/User";
import { IUser } from "../interfaces/user";
export class UserRepository {
  static async createUser(user: IUser): Promise<IUser> {
    return await User.create(user);
  }
}
