import request from "supertest";
import app from "../../app";
import { User } from "../../models/User";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/env";

const baseUrl = "/api/v1";

describe("Forgot Password", () => {
  const testEmail = "test@example.com";
  const testPassword = "securePassword123";
  const token = jwt.sign({ email: testEmail }, JWT_SECRET, {
    expiresIn: "1d",
  });
  beforeEach(async () => {
    await User.create({
      firstName: "John",
      lastName: "Doe",
      password: testPassword,
      email: testEmail,
    });
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should return 400 if required fields are missing", async () => {
    const response = await request(app)
      .post(`${baseUrl}/auth/reset-password`)
      .send({ firstName: "John", lastName: "Doe" });
    expect(response.statusCode).toBe(400);
  });

  it("should return 404 if user does not exist", async () => {
    const response = await request(app)
      .post(`${baseUrl}/auth/reset-password`)
      .send({
        password: "securePassword",
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNoaW5vbnNvQHNlY29uZGNvbXBhbnkubmwiLCJpYXQiOjE2OTY1MjU4MjMsImV4cCI6MTY5NjYxMjIyM30.r6d1S9WtWPTsYsEMzdB629WeN3sdZKWTNpea4Vpnzzg",
      });
    expect(response.statusCode).toBe(404);
  });

  it("should reset password successfully", async () => {
    const response = await request(app)
      .post(`${baseUrl}/auth/reset-password`)
      .send({ password: "new password", token: token });
    expect(response.statusCode).toBe(200);
  });
});
