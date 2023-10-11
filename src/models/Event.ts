import { IEvent } from "../interfaces/event";
import { Document, Schema, model, Model } from "mongoose";

export interface IEventDocument extends IEvent, Document {}
export type IEventModel = Model<IEventDocument>;

const eventSchema = new Schema(
  {
    eventName: { type: String, required: true },
    eventData: { type: {}, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Event: IEventModel = model<IEventDocument, IEventModel>(
  "Event",
  eventSchema
);
