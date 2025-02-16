import path from "node:path";
import { parseArgs } from "node:util";
import { $ } from "bun";

import { GenX } from "@toil/typebox-genx";

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
  const genx = new GenX({
    root: packagePath,
  });
  await $`mkdir dist/typebox`;
  await genx.generateByDir(
    path.resolve(packagePath, "src", "types"),
    path.resolve(packagePath, "dist", "typebox"),
  );
  $.cwd("./");
}

await build(skipProto ? undefined : [`proto:gen`]);
