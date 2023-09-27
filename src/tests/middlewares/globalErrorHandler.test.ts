import { globalErrorHandler } from "../../middlewares/errorHandler";
import { Request, Response, NextFunction } from "express";
import * as errorHandlerModule from "../../middlewares/errorHandler";

const mockRequest = {} as Request;
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;
const mockNext = jest.fn() as NextFunction;

describe("globalErrorHandler", () => {
  it("should set default error properties and call devErrors in development environment", () => {
    process.env.NODE_ENV = "development";

    const error = {} as any;

    globalErrorHandler(error, mockRequest, mockResponse, mockNext);

    expect(error.statusCode).toBe(500);
    expect(error.status).toBe("fail");
    expect(error.message).toBe("Internal Server Error");

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "fail",
      message: error.message,
      stack: error.stack,
      error: {
        status: "fail",
        message: "Internal Server Error",
        statusCode: 500,
      },
    });
  });

  it("should call prodErrors in production environment", () => {
    process.env.NODE_ENV = "production";

    const error = {} as any;

    globalErrorHandler(error, mockRequest, mockResponse, mockNext);
    expect(error.statusCode).toBe(500);
    expect(error.status).toBe("fail");
    expect(error.message).toBe("Internal Server Error");

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "fail",
      message: error.message,
      error: {
        status: "fail",
        message: "Internal Server Error",
        statusCode: 500,
      },
    });
  });

  it("should call prodErrors in production environment", () => {
    process.env.NODE_ENV = "production";

    const error = {
      isOperational: true,
      statusCode: 404,
      message: "Not Found",
    };

    const prodErrorsMock = jest.spyOn(errorHandlerModule, "prodErrors");

    globalErrorHandler(error, mockRequest, mockResponse, mockNext);
    expect(error.statusCode).toBe(404);
    expect(prodErrorsMock).toHaveBeenCalledWith(mockResponse, error);
  });

  it("should call testErrors in test environments", () => {
    process.env.NODE_ENV = "test";
    const error = {} as any;

    globalErrorHandler(error, mockRequest, mockResponse, mockNext);
    expect(error.statusCode).toBe(500);
    expect(error.status).toBe("fail");
    expect(error.message).toBe("Internal Server Error");

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "fail",
      message: error.message,
      stack: error.stack,
      error: {
        status: "fail",
        message: "Internal Server Error",
        statusCode: 500,
      },
    });
  });
});
