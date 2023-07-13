import { join } from "path";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";
import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  testTimeout: 40000,
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["tests"],
  // setupFilesAfterEnv: ["./test-utils/jest.test.utils.ts"],
  globalSetup: "./tests/utils/setup.ts",
  globalTeardown: "./tests/utils/teardown.ts",

  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
  //   prefix: join("<rootDir>", compilerOptions.baseUrl),
  // }),
};

export default config;
