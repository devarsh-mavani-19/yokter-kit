import { renderHook, waitFor } from "@testing-library/react-native";
import { useInfiniteList } from "./use-infinite-list";
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

describe("useInfiniteList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call dataProvider.getList with pagination starting at page 1", async () => {
    const mockResponse = { data: [{ id: "1" }], total: 1 };
    (mockDataProvider.getList as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(
      () => useInfiniteList({ resource: "posts" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockDataProvider.getList).toHaveBeenCalledWith({
      resource: "posts",
      pagination: { mode: "server", current: 1, pageSize: 10 },
    });
  });

  it("should use custom pageSize", async () => {
    const mockResponse = { data: [{ id: "1" }], total: 1 };
    (mockDataProvider.getList as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(
      () => useInfiniteList({ resource: "posts", pageSize: 5 }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockDataProvider.getList).toHaveBeenCalledWith({
      resource: "posts",
      pagination: { mode: "server", current: 1, pageSize: 5 },
    });
  });

  it("should have next page when data length equals pageSize", async () => {
    const items = Array.from({ length: 10 }, (_, i) => ({ id: String(i) }));
    const mockResponse = { data: items, total: 20 };
    (mockDataProvider.getList as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(
      () => useInfiniteList({ resource: "posts" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.hasNextPage).toBe(true);
  });

  it("should not have next page when data length is less than pageSize", async () => {
    const mockResponse = { data: [{ id: "1" }, { id: "2" }], total: 2 };
    (mockDataProvider.getList as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(
      () => useInfiniteList({ resource: "posts", pageSize: 10 }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.hasNextPage).toBe(false);
  });

  it("should fetch next page with incremented page param", async () => {
    const page1 = Array.from({ length: 10 }, (_, i) => ({ id: String(i) }));
    const page2 = [{ id: "10" }];
    (mockDataProvider.getList as jest.Mock)
      .mockResolvedValueOnce({ data: page1, total: 11 })
      .mockResolvedValueOnce({ data: page2, total: 11 });

    const { result } = renderHook(
      () => useInfiniteList({ resource: "posts" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    void result.current.fetchNextPage();

    await waitFor(() => {
      expect(result.current.data?.pages).toHaveLength(2);
    });

    expect(mockDataProvider.getList).toHaveBeenCalledWith({
      resource: "posts",
      pagination: { mode: "server", current: 2, pageSize: 10 },
    });
  });

  it("should pass additional props to dataProvider.getList", async () => {
    const mockResponse = { data: [{ id: "1" }], total: 1 };
    (mockDataProvider.getList as jest.Mock).mockResolvedValue(mockResponse);

    const meta = { locale: "en" };
    const sorters = [{ field: "name", order: "asc" as const }];
    const { result } = renderHook(
      () => useInfiniteList({ resource: "posts", meta, sorters }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockDataProvider.getList).toHaveBeenCalledWith({
      resource: "posts",
      meta,
      sorters,
      pagination: { mode: "server", current: 1, pageSize: 10 },
    });
  });

  it("should return error state on failure", async () => {
    const mockError = { message: "Server error", statusCode: 500 };
    (mockDataProvider.getList as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(
      () => useInfiniteList({ resource: "posts" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });

  it("should return loading state initially", () => {
    (mockDataProvider.getList as jest.Mock).mockReturnValue(
      new Promise(() => void 0),
    );

    const { result } = renderHook(
      () => useInfiniteList({ resource: "posts" }),
      { wrapper: createWrapper() },
    );

    expect(result.current.isPending).toBe(true);
  });
});
