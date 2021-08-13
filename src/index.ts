import { existsSync } from "fs";
import { resolve } from "path";
import { envConfig } from "./envConfig";

export interface EnvOptions {
  root: string;
  envFileName?: string;
  prefix?: string;
  overwritten?: boolean;
}

export interface EnvResult {
  "process.env": Record<string, string>;
}

export function getEnvironment({
  root,
  envFileName = ".env",
  prefix,
  overwritten = false,
}: EnvOptions): EnvResult {
  const NODE_ENV = process.env.NODE_ENV || "development";

  // If the env.NODE_ENV doesn't exist, create it
  process.env.NODE_ENV = NODE_ENV;

  const dotenvFiles = [
    resolve(root, envFileName),
    resolve(root, [envFileName, NODE_ENV].join(".")),
  ];

  dotenvFiles.forEach((dotenvFile) => {
    if (existsSync(dotenvFile)) {
      require("dotenv-expand")(
        envConfig({
          path: dotenvFile,
          overwritten,
        })
      );
    }
  });

  const raw: Record<string, any> = Object.keys(process.env)
    .filter((key) => (prefix ? key.startsWith(prefix) : true))
    .reduce(
      (env: Record<string, any>, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches into the correct mode.
        NODE_ENV: process.env.NODE_ENV,
      }
    );

  // Stringify all values so we can feed into webpack DefinePlugin
  return {
    "process.env": Object.keys(raw).reduce((env: Record<string, any>, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };
}
