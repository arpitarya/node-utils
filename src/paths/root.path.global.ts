import { readFileSync, realpathSync } from "node:fs";
import Module from "node:module";
import chalk from "chalk";

enum ProcessEnvProp {
  WorkingDirLogsLevel = "ENABLE_WORKING_DIR_LOGS_LEVEL",
  RootWorkingDirectory = "ROOT_WORKING_DIRECTORY",
}

enum WorkingDirLogsLevel {
  None = "none",
  Info = "info",
  Verbose = "verbose",
}

function logInfo(...args: unknown[]): void {
  console.info("SENTENEL PATH::", chalk.blueBright(...args.map((arg) => String(arg))));
}

function getRootWorkingDirectory(): string | undefined {
  const workingDirLogsLevel: WorkingDirLogsLevel =
    (process.env[ProcessEnvProp.WorkingDirLogsLevel] as WorkingDirLogsLevel) || WorkingDirLogsLevel.None;
  if (!Object.values(WorkingDirLogsLevel).includes(workingDirLogsLevel)) {
    console.error(
      `Invalid value for environment variable ${ProcessEnvProp.WorkingDirLogsLevel}: ${workingDirLogsLevel}. Defaulting to ${WorkingDirLogsLevel.None}.`,
    );
  }
  if (workingDirLogsLevel === WorkingDirLogsLevel.Info || workingDirLogsLevel === WorkingDirLogsLevel.Verbose) {
    logInfo(`Getting root working directory from environment variable ${ProcessEnvProp.RootWorkingDirectory}...`);
  }

  const isVerbose = workingDirLogsLevel === WorkingDirLogsLevel.Verbose;
  const isInfo = workingDirLogsLevel === WorkingDirLogsLevel.Info || isVerbose;

  const currentWorkingDirectory: string = realpathSync(process.cwd());

  const nodeModulesPathList: string[] = (Module as any)._nodeModulePaths(currentWorkingDirectory);

  isVerbose && logInfo("Current working directory:", currentWorkingDirectory);
  isVerbose && logInfo("Node modules path list:", nodeModulesPathList);

  const packageJsonPathList: string[] = nodeModulesPathList.map((nodeModulesPath: string) => {
    const packageJsonPath = nodeModulesPath.replace("node_modules", "package.json");
    return packageJsonPath;
  });

  isVerbose && logInfo("Package.json path list:", packageJsonPathList);

  const packageJsonExistsPathList: string[] = packageJsonPathList.filter((packageJsonPath: string) => {
    try {
      realpathSync(packageJsonPath);
      return true;
    } catch {
      return false;
    }
  });

  isVerbose && logInfo("Existing package.json path list:", packageJsonExistsPathList);

  if (packageJsonExistsPathList.length === 0) {
    isInfo && logInfo("No package.json found in node modules paths.");
  }

  const workspacePackageJsonList: string[] = packageJsonExistsPathList.filter((packageJsonPath: string) => {
    const packageJsonBuffer = readFileSync(packageJsonPath);

    //@ts-expect-error
    const packageJsonContent = JSON.parse(packageJsonBuffer);

    if (packageJsonContent?.workspaces && packageJsonContent?.workspaces.length > 0) {
      return true;
    }
    return false;
  });

  isVerbose && logInfo("Workspace package.json list:", workspacePackageJsonList);

  if (workspacePackageJsonList.length === 0) {
    isInfo && logInfo("No workspace package.json found in node modules paths.");

    const rootWorkingDirectory = currentWorkingDirectory;
    if (!rootWorkingDirectory) {
      throw new Error(`Environment variable ${ProcessEnvProp.RootWorkingDirectory} is not set.`);
    }

    isInfo && logInfo(`Current working directory determined: ${currentWorkingDirectory}`);
    isInfo && logInfo(`Root working directory determined: ${rootWorkingDirectory}`);
    process.env[ProcessEnvProp.RootWorkingDirectory] = rootWorkingDirectory;

    return rootWorkingDirectory;
  }

  if (workspacePackageJsonList.length === 1) {
    isInfo && logInfo(`Single workspace package.json file found: ${workspacePackageJsonList[0]}`);

    const rootPackageJsonPath: string = realpathSync(workspacePackageJsonList[0]);
    const rootWorkingDirectory: string = rootPackageJsonPath.replace("/package.json", "");

    isInfo && logInfo(`Current working directory determined: ${currentWorkingDirectory}`);
    isInfo && logInfo(`Root working directory determined: ${rootWorkingDirectory}`);
    process.env[ProcessEnvProp.RootWorkingDirectory] = rootWorkingDirectory;

    return rootWorkingDirectory;
  }

  if (workspacePackageJsonList.length > 1) {
    isInfo && logInfo(`Multiple workspace package.json files found: ${workspacePackageJsonList.join(", ")}`);

    // Fallback (should not reach here)
    const rootWorkingDirectory = currentWorkingDirectory;

    isInfo && logInfo(`Current working directory determined (fallback): ${currentWorkingDirectory}`);
    isInfo && logInfo(`Root working directory determined (fallback): ${rootWorkingDirectory}`);
    process.env[ProcessEnvProp.RootWorkingDirectory] = rootWorkingDirectory;

    return rootWorkingDirectory;
  }

  console.error("Unable to determine root working directory.");
}

getRootWorkingDirectory();

export { ProcessEnvProp, WorkingDirLogsLevel, getRootWorkingDirectory };
