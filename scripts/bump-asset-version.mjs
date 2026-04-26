import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const indexPath = path.join(rootDir, "index.html");

function currentDateVersion() {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

const version = currentDateVersion();
const source = await readFile(indexPath, "utf8");
const updated = source
  .replace(/(href="\.\/styles\.css\?v=)\d+(")/, `$1${version}$2`)
  .replace(/(src="\.\/script\.js\?v=)\d+(")/, `$1${version}$2`);

if (updated !== source) {
  await writeFile(indexPath, updated, "utf8");
}

console.log(`asset version: ${version}`);
