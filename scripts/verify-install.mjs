import fs from "node:fs";

if (!fs.existsSync("package.json")) {
  console.error("package.json is missing");
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const major = Number(process.versions.node.split(".")[0]);

if (major !== 22) {
  console.error(`WinsWi requires Node 22.x; detected ${process.version}`);
  process.exit(1);
}

if (!pkg.scripts?.build || !pkg.scripts?.typecheck || !pkg.scripts?.lint || !pkg.scripts?.verify) {
  console.error("Required npm scripts are missing from package.json");
  process.exit(1);
}

console.log(`WinsWi ${pkg.version}: Node ${process.version} and required npm scripts OK.`);
console.log(
  fs.existsSync("package-lock.json")
    ? "package-lock.json detected."
    : "No package-lock.json bundled: CI intentionally uses npm install for this source release."
);
