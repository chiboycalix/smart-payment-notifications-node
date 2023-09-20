import express from "express";

export const AuthRouter = express.Router();
AuthRouter.post("/login", (req, res) => {
  res.send("login");
});
