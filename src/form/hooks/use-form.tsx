import { useCallback, useMemo, useEffect } from "react";
import {
  DefaultValues,
  KeepStateOptions,
  useForm as useReactHookForm,
} from "react-hook-form";
import { useCreate, UseCreateParams } from "../../core/hooks/use-create";
import { useUpdate, UseUpdateParams } from "../../core/hooks/use-update";
import { useNotification } from "../../notification/hooks/use-notification";
import { BaseRecord, SingleResponse } from "../../core/types/data-provider.type";
import {
  InvalidateQueryFilters,
  UseMutationResult,
} from "@tanstack/react-query";
import { OpenNotificationParams } from "../../notification/types/notification.type";
import { HttpError } from "../../core/types/data.type";
import { useYokterContext } from "../../core/context/yokter.context";
import { useTranslate } from "../../i18n/hooks/use-translate";
import { sentenceCase } from "change-case-all";

export type UseFormProps<
  TData extends BaseRecord = BaseRecord,
  TVariables extends BaseRecord = BaseRecord,
  TInitialValues extends BaseRecord = TVariables,
> = {
  action: "create" | "edit";
  resource: string;
  id?: string;
  defaultValues?: DefaultValues<TVariables>;
  initialValuesTransform?: (values: TInitialValues) => TVariables;
  onFinishTransform?: (values: TVariables) => TVariables;
  resetFormOnSubmit?: boolean;
  shouldUnregister?: boolean;
  meta?: { [k: string]: unknown };
  invalidateQueryFilters?: InvalidateQueryFilters;
  successNotification?:
    | OpenNotificationParams
    | false
    | ((
        data?: TData,
        values?: TVariables,
        resource?: string,
      ) => OpenNotificationParams | false | undefined);
  errorNotification?:
    | OpenNotificationParams
    | false
    | ((
        error?: HttpError,
        values?: TVariables,
        resource?: string,
      ) => OpenNotificationParams | false | undefined);
  onMutationSuccess?: (
    data: SingleResponse<TData>,
    variables: TVariables,
    onMutateResult: unknown,
    context: unknown,
  ) => void;
  onMutationError?: (
    error: HttpError,
    variables: TVariables,
    onMutateResult: unknown,
    context: unknown,
  ) => void;
};

export type UseFormReturn<
  TData extends BaseRecord = BaseRecord,
  TVariables extends BaseRecord = BaseRecord,
> = {
  saveButtonProps: {
    onPress: () => void;
    disabled: boolean;
    loading: boolean;
  };
  form: ReturnType<typeof useReactHookForm<TVariables>>;
  reloadForm: (keepStateOptions?: KeepStateOptions) => void;
  mutation:
    | UseMutationResult<
        SingleResponse<TData>,
        HttpError,
        UseCreateParams<TVariables>
      >
    | UseMutationResult<
        SingleResponse<TData>,
        HttpError,
        UseUpdateParams<TVariables>
      >;
  onFinish: () => Promise<void>;
};

export const useForm = <
  TData extends BaseRecord = BaseRecord,
  TVariables extends BaseRecord = BaseRecord,
  TInitialValues extends BaseRecord = TVariables,
>({
  action,
  resource,
  id,
  defaultValues: defaultValuesFromProps,
  initialValuesTransform,
  onFinishTransform,
  resetFormOnSubmit = true,
  shouldUnregister,
  meta,
  invalidateQueryFilters,
  successNotification,
  errorNotification,
  onMutationSuccess,
  onMutationError,
}: UseFormProps<TData, TVariables, TInitialValues>): UseFormReturn<
  TData,
  TVariables
> => {
  const { dataProvider } = useYokterContext();
  const translate = useTranslate();

  const fetchEditValues = useCallback(async (): Promise<
    TVariables | TInitialValues
  > => {
    const response = await dataProvider.getOne<TInitialValues>({
      resource,
      id: id!,
      meta,
    });
    return initialValuesTransform
      ? initialValuesTransform(response.data)
      : response.data;
  }, [id, resource, meta, initialValuesTransform, dataProvider]);

  const form = useReactHookForm<TVariables>({
    mode: "all",
    reValidateMode: "onChange",
    shouldUnregister: shouldUnregister ?? false,
    defaultValues: defaultValuesFromProps,
  });

  const { trigger, getValues, reset: resetForm, ...reactHookForm } = form;

  const { open } = useNotification();

  useEffect(() => {
    if (action === "edit" && id) {
      fetchEditValues()
        .then((data) => {
          resetForm(data as unknown as TVariables);
        })
        .catch((error: unknown) => {
          open?.({
            type: "error",
            message: sentenceCase(
              error && typeof error === "object" && "message" in error
                ? (error.message as string)
                : translate("error.somethingWentWrong"),
            ),
            description: translate("error.errorLabel"),
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, action, fetchEditValues]);

  const reloadForm = useCallback(
    (keepStateOptions?: KeepStateOptions) => {
      if (action === "edit" && id) {
        fetchEditValues()
          .then((data) => {
            resetForm(data as unknown as TVariables, keepStateOptions);
          })
          .catch((error: unknown) => {
            open?.({
              type: "error",
              message: sentenceCase(
                error && typeof error === "object" && "message" in error
                  ? (error.message as string)
                  : translate("error.somethingWentWrong"),
              ),
              description: translate("error.errorLabel"),
            });
          });
      } else {
        resetForm(undefined, keepStateOptions);
      }
    },
    [action, id, fetchEditValues, resetForm, open, translate],
  );

  const handleMutationSuccess = useCallback(
    (
      data: SingleResponse<TData>,
      variables: UseCreateParams<TVariables> | UseUpdateParams<TVariables>,
      onMutateResult: unknown,
      context: unknown,
    ) => {
      if (resetFormOnSubmit) {
        reloadForm({ keepErrors: false });
      }
      onMutationSuccess?.(
        data,
        variables.variables ?? ({} as TVariables),
        onMutateResult,
        context,
      );
    },
    [resetFormOnSubmit, reloadForm, onMutationSuccess],
  );

  const handleMutationError = useCallback(
    (
      error: HttpError,
      variables: UseCreateParams<TVariables> | UseUpdateParams<TVariables>,
      onMutateResult: unknown,
      context: unknown,
    ) => {
      onMutationError?.(
        error,
        variables.variables ?? ({} as TVariables),
        onMutateResult,
        context,
      );
    },
    [onMutationError],
  );

  const createMutation = useCreate<TData, HttpError, TVariables>({
    resource,
    invalidateQueryFilters,
    successNotification,
    errorNotification,
    mutationOptions: {
      onSuccess: handleMutationSuccess,
      onError: handleMutationError,
    },
  });

  const updateMutation = useUpdate<TData, HttpError, TVariables>({
    resource,
    id,
    invalidateQueryFilters,
    successNotification,
    errorNotification,
    mutationOptions: {
      onSuccess: handleMutationSuccess,
      onError: handleMutationError,
    },
  });

  const mutation = action === "create" ? createMutation : updateMutation;

  const onFinish = useCallback(async () => {
    // validate form before submitting
    const isValid = await trigger();
    if (!isValid) return;

    const formValues = onFinishTransform?.(getValues()) ?? getValues();

    if (action === "create") {
      createMutation.mutate({ resource, variables: formValues, meta });
    } else {
      if (!id) {
        throw new Error("[useForm]: `id` is required for edit action");
      }
      updateMutation.mutate({ resource, id, variables: formValues, meta });
    }
  }, [
    trigger,
    getValues,
    onFinishTransform,
    action,
    createMutation,
    updateMutation,
    resource,
    id,
    meta,
  ]);

  const saveButtonProps = useMemo(
    () => ({
      onPress: () => void onFinish(),
      disabled: mutation.isPending || !reactHookForm.formState.isValid,
      loading: mutation.isPending,
    }),
    [reactHookForm.formState.isValid, mutation.isPending, onFinish],
  );

  return {
    saveButtonProps,
    onFinish,
    mutation,
    reloadForm,
    form,
  };
};
