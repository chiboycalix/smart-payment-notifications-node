import { asyncErrorHandler } from "../../middlewares/asyncErrorHandler";

describe("asyncErrorHandler", () => {
  it("should wrap an asynchronous function and call next on error", async () => {
    const mockRequest = {} as any;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    const mockNext = jest.fn();
    const asyncFunction = async () => {
      throw new Error("Test Error");
    };
    const wrappedAsyncFunction = asyncErrorHandler(asyncFunction);
    await wrappedAsyncFunction(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it("should pass control to the next middleware if there is no error", async () => {
    const mockRequest = {} as any;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    const mockNext = jest.fn();

    const asyncFunction = async () => {
      return "Success";
    };

    const wrappedAsyncFunction = asyncErrorHandler(asyncFunction);

    await wrappedAsyncFunction(mockRequest, mockResponse, mockNext);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
