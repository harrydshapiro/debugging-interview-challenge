const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require("./tsconfig.json")

/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  clearMocks: true,
  globalSetup: "./test/setup.ts",
  globalTeardown: "./test/teardown.ts",
  preset: 'ts-jest',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  testEnvironment: "node",
  testRegex: [ ".*\\.test.ts$"],
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};