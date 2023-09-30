import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import * as Sentry from "@sentry/node";
import { API } from "./routes";
import { CustomError } from "./exceptions/customError";
import { globalErrorHandler } from "./middlewares/errorHandler";
import { database } from "./config/database";

dotenv.config();

const app = express();
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

database.connect(app);

app.use(Sentry.Handlers.tracingHandler());
app.use("/api/v1", API.connect());
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error: any = new CustomError(
    `Can't find ${req.originalUrl} on this server`,
    404
  );
  next(error);
});
app.use(Sentry.Handlers.errorHandler());
app.use(globalErrorHandler);
export default app;
