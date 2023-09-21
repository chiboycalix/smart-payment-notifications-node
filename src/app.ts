import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { API } from "./routes";
import { CustomError } from "./exceptions/customError";
import { globalErrorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/smart-payment-notifications";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.use("/api/v1", API.connect());
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error: any = new CustomError(
    `Can't find ${req.originalUrl} on this server`,
    404
  );
  next(error);
});

app.use(globalErrorHandler);
export default app;
