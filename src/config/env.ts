import dotenv from "dotenv";
dotenv.config();

export const MAIL_HOST = process.env.MAIL_HOST || "smtp.mailtrap.io";
export const MAIL_PORT = process.env.MAIL_PORT || 2525;
export const MAIL_FROM = process.env.MAIL_FROM || "from";
export const MAIL_SERVICE = process.env.MAIL_SERVICE || "gmail";
export const MAIL_AUTH_USER = process.env.MAIL_AUTH_USER || "user";
export const MAIL_AUTH_PASS = process.env.MAIL_AUTH_PASS || "pass";
export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017";
export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const CLIENT_BASE_URL =
  process.env.CLIENT_BASE_URL || "http://localhost:3000";
