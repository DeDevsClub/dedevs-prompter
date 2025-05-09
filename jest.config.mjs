// jest.config.mjs
/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/app', '<rootDir>/components', '<rootDir>/lib', '<rootDir>/hooks'],
  moduleNameMapper: {
    // Handle module aliases (if you have them in tsconfig.json)
    '^@/app/(.*)$': '<rootDir>/app/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    // Mock CSS imports (if you import CSS in JS/TS files)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Optional: for global test setup
  transform: {
    '^.+\\.m?js$': 'babel-jest', // if you need to transpile mjs or js files specifically with babel
  },
  // Add this if you're using ES modules and want to allow 'import.meta.url'
  // or if you have issues with ES module imports in tests.
  // extensionsToTreatAsEsm: ['.ts', '.tsx'], // This can sometimes cause issues with CJS modules
  // globals: {
  //   'ts-jest': {
  //     useESM: true, // Use this if extensionsToTreatAsEsm is enabled and you have ESM-only dependencies
  //   },
  // },
};
