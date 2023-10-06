import express from "express";
import { AuthRouter } from "./authRoutes";
import { AccountRouter } from "./accountRoutes";

export class API {
  public static connect() {
    const route = express.Router();
    route.use("/auth", AuthRouter);
    route.use("/account", AccountRouter);

    return route;
  }
}
