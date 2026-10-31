/**
 * Optional database seed: copies the site content into Postgres.
 * The site itself serves posts and projects from shared/content.ts and does not need this.
 * Run with: DATABASE_URL=... npx tsx scripts/seed.ts
 */

import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { posts, projects } from "../shared/schema";
import { POSTS, PROJECTS } from "../shared/content";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set.");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function seed() {
  console.log("Clearing existing posts and projects...");
  await db.delete(posts);
  await db.delete(projects);

  console.log("Inserting posts...");
  for (const { id, ...post } of POSTS) {
    await db.insert(posts).values(post);
    console.log(`  ✓ ${post.title}`);
  }

  console.log("Inserting projects...");
  for (const { id, order, ...project } of PROJECTS) {
    await db.insert(projects).values(project);
    console.log(`  ✓ ${project.name}`);
  }

  console.log("\nSeed complete.");
  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
