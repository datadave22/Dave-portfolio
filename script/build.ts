import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, mkdir, cp, writeFile } from "fs/promises";

// Dependencies to bundle into the server (reduces cold-start file I/O on serverless)
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "resend",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });
  await rm(".vercel/output", { recursive: true, force: true });

  // ── Frontend ──────────────────────────────────────────────────────────────
  console.log("building client...");
  await viteBuild();

  // ── Server (for local `npm start`) ────────────────────────────────────────
  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: { "process.env.NODE_ENV": '"production"' },
    minify: true,
    external: externals,
    logLevel: "info",
  });

  // ── Vercel Build Output API v3 ────────────────────────────────────────────
  console.log("building vercel output...");

  // Static files
  await mkdir(".vercel/output/static", { recursive: true });
  await cp("dist/public", ".vercel/output/static", { recursive: true });

  // Serverless function — bundle server/handler.ts (no .listen())
  await mkdir(".vercel/output/functions/api.func", { recursive: true });
  await esbuild({
    entryPoints: ["server/handler.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: ".vercel/output/functions/api.func/index.js",
    define: { "process.env.NODE_ENV": '"production"' },
    minify: true,
    external: externals,
    logLevel: "info",
  });

  // Function runtime config
  await writeFile(
    ".vercel/output/functions/api.func/.vc-config.json",
    JSON.stringify({ runtime: "nodejs20.x", handler: "index.js", launcherType: "Nodejs" }, null, 2),
  );

  // Routing config:
  //   1. /api/* → serverless function (Express handles subroutes via req.url)
  //   2. static filesystem (serves dist/public assets, JS, CSS, etc.)
  //   3. /* → index.html (React client-side routing fallback)
  await writeFile(
    ".vercel/output/config.json",
    JSON.stringify(
      {
        version: 3,
        routes: [
          { src: "/api(.*)", dest: "/api" },
          { handle: "filesystem" },
          { src: "/(.*)", dest: "/index.html" },
        ],
      },
      null,
      2,
    ),
  );

  console.log("build complete.");
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
