import mongoose from "mongoose";
import chalk from "chalk";
import { MONGODB_URI, NODE_ENV } from "./env";

export const database = {
  connect: () => {
    if (NODE_ENV !== "test") {
      mongoose
        .connect(MONGODB_URI, {})
        .then(() => {
          console.log(
            chalk.hex("#3c3").bold(`Connection to database was successfull`)
          );
        })
        .catch((err) => {
          console.error(err);
        });
    }
  },
};
