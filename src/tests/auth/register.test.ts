/* eslint-disable @typescript-eslint/ban-ts-comment */
import request from "supertest";
import app from "../../app";
import { User } from "../../models/User";

const baseUrl = "/api/v1";

describe("Register Function", () => {
  beforeEach(async () => {
    await User.create({
      firstName: "Existing User",
      lastName: "Doe",
      password: "password123",
      email: "test@example.com",
    });
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should return 400 if required fields are missing", async () => {
    const response = await request(app)
      .post(`${baseUrl}/auth/register`)
      .send({ firstName: "John", lastName: "Doe" });
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if required fields are missing", async () => {
    const response = (await request(app)
      .post(`${baseUrl}/auth/registe`)
      .send({ firstName: "John", lastName: "Doe" })) as any;
    expect(response.statusCode).toBe(404);
    expect(response.error.message).toBe(
      "cannot POST /api/v1/auth/registe (404)"
    );
  });

  it("should return 409 when user already exists", async () => {
    const res = await request(app).post(`${baseUrl}/auth/register`).send({
      firstName: "Existing User",
      lastName: "Doe",
      password: "password123",
      email: "test@example.com",
    });
    expect(res.statusCode).toEqual(409);
    expect(res.body.message).toBe("User already exists");
  });

  it("should successfully register user", async () => {
    const response = await request(app).post(`${baseUrl}/auth/register`).send({
      email: "john.doe@test.com",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
    });

    expect(response.statusCode).toEqual(201);
    expect(response.body.data).toHaveProperty("_id");
    expect(response.body.data).toHaveProperty("firstName", "John");
    expect(response.body.data).toHaveProperty("lastName", "Doe");
    expect(response.body.data).toHaveProperty("email", "john.doe@test.com");
  });
});
