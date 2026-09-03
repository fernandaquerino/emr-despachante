import path from "node:path";

const quote = (file) => JSON.stringify(file);

const formatExtensions = new Set([
  ".cjs",
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsonc",
  ".jsx",
  ".mjs",
  ".scss",
  ".ts",
  ".tsx",
  ".yaml",
  ".yml",
]);

const eslintWorkspaces = ["apps/api", "apps/web", "apps/worker", "packages/types", "packages/ui"];
const eslintExtensions = new Set([".cjs", ".js", ".jsx", ".mjs", ".ts", ".tsx"]);

const command = (prefix, files) => `${prefix} ${files.map(quote).join(" ")}`;

export default {
  "*": (stagedFiles) => {
    const commands = [];
    const filesToFormat = stagedFiles.filter((file) => formatExtensions.has(path.extname(file)));

    if (filesToFormat.length > 0) {
      commands.push(command("prettier --write", filesToFormat));
    }

    for (const workspace of eslintWorkspaces) {
      const workspaceRoot = `${path.resolve(workspace)}${path.sep}`;
      const filesToLint = stagedFiles.filter(
        (file) => file.startsWith(workspaceRoot) && eslintExtensions.has(path.extname(file)),
      );

      if (filesToLint.length > 0) {
        commands.push(command(`pnpm --dir ${workspace} exec eslint --fix`, filesToLint));
      }
    }

    return commands;
  },
};
