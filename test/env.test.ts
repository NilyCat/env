import { getEnvironment } from "../src";

describe("env", () => {
  const modes = ["development", "production", "test"];

  test("with prefix", async () => {
    modes.forEach((mode) => {
      // Reset NODE_ENV
      process.env.NODE_ENV = mode;

      const config = getEnvironment({
        root: __dirname,
        prefix: "VUE_APP_",
      });
      expect(config["process.env"]).toStrictEqual({
        VUE_APP_NAME: '"@nily/env"',
        NODE_ENV: JSON.stringify(mode),
      });
    });
  });

  test("without prefix", async () => {
    modes.forEach((mode) => {
      // Reset NODE_ENV
      process.env.NODE_ENV = mode;

      const config = getEnvironment({
        root: __dirname,
      });
      const raw = config["process.env"];

      expect(raw.BASE_URL).toBe('"/"');
      expect(raw.VUE_APP_NAME).toBe('"@nily/env"');
      expect(raw.NODE_ENV).toBe(JSON.stringify(mode));
    });
  });

  test("with overwritten", async () => {
    modes.forEach((mode) => {
      // Reset NODE_ENV
      process.env.NODE_ENV = mode;

      const config = getEnvironment({
        root: __dirname,
        prefix: "VUE_APP_",
        overwritten: true,
      });
      expect(config["process.env"]).toStrictEqual({
        VUE_APP_NAME: JSON.stringify(mode),
        NODE_ENV: JSON.stringify(mode),
      });
    });
  });
});
