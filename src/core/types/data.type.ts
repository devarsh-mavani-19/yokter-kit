export type ValidationErrors = {
  [field: string]:
    | string
    | string[]
    | boolean
    | { key: string; message: string };
};

export interface HttpError {
  message: string;
  statusCode: number;
  errors?: ValidationErrors;
}
