import request from "supertest";
import express, { Express } from "express";

import { UserRepository } from "../../repositories/userRepository";
import { AuthController } from "../../controllers/authController";
import { globalErrorHandler } from "../../middlewares/errorHandler";

const baseUrl = "/api/v1";
jest.mock("../../repositories/userRepository.ts", () => {
  const originalModule = jest.requireActual(
    "../../repositories/userRepository.ts"
  );
  return {
    ...originalModule,
    UserRepository: {
      ...originalModule.UserRepository,
      createUser: jest.fn(),
    },
  };
});

const mockApp: Express = express();
mockApp.use(express.json());
mockApp.use(express.urlencoded({ extended: true }));
mockApp.use(globalErrorHandler);

mockApp.post(`${baseUrl}/auth/register`, AuthController.register);

describe.skip("Register Function", () => {
  const mockCreateUser = UserRepository.createUser as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
    mockCreateUser.mockReset();
  });

  it("should return 400 if required fields are missing", async () => {
    const response = await request(mockApp)
      .post(`${baseUrl}/auth/register`)
      .send({ firstName: "John", lastName: "Doe" });
    expect(response.statusCode).toBe(400);
  });

  it("should successfully create user", async () => {
    const response = await request(mockApp)
      .post(`${baseUrl}/auth/register`)
      .send({
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
