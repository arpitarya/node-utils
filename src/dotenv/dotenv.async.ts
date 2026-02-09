import { existsSync } from "node:fs";

const { NODE_ENV } = process.env;

async function asyncExpandDotEnv(path: string): Promise<void> {
  // https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
  const dotenvFiles = [
    `${path}.${NODE_ENV}.local`,
    `${path}.${NODE_ENV}`,
    // Don't include `.env.local` for `test` environment to avoid
    // polluting test environments with local development settings
    NODE_ENV !== "test" ? `${path}.local` : null,
    path,
  ].filter(Boolean) as string[];

  // Load environment variables from .env* files in order
  // https://github.com/motdotla/dotenv
  // https://github.com/motedotla/dotenv-expand
  await Promise.all(
    dotenvFiles.map(async (dotenvFile) => {
      if (existsSync(dotenvFile)) {
        import("dotenv-expand").then(async () => {
          import("dotenv").then((config) => {
            config.config({ path: dotenvFile });
          });
        });
      }
    }),
  );
}

export { asyncExpandDotEnv };
