import { renderHook, waitFor } from "@testing-library/react-native";
import { useList } from "./use-list";
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

jest.mock("../context/yokter.context", () => ({
  useYokterContext: () => ({ dataProvider: mockDataProvider }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }
  return Wrapper;
}

describe("useList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call dataProvider.getList with correct params", async () => {
    const mockResponse = { data: [{ id: "1", title: "Post" }], total: 1 };
    (mockDataProvider.getList as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(
      () => useList({ resource: "posts" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockDataProvider.getList).toHaveBeenCalledWith({
      resource: "posts",
    });
    expect(result.current.data).toEqual(mockResponse);
  });

  it("should pass pagination to dataProvider.getList", async () => {
    const mockResponse = { data: [{ id: "1" }], total: 10 };
    (mockDataProvider.getList as jest.Mock).mockResolvedValue(mockResponse);

    const pagination = { current: 2, pageSize: 5 };
    const { result } = renderHook(
      () => useList({ resource: "posts", pagination }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockDataProvider.getList).toHaveBeenCalledWith({
      resource: "posts",
      pagination,
    });
  });

  it("should pass sorters to dataProvider.getList", async () => {
    const mockResponse = { data: [{ id: "1" }], total: 1 };
    (mockDataProvider.getList as jest.Mock).mockResolvedValue(mockResponse);

    const sorters = [{ field: "title", order: "asc" as const }];
    const { result } = renderHook(
      () => useList({ resource: "posts", sorters }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockDataProvider.getList).toHaveBeenCalledWith({
      resource: "posts",
      sorters,
    });
  });

  it("should pass meta to dataProvider.getList", async () => {
    const mockResponse = { data: [], total: 0 };
    (mockDataProvider.getList as jest.Mock).mockResolvedValue(mockResponse);

    const meta = { tenant: "acme" };
    const { result } = renderHook(
      () => useList({ resource: "posts", meta }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockDataProvider.getList).toHaveBeenCalledWith({
      resource: "posts",
      meta,
    });
  });

  it("should not fetch when enabled is false", () => {
    const { result } = renderHook(
      () => useList({ resource: "posts", enabled: false }),
      { wrapper: createWrapper() },
    );

    expect(mockDataProvider.getList).not.toHaveBeenCalled();
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("should return loading state initially", () => {
    (mockDataProvider.getList as jest.Mock).mockReturnValue(
      new Promise(() => void 0),
    );

    const { result } = renderHook(
      () => useList({ resource: "posts" }),
      { wrapper: createWrapper() },
    );

    expect(result.current.isPending).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it("should return error state on failure", async () => {
    const mockError = { message: "Server error", statusCode: 500 };
    (mockDataProvider.getList as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(
      () => useList({ resource: "posts" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });
});
