export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ILoginUser extends Document {
  email: string;
  password: string;
}
