import express from "express";
import { AuthRouter } from "./authRoutes";
import { AccountRouter } from "./accountRoutes";
import { TransactionRouter } from "./transactionRoutes";

export class API {
  public static connect() {
    const route = express.Router();
    route.use("/auth", AuthRouter);
    route.use("/account", AccountRouter);
    route.use("/transaction", TransactionRouter);
    return route;
  }
}
