import { renderHook } from "@testing-library/react-native";
import { useTranslate } from "./use-translate";
import React from "react";
import { I18nContextProvider } from "../context/i18n.context";

const mockLocalize = jest.fn();
let mockI18nProvider: { localize: jest.Mock; changeLocale: jest.Mock; getLocale: jest.Mock } | undefined = {
  localize: mockLocalize,
  changeLocale: jest.fn(),
  getLocale: jest.fn(),
};

function createWrapper() {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <I18nContextProvider i18nProvider={mockI18nProvider}>
        {children}
      </I18nContextProvider>
    );
  }
  return Wrapper;
}

describe("useTranslate", () => {
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

    const { result } = renderHook(() => useTranslate(), {
      wrapper: createWrapper(),
    });

    expect(result.current("some.key")).toBe("Translated");
    expect(mockLocalize).toHaveBeenCalledWith("some.key", undefined, undefined);
  });

  it("should pass options to i18nProvider.localize", () => {
    mockLocalize.mockReturnValue("Hello, World");

    const { result } = renderHook(() => useTranslate(), {
      wrapper: createWrapper(),
    });

    const options = { name: "World" };
    expect(result.current("greeting", options)).toBe("Hello, World");
    expect(mockLocalize).toHaveBeenCalledWith("greeting", options, undefined);
  });

  it("should pass defaultMessage to i18nProvider.localize", () => {
    mockLocalize.mockReturnValue("Default Message");

    const { result } = renderHook(() => useTranslate(), {
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

    const { result } = renderHook(() => useTranslate(), {
      wrapper: createWrapper(),
    });

    expect(result.current("missing.key", undefined, "Fallback")).toBe("Fallback");
  });

  it("should return key when both localize result and defaultMessage are falsy", () => {
    mockLocalize.mockReturnValue(undefined);

    const { result } = renderHook(() => useTranslate(), {
      wrapper: createWrapper(),
    });

    expect(result.current("some.key")).toBe("some.key");
  });

  it("should return defaultMessage when i18nProvider is undefined", () => {
    mockI18nProvider = undefined;

    const { result } = renderHook(() => useTranslate(), {
      wrapper: createWrapper(),
    });

    expect(result.current("key", undefined, "Default")).toBe("Default");
  });

  it("should return key when i18nProvider is undefined and no defaultMessage", () => {
    mockI18nProvider = undefined;

    const { result } = renderHook(() => useTranslate(), {
      wrapper: createWrapper(),
    });

    expect(result.current("some.key")).toBe("some.key");
  });
});
