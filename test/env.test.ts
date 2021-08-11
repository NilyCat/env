import { getEnvironment } from "../src";

describe("env", () => {
  test(".env", async () => {
    const modes = ["development", "production", "test"];

    modes.forEach((mode) => {
      // Reset NODE_ENV
      process.env.NODE_ENV = mode;

      const config = getEnvironment({
        root: __dirname,
        prefix: "VUE_APP_",
      });
      expect(config).toStrictEqual({
        "process.env": {
          VUE_APP_NAME: '"@nily/env"',
          NODE_ENV: JSON.stringify(mode),
        },
      });
    });
  });
});
