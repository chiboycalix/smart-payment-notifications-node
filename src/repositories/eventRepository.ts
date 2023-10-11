import { Model } from "mongoose";
import { IEvent } from "../interfaces/event";

export class EventRepository {
  private eventModel: Model<IEvent>;
  constructor({ eventModel }: { eventModel: Model<IEvent> }) {
    this.eventModel = eventModel;
  }
  async createEvent(event: IEvent): Promise<IEvent> {
    return this.eventModel.create(event);
  }
}
