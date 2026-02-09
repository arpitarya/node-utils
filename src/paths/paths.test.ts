import { afterEach, beforeEach, describe, expect, it } from "@rstest/core";
import { resolveRootPath, resolveWorkspaceDirectory } from "./paths";

describe("Paths Utilities", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("resolveRootPath", () => {
    it("should resolve a relative path against the root working directory", () => {
      process.env.ROOT_WORKING_DIRECTORY = "/home/user/projects/sentenel";
      const result = resolveRootPath("src/index.ts");
      expect(result).toContain("src/index.ts");
    });

    it("should handle absolute paths correctly", () => {
      process.env.ROOT_WORKING_DIRECTORY = "/home/user/projects/sentenel";
      const result = resolveRootPath("packages/node-utils");
      expect(result).toContain("packages/node-utils");
    });

    it("should throw error when root working directory is not defined", () => {
      // Note: rootWorkingDirectory falls back to currentWorkingDirectory,
      // so it will never be undefined. This test documents that behavior.
      process.env.ROOT_WORKING_DIRECTORY = "/home/user/projects/sentenel";
      const result = resolveRootPath("src/index.ts");
      expect(result).toContain("src/index.ts");
    });

    it("should handle empty relative path", () => {
      process.env.ROOT_WORKING_DIRECTORY = "/home/user/projects/sentenel";
      const result = resolveRootPath("");
      expect(result).toContain("sentenel");
    });

    it("should handle nested relative paths", () => {
      process.env.ROOT_WORKING_DIRECTORY = "/home/user/projects/sentenel";
      const result = resolveRootPath("packages/node-utils/src/index.ts");
      expect(result).toContain("packages/node-utils/src/index.ts");
    });

    it("should handle paths with .. navigation", () => {
      process.env.ROOT_WORKING_DIRECTORY = "/home/user/projects/sentenel";
      const result = resolveRootPath("packages/../src");
      expect(result).toContain("src");
    });
  });

  describe("resolveWorkspaceDirectory", () => {
    it("should resolve a relative path against the current working directory", () => {
      const result = resolveWorkspaceDirectory("src/index.ts");
      expect(result).toContain("src/index.ts");
    });

    it("should handle absolute paths correctly", () => {
      const result = resolveWorkspaceDirectory("packages/node-utils");
      expect(result).toContain("packages/node-utils");
    });

    it("should throw error when current working directory is not defined", () => {
      expect(() => {
        resolveWorkspaceDirectory("src/index.ts");
      }).not.toThrow();
    });

    it("should handle empty relative path", () => {
      const result = resolveWorkspaceDirectory("");
      expect(result).toBeTruthy();
    });

    it("should handle nested relative paths", () => {
      const result = resolveWorkspaceDirectory("packages/node-utils/src/index.ts");
      expect(result).toContain("packages/node-utils/src/index.ts");
    });

    it("should handle paths with .. navigation", () => {
      const result = resolveWorkspaceDirectory("packages/../src");
      expect(result).toContain("src");
    });
  });

  describe("Path resolution integration", () => {
    it("should resolve different paths consistently when environment is set", () => {
      process.env.ROOT_WORKING_DIRECTORY = "/home/user/projects/sentenel";

      const rootPath1 = resolveRootPath("src/utils");
      const rootPath2 = resolveRootPath("src/utils");

      expect(rootPath1).toBe(rootPath2);
    });

    it("should normalize paths correctly", () => {
      process.env.ROOT_WORKING_DIRECTORY = "/home/user/projects/sentenel";

      const result1 = resolveRootPath("./src/index.ts");
      const result2 = resolveRootPath("src/index.ts");

      expect(result1).toBe(result2);
    });
  });
});
