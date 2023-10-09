import Joi from "joi";
import { CustomError } from "../exceptions/customError";

export const createTransactionSchema = Joi.object({
  transactionDescription: Joi.string().required(),
  transactionType: Joi.string().required(),
  transactionAccount: Joi.string().min(10).max(12).required(),
  transactionAmount: Joi.number().required(),
});

export const createTransactionValidateInput = (data: any) => {
  const { error, value } = createTransactionSchema.validate(data);
  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return new CustomError(errorMessage, 400);
  }
  return value;
};
