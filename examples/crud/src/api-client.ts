import axios, { AxiosError } from "axios";
import { ValidationErrors } from "yokter-kit";
import { HttpError } from "yokter-kit";

const API_URL = "https://api.fake-rest.refine.dev";

export const apiClient = axios.create({
  baseURL: API_URL,
});

// transform axios error to http error
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(APIError.from(error));
  },
);

export type APIErrorRaw = {
  message: string;
  statusCode: number;
  validationErrors?: APIValidationErrorRaw[];
};

export type APIValidationErrorRaw = {
  property: string;
  message: string;
};

export class APIError extends Error implements HttpError {
  errors?: ValidationErrors | undefined;

  private constructor(
    readonly message: string,
    readonly statusCode: number,
    options?: ErrorOptions,
  ) {
    super(message, options);
  }

  static from<T extends Record<string, unknown>>(error: unknown, data?: T) {
    let instance: APIError;

    if (error instanceof APIError) {
      instance = new this(error.message, error.statusCode, {
        cause: error.cause,
      });
      instance = Object.assign(instance, error);
    } else if (error instanceof AxiosError) {
      const axiosError = error as AxiosError<APIErrorRaw | undefined>;
      instance = new this(
        axiosError.response?.data?.message ?? axiosError.message,
        axiosError.response?.status ?? 500,
        { cause: error },
      );
      instance.errors = axiosError.response?.data?.validationErrors
        ? Object.fromEntries(
            axiosError.response.data.validationErrors.map((validationError) => [
              validationError.property,
              validationError.message,
            ]),
          )
        : undefined;
    } else if (error instanceof Error) {
      instance = new this(error.message, 500, { cause: error });
    } else {
      instance = new this(String(error), 500, { cause: error });
    }

    return Object.assign(instance, data);
  }
}
