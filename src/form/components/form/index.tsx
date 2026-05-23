import { ReactNode } from "react";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";

export type FormProps<TFieldValues extends FieldValues, TTransformedValues extends FieldValues | undefined = undefined> = {
	children: ReactNode;
	form: UseFormReturn<TFieldValues, TTransformedValues>;
};

export const Form = <
	TFieldValues extends FieldValues,
	TTransformedValues extends FieldValues | undefined = undefined,
>({
	children,
	form,
}: FormProps<TFieldValues, TTransformedValues>) => {
	return <FormProvider {...form}>{children}</FormProvider>;
};
