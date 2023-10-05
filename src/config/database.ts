import mongoose from "mongoose";
import { MONGODB_URI, NODE_ENV, MONGODB_URI_TEST } from "./env";
console.log(NODE_ENV, "NODE_ENV");
export const database = {
  connect: () => {
    if (NODE_ENV !== "test") {
      mongoose
        .connect(MONGODB_URI, {})
        .then(() => {
          console.log("Connected to MongoDB!");
        })
        .catch((err) => {
          console.error(err);
        });
    }
  },
};
