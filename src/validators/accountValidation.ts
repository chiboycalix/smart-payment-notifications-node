import Joi from "joi";
import { CustomError } from "../exceptions/customError";

export const createAccountSchema = Joi.object({
  accountName: Joi.string().required(),
  accountNumber: Joi.string().min(10).max(12).required(),
  accountBalance: Joi.number().required(),
});

export const createAccountValidateInput = (data: any) => {
  const { error, value } = createAccountSchema.validate(data);
  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return new CustomError(errorMessage, 400);
  }
  return value;
};
