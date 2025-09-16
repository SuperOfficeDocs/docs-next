import { execSync } from "child_process";
import { cpSync, rmSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Work out project root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientRoot = path.resolve(__dirname, "..");

// Paths to local binaries
const astroBin = path.join(clientRoot, "node_modules", ".bin", "astro");
const pagefindBin = path.join(clientRoot, "node_modules", ".bin", "pagefind");

// Paths
const distDir = path.resolve("dist");
const distA = path.resolve(".distA");
const distB = path.resolve(".distB");

// Cleanup old dirs
[distDir, distA, distB].forEach((dir) => {
  if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
});

// First build with API_ONLY=true
console.log("Building with API_ONLY=true");
execSync(`"${astroBin}" build`, {
  stdio: "inherit",
  env: { ...process.env, API_ONLY: "true" },
});
cpSync(distDir, distA, { recursive: true });

// Second build with API_ONLY=false
console.log("Building with API_ONLY=false");
execSync(`"${astroBin}" build`, {
  stdio: "inherit",
  env: { ...process.env, API_ONLY: "false" },
});
cpSync(distDir, distB, { recursive: true });

// Merge outputs
console.log("Merging distA and distB into dist...");
cpSync(distA, distDir, { recursive: true });
cpSync(distB, distDir, { recursive: true });

// Cleanup temporary dirs after merging
[distA, distB].forEach((dir) => {
  if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
});

// Pagefind Indexing
console.log("Indexing with Pagefind");
execSync(`"${pagefindBin}" --site dist`, { stdio: "inherit" });

console.log("Completed. Final merged build is in dist/");
