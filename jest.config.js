// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */

const config = {
  verbose: true,
  modulePaths: ["src"],
  moduleDirectories: ["node_modules"],
  testEnvironment: "jsdom"
};

module.exports = config;