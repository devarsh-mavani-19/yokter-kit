import { renderHook, act, waitFor } from "@testing-library/react-native";
import { useDelete } from "./use-delete";
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
    defaultOptions: { mutations: { retry: false } },
  });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }
  return Wrapper;
}

describe("useDelete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call dataProvider.deleteOne with correct params", async () => {
    const mockResponse = { data: { id: "1" } };
    (mockDataProvider.deleteOne as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useDelete({ resource: "posts" }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ id: "1" });
    });

    expect(mockDataProvider.deleteOne).toHaveBeenCalledWith({
      resource: "posts",
      id: "1",
      meta: undefined,
    });
  });

  it("should use resource and id from mutate params over props", async () => {
    const mockResponse = { data: { id: "2" } };
    (mockDataProvider.deleteOne as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(
      () => useDelete({ resource: "posts", id: "1" }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({ resource: "users", id: "2" });
    });

    expect(mockDataProvider.deleteOne).toHaveBeenCalledWith({
      resource: "users",
      id: "2",
      meta: undefined,
    });
  });

  it("should throw when resource is not defined", async () => {
    const { result } = renderHook(() => useDelete(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await expect(
        result.current.mutateAsync({ id: "1" }),
      ).rejects.toThrow("[useDelete]: `resource` is not defined");
    });
  });

  it("should throw when id is not provided", async () => {
    const { result } = renderHook(() => useDelete({ resource: "posts" }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await expect(result.current.mutateAsync({})).rejects.toThrow(
        "[useDelete]: `id` is not provided",
      );
    });
  });

  it("should invalidate resource on success", async () => {
    const mockResponse = { data: { id: "1" } };
    (mockDataProvider.deleteOne as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useDelete({ resource: "posts" }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ id: "1" });
    });

    expect(mockInvalidateResource).toHaveBeenCalledWith({
      resource: "posts",
      id: "1",
      invalidateQueryFilters: undefined,
    });
  });

  it("should pass custom invalidateQueryFilters", async () => {
    const mockResponse = { data: { id: "1" } };
    (mockDataProvider.deleteOne as jest.Mock).mockResolvedValue(mockResponse);

    const customFilters = { queryKey: ["custom"] };
    const { result } = renderHook(
      () => useDelete({ resource: "posts", invalidateQueryFilters: customFilters }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({ id: "1" });
    });

    expect(mockInvalidateResource).toHaveBeenCalledWith({
      resource: "posts",
      id: "1",
      invalidateQueryFilters: customFilters,
    });
  });

  it("should call static successNotification on success", async () => {
    const mockResponse = { data: { id: "1" } };
    (mockDataProvider.deleteOne as jest.Mock).mockResolvedValue(mockResponse);

    const notification = {
      message: "Deleted successfully",
      type: "success" as const,
    };
    const { result } = renderHook(
      () => useDelete({ resource: "posts", successNotification: notification }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({ id: "1" });
    });

    expect(mockOpen).toHaveBeenCalledWith(notification);
  });

  it("should call successNotification function", async () => {
    const mockResponse = { data: { id: "1" } };
    (mockDataProvider.deleteOne as jest.Mock).mockResolvedValue(mockResponse);

    const notificationFn = jest.fn().mockReturnValue({
      message: "Done",
      type: "success",
    });

    const { result } = renderHook(
      () => useDelete({ resource: "posts", successNotification: notificationFn }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({ id: "1" });
    });

    expect(notificationFn).toHaveBeenCalledWith(mockResponse, undefined, "posts");
    expect(mockOpen).toHaveBeenCalledWith({ message: "Done", type: "success" });
  });

  it("should not send notification when successNotification is false", async () => {
    const mockResponse = { data: { id: "1" } };
    (mockDataProvider.deleteOne as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(
      () => useDelete({ resource: "posts", successNotification: false }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({ id: "1" });
    });

    expect(mockOpen).not.toHaveBeenCalled();
  });

  it("should call static errorNotification on failure", async () => {
    const mockError = { message: "Failed", statusCode: 500 };
    (mockDataProvider.deleteOne as jest.Mock).mockRejectedValue(mockError);

    const notification = { message: "Delete failed", type: "error" as const };
    const { result } = renderHook(
      () => useDelete({ resource: "posts", errorNotification: notification }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({ id: "1" }).catch(() => void 0);
    });

    expect(mockOpen).toHaveBeenCalledWith(notification);
  });

  it("should call errorNotification function with error", async () => {
    const mockError = { message: "Failed", statusCode: 500 };
    (mockDataProvider.deleteOne as jest.Mock).mockRejectedValue(mockError);

    const notificationFn = jest.fn().mockReturnValue({
      message: "Error occurred",
      type: "error",
    });

    const { result } = renderHook(
      () => useDelete({ resource: "posts", errorNotification: notificationFn }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({ id: "1" }).catch(() => void 0);
    });

    expect(notificationFn).toHaveBeenCalledWith(mockError, undefined, "posts");
    expect(mockOpen).toHaveBeenCalledWith({
      message: "Error occurred",
      type: "error",
    });
  });

  it("should not send notification when errorNotification is false", async () => {
    const mockError = { message: "Failed", statusCode: 500 };
    (mockDataProvider.deleteOne as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(
      () => useDelete({ resource: "posts", errorNotification: false }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({ id: "1" }).catch(() => void 0);
    });

    expect(mockOpen).not.toHaveBeenCalled();
  });

  it("should pass meta to dataProvider.deleteOne", async () => {
    const mockResponse = { data: { id: "1" } };
    (mockDataProvider.deleteOne as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useDelete({ resource: "posts" }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ id: "1", meta: { reason: "spam" } });
    });

    expect(mockDataProvider.deleteOne).toHaveBeenCalledWith({
      resource: "posts",
      id: "1",
      meta: { reason: "spam" },
    });
  });

  it("should call mutationOptions.onSuccess callback", async () => {
    const mockResponse = { data: { id: "1" } };
    (mockDataProvider.deleteOne as jest.Mock).mockResolvedValue(mockResponse);
    const onSuccess = jest.fn();

    const { result } = renderHook(
      () => useDelete({ resource: "posts", mutationOptions: { onSuccess } }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({ id: "1" });
    });

    expect(onSuccess).toHaveBeenCalled();
  });

  it("should call mutationOptions.onError callback", async () => {
    const mockError = { message: "Failed", statusCode: 500 };
    (mockDataProvider.deleteOne as jest.Mock).mockRejectedValue(mockError);
    const onError = jest.fn();

    const { result } = renderHook(
      () => useDelete({ resource: "posts", mutationOptions: { onError } }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({ id: "1" }).catch(() => void 0);
    });

    expect(onError).toHaveBeenCalled();
  });

  it("should use default mutationKey when resource is not in props", async () => {
    const mockResponse = { data: { id: "1" } };
    (mockDataProvider.deleteOne as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useDelete(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ resource: "posts", id: "1" });
    });

    expect(mockDataProvider.deleteOne).toHaveBeenCalledWith({
      resource: "posts",
      id: "1",
      meta: undefined,
    });
  });

  it("should return mutation state", async () => {
    const mockResponse = { data: { id: "1" } };
    (mockDataProvider.deleteOne as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useDelete({ resource: "posts" }), {
      wrapper: createWrapper(),
    });

    expect(result.current.isIdle).toBe(true);

    await act(async () => {
      await result.current.mutateAsync({ id: "1" });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
  });
});
