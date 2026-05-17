export interface FormInputFieldProps<T> {
  onBlur?: () => void;
  onChange?: (value: T) => void;
  value?: T;
  errorMessage?: string;
}
