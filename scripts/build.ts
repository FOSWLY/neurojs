import path from "node:path";
import { parseArgs } from "node:util";
import { $ } from "bun";

import { generateTypebox } from "./typebox-gen";

const {
  values: { ["skip-proto"]: skipProto },
} = parseArgs({
  options: {
    "skip-proto": {
      type: "boolean",
      short: "s",
    },
  },
});

async function build(extraScripts: string[] = []) {
  console.log(`Building summarize.js...`);
  const packagePath = path.join(__dirname, "..");
  await $`rm -rf dist`;
  for await (const script of extraScripts) {
    await $`bun ${script}`;
  }

  await $`tsc --project tsconfig.build.json --outdir ./dist && tsc-esm-fix --tsconfig tsconfig.build.json`;
  await generateTypebox(packagePath);
  $.cwd("./");
}

await build(skipProto ? undefined : [`proto:gen`]);
