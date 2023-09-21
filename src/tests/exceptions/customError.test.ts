import { CustomError } from "../../exceptions/customError";

describe("CustomError", () => {
  it("should create an instance of CustomError", () => {
    const message = "This is an error message";
    const statusCode = 404;

    const customError = new CustomError(message, statusCode);
    expect(customError instanceof CustomError).toBe(true);
    expect(customError.message).toBe(message);
    expect(customError.statusCode).toBe(statusCode);
    expect(customError.status).toBe("fail");
    expect(customError.isOperational).toBe(true);
    expect(customError.stack).toBeDefined();
  });

  it('should create an instance of CustomError with "error" status for 500 status code', () => {
    const message = "This is an error message";
    const statusCode = 500;

    const customError = new CustomError(message, statusCode);

    expect(customError.status).toBe("error");
  });

  it("should capture a stack trace", () => {
    const message = "This is an error message";
    const statusCode = 404;

    const customError = new CustomError(message, statusCode);

    expect(customError.stack).toBeDefined();
  });
});
