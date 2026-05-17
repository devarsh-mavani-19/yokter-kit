import { renderHook, act, waitFor } from "@testing-library/react-native";
import { useUpdate } from "./use-update";
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

describe("useUpdate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call dataProvider.update with correct params", async () => {
    const mockResponse = { data: { id: "1", title: "Updated" } };
    (mockDataProvider.update as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUpdate({ resource: "posts" }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        id: "1",
        variables: { title: "Updated" },
      });
    });

    expect(mockDataProvider.update).toHaveBeenCalledWith({
      resource: "posts",
      id: "1",
      variables: { title: "Updated" },
      meta: undefined,
    });
  });

  it("should use resource and id from mutate params over props", async () => {
    const mockResponse = { data: { id: "2", name: "Test" } };
    (mockDataProvider.update as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(
      () => useUpdate({ resource: "posts", id: "1" }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({
        resource: "users",
        id: "2",
        variables: { name: "Test" },
      });
    });

    expect(mockDataProvider.update).toHaveBeenCalledWith({
      resource: "users",
      id: "2",
      variables: { name: "Test" },
      meta: undefined,
    });
  });

  it("should throw when resource is not defined", async () => {
    const { result } = renderHook(() => useUpdate(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await expect(
        result.current.mutateAsync({ id: "1", variables: {} }),
      ).rejects.toThrow("[useUpdate]: `resource` is not defined");
    });
  });

  it("should throw when id is not provided", async () => {
    const { result } = renderHook(() => useUpdate({ resource: "posts" }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await expect(
        result.current.mutateAsync({ variables: {} }),
      ).rejects.toThrow("[useUpdate]: `id` is not provided");
    });
  });

  it("should invalidate resource on success", async () => {
    const mockResponse = { data: { id: "1", title: "Updated" } };
    (mockDataProvider.update as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUpdate({ resource: "posts" }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        id: "1",
        variables: { title: "Updated" },
      });
    });

    expect(mockInvalidateResource).toHaveBeenCalledWith({
      resource: "posts",
      id: "1",
      invalidateQueryFilters: undefined,
    });
  });

  it("should pass custom invalidateQueryFilters", async () => {
    const mockResponse = { data: { id: "1" } };
    (mockDataProvider.update as jest.Mock).mockResolvedValue(mockResponse);

    const customFilters = { queryKey: ["custom"] };
    const { result } = renderHook(
      () => useUpdate({ resource: "posts", invalidateQueryFilters: customFilters }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({ id: "1", variables: {} });
    });

    expect(mockInvalidateResource).toHaveBeenCalledWith({
      resource: "posts",
      id: "1",
      invalidateQueryFilters: customFilters,
    });
  });

  it("should call static successNotification on success", async () => {
    const mockResponse = { data: { id: "1", title: "Updated" } };
    (mockDataProvider.update as jest.Mock).mockResolvedValue(mockResponse);

    const notification = {
      message: "Updated successfully",
      type: "success" as const,
    };
    const { result } = renderHook(
      () => useUpdate({ resource: "posts", successNotification: notification }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({ id: "1", variables: { title: "Updated" } });
    });

    expect(mockOpen).toHaveBeenCalledWith(notification);
  });

  it("should call successNotification function with data", async () => {
    const mockResponse = { data: { id: "1", title: "Updated" } };
    (mockDataProvider.update as jest.Mock).mockResolvedValue(mockResponse);

    const notificationFn = jest.fn().mockReturnValue({
      message: "Done",
      type: "success",
    });

    const { result } = renderHook(
      () => useUpdate({ resource: "posts", successNotification: notificationFn }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({ id: "1", variables: { title: "Updated" } });
    });

    expect(notificationFn).toHaveBeenCalledWith(
      mockResponse.data,
      { title: "Updated" },
      "posts",
    );
    expect(mockOpen).toHaveBeenCalledWith({ message: "Done", type: "success" });
  });

  it("should not send notification when successNotification is false", async () => {
    const mockResponse = { data: { id: "1" } };
    (mockDataProvider.update as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(
      () => useUpdate({ resource: "posts", successNotification: false }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({ id: "1", variables: {} });
    });

    expect(mockOpen).not.toHaveBeenCalled();
  });

  it("should call static errorNotification on failure", async () => {
    const mockError = { message: "Failed", statusCode: 500 };
    (mockDataProvider.update as jest.Mock).mockRejectedValue(mockError);

    const notification = { message: "Update failed", type: "error" as const };
    const { result } = renderHook(
      () => useUpdate({ resource: "posts", errorNotification: notification }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({ id: "1", variables: {} }).catch(() => void 0);
    });

    expect(mockOpen).toHaveBeenCalledWith(notification);
  });

  it("should call errorNotification function with error", async () => {
    const mockError = { message: "Failed", statusCode: 500 };
    (mockDataProvider.update as jest.Mock).mockRejectedValue(mockError);

    const notificationFn = jest.fn().mockReturnValue({
      message: "Error occurred",
      type: "error",
    });

    const { result } = renderHook(
      () => useUpdate({ resource: "posts", errorNotification: notificationFn }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({ id: "1", variables: { title: "x" } }).catch(() => void 0);
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
    (mockDataProvider.update as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(
      () => useUpdate({ resource: "posts", errorNotification: false }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({ id: "1", variables: {} }).catch(() => void 0);
    });

    expect(mockOpen).not.toHaveBeenCalled();
  });

  it("should pass meta to dataProvider.update", async () => {
    const mockResponse = { data: { id: "1" } };
    (mockDataProvider.update as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUpdate({ resource: "posts" }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        id: "1",
        variables: {},
        meta: { tenant: "acme" },
      });
    });

    expect(mockDataProvider.update).toHaveBeenCalledWith({
      resource: "posts",
      id: "1",
      variables: {},
      meta: { tenant: "acme" },
    });
  });

  it("should call mutationOptions.onSuccess callback", async () => {
    const mockResponse = { data: { id: "1" } };
    (mockDataProvider.update as jest.Mock).mockResolvedValue(mockResponse);
    const onSuccess = jest.fn();

    const { result } = renderHook(
      () => useUpdate({ resource: "posts", mutationOptions: { onSuccess } }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({ id: "1", variables: {} });
    });

    expect(onSuccess).toHaveBeenCalled();
  });

  it("should call mutationOptions.onError callback", async () => {
    const mockError = { message: "Failed", statusCode: 500 };
    (mockDataProvider.update as jest.Mock).mockRejectedValue(mockError);
    const onError = jest.fn();

    const { result } = renderHook(
      () => useUpdate({ resource: "posts", mutationOptions: { onError } }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({ id: "1", variables: {} }).catch(() => void 0);
    });

    expect(onError).toHaveBeenCalled();
  });

it("should use default mutationKey when resource is not provided in props", async () => {
    const mockResponse = { data: { id: "1" } };
    (mockDataProvider.update as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUpdate(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        resource: "posts",
        id: "1",
        variables: {},
      });
    });

    expect(mockDataProvider.update).toHaveBeenCalledWith({
      resource: "posts",
      id: "1",
      variables: {},
      meta: undefined,
    });
  });

  it("should return mutation state", async () => {
    const mockResponse = { data: { id: "1" } };
    (mockDataProvider.update as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUpdate({ resource: "posts" }), {
      wrapper: createWrapper(),
    });

    expect(result.current.isIdle).toBe(true);

    await act(async () => {
      await result.current.mutateAsync({ id: "1", variables: {} });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
  });
});
