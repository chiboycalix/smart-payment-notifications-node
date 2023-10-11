import { Schema } from "mongoose";

export interface IEvent extends Document {
  eventName: string;
  eventData: any;
  owner: typeof Schema.Types.ObjectId;
}
