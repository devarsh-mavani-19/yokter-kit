import { renderHook, act } from "@testing-library/react-native";
import { useInvalidate } from "./use-invalidate";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function createWrapper() {
  const queryClient = new QueryClient();
  return { queryClient, Wrapper };

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }
}

describe("useInvalidate", () => {
  it("should invalidate queries for a resource", async () => {
    const { queryClient, Wrapper } = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useInvalidate(), {
      wrapper: Wrapper,
    });

    await act(async () => {
      await result.current.invalidateResource({ resource: "posts" });
    });

    expect(invalidateSpy).toHaveBeenCalled();
    const call = invalidateSpy.mock.calls[0][0]!;
    expect(call.queryKey).toEqual(["posts"]);
    expect(call.type).toBe("all");
    expect(call.refetchType).toBe("all");
  });

  it("should invalidate with custom predicate matching resource parts", async () => {
    const { queryClient, Wrapper } = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useInvalidate(), {
      wrapper: Wrapper,
    });

    await act(async () => {
      await result.current.invalidateResource({ resource: "users/posts" });
    });

    const call = invalidateSpy.mock.calls[0][0]!;
    const predicate = call.predicate!;

    // Predicate checks if queryKey[index] matches the resource part at same index
    // "users/posts" => ["users", "posts"] checks queryKey[0]==="users" OR queryKey[1]==="posts"
    expect(predicate({ queryKey: ["users", "list"] } as never)).toBe(true);
    expect(predicate({ queryKey: ["other", "posts"] } as never)).toBe(true);
    expect(predicate({ queryKey: ["comments"] } as never)).toBe(false);
    expect(predicate({ queryKey: ["posts", "1"] } as never)).toBe(false);
  });

  it("should also invalidate specific record query when id is provided", async () => {
    const { queryClient, Wrapper } = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useInvalidate(), {
      wrapper: Wrapper,
    });

    await act(async () => {
      await result.current.invalidateResource({ resource: "posts", id: "1" });
    });

    // Should be called twice: once for resource, once for specific record
    expect(invalidateSpy).toHaveBeenCalledTimes(2);
    expect(invalidateSpy.mock.calls[1][0]).toEqual({
      queryKey: ["posts", "1"],
    });
  });

  it("should not invalidate specific record when id is not provided", async () => {
    const { queryClient, Wrapper } = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useInvalidate(), {
      wrapper: Wrapper,
    });

    await act(async () => {
      await result.current.invalidateResource({ resource: "posts" });
    });

    expect(invalidateSpy).toHaveBeenCalledTimes(1);
  });

  it("should use custom invalidateQueryFilters when provided", async () => {
    const { queryClient, Wrapper } = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useInvalidate(), {
      wrapper: Wrapper,
    });

    const customPredicate = () => true;
    await act(async () => {
      await result.current.invalidateResource({
        resource: "posts",
        invalidateQueryFilters: {
          queryKey: ["custom-key"],
          type: "active",
          refetchType: "none",
          predicate: customPredicate,
        },
      });
    });

    const call = invalidateSpy.mock.calls[0][0]!;
    expect(call.queryKey).toEqual(["custom-key"]);
    expect(call.type).toBe("active");
    expect(call.refetchType).toBe("none");
    expect(call.predicate).toBe(customPredicate);
  });

  it("should invalidate all queries with invalidateAll", async () => {
    const { queryClient, Wrapper } = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useInvalidate(), {
      wrapper: Wrapper,
    });

    await act(async () => {
      await result.current.invalidateAll();
    });

    expect(invalidateSpy).toHaveBeenCalledWith();
  });
});
