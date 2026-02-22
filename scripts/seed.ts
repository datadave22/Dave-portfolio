/**
 * Database seed script — clears and reseeds all posts and projects.
 * Run with: npm run db:seed
 *
 * This is the source of truth for portfolio content.
 * Edit this file to add, update, or remove posts and projects,
 * then run `npm run db:seed` to push changes to your database.
 */

import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { posts, projects } from "../shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set.");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

// ─── BLOG POSTS ────────────────────────────────────────────────────────────────

const POST_DATA = [
  {
    title: "Top 5 at Nationals: Competing in the 2021 Collegiate Penetration Testing Competition",
    slug: "cptc-2021-nationals",
    status: "published" as const,
    tags: ["Cybersecurity", "Competition", "Penetration Testing"],
    summary: "How a Cal State Fullerton team qualified for and competed in the national CPTC championship against Stanford, MIT, and RIT — finishing in the top 5 out of 67 universities.",
    content: `In January 2021, I competed in the National Collegiate Penetration Testing Competition (CPTC) as part of Cal State Fullerton's team — finishing in the top 5 out of 67 universities worldwide, including Stanford, MIT, and Rochester Institute of Technology.

## What is CPTC?

CPTC is the most realistic collegiate penetration testing competition in the world. Unlike CTF (capture-the-flag) competitions where you're hunting flags in isolated challenges, CPTC simulates a full professional penetration testing engagement. You're given a fictional company's infrastructure, a rules of engagement document, and a clock.

The 2021 competition was fully virtual due to COVID-19, which added its own layer of complexity — coordinating a team across different machines and environments while attacking a live system is a different skill set than being in the same room.

## The Qualification Round

To get to nationals, we first had to qualify through the western regional. The scenario: a fictional water and power plant company. Nine hours to compromise as much of their infrastructure as possible, document your findings, and produce a professional deliverable.

Water and power plant simulations are a deliberate choice by the CPTC organizers — critical infrastructure attacks are exactly the threat landscape the industry needs defenders for. The systems we were attacking modeled real SCADA and ICS configurations.

Our team — Josiah Peedikayil, Rojan Rijal, Josh Ibad, Rian Luzio, Yao Lin, and myself — worked through the scope methodically. Enumeration first, attack second, documentation throughout. One of the hardest parts of CPTC that separates it from CTF is that you can't just exploit something and move on. You have to write it up in a format a real client can understand and act on.

We qualified for nationals.

## Nationals: 17 Hours

The national competition ran nearly 17 hours. You're doing active penetration testing during the day, then writing the report and documentation into the early morning — we were working until 1 a.m.

The scope at nationals was broader and the infrastructure more complex. The judging isn't just on how many systems you compromised — it's on the quality of your report, your communication with the simulated client, and whether your findings are actionable.

We finished in the top 5 out of 67 universities globally.

## What I Took Away

The biggest skill CPTC built for me wasn't technical — it was the discipline of working within rules of engagement and producing professional output under pressure. Penetration testing in the real world isn't about showing off. It's about giving a client an accurate picture of their risk so they can fix it.

The competition also gave me direct exposure to the network and infrastructure concepts I'd later apply building cloud security ranges for CyberPatriot: AWS VPC architecture, IAM hardening, network segmentation. Attacking well-defended systems teaches you how to defend them.

The Cal State Fullerton team was coached by Hernan Manabat (alumnus, CS lecturer) and Professor Mikhail Gofman (director of the Center for Cybersecurity). The program they built gave us a legitimate competitive foundation — we weren't just good students, we were competing against and beating teams from institutions with graduate security programs and dedicated labs.

## Further Reading

[CSUF News coverage of the 2021 CPTC qualifying run](https://news.fullerton.edu/2020/12/cybersecurity-students-secure-spot-in-national-competition/)`,
  },
  {
    title: "CI/CD at Scale: Managing Thousands of Build Configurations for the Trilinos HPC Framework",
    slug: "trilinos-cicd-at-scale",
    status: "published" as const,
    tags: ["DevOps", "HPC", "CI/CD", "CUDA"],
    summary: "What it actually looks like to maintain CI/CD infrastructure for a C++ scientific computing framework used by U.S. Top 500 supercomputers — thousands of build permutations, GPU acceleration, and MPI implementations.",
    content: `For almost two years at Sandia National Laboratories, I maintained the CI/CD infrastructure for the Trilinos Project — a large-scale C++ scientific computing framework used by multiple U.S. Top 500 supercomputers. Here's what operating at that scale actually looks like.

## What Is Trilinos?

Trilinos is an open-source collection of scientific libraries and tools focused on solving large-scale, complex multi-physics engineering and scientific problems. It's used in structural mechanics simulations, climate modeling, nuclear weapons research, and a dozen other domains. Thousands of developers, scientists, and companies depend on it being stable and buildable.

The framework is large. Hundreds of packages. Millions of lines of C++. And it has to build — correctly — across an enormous matrix of configurations.

## The Configuration Matrix Problem

Here's where the CI/CD work gets interesting. A single build of Trilinos isn't one thing. It's a combination of:

- **CUDA version** (multiple active versions, each with its own compiler quirks)
- **MPI implementation** (OpenMPI, MPICH, Intel MPI — not all behave identically)
- **Compiler toolchain** (GCC versions, Intel compilers, Clang)
- **Build options** (packages enabled/disabled, optimization levels, debug vs. release)
- **Target platform** (different supercomputer architectures have different constraints)

Multiply those out and you're looking at thousands of valid build permutations. My job was to ensure that the ones that should build, do — and the ones that can't (conflicting requirements, unsupported combinations) are identified early and excluded from the matrix before they waste machine time.

## Debugging Build Failures

The hardest part of this work isn't running CI jobs. It's diagnosing failures.

CMake and the Trilinos build system (TriBITS) produce complex dependency trees. When a build fails, the error often isn't at the point of failure — it's buried three levels up in a toolchain interaction that only manifests on specific combinations. Root-cause analysis meant reading CMake output carefully, understanding how TriBITS resolves package dependencies, and knowing enough about compiler behavior to distinguish "this is a real bug" from "this is a configuration that was never going to work."

A subset of the failures were intermittent — infrastructure instability, resource contention, transient network issues on the HPC schedulers. Distinguishing a true code regression from a flaky environment required baselining failure rates and looking at patterns across runs, not just individual failures.

## GPU Acceleration Workflows

The CUDA-enabled builds were their own category of complexity. GPU-accelerated builds require matching CUDA versions to driver versions to compiler versions, and the matrix of "known good" combinations is much smaller than what's theoretically possible. When new CUDA versions landed, part of the job was testing the matrix boundaries — finding where support broke and updating the CI configuration to reflect reality.

The other GPU complexity is runtime validation. Building successfully doesn't mean your CUDA kernels produce correct results. Validating GPU acceleration workflows meant running tests on actual GPU nodes in the HPC cluster, not just checking compilation.

## What Scale Changes

The difference between managing CI for a typical software project and managing it for Trilinos is mostly about the cost of being wrong. When a configuration matrix has thousands of permutations and runs on supercomputers, wasted builds are expensive — in machine time, in developer time waiting for results, and in trust from the scientific computing community depending on your stability signals.

The work pushed me toward a different mode of thinking: conservative changes, high confidence before enabling new configurations, and explicit documentation of why combinations are excluded rather than just marking them as unsupported.

I was operating under DOE L-clearance for the duration of this work. Some of the applications Trilinos is used in, I'll leave as an exercise.`,
  },
  {
    title: "Building a Production SaaS Solo: Lessons from ResumePolish",
    slug: "building-resumepolish",
    status: "published" as const,
    tags: ["SaaS", "Full-Stack", "AI", "Stripe", "Production"],
    summary: "What I learned shipping a full-stack AI SaaS from scratch — auth flows, Stripe webhook security, serverless constraints, and the production debugging that only shows up after you deploy.",
    content: `ResumePolish is an AI-powered resume optimization platform I built solo and deployed to production. A user uploads their resume, selects their target industry and role, and gets a professionally rewritten version optimized for ATS systems in under 30 seconds.

Building it taught me more about production software than any environment where someone else owns the infrastructure.

## The Stack

React frontend, Express backend, PostgreSQL via Neon, deployed on Vercel serverless. Clerk for authentication, Stripe for payments, GPT-4o for the actual optimization.

I chose a monolith deliberately. As a solo developer, shared TypeScript types between frontend and backend are worth more than the theoretical benefits of microservices. If I change a database column, the compiler tells me every place I need to update. That feedback loop is too valuable to give up before you have a team that needs independent deployability.

## Authentication: The Full Request Lifecycle

When a user signs in with Google, Clerk handles the OAuth flow and issues a JWT stored as an httpOnly cookie. On every API request, \`clerkMiddleware()\` validates the token against Clerk's public keys and attaches the user ID to \`req.auth\`.

The first time a new user hits the API, I check if they exist in my local database. If not, I create a record with their Clerk ID, email, and profile data. This local copy matters: querying your own database is fast and free. Querying Clerk's API on every request is neither.

The production debugging moment that made this concrete: after migrating from development to production, Google OAuth was returning "Error 400: missing client_id." My code hadn't changed. The issue was that Clerk's development mode uses shared OAuth credentials that don't work on custom domains. Fix: create a Google Cloud OAuth application, add the production domain to Authorized JavaScript Origins, wire the credentials into Clerk's Social Connections. 2 hours to diagnose, 5 minutes to fix.

## Stripe Webhooks: Never Trust the Client

The payment flow is: user clicks Buy → Stripe hosted checkout → Stripe sends webhook to my server → I grant revision credits.

The critical implementation detail is webhook signature verification. Stripe signs every webhook with HMAC-SHA256. You verify with the raw request body — not the parsed JSON. \`express.json()\` middleware consumes and parses the body, so I use \`express.raw({ type: 'application/json' })\` specifically on the webhook route to preserve the raw buffer.

After verification, I check for duplicate events — I store the Stripe event ID in the database and skip processing if I've already handled it. This prevents double-crediting users if Stripe retries a webhook.

Client-side checkout confirmation is never trusted. Webhooks are the source of truth. This is the only architecture that's actually secure.

## Serverless File Processing

Serverless functions have no persistent filesystem. Uploaded files can't be written to disk.

The solution is \`multer\` with \`memoryStorage\`. Files go into a Node.js Buffer in memory. For PDF parsing, I pass the buffer directly to \`pdfjs-dist\`. For DOCX, \`mammoth\` takes the buffer. The extracted text goes to the OpenAI API and the database — nothing ever touches the filesystem.

This also happens to be the correct security posture. No file cleanup required, no risk of malicious file execution.

The edge case: \`pdfjs-dist\` expects browser APIs like \`DOMMatrix\` and \`fetch\`. Node.js doesn't have those. I created polyfill stubs that provide no-op implementations so the module loads without crashing. The actual PDF parsing still works via pdfjs's Node.js fallback code paths.

## Prompt Architecture

The two-tier optimization system is where the product differentiation lives. Free users get standard optimization. Paid users get ATS keyword injection, Harvard-style formatting, achievement reframing, and a Resume Strength Score.

The differentiation is in the prompt, not in separate code paths. I store prompts in the database with version numbers and an \`is_active\` boolean. When I want to test a new prompt strategy, I create a new version, test it in a sandbox, then activate it with a single UPDATE query. No code deployment required. Instant rollback is the same operation.

## What Shipping Teaches You

The things that break in production aren't the things you anticipated. They're the seams between systems you didn't own: OAuth credential scoping, webhook retry behavior, serverless module loading order, database connection pooling under concurrent requests.

Building this end-to-end — including the infrastructure, the payments, the auth, the AI integration, and the debugging — is the clearest picture I have of what production software actually requires.`,
  },
];

// ─── PROJECTS ──────────────────────────────────────────────────────────────────

const PROJECT_DATA = [
  {
    name: "Trilinos CI/CD Infrastructure — Sandia National Laboratories",
    description: "Managed CI/CD pipelines for the Trilinos C++ scientific computing framework supporting multiple U.S. Top 500 supercomputers. Configuration matrices spanning thousands of build permutations across CUDA versions, MPI implementations (OpenMPI/MPICH/Intel MPI), and compiler toolchains. Debugged complex CMake/TriBITS failures, stabilized intermittent pipeline failures, and implemented automated validation across GPU-accelerated and CPU-optimized workflows. Operated under DOE L-clearance.",
    role: "DevOps / MLOps Platform Engineer",
    techStack: ["C++", "CMake", "TriBITS", "CUDA", "MPI", "Jenkins", "GitLab CI", "Linux", "Bash", "HPC Schedulers"],
    featured: true,
    link: "https://github.com/trilinos/Trilinos",
    year: "2022",
  },
  {
    name: "StarFire GNSS Firmware Validation — John Deere Advanced R&D",
    description: "Validated 50–100 firmware iterations per cycle for StarFire GNSS receivers supporting GPS, Galileo, GLONASS, and BeiDou constellations across precision agriculture and autonomous vehicle systems. Processed GB-to-TB telemetry datasets monthly using Python to validate ML positioning algorithms. Automated test pipelines achieving microsecond-to-millisecond improvements that scaled to millions in annual cost savings across worldwide equipment fleets.",
    role: "Software Engineer / Embedded Systems Security",
    techStack: ["Python", "pandas", "NumPy", "SciPy", "MATLAB", "Embedded Linux", "GNSS/RTK", "Hardware-in-the-loop Testing"],
    featured: true,
    year: "2023",
  },
  {
    name: "ResumePolish — AI Resume Optimization SaaS",
    description: "Full-stack SaaS platform using GPT-4o to tailor resumes for specific roles and industries in under 30 seconds. Implements Stripe webhook payments with HMAC-SHA256 signature verification, Clerk OAuth authentication, and a prompt versioning system for atomic AI model updates without deployments. Engineered for Vercel serverless: buffer-based PDF/DOCX parsing, CJS/ESM interop resolution, and a freemium credit-pack revenue model.",
    role: "Founder / Full-Stack Developer",
    techStack: ["React", "TypeScript", "Express", "PostgreSQL", "Drizzle ORM", "OpenAI GPT-4o", "Stripe", "Clerk", "Vercel", "Neon"],
    featured: true,
    year: "2024",
  },
  {
    name: "Viral Clips — Hybrid CV + AI Gaming Highlight Pipeline",
    description: "7-stage modular video processing pipeline that turns raw gaming footage into platform-ready vertical short-form clips automatically. Uses OpenCV as a cost filter (HSV color analysis, template matching) to pre-screen 85% of frames, with Claude Vision API confirmation only on the ambiguous 15% — delivering near-AI accuracy at near-CV cost ($0.20–0.40 per video). Resolution-independent HUD detection, death-aware clip scoring with streak multipliers, and auto-generated captions. Processes 15-minute 1080p60 footage in under 2 minutes. Tested on 22GB of real footage.",
    role: "Creator / Systems Engineer",
    techStack: ["Python", "OpenCV", "FFmpeg", "EasyOCR", "Whisper", "Claude Vision API", "NumPy", "SciPy"],
    featured: true,
    year: "2024",
  },
  {
    name: "CPTC 2021 — National Collegiate Penetration Testing Competition",
    description: "Top 5 finish out of 67 universities globally (Stanford, MIT, RIT) in a 17-hour professional penetration testing competition. Simulated full red-team engagements with real-world rules of engagement, client communication, and written deliverables. Built and maintained the AWS cyber range infrastructure (EC2, S3, VPC, IAM) supporting 800–2,000 participants across K-12, collegiate, and military training programs. Contributed technical input to federal grant proposals securing $4M+ in cybersecurity education funding.",
    role: "Penetration Tester / Cloud Infrastructure Engineer",
    techStack: ["AWS", "EC2", "VPC", "IAM", "Docker", "SELinux", "PAM", "iptables", "Network Penetration Testing"],
    featured: true,
    link: "https://news.fullerton.edu/2020/12/cybersecurity-students-secure-spot-in-national-competition/",
    year: "2021",
  },
];

// ─── SEED FUNCTION ─────────────────────────────────────────────────────────────

async function seed() {
  console.log("Clearing existing posts and projects...");
  await db.delete(posts);
  await db.delete(projects);

  console.log("Inserting posts...");
  for (const post of POST_DATA) {
    await db.insert(posts).values(post);
    console.log(`  ✓ ${post.title}`);
  }

  console.log("Inserting projects...");
  for (const project of PROJECT_DATA) {
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
