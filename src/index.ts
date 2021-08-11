import { existsSync } from "fs";
import { resolve } from "path";

export interface EnvOptions {
  root: string;
  envFileName?: string;
  prefix: string;
}

export interface EnvResult {
  "process.env": Record<string, string>;
}

export function getEnvironment({
  root,
  envFileName = ".env",
  prefix,
}: EnvOptions): EnvResult {
  const NODE_ENV = process.env.NODE_ENV;
  if (!NODE_ENV) {
    throw new Error(
      "The NODE_ENV environment variable is required but was not specified."
    );
  }

  const dotenvFiles = [
    resolve(root, envFileName),
    resolve(root, [envFileName, NODE_ENV].join(".")),
  ];

  dotenvFiles.forEach((dotenvFile) => {
    if (existsSync(dotenvFile)) {
      require("dotenv-expand")(
        require("dotenv").config({
          path: dotenvFile,
        })
      );
    }
  });

  const raw: Record<string, any> = Object.keys(process.env)
    .filter((key) => key.startsWith(prefix))
    .reduce(
      (env: Record<string, any>, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches into the correct mode.
        NODE_ENV: process.env.NODE_ENV || "development",
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
