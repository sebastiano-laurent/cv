import { mkdir, readFile, rm, writeFile, copyFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { transform } from "esbuild";
import { minify } from "html-minifier-terser";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const distDir = path.join(rootDir, "dist");

async function copyDirRecursive(srcDir, dstDir, fileFilter) {
  await mkdir(dstDir, { recursive: true });
  const entries = await readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const dstPath = path.join(dstDir, entry.name);

    if (entry.isDirectory()) {
      await copyDirRecursive(srcPath, dstPath, fileFilter);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (fileFilter && !fileFilter(srcPath)) {
      continue;
    }

    await copyFile(srcPath, dstPath);
  }
}

async function minifyAsset(filename, loader) {
  const sourcePath = path.join(rootDir, filename);
  const outputPath = path.join(distDir, filename);
  const source = await readFile(sourcePath, "utf8");

  const result = await transform(source, {
    loader,
    minify: true,
    legalComments: "none"
  });

  await writeFile(outputPath, result.code, "utf8");
}

async function build() {
  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });

  await Promise.all([
    copyFile(path.join(rootDir, "favicon.svg"), path.join(distDir, "favicon.svg")),
    copyFile(path.join(rootDir, "favicon.png"), path.join(distDir, "favicon.png")),
    copyFile(path.join(rootDir, "favicon.ico"), path.join(distDir, "favicon.ico"))
  ]);

  await copyDirRecursive(path.join(rootDir, "assets"), path.join(distDir, "assets"), (filePath) => !filePath.endsWith(".ttf"));

  await Promise.all([
    minifyAsset("styles.css", "css"),
    minifyAsset("script.js", "js")
  ]);

  const htmlSource = await readFile(path.join(rootDir, "index.html"), "utf8");
  const htmlMinified = await minify(htmlSource, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
    minifyJS: true
  });

  await writeFile(path.join(distDir, "index.html"), htmlMinified, "utf8");
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
