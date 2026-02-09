import { defineConfig } from "@rslib/core";

export default defineConfig({
  source: {
    entry: {
      index: "./src/index.ts",
    },
    tsconfigPath: "./tsconfig.json",
  },
  lib: [
    {
      format: "esm",
      syntax: "esnext",
      dts: {
        distPath: "./dist/esm",
      },
      bundle: false,
      output: {
        distPath: "./dist/esm",
        manifest: "asset-manifest-mjs.json",
      },
    },
    {
      format: "cjs",
      syntax: "esnext",
      dts: {
        distPath: "./dist/cjs",
      },
      bundle: false,
      output: {
        distPath: "./dist/cjs",
        manifest: "asset-manifest-cjs.json",
      },
    },
  ],
});
