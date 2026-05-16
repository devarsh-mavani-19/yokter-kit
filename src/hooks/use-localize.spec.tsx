import { renderHook } from "@testing-library/react-native";
import { useLocalize } from "./use-localize";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockLocalize = jest.fn();
let mockI18nProvider: { localize: jest.Mock; changeLocale: jest.Mock; getLocale: jest.Mock } | undefined = {
  localize: mockLocalize,
  changeLocale: jest.fn(),
  getLocale: jest.fn(),
};

jest.mock("../context/yokter.context", () => ({
  useYokterContext: () => ({
    i18nProvider: mockI18nProvider,
    dataProvider: {},
  }),
}));

function createWrapper() {
  const queryClient = new QueryClient();
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }
  return Wrapper;
}

describe("useLocalize", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockI18nProvider = {
      localize: mockLocalize,
      changeLocale: jest.fn(),
      getLocale: jest.fn(),
    };
  });

  it("should return translated value from i18nProvider", () => {
    mockLocalize.mockReturnValue("Translated");

    const { result } = renderHook(() => useLocalize(), {
      wrapper: createWrapper(),
    });

    expect(result.current("some.key")).toBe("Translated");
    expect(mockLocalize).toHaveBeenCalledWith("some.key", undefined, undefined);
  });

  it("should pass options to i18nProvider.localize", () => {
    mockLocalize.mockReturnValue("Hello, World");

    const { result } = renderHook(() => useLocalize(), {
      wrapper: createWrapper(),
    });

    const options = { name: "World" };
    expect(result.current("greeting", options)).toBe("Hello, World");
    expect(mockLocalize).toHaveBeenCalledWith("greeting", options, undefined);
  });

  it("should pass defaultMessage to i18nProvider.localize", () => {
    mockLocalize.mockReturnValue("Default Message");

    const { result } = renderHook(() => useLocalize(), {
      wrapper: createWrapper(),
    });

    expect(result.current("missing.key", undefined, "Default Message")).toBe(
      "Default Message",
    );
    expect(mockLocalize).toHaveBeenCalledWith(
      "missing.key",
      undefined,
      "Default Message",
    );
  });

  it("should return defaultMessage when i18nProvider.localize returns falsy", () => {
    mockLocalize.mockReturnValue(undefined);

    const { result } = renderHook(() => useLocalize(), {
      wrapper: createWrapper(),
    });

    expect(result.current("missing.key", undefined, "Fallback")).toBe("Fallback");
  });

  it("should return key when both localize result and defaultMessage are falsy", () => {
    mockLocalize.mockReturnValue(undefined);

    const { result } = renderHook(() => useLocalize(), {
      wrapper: createWrapper(),
    });

    expect(result.current("some.key")).toBe("some.key");
  });

  it("should return defaultMessage when i18nProvider is undefined", () => {
    mockI18nProvider = undefined;

    const { result } = renderHook(() => useLocalize(), {
      wrapper: createWrapper(),
    });

    expect(result.current("key", undefined, "Default")).toBe("Default");
  });

  it("should return key when i18nProvider is undefined and no defaultMessage", () => {
    mockI18nProvider = undefined;

    const { result } = renderHook(() => useLocalize(), {
      wrapper: createWrapper(),
    });

    expect(result.current("some.key")).toBe("some.key");
  });
});
