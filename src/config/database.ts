import mongoose from "mongoose";
import { MONGODB_URI, NODE_ENV, PORT } from "./env";

export const database = {
  connect: (app: any) => {
    if (NODE_ENV !== "test") {
      mongoose
        .connect(MONGODB_URI, {})
        .then(() => {
          console.log("Connected to MongoDB!");
          app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  },
};
