export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["<rootDir>/src/tests/**/*.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  // setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
  globals: {
    transform: {
      tsconfig: "tsconfig.json",
    },
  },
  testTimeout: 20000,
  verbose: true,
  coveragePathIgnorePatterns: [
    "<rootDir>/src/app.ts",
    "<rootDir>/src/routes",
    "<rootDir>/src/config",
    "<rootDir>/src/middlewares",
    "<rootDir>/src/exceptions",
    "<rootDir>/src/utils",
    "<rootDir>/src/responses",
  ],
};
