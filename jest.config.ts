import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    // tsconfig の compilerOptions.paths と合わせる
    "@/(.*)$": "<rootDir>/src/$1",
  },
};

export default createJestConfig(config);
