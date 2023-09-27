import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/smart-payment-notifications";
const PORT = process.env.PORT || 2000;

export const database = {
  connect: (app: any) => {
    if (process.env.NODE_ENV !== "test") {
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
