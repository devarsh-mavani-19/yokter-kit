import { renderHook, act, waitFor } from "@testing-library/react-native";
import { useCreate } from "./use-create";
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

describe("useCreate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call dataProvider.create with correct params", async () => {
    const mockResponse = { data: { id: "1", title: "New Post" } };
    (mockDataProvider.create as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCreate({ resource: "posts" }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        variables: { title: "New Post" },
      });
    });

    expect(mockDataProvider.create).toHaveBeenCalledWith({
      resource: "posts",
      variables: { title: "New Post" },
      meta: undefined,
    });
  });

  it("should use resource from mutate params over props", async () => {
    const mockResponse = { data: { id: "1", name: "User" } };
    (mockDataProvider.create as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCreate({ resource: "posts" }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        resource: "users",
        variables: { name: "User" },
      });
    });

    expect(mockDataProvider.create).toHaveBeenCalledWith({
      resource: "users",
      variables: { name: "User" },
      meta: undefined,
    });
  });

  it("should throw when resource is not defined", async () => {
    const { result } = renderHook(() => useCreate(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await expect(
        result.current.mutateAsync({ variables: { title: "x" } }),
      ).rejects.toThrow("[useCreate]: `resource` is not defined");
    });
  });

  it("should throw when variables is not provided", async () => {
    const { result } = renderHook(() => useCreate({ resource: "posts" }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await expect(result.current.mutateAsync({})).rejects.toThrow(
        "[useCreate]: `variables` is not provided",
      );
    });
  });

  it("should invalidate resource on success", async () => {
    const mockResponse = { data: { id: "1", title: "New" } };
    (mockDataProvider.create as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCreate({ resource: "posts" }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ variables: { title: "New" } });
    });

    expect(mockInvalidateResource).toHaveBeenCalledWith({
      resource: "posts",
      invalidateQueryFilters: undefined,
    });
  });

  it("should pass custom invalidateQueryFilters", async () => {
    const mockResponse = { data: { id: "1" } };
    (mockDataProvider.create as jest.Mock).mockResolvedValue(mockResponse);

    const customFilters = { queryKey: ["custom"] };
    const { result } = renderHook(
      () => useCreate({ resource: "posts", invalidateQueryFilters: customFilters }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({ variables: { title: "x" } });
    });

    expect(mockInvalidateResource).toHaveBeenCalledWith({
      resource: "posts",
      invalidateQueryFilters: customFilters,
    });
  });

  it("should call static successNotification on success", async () => {
    const mockResponse = { data: { id: "1" } };
    (mockDataProvider.create as jest.Mock).mockResolvedValue(mockResponse);

    const notification = {
      message: "Created successfully",
      type: "success" as const,
    };
    const { result } = renderHook(
      () => useCreate({ resource: "posts", successNotification: notification }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({ variables: { title: "x" } });
    });

    expect(mockOpen).toHaveBeenCalledWith(notification);
  });

  it("should call successNotification function with data", async () => {
    const mockResponse = { data: { id: "1", title: "Created" } };
    (mockDataProvider.create as jest.Mock).mockResolvedValue(mockResponse);

    const notificationFn = jest.fn().mockReturnValue({
      message: "Done",
      type: "success",
    });

    const { result } = renderHook(
      () => useCreate({ resource: "posts", successNotification: notificationFn }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({ variables: { title: "Created" } });
    });

    expect(notificationFn).toHaveBeenCalledWith(
      mockResponse.data,
      { title: "Created" },
      "posts",
    );
    expect(mockOpen).toHaveBeenCalledWith({ message: "Done", type: "success" });
  });

  it("should not send notification when successNotification is false", async () => {
    const mockResponse = { data: { id: "1" } };
    (mockDataProvider.create as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(
      () => useCreate({ resource: "posts", successNotification: false }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({ variables: { title: "x" } });
    });

    expect(mockOpen).not.toHaveBeenCalled();
  });

  it("should call static errorNotification on failure", async () => {
    const mockError = { message: "Failed", statusCode: 500 };
    (mockDataProvider.create as jest.Mock).mockRejectedValue(mockError);

    const notification = { message: "Create failed", type: "error" as const };
    const { result } = renderHook(
      () => useCreate({ resource: "posts", errorNotification: notification }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current
        .mutateAsync({ variables: { title: "x" } })
        .catch(() => void 0);
    });

    expect(mockOpen).toHaveBeenCalledWith(notification);
  });

  it("should call errorNotification function with error", async () => {
    const mockError = { message: "Failed", statusCode: 500 };
    (mockDataProvider.create as jest.Mock).mockRejectedValue(mockError);

    const notificationFn = jest.fn().mockReturnValue({
      message: "Error occurred",
      type: "error",
    });

    const { result } = renderHook(
      () => useCreate({ resource: "posts", errorNotification: notificationFn }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current
        .mutateAsync({ variables: { title: "x" } })
        .catch(() => void 0);
    });

    expect(notificationFn).toHaveBeenCalledWith(
      mockError,
      { title: "x" },
      "posts",
    );
    expect(mockOpen).toHaveBeenCalledWith({
      message: "Error occurred",
      type: "error",
    });
  });

  it("should not send notification when errorNotification is false", async () => {
    const mockError = { message: "Failed", statusCode: 500 };
    (mockDataProvider.create as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(
      () => useCreate({ resource: "posts", errorNotification: false }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current
        .mutateAsync({ variables: { title: "x" } })
        .catch(() => void 0);
    });

    expect(mockOpen).not.toHaveBeenCalled();
  });

  it("should pass meta to dataProvider.create", async () => {
    const mockResponse = { data: { id: "1" } };
    (mockDataProvider.create as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCreate({ resource: "posts" }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        variables: { title: "x" },
        meta: { tenant: "acme" },
      });
    });

    expect(mockDataProvider.create).toHaveBeenCalledWith({
      resource: "posts",
      variables: { title: "x" },
      meta: { tenant: "acme" },
    });
  });

  it("should call mutationOptions.onSuccess callback", async () => {
    const mockResponse = { data: { id: "1" } };
    (mockDataProvider.create as jest.Mock).mockResolvedValue(mockResponse);
    const onSuccess = jest.fn();

    const { result } = renderHook(
      () => useCreate({ resource: "posts", mutationOptions: { onSuccess } }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({ variables: { title: "x" } });
    });

    expect(onSuccess).toHaveBeenCalled();
  });

  it("should call mutationOptions.onError callback", async () => {
    const mockError = { message: "Failed", statusCode: 500 };
    (mockDataProvider.create as jest.Mock).mockRejectedValue(mockError);
    const onError = jest.fn();

    const { result } = renderHook(
      () => useCreate({ resource: "posts", mutationOptions: { onError } }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current
        .mutateAsync({ variables: { title: "x" } })
        .catch(() => void 0);
    });

    expect(onError).toHaveBeenCalled();
  });

  it("should use default mutationKey when resource is not provided in props", async () => {
    const mockResponse = { data: { id: "1" } };
    (mockDataProvider.create as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCreate(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        resource: "posts",
        variables: { title: "x" },
      });
    });

    expect(mockDataProvider.create).toHaveBeenCalledWith({
      resource: "posts",
      variables: { title: "x" },
      meta: undefined,
    });
  });

  it("should return mutation state", async () => {
    const mockResponse = { data: { id: "1" } };
    (mockDataProvider.create as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCreate({ resource: "posts" }), {
      wrapper: createWrapper(),
    });

    expect(result.current.isIdle).toBe(true);

    await act(async () => {
      await result.current.mutateAsync({ variables: { title: "x" } });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
  });
});
