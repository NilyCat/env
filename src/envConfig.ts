import { parse } from "dotenv";
import { readFileSync } from "fs";

export interface EnvConfigOptions {
  path: string;
  overwritten?: boolean;
  encoding?: string;
}

// fork from https://github.com/motdotla/dotenv/blob/master/lib/main.js#L82
export function envConfig(options: EnvConfigOptions) {
  const encoding: string = options.encoding || "utf8";

  try {
    // specifying an encoding returns a string instead of a buffer
    const parsed = parse(
      readFileSync(options.path, {
        encoding: encoding as any,
      })
    );

    Object.keys(parsed).forEach(function (key) {
      if (options.overwritten) {
        process.env[key] = parsed[key];
      } else if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = parsed[key];
      }
    });

    return { parsed };
  } catch (e) {
    return { error: e };
  }
}
