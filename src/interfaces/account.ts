export interface IAccount extends Document {
  accountName: string;
  accountNumber: string;
  accountBalance: string;
  owner: string;
}
