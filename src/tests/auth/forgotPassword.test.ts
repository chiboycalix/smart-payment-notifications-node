import request from "supertest";
import app from "../../app";
import { User } from "../../models/User";
import { sendEmail } from "../../utils/emailSender";

const baseUrl = "/api/v1";

jest.mock("../../utils/emailSender.ts", () => {
  return {
    sendEmail: jest.fn(),
  };
});

describe("Forgot Password", () => {
  const testEmail = "test@example.com";
  const testPassword = "securePassword123";
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
      .post(`${baseUrl}/auth/forgot-password`)
      .send({ firstName: "John", lastName: "Doe" });
    expect(response.statusCode).toBe(400);
  });

  it("should return 404 if user does not exist", async () => {
    const response = await request(app)
      .post(`${baseUrl}/auth/forgot-password`)
      .send({ email: "john.doe@test.com", password: "Doe" });
    expect(response.statusCode).toBe(404);
  });

  it("should send forgot password mail", async () => {
    const response = await request(app)
      .post(`${baseUrl}/auth/forgot-password`)
      .send({ email: testEmail });
    expect(response.statusCode).toBe(200);
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });
});
