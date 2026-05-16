/** @type {import('jest').Config} */
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.spec.ts", "**/*.spec.tsx"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  setupFiles: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
};
