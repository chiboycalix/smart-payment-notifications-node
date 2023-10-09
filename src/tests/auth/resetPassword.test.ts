import request from "supertest";
import app from "../../app";
import { User } from "../../models/User";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/env";

const baseUrl = "/api/v1";

describe("Forgot Password", () => {
  const wrongTestEmail = "wrong@gmail.com";
  const testEmail = "test@example.com";
  const testPassword = "securePassword123";
  const token = jwt.sign({ email: testEmail }, JWT_SECRET, {
    expiresIn: "1d",
  });
  const wrongToken = jwt.sign({ email: wrongTestEmail }, JWT_SECRET, {
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
        token: wrongToken,
      });
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  it("should reset password successfully", async () => {
    const response = await request(app)
      .post(`${baseUrl}/auth/reset-password`)
      .send({ password: "new password", token: token });
    expect(response.statusCode).toBe(200);
  });
});
