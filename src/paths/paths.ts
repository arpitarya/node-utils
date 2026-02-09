import { realpathSync } from "node:fs";
import * as path from "node:path";
import { ProcessEnvProp } from "./root.path.global";

const currentWorkingDirectory: string = realpathSync(process.cwd());
const rootWorkingDirectory: string = realpathSync(
  process.env[ProcessEnvProp.RootWorkingDirectory] || currentWorkingDirectory,
);

function resolveRootPath(relativePath: string): string {
  if (!rootWorkingDirectory) {
    console.log(
      `Define "process.env[ProcessEnvProp.WorkingDirLogsLevel]"='none' | 'info' | 'verbose' to enable logging of the working directory resolution process.`,
    );
    throw new Error(
      `Root working directory is not defined. Please set the environment variable ${ProcessEnvProp.RootWorkingDirectory} to the desired root working directory path.`,
    );
  }

  return path.resolve(rootWorkingDirectory, relativePath);
}

function resolveWorkspaceDirectory(relativePath: string): string {
  if (!currentWorkingDirectory) {
    throw new Error(
      `Current working directory is not defined. Please set the environment variable ${ProcessEnvProp.RootWorkingDirectory} to the desired root working directory path.`,
    );
  }

  return path.resolve(currentWorkingDirectory, relativePath);
}

export { resolveRootPath, resolveWorkspaceDirectory };
