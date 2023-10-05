import request from "supertest";
import bcrypt from "bcrypt";
import app from "../../app";
import { User } from "../../models/User";

const baseUrl = "/api/v1";

describe("Login Function", () => {
  const testEmail = "test@example.com";
  const testPassword = "securePassword123";
  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    await User.create({
      firstName: "John",
      lastName: "Doe",
      password: hashedPassword,
      email: testEmail,
    });
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should return 400 if required fields are missing", async () => {
    const response = await request(app)
      .post(`${baseUrl}/auth/login`)
      .send({ firstName: "John", lastName: "Doe" });
    expect(response.statusCode).toBe(400);
  });

  it("should return 404 if user does not exist", async () => {
    const response = await request(app)
      .post(`${baseUrl}/auth/login`)
      .send({ email: "john.doe@test.com", password: "Doe" });
    expect(response.statusCode).toBe(404);
  });

  it("should login user successfuly", async () => {
    const response = await request(app)
      .post(`${baseUrl}/auth/login`)
      .send({ email: testEmail, password: "wrong password" });
    expect(response.statusCode).toBe(401);
  });

  it("should login user successfuly", async () => {
    const response = await request(app)
      .post(`${baseUrl}/auth/login`)
      .send({ email: testEmail, password: testPassword });
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty("token");
    expect(response.body.data).toHaveProperty("email");
    expect(response.body.data).toHaveProperty("firstName");
    expect(response.body.data).toHaveProperty("lastName");
    expect(response.body.data).toHaveProperty("_id");
  });
});
