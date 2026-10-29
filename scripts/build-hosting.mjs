import { cp, mkdir, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const baseFlag = args.indexOf("--base-path");
const basePath = baseFlag === -1 ? "" : args[baseFlag + 1];
if (typeof basePath !== "string" || (basePath && !/^\/[a-zA-Z0-9_-]+$/.test(basePath))) {
  throw new Error("Use an empty base path or a single safe directory such as /revision-fourservice.");
}
const label = basePath ? "preview" : "production";
const work = path.join(root, ".hosting-build", label);
const destination = path.join(root, "hosting-dist", label);
const widths = [64, 128, 256, 384, 480, 768, 1024, 1440, 1920];

await rm(work, { recursive: true, force: true });
await mkdir(work, { recursive: true });
for (const item of ["src", "public", "package.json", "package-lock.json", "tsconfig.json", "next.config.ts"]) {
  await cp(path.join(root, item), path.join(work, item), { recursive: true });
}
// The Node route remains in the source project. Only this isolated static build uses PHP.
await rm(path.join(work, "src/app/api"), { recursive: true, force: true });
await symlink(path.join(root, "node_modules"), path.join(work, "node_modules"), "dir");

const phpmailer = path.join(root, "hosting/php/lib/phpmailer/PHPMailer.php");
await readFile(phpmailer);

await new Promise((resolve, reject) => {
  const build = spawn(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "build", "--webpack"], {
    cwd: work,
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: "1",
      FOUR_STATIC_HOSTING: "true",
      NEXT_PUBLIC_HOSTING_BASE_PATH: basePath,
      NEXT_PUBLIC_CONTACT_ENDPOINT: `${basePath}/api/contact.php`,
    },
  });
  build.on("error", reject);
  build.on("exit", code => code === 0 ? resolve() : reject(new Error(`Static build failed: ${code}`)));
});

await rm(destination, { recursive: true, force: true });
await cp(path.join(work, "out"), destination, { recursive: true });
await cp(path.join(root, "hosting/php"), destination, { recursive: true });

async function optimizeDirectory(directory, relative = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const source = path.join(directory, entry.name);
    const key = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) {
      await optimizeDirectory(source, key);
    } else if (/\.(webp|png|jpe?g)$/i.test(entry.name)) {
      const imageDirectory = path.join(destination, "_images", key.replace(/\.[^.]+$/, ""));
      await mkdir(imageDirectory, { recursive: true });
      for (const width of widths) {
        await sharp(source).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 90 }).toFile(path.join(imageDirectory, `${width}.webp`));
      }
    }
  }
}
await optimizeDirectory(path.join(root, "public/images"));
// Every next/image URL uses the pre-generated responsive variants in this build.
// Do not upload a second unused copy of all original photos.
await rm(path.join(destination, "images"), { recursive: true, force: true });

await writeFile(path.join(destination, ".htaccess"), `DirectoryIndex index.html index.php\nOptions -Indexes\nErrorDocument 404 ${basePath}/404.html\n<FilesMatch "(^\\.|\\.(sql|zip|log|ini|lock)$)">\n  Require all denied\n</FilesMatch>\n<IfModule mod_headers.c>\n  Header always set X-Content-Type-Options "nosniff"\n</IfModule>\n`);
await writeFile(path.join(destination, ".user.ini"), "upload_max_filesize=8M\npost_max_size=10M\ndisplay_errors=Off\n");
await writeFile(path.join(destination, "lib/.htaccess"), "Require all denied\n");
await writeFile(path.join(root, "hosting-dist", `${label}-build.json`), JSON.stringify({
  basePath, destination, generatedAt: new Date().toISOString(), widths,
}, null, 2));
console.log(`Hosting package ready: ${destination}`);
