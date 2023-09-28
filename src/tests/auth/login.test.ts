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
      findUserByEmail: jest.fn(),
    },
  };
});

const mockApp: Express = express();
mockApp.use(express.json());
mockApp.use(express.urlencoded({ extended: true }));
mockApp.use(globalErrorHandler);

mockApp.post(`${baseUrl}/auth/login`, AuthController.login);

describe("Login Function", () => {
  const mockLoginUser = UserRepository.findUserByEmail as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
    mockLoginUser.mockReset();
  });

  it("should return 400 if required fields are missing", async () => {
    const response = await request(mockApp)
      .post(`${baseUrl}/auth/login`)
      .send({ firstName: "John", lastName: "Doe" });
    expect(response.statusCode).toBe(400);
  });

  it("should return 404 if user does not exist", async () => {
    const response = await request(mockApp)
      .post(`${baseUrl}/auth/login`)
      .send({ email: "john.doe@test.com", password: "Doe" });
    expect(response.statusCode).toBe(404);
  });
});
