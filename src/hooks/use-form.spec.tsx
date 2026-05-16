import { renderHook, act, waitFor } from "@testing-library/react-native";
import { useForm } from "./use-form";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DataProvider } from "../types/data-provider.type";

const mockDataProvider: DataProvider = {
  getList: jest.fn(),
  getOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  deleteOne: jest.fn(),
  getApiUrl: () => "https://api.test.com",
};

const mockInvalidateResource = jest.fn();
const mockOpen = jest.fn();

jest.mock("../context/yokter.context", () => ({
  useYokterContext: () => ({
    dataProvider: mockDataProvider,
    notificationProvider: { open: mockOpen, close: jest.fn() },
    i18nProvider: {
      localize: (key: string) => key,
      changeLocale: jest.fn(),
      getLocale: jest.fn(),
    },
  }),
}));

jest.mock("./use-invalidate", () => ({
  useInvalidate: () => ({
    invalidateResource: mockInvalidateResource,
    invalidateAll: jest.fn(),
  }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }
  return Wrapper;
}

describe("useForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create action", () => {
    it("should return form and saveButtonProps", () => {
      const { result } = renderHook(
        () => useForm({ action: "create", resource: "posts" }),
        { wrapper: createWrapper() },
      );

      expect(result.current.form).toBeDefined();
      expect(result.current.saveButtonProps).toBeDefined();
      expect(result.current.saveButtonProps.onPress).toBeDefined();
      expect(result.current.mutation).toBeDefined();
      expect(result.current.onFinish).toBeDefined();
      expect(result.current.reloadForm).toBeDefined();
    });

    it("should call create mutation on onFinish", async () => {
      const mockResponse = { data: { id: "1", title: "New" } };
      (mockDataProvider.create as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () =>
          useForm<{ id?: string; title: string }, { title: string }>({
            action: "create",
            resource: "posts",
            defaultValues: { title: "New" },
          }),
        { wrapper: createWrapper() },
      );

      await act(async () => {
        await result.current.onFinish();
      });

      expect(mockDataProvider.create).toHaveBeenCalledWith({
        resource: "posts",
        variables: { title: "New" },
        meta: undefined,
      });
    });

    it("should not submit when form validation fails", async () => {
      const { result } = renderHook(
        () => useForm({ action: "create", resource: "posts" }),
        { wrapper: createWrapper() },
      );

      // Register a required field without a value
      act(() => {
        result.current.form.register("title", { required: true });
      });

      await act(async () => {
        await result.current.onFinish();
      });

      expect(mockDataProvider.create).not.toHaveBeenCalled();
    });

    it("should apply onFinishTransform before submitting", async () => {
      const mockResponse = { data: { id: "1", title: "TRANSFORMED" } };
      (mockDataProvider.create as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () =>
          useForm<{ id?: string; title: string }, { title: string }>({
            action: "create",
            resource: "posts",
            defaultValues: { title: "original" },
            onFinishTransform: (values) => ({
              ...values,
              title: values.title.toUpperCase(),
            }),
          }),
        { wrapper: createWrapper() },
      );

      await act(async () => {
        await result.current.onFinish();
      });

      expect(mockDataProvider.create).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: { title: "ORIGINAL" },
        }),
      );
    });

    it("should pass meta to mutation", async () => {
      const mockResponse = { data: { id: "1" } };
      (mockDataProvider.create as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () =>
          useForm<{ id?: string; title: string }, { title: string }>({
            action: "create",
            resource: "posts",
            defaultValues: { title: "x" },
            meta: { tenant: "acme" },
          }),
        { wrapper: createWrapper() },
      );

      await act(async () => {
        await result.current.onFinish();
      });

      expect(mockDataProvider.create).toHaveBeenCalledWith(
        expect.objectContaining({ meta: { tenant: "acme" } }),
      );
    });

    it("should call onMutationSuccess callback", async () => {
      const mockResponse = { data: { id: "1", title: "New" } };
      (mockDataProvider.create as jest.Mock).mockResolvedValue(mockResponse);
      (mockDataProvider.getOne as jest.Mock).mockResolvedValue(mockResponse);
      const onMutationSuccess = jest.fn();

      const { result } = renderHook(
        () =>
          useForm<{ id?: string; title: string }, { title: string }>({
            action: "create",
            resource: "posts",
            defaultValues: { title: "New" },
            onMutationSuccess,
          }),
        { wrapper: createWrapper() },
      );

      await act(async () => {
        await result.current.onFinish();
      });

      await waitFor(() => {
        expect(onMutationSuccess).toHaveBeenCalled();
      });
    });

    it("should call onMutationError callback on failure", async () => {
      const mockError = { message: "Failed", statusCode: 500 };
      (mockDataProvider.create as jest.Mock).mockRejectedValue(mockError);
      const onMutationError = jest.fn();

      const { result } = renderHook(
        () =>
          useForm<{ id?: string; title: string }, { title: string }>({
            action: "create",
            resource: "posts",
            defaultValues: { title: "x" },
            onMutationError,
          }),
        { wrapper: createWrapper() },
      );

      await act(async () => {
        await result.current.onFinish();
      });

      await waitFor(() => {
        expect(onMutationError).toHaveBeenCalled();
      });
    });

    it("should reset form on submit when resetFormOnSubmit is true", async () => {
      const mockResponse = { data: { id: "1", title: "New" } };
      (mockDataProvider.create as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () =>
          useForm<{ id?: string; title: string }, { title: string }>({
            action: "create",
            resource: "posts",
            defaultValues: { title: "New" },
            resetFormOnSubmit: true,
          }),
        { wrapper: createWrapper() },
      );

      act(() => {
        result.current.form.setValue("title", "Changed");
      });

      await act(async () => {
        await result.current.onFinish();
      });

      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(true);
      });
    });

    it("should have disabled saveButtonProps when mutation is pending", async () => {
      (mockDataProvider.create as jest.Mock).mockReturnValue(
        new Promise(() => void 0),
      );

      const { result } = renderHook(
        () =>
          useForm<{ id?: string; title: string }, { title: string }>({
            action: "create",
            resource: "posts",
            defaultValues: { title: "x" },
          }),
        { wrapper: createWrapper() },
      );

      act(() => {
        result.current.saveButtonProps.onPress();
      });

      await waitFor(() => {
        expect(result.current.saveButtonProps.loading).toBe(true);
      });
    });
  });

  describe("edit action", () => {
    it("should fetch initial values on mount", async () => {
      const mockResponse = { data: { id: "1", title: "Existing" } };
      (mockDataProvider.getOne as jest.Mock).mockResolvedValue(mockResponse);

      renderHook(
        () =>
          useForm<{ id?: string; title: string }, { title: string }>({
            action: "edit",
            resource: "posts",
            id: "1",
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(mockDataProvider.getOne).toHaveBeenCalledWith({
          resource: "posts",
          id: "1",
          meta: undefined,
        });
      });
    });

    it("should apply initialValuesTransform on fetched data", async () => {
      const mockResponse = { data: { id: "1", title: "Existing", extra: true } };
      (mockDataProvider.getOne as jest.Mock).mockResolvedValue(mockResponse);

      const transform = jest.fn().mockReturnValue({ title: "Transformed" });

      renderHook(
        () =>
          useForm({
            action: "edit",
            resource: "posts",
            id: "1",
            initialValuesTransform: transform,
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(transform).toHaveBeenCalledWith(mockResponse.data);
      });
    });

    it("should call update mutation on onFinish", async () => {
      const getOneResponse = { data: { id: "1", title: "Existing" } };
      const updateResponse = { data: { id: "1", title: "Updated" } };
      (mockDataProvider.getOne as jest.Mock).mockResolvedValue(getOneResponse);
      (mockDataProvider.update as jest.Mock).mockResolvedValue(updateResponse);

      const { result } = renderHook(
        () =>
          useForm<{ id?: string; title: string }, { title: string }>({
            action: "edit",
            resource: "posts",
            id: "1",
            defaultValues: { title: "Existing" },
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(mockDataProvider.getOne).toHaveBeenCalled();
      });

      await act(async () => {
        await result.current.onFinish();
      });

      expect(mockDataProvider.update).toHaveBeenCalledWith(
        expect.objectContaining({
          resource: "posts",
          id: "1",
          meta: undefined,
        }),
      );
      const callArgs = (mockDataProvider.update as jest.Mock).mock.calls[0] as [
        { variables: { title: string } },
      ];
      expect(callArgs[0].variables.title).toBe("Existing");
    });

    it("should throw when id is missing for edit action on submit", async () => {
      const { result } = renderHook(
        () =>
          useForm<{ id?: string; title: string }, { title: string }>({
            action: "edit",
            resource: "posts",
            defaultValues: { title: "x" },
          }),
        { wrapper: createWrapper() },
      );

      await expect(
        act(async () => {
          await result.current.onFinish();
        }),
      ).rejects.toThrow("[useForm]: `id` is required for edit action");
    });

    it("should show error notification when fetchEditValues fails", async () => {
      const mockError = { message: "Not found" };
      (mockDataProvider.getOne as jest.Mock).mockRejectedValue(mockError);

      renderHook(
        () =>
          useForm({
            action: "edit",
            resource: "posts",
            id: "1",
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(mockOpen).toHaveBeenCalledWith(
          expect.objectContaining({ type: "error" }),
        );
      });
    });

    it("should reload form with reloadForm", async () => {
      const mockResponse = { data: { id: "1", title: "Reloaded" } };
      (mockDataProvider.getOne as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () =>
          useForm<{ id?: string; title: string }, { title: string }>({
            action: "edit",
            resource: "posts",
            id: "1",
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(mockDataProvider.getOne).toHaveBeenCalledTimes(1);
      });

      act(() => {
        result.current.reloadForm();
      });

      await waitFor(() => {
        expect(mockDataProvider.getOne).toHaveBeenCalledTimes(2);
      });
    });

    it("should reset form without fetching when action is create on reloadForm", () => {
      const { result } = renderHook(
        () =>
          useForm<{ id?: string; title: string }, { title: string }>({
            action: "create",
            resource: "posts",
            defaultValues: { title: "x" },
          }),
        { wrapper: createWrapper() },
      );

      act(() => {
        result.current.reloadForm();
      });

      expect(mockDataProvider.getOne).not.toHaveBeenCalled();
    });

    it("should show error notification with fallback message when reloadForm fetch fails with non-object error", async () => {
      (mockDataProvider.getOne as jest.Mock)
        .mockResolvedValueOnce({ data: { id: "1", title: "x" } })
        .mockRejectedValueOnce("string error");

      const { result } = renderHook(
        () =>
          useForm({
            action: "edit",
            resource: "posts",
            id: "1",
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(mockDataProvider.getOne).toHaveBeenCalledTimes(1);
      });

      act(() => {
        result.current.reloadForm();
      });

      await waitFor(() => {
        expect(mockOpen).toHaveBeenCalledWith(
          expect.objectContaining({ type: "error" }),
        );
      });
    });

    it("should not reset form on submit when resetFormOnSubmit is false", async () => {
      const mockResponse = { data: { id: "1", title: "New" } };
      (mockDataProvider.create as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () =>
          useForm<{ id?: string; title: string }, { title: string }>({
            action: "create",
            resource: "posts",
            defaultValues: { title: "New" },
            resetFormOnSubmit: false,
          }),
        { wrapper: createWrapper() },
      );

      await act(async () => {
        await result.current.onFinish();
      });

      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(true);
      });

      // getOne should not be called since resetFormOnSubmit is false
      expect(mockDataProvider.getOne).not.toHaveBeenCalled();
    });

    it("should handle onMutationError not being provided", async () => {
      const mockError = { message: "Failed", statusCode: 500 };
      (mockDataProvider.create as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(
        () =>
          useForm<{ id?: string; title: string }, { title: string }>({
            action: "create",
            resource: "posts",
            defaultValues: { title: "x" },
          }),
        { wrapper: createWrapper() },
      );

      await act(async () => {
        await result.current.onFinish();
      });

      await waitFor(() => {
        expect(result.current.mutation.isError).toBe(true);
      });
    });

    it("should use form values directly when onFinishTransform is not provided", async () => {
      const mockResponse = { data: { id: "1", title: "Direct" } };
      (mockDataProvider.create as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () =>
          useForm<{ id?: string; title: string }, { title: string }>({
            action: "create",
            resource: "posts",
            defaultValues: { title: "Direct" },
          }),
        { wrapper: createWrapper() },
      );

      await act(async () => {
        await result.current.onFinish();
      });

      expect(mockDataProvider.create).toHaveBeenCalledWith(
        expect.objectContaining({ variables: { title: "Direct" } }),
      );
    });
  });
});
