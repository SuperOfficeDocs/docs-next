/**
 * Local build script for split builds
 * 
 * This script performs a two-phase build process and merges the results:
 * 1. Builds with API_ONLY=true
 * 2. Builds with API_ONLY=false
 * 3. Merges both builds
 * 
 * @description
 * To use this script for split builds:
 * 1. Set up your content collections to handle API_ONLY environment variable
 * 2. Configure other files to respond to API_ONLY flag appropriately
 * 3. Run this script instead of regular astro build
 * 
 * @example
 * // In your content collections:
 * const items = API_ONLY === 'true' 
 *   ? apiOnlyContent
 *   : fullContent;
 * 
 * @note
 * - Cleans up temporary build directories (.distA and .distB)
 * - Final output will be in dist/ directory
 * 
 * @warning
 * Currently not actively used in the codebase.
 * Ensure proper setup before running split builds.
 */


import { execSync } from "child_process";
import { cpSync, rmSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Work out project root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientRoot = path.resolve(__dirname, "..");

// Paths to local binaries
const astroBin = path.join(clientRoot, "node_modules", ".bin", "astro");

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

console.log("Completed. Final merged build is in dist/");
