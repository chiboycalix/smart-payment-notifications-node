import request from "supertest";
import express, { Express } from "express";
import { AuthController } from "../../controllers/authController";

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

mockApp.post(`${baseUrl}/auth/forgot-password`, AuthController.forgotPassword);

describe("Forgot Password", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return 400 if required fields are missing", async () => {
    const response = await request(mockApp)
      .post(`${baseUrl}/auth/forgot-password`)
      .send({ firstName: "John", lastName: "Doe" });
    expect(response.statusCode).toBe(400);
  });

  it("should return 404 if user does not exist", async () => {
    const response = await request(mockApp)
      .post(`${baseUrl}/auth/forgot-password`)
      .send({ email: "john.doe@test.com", password: "Doe" });
    expect(response.statusCode).toBe(404);
  });
});
