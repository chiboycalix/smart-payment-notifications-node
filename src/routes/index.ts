import express from "express";
import { AuthRouter } from "./authRoutes";

export class API {
  public static connect() {
    const route = express.Router();
    route.use("/auth", AuthRouter);

    return route;
  }
}
