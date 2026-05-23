import { renderHook, waitFor } from "@testing-library/react-native";
import { useOne } from "./use-one";
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

describe("useOne", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call dataProvider.getOne with correct params", async () => {
    const mockResponse = { data: { id: "1", title: "Test Post" } };
    (mockDataProvider.getOne as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(
      () => useOne({ resource: "posts", id: "1" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockDataProvider.getOne).toHaveBeenCalledWith({
      resource: "posts",
      id: "1",
    });
    expect(result.current.data).toEqual(mockResponse);
  });

  it("should pass meta to dataProvider.getOne", async () => {
    const mockResponse = { data: { id: "1", title: "Test" } };
    (mockDataProvider.getOne as jest.Mock).mockResolvedValue(mockResponse);

    const meta = { locale: "en" };
    const { result } = renderHook(
      () => useOne({ resource: "posts", id: "1", meta }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockDataProvider.getOne).toHaveBeenCalledWith({
      resource: "posts",
      id: "1",
      meta,
    });
  });

  it("should not fetch when enabled is false", () => {
    const { result } = renderHook(
      () => useOne({ resource: "posts", id: "1", enabled: false }),
      { wrapper: createWrapper() },
    );

    expect(mockDataProvider.getOne).not.toHaveBeenCalled();
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("should return loading state initially", () => {
    (mockDataProvider.getOne as jest.Mock).mockReturnValue(
      new Promise(() => void 0),
    );

    const { result } = renderHook(
      () => useOne({ resource: "posts", id: "1" }),
      { wrapper: createWrapper() },
    );

    expect(result.current.isPending).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it("should return error state on failure", async () => {
    const mockError = { message: "Not found", statusCode: 404 };
    (mockDataProvider.getOne as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(
      () => useOne({ resource: "posts", id: "1" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });
});
