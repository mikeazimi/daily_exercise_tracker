/**
 * Build script for iOS (Capacitor static export).
 *
 * Temporarily moves server-only route handlers (API routes, auth callback)
 * out of the way so Next.js `output: 'export'` can succeed, then restores them.
 */
import { execSync } from "child_process";
import { renameSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const root = process.cwd();
const tmpDir = join(root, ".ios-build-tmp");

// Directories to temporarily exclude from the static export build
const excludeDirs = [
  "src/app/api",
  "src/app/auth/callback",
];

// Also temporarily rename middleware (not supported in static export)
const middlewareFile = "src/middleware.ts";

function move(src, dest) {
  if (existsSync(join(root, src))) {
    const destPath = join(tmpDir, src);
    const destDir = destPath.substring(0, destPath.lastIndexOf("/"));
    mkdirSync(destDir, { recursive: true });
    renameSync(join(root, src), destPath);
    console.log(`  Moved: ${src} -> .ios-build-tmp/${src}`);
  }
}

function restore(src) {
  const tmpPath = join(tmpDir, src);
  if (existsSync(tmpPath)) {
    renameSync(tmpPath, join(root, src));
    console.log(`  Restored: ${src}`);
  }
}

console.log("\n📱 Building for iOS (static export)...\n");
console.log("1. Moving server-only files out of the way...");

mkdirSync(tmpDir, { recursive: true });

for (const dir of excludeDirs) {
  move(dir, join(tmpDir, dir));
}
move(middlewareFile, join(tmpDir, middlewareFile));

let buildFailed = false;

try {
  console.log("\n2. Running next build with output: export...\n");
  execSync("npx next build", { stdio: "inherit", env: { ...process.env, CAPACITOR_BUILD: "true" } });
  console.log("\n✅ Static export build succeeded!\n");
} catch (err) {
  console.error("\n❌ Build failed!\n");
  buildFailed = true;
} finally {
  console.log("3. Restoring server-only files...");
  for (const dir of excludeDirs) {
    restore(dir);
  }
  restore(middlewareFile);

  // Clean up temp directory
  try {
    execSync(`rm -rf "${tmpDir}"`);
  } catch {
    // ignore
  }
}

if (buildFailed) {
  process.exit(1);
}
