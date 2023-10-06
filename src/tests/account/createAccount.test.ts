import request from "supertest";
import app from "../../app";
import { Account } from "../../models/Account";
import { User } from "../../models/User";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/env";

const baseUrl = "/api/v1";

describe("Create Account Tests", () => {
  const testEmail = "test@example.com";
  const wrongToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNoaW5vbnNvQHNlY29uZGNvbXBhbnkubmwiLCJpYXQiOjE2OTY1OTEwODIsImV4cCI6MTY5NjY3NzQ4Mn0.nVuXCG-9hCI_isNgEMg4DgF77-S6YElnDrS7EhysUCc";
  const token = jwt.sign({ email: testEmail }, JWT_SECRET, {
    expiresIn: "1d",
  });
  let owner: any;
  beforeEach(async () => {
    const user = await User.create({
      firstName: "Existing User",
      lastName: "Doe",
      password: "password123",
      email: testEmail,
    });

    await Account.create({
      accountName: "New Account",
      accountNumber: "0114276910",
      accountBalance: "20",
      owner: user._id,
    });

    owner = user._id;
  });

  afterEach(async () => {
    await Account.deleteMany({});
    await User.deleteMany({});
  });

  it("should return 401 if not auth token is provided", async () => {
    const response = await request(app)
      .post(`${baseUrl}/account`)
      .send({ firstName: "John", lastName: "Doe" });
    expect(response.statusCode).toBe(401);
  });

  it("should return 400 if required paramerers are provided", async () => {
    const response = await request(app)
      .post(`${baseUrl}/account`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        accountName: "New Account",
        accountNumber: "0114276910",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "account name, account balance, and account number are required"
    );
  });

  it("should return 404 if user with token does not exist", async () => {
    const response = await request(app)
      .post(`${baseUrl}/account`)
      .set("Authorization", `Bearer ${wrongToken}`)
      .send({
        accountName: "New Account",
        accountNumber: "0114276911",
        accountBalance: "20",
        owner: owner,
      });
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  it("should return 404 if user with token does not exist", async () => {
    const response = await request(app)
      .post(`${baseUrl}/account`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        accountName: "New Account",
        accountNumber: "0114276911",
        accountBalance: "20",
        owner: owner,
      });
    expect(response.statusCode).toBe(201);
  });
});
