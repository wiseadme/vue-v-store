module.exports = {
  verbose: true,
  roots: [
    '<rootDir>/tests',
  ],
  moduleFileExtensions: [
    'vue',
    'ts',
    'js',
  ],
  moduleDirectories: [
    'node_modules',
  ],

  transform: {
    '.*\\.(j|t)s$': 'ts-jest',
    '.*\\.ts$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest',
  },
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!**/*.d.ts',
  ],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/',
  ],
  testMatch: [
    // Default
    '**/tests/**/*.ts',
  ],
  globals: {
    'ts-jest': {
      babelConfig: true,
      // tsConfig: '<rootDir>/tsconfig.test.json',
      diagnostics: false,
    },
  },
}
