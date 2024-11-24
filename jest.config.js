const nextJest = require("next/jest");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.development" });

const createJestConfig = nextJest({
  dir: "./",
});
const customJestConfig = {
  moduleDirectories: ["node_modules", "<rootDir>"],
  setupFiles: ["<rootDir>/jest.setup.js"],
  testTimeout: 6000,
};

module.exports = createJestConfig(customJestConfig);

// dando poderes para o jest com o next.js
