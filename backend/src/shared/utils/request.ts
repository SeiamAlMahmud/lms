import { AppError } from "../errors/AppError";

export const toSingleParam = (value: string | string[] | undefined, name: string): string => {
  if (!value) {
    throw new AppError(`Missing required param: ${name}`, 400);
  }

  if (Array.isArray(value)) {
    if (value.length === 0 || !value[0]) {
      throw new AppError(`Invalid param: ${name}`, 400);
    }

    return value[0];
  }

  return value;
};
