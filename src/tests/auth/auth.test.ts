// import request from "supertest";
// import express, { Express, Request, Response, NextFunction } from "express";

// import { UserRepository } from "../../repositories/userRepository";
// import { AuthController } from "../../controllers/authController";
// import { globalErrorHandler } from "../../middlewares/errorHandler";

// const baseUrl = "/api/v1";
// jest.mock("../../repositories/userRepository.ts", () => {
//   const originalModule = jest.requireActual(
//     "../../repositories/userRepository.ts"
//   );
//   return {
//     ...originalModule,
//     UserRepository: {
//       ...originalModule.UserRepository,
//       createUser: jest.fn(),
//     },
//   };
// });

// const mockApp: Express = express();
// mockApp.use(express.json());
// mockApp.use(express.urlencoded({ extended: true }));
// mockApp.use(globalErrorHandler);

// mockApp.post(`${baseUrl}/auth/register`, AuthController.register);

// describe("Register Function", () => {
//   const mockCreateUser = UserRepository.createUser as jest.Mock;

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   afterEach(() => {
//     jest.resetAllMocks();
//     mockCreateUser.mockReset();
//   });

//   it("should return 400 if required fields are missing", async () => {
//     const response = await request(mockApp)
//       .post(`${baseUrl}/auth/register`)
//       .send({ firstName: "John", lastName: "Doe" });
//     expect(response.statusCode).toBe(400);
//   });

//   it("should successfully create user", async () => {
//     const response = await request(mockApp)
//       .post(`${baseUrl}/auth/register`)
//       .send({
//         email: "john.doe@test.com",
//         password: "password123",
//         firstName: "John",
//         lastName: "Doe",
//       });
//     expect(response.statusCode).toEqual(201);
//     expect(response.body.data).toHaveProperty("_id");
//     expect(response.body.data).toHaveProperty("firstName", "John");
//     expect(response.body.data).toHaveProperty("lastName", "Doe");
//     expect(response.body.data).toHaveProperty("email", "john.doe@test.com");
//   });
// });

import request from "supertest";
import jwt from "jsonwebtoken";
import { User } from "../../models/User";
import app from "../../app";

const baseUrl = "/api/v1";

describe("User API", () => {
  let token: string;
  beforeAll(async () => {
    // Create a test user
    const testUser = new User({
      firstName: "testuser",
      lastName: "testuser",
      email: "testuser@example.com",
      password: "testpassword",
    });
    await testUser.save();

    // Generate a JWT token for the test user
    token = jwt.sign(
      { userId: testUser._id },
      process.env.JWT_SECRET || "secret"
    );
  });

  afterAll(async () => {
    await User.deleteMany({});
  });
  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /auth/register", () => {
    it("should signup a new user", async () => {
      const res = await request(app).post(`${baseUrl}/auth/register`).send({
        firstName: "John",
        lastName: "Doe",
        password: "1234",
        email: "john.doe@example.com",
      });
      expect(res.statusCode).toEqual(201);
      expect(res.body.data).toHaveProperty("_id");
      expect(res.body.data).toHaveProperty("firstName", "John");
      expect(res.body.data).toHaveProperty("lastName", "Doe");
      expect(res.body.data).toHaveProperty("email", "john.doe@example.com");
    });
  });
});
