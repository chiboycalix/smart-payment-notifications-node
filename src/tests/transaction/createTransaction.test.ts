import request from "supertest";
import app from "../../app";
import { Account } from "../../models/Account";
import { User } from "../../models/User";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/env";
const baseUrl = "/api/v1";

describe("Create Transaction Tests", () => {
  const testEmail = "test@example.com";
  const wrongTestEmail = "wrong@gmail.com";
  const token = jwt.sign({ email: testEmail }, JWT_SECRET, {
    expiresIn: "1d",
  });
  const wrongToken = jwt.sign({ email: wrongTestEmail }, JWT_SECRET, {
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
      accountBalance: 500,
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
      .post(`${baseUrl}/transaction`)
      .send({ firstName: "John", lastName: "Doe" });
    expect(response.statusCode).toBe(401);
  });

  it("should return 404 if user with token does not exist", async () => {
    const response = await request(app)
      .post(`${baseUrl}/transaction`)
      .set("Authorization", `Bearer ${wrongToken}`)
      .send({
        transactionDescription: "apple subscription",
        transactionAmount: 20,
        transactionType: "debit",
        transactionAccount: "0114276910",
      });
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  it("should return 404 if account does not exist", async () => {
    const response = await request(app)
      .post(`${baseUrl}/transaction`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        transactionDescription: "apple subscription",
        transactionAmount: 20,
        transactionType: "debit",
        transactionAccount: "0114276940",
      });
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Account not found");
  });

  it("should return 400 if required parameters are not provided", async () => {
    const response = await request(app)
      .post(`${baseUrl}/transaction`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        transactionType: "debit",
        transactionAmount: "20",
        transactionAccount: "0114276910",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('"transactionDescription" is required');
  });

  it("should return 400 if invalid transaction type is passed", async () => {
    const response = await request(app)
      .post(`${baseUrl}/transaction`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        transactionDescription: "apple subscription",
        transactionAmount: 20,
        transactionType: "notfound",
        transactionAccount: "0114276910",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid transaction type");
  });

  it("should return Insufficient funds error", async () => {
    const response = await request(app)
      .post(`${baseUrl}/transaction`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        transactionDescription: "apple subscription",
        transactionAmount: 2000,
        transactionType: "debit",
        transactionAccount: "0114276910",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "Insufficient funds to complete transaction"
    );
  });

  it("should successfully debit my account", async () => {
    const response = await request(app)
      .post(`${baseUrl}/transaction`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        transactionDescription: "apple subscription",
        transactionAmount: 200,
        transactionType: "debit",
        transactionAccount: "0114276910",
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.data.message).toBe(
      "Transaction was created successfully"
    );
  });

  it("should successfully credit my account", async () => {
    const response = await request(app)
      .post(`${baseUrl}/transaction`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        transactionDescription: "apple subscription",
        transactionAmount: 200,
        transactionType: "credit",
        transactionAccount: "0114276910",
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.data.message).toBe(
      "Transaction was created successfully"
    );
  });
});
