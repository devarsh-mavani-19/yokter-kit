import { cloneElement, ReactElement, ReactNode, useMemo } from "react";
import {
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";
import { View } from "react-native";
import { useLocalize } from "../../../i18n/hooks/use-localize";
import { FormInputFieldProps } from "../../types/form.type";

export type FormItemProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  label?: string;
  rules?: Omit<
    RegisterOptions<TFieldValues, FieldPath<TFieldValues>>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
  children: ReactElement<FormInputFieldProps<unknown>>;
  error?: string | ((message: string) => ReactNode);
};

export const FormItem = <TFieldValues extends FieldValues>({
  name,
  label,
  rules,
  children,
  error,
}: FormItemProps<TFieldValues>) => {
  const { control } = useFormContext<TFieldValues>();
  const localize = useLocalize();
  const fieldLabel = label ?? name;

  const rulesWithDefaults = useMemo(() => {
    if (!rules) return undefined;

    const result: typeof rules = { ...rules };

    // Only override with default message when user passes a simple value without a custom message
    if (rules.required === true) {
      result.required = localize("error.required", { field: fieldLabel });
    }
    // string = user's custom message, object with message = user's custom message — leave as-is

    if (typeof rules.min === "number") {
      result.min = {
        value: rules.min,
        message: localize("error.min", { field: fieldLabel, min: rules.min }),
      };
    }
    // object with value+message = user's custom message — leave as-is

    if (typeof rules.max === "number") {
      result.max = {
        value: rules.max,
        message: localize("error.max", { field: fieldLabel, max: rules.max }),
      };
    }

    if (typeof rules.minLength === "number") {
      result.minLength = {
        value: rules.minLength,
        message: localize("error.minLength", {
          field: fieldLabel,
          minLength: rules.minLength,
        }),
      };
    }

    if (typeof rules.maxLength === "number") {
      result.maxLength = {
        value: rules.maxLength,
        message: localize("error.maxLength", {
          field: fieldLabel,
          maxLength: rules.maxLength,
        }),
      };
    }

    if (rules.pattern instanceof RegExp) {
      result.pattern = {
        value: rules.pattern,
        message: localize("error.pattern", { field: fieldLabel }),
      };
    }
    // object with value+message = user's custom message — leave as-is

    return result;
  }, [rules, fieldLabel, localize]);

  return (
    <Controller<TFieldValues, typeof name>
      name={name}
      control={control}
      rules={rulesWithDefaults}
      render={({ field, fieldState }) => {
        const errorMessage = fieldState.error?.message;

        return (
          <View style={{ width: "100%" }}>
            {cloneElement(children, {
              onBlur: () => {
                field.onBlur();
              },
              onChange: (v: unknown) => {
                field.onChange(v);
              },
              value: field.value,
              errorMessage,
            })}
            {errorMessage && typeof error === "function" && error(errorMessage)}
            {errorMessage && typeof error === "string" && error}
          </View>
        );
      }}
    />
  );
};
