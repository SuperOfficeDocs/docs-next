/**
 * Setup External Repositories
 *
 * This script clones or updates the required external GitHub repositories
 * into the `src/external-content/` directory. If a repository folder
 * already exists, it will fetch and reset it to the latest commit on the
 * `main` branch.
 *
 * Usage:
 *   # From ClientApp/build directory
 *   node setup-external-repos.js
 *
 * Notes:
 * - Requires Git to be installed and available in PATH.
 * - Local changes inside the external repos will be overwritten when updating.
 */




import { exec } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

const baseDir = path.resolve(process.cwd(), "..", "external-content");

const repos = [
  {
    url: "https://github.com/SuperOfficeDocs/contribution.git",
    dest: path.join(baseDir, "contribution"),
  },
  {
    url: "https://github.com/SuperOfficeDocs/superoffice-docs.git",
    dest: path.join(baseDir, "superoffice-docs"),
  },
];

function runCommand(command, cwd) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Command failed: ${command}\n${stderr}`);
        return reject(error);
      }
      resolve(stdout.trim());
    });
  });
}

async function cloneOrUpdate({ url, dest }) {
  if (fs.existsSync(dest)) {
    console.log(`Repo already exists at ${dest}. Pulling latest changes...`);
    await runCommand("git fetch --all", dest);
    await runCommand("git reset --hard origin/main", dest);
    console.log(`Updated ${url}`);
  } else {
    console.log(`Cloning ${url} into ${dest}...`);
    await runCommand(`git clone ${url} "${dest}"`, process.cwd());
    console.log(`Successfully cloned ${url}`);
  }
}

async function main() {
  for (const repo of repos) {
    try {
      await cloneOrUpdate(repo);
    } catch {
      process.exitCode = 1;
      break;
    }
  }
}

main();
