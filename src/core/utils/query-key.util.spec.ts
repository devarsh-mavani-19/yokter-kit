import { getQueryKey } from "./query-key.util";

describe("getQueryKey", () => {
  it("should return resource segments", () => {
    expect(getQueryKey({ resource: "posts" })).toEqual(["posts"]);
  });

  it("should split nested resource paths", () => {
    expect(getQueryKey({ resource: "users/posts" })).toEqual([
      "users",
      "posts",
    ]);
  });

  it("should filter empty segments from resource", () => {
    expect(getQueryKey({ resource: "/posts/" })).toEqual(["posts"]);
  });

  it("should prepend action when provided", () => {
    expect(getQueryKey({ resource: "posts", action: "list" })).toEqual([
      "list",
      "posts",
    ]);
  });

  it("should include id after resource", () => {
    expect(getQueryKey({ resource: "posts", id: "123" })).toEqual([
      "posts",
      "123",
    ]);
  });

  it("should exclude id when it is '-'", () => {
    expect(getQueryKey({ resource: "posts", id: "-" })).toEqual(["posts"]);
  });

  it("should exclude id when undefined", () => {
    expect(getQueryKey({ resource: "posts", id: undefined })).toEqual([
      "posts",
    ]);
  });

  it("should include pagination when provided", () => {
    const pagination = { current: 1, pageSize: 10 };
    expect(getQueryKey({ resource: "posts", pagination })).toEqual([
      "posts",
      pagination,
    ]);
  });

  it("should include sorters when provided", () => {
    const sorters = [{ field: "title", order: "asc" as const }];
    expect(getQueryKey({ resource: "posts", sorters })).toEqual([
      "posts",
      sorters,
    ]);
  });

  it("should include meta when provided", () => {
    const meta = { locale: "en" };
    expect(getQueryKey({ resource: "posts", meta })).toEqual(["posts", meta]);
  });

  it("should combine all parameters in correct order", () => {
    const pagination = { current: 2, pageSize: 5 };
    const sorters = [{ field: "name", order: "desc" as const }];
    const meta = { tenant: "acme" };

    expect(
      getQueryKey({
        resource: "users/posts",
        action: "list",
        id: "42",
        pagination,
        sorters,
        meta,
      }),
    ).toEqual(["list", "users", "posts", "42", pagination, sorters, meta]);
  });

  it("should handle action without optional params", () => {
    expect(getQueryKey({ resource: "posts", action: "one" })).toEqual([
      "one",
      "posts",
    ]);
  });

  it("should handle all action types", () => {
    const actions = ["list", "one", "create", "update", "delete"] as const;
    for (const action of actions) {
      const result = getQueryKey({ resource: "posts", action });
      expect(result[0]).toBe(action);
    }
  });
});
