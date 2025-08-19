import { execSync } from "child_process";
import { cpSync, rmSync, existsSync } from "fs";
import path from "path";

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
execSync("cross-env API_ONLY=false astro build", { stdio: "inherit" });
cpSync(distDir, distA, { recursive: true });

// Second build with API_ONLY=false
console.log("Building with API_ONLY=false");
execSync("cross-env API_ONLY=false astro build", { stdio: "inherit" });
cpSync(distDir, distB, { recursive: true });

// Merge outputs
console.log("Merging distA and distB into dist...");
cpSync(distA, distDir, { recursive: true });
cpSync(distB, distDir, { recursive: true });

// Pagefind Indexing
console.log("Indexing with Pagefind");
execSync("npx pagefind --site dist", { stdio: "inherit" });


console.log("Completed. Final merged build is in dist/");
