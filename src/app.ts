import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { API } from "./routes";
import { CustomError } from "./exceptions/customError";
import { globalErrorHandler } from "./middlewares/errorHandler";
import { database } from "./config/database";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

database.connect(app);

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
