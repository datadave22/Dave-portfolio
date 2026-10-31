// Site content: posts and projects.
// Served directly by the API (no database needed). Edit here and push to update the site.
// Every claim must match the resumes and LinkedIn (contract roles, real dates, no "solo"/"founder").

import type { Post, Project } from "./schema";

export const POSTS: Post[] = [
  {
    id: 5,
    title: "The Algorithm Switch: Why I Replaced Pure Computer Vision with a Hybrid Model in Viral Clips",
    slug: "viral-clips-algorithm-switch",
    status: "published",
    publishedAt: new Date("2026-02-22T12:00:00Z"),
    tags: ["Computer Vision", "Machine Learning", "Python", "R&D"],
    summary: "An R&D project that started with pure OpenCV — fast, cheap, deterministic — and an unusable false positive rate. Here's the math behind the hybrid CV+AI model that got it to near-human accuracy at near-CV cost.",
    content: `Viral Clips is an R&D project: a 7-stage pipeline that automatically extracts gaming highlights from raw footage. The core problem: given hours of raw gameplay, find the 30–90 second clips worth posting. The first version used pure computer vision. It didn't work well enough. Here's why, and what replaced it.

## The Original Model: Pure Computer Vision

The first approach was entirely OpenCV-based. Frame-by-frame analysis with three signals:

**Frame Delta Score** — absolute pixel difference between consecutive frames:
\`delta = sum(abs(frame_n - frame_{n-1})) / (width * height)\`

A high delta score indicates scene change, action, or transition. Fights, kills, and highlight moments tend to cluster around high delta events.

**Histogram Comparison** — HSV color distribution shift between frames using Bhattacharyya distance:
\`dist = sqrt(1 - sum(sqrt(h1_i * h2_i)))\`

Useful for detecting death screens, scoreboards, and UI transitions, which have characteristic color signatures.

**Optical Flow Magnitude** — Farnebäck dense optical flow, summing motion vectors:
\`motion = mean(sqrt(flow_x^2 + flow_y^2))\`

High motion indicates gameplay action. Low motion between high-motion windows = potential clip boundary.

The composite score was a weighted sum: \`score = 0.4 * delta + 0.3 * histogram_shift + 0.3 * motion\`. Frames scoring above a threshold got flagged as highlight candidates. Contiguous runs of flagged frames became clips.

## Why It Failed

The false positive rate was ~40% on real footage. The model had no semantic understanding. An inventory screen opening created high delta. A spectator replay triggered high motion. A loading screen with animated elements scored higher than an actual kill.

More critically, it was completely blind to death screens — which are semantically important (clip should end before the death, or include it as a dramatic beat) but visually variable. Different games, different death animations, different UI. No single histogram threshold caught them reliably.

After testing on 22GB of footage across multiple games, the precision/recall curve was unacceptable for a product. High recall, terrible precision.

## The Insight: CV as a Cost Filter

The real cost of the pure CV model wasn't the false positives — it was that fixing them required individual per-game tuning, and even then you'd never get semantic accuracy. Computer vision can tell you *something changed*. It cannot tell you *something meaningful happened*.

But LLM/vision API calls on every frame are economically insane. At 24fps over a 2-hour session, that's 172,800 frames. At vision API pricing, that's hundreds of dollars per video.

The insight: **use CV to discard the obvious 85%, then use AI only on the ambiguous 15%.**

## The Hybrid Pipeline

Stage 1–3: Standard CV scoring as before. Frames that score in the bottom 70% of the delta distribution are immediately discarded — no action happening, no need for further processing.

Stage 4: The "ambiguous zone" — frames that score in the middle 15% get sent to a vision API with a structured prompt:

\`Is this frame from a gaming highlight moment? Specifically: is there an active kill, elimination, objective capture, or significant in-game event visible? Respond with: HIGHLIGHT / TRANSITION / DEAD_TIME and a 1-sentence reason.\`

The structured response can be parsed programmatically without relying on free-text output.

Stage 5: Top 15% of CV scorers are flagged as automatic highlight candidates — no vision API call needed. High delta + high motion + known UI signature = clip. The CV threshold here is conservative (high precision, accept lower recall) because the API fills the gap.

## The Economics

Testing on 22GB of footage:
- Pure CV: $0 but 40% false positive rate
- Pure Vision API: ~$180–220 per video at 24fps — unviable
- Hybrid: $0.20–0.40 per video, ~94% precision on highlight detection

The math works because the CV filter is aggressive. On typical gameplay footage, 85% of frames are dead time — respawn screens, menus, walking, spectating. CV catches all of that for free. The vision API only touches the genuinely ambiguous content.

## EasyOCR Integration: Death-Aware Scoring

One additional layer: EasyOCR on frames flagged by the kill/death detection heuristic. Death screens in most games contain text: "ELIMINATED", "YOU DIED", "DEFEAT". OCR is fast, cheap, and accurate for this — far better than trying to model death screens visually.

When an OCR-detected death follows within 8 seconds of a high-score highlight frame, the clip is trimmed to include 2 seconds post-death rather than cutting immediately. This preserves the narrative arc — the highlight, then the consequence.

## What the Algorithm Switch Taught Me

The lesson wasn't "CV is bad" or "AI is better." It was that the right model depends on the cost structure of the problem.

CV is fast, deterministic, and free. AI is semantic, flexible, and has a per-call cost. The question is always: where is the decision boundary expensive enough to justify the AI call?

In Viral Clips, the expensive boundary is semantic understanding. Everything below that boundary — "is there motion in this frame?" — is CV territory.`,
  },
  {
    id: 4,
    title: "Monolith Over Microservices: The Architecture Behind ResumePolish",
    slug: "monolith-over-microservices",
    status: "published",
    publishedAt: new Date("2026-02-20T12:00:00Z"),
    tags: ["Architecture", "SaaS", "Production"],
    summary: "Why ResumePolish runs as a monolith when most architecture articles point the other way — and the specific decision points that made microservices the wrong call for a small team.",
    content: `Every modern architecture article points toward microservices. Separate services for auth, payments, file processing, AI calls. Independent scaling. Technology heterogeneity. ResumePolish went the other direction on purpose.

Here's why — and the specific calculus behind it.

## The Deployment Unit Problem

Microservices promise independent deployability. In practice, for a small team shipping v1, that's a liability. Every feature that touches payments, file upload, and AI generation touches three services simultaneously. A schema change to the users table requires coordinating migrations across services that all read user state.

With a monolith, a single deployment ships everything. Zero coordination overhead. On a small team, coordination overhead isn't theoretical — it's an entire afternoon.

## Shared TypeScript Types: The Hidden Multiplier

The biggest practical win from a monolith isn't deployment simplicity. It's type safety end-to-end.

With a shared \`/shared\` directory, the same Zod schema that validates the POST /api/resume request on the server also types the frontend form. The same \`InsertUser\` type that Drizzle ORM uses for database writes is the type the React Query mutation expects on the client.

In a microservices setup, you manage this with a shared types package or API contract tooling (OpenAPI, Protobuf, tRPC cross-service). That's non-trivial infrastructure. At ResumePolish's scale at launch — a small team, under 1,000 users — it would have been the most expensive architectural decision with the smallest return.

## The Scaling Argument Doesn't Hold Until It Does

The common microservices pitch: "What if your AI processing needs to scale independently from your auth service?" Valid question. The answer here: not yet.

The app leaves room to scale in the right places. The AI processing endpoint is stateless — it reads from the database, calls OpenAI, and writes results back. It can be extracted into a standalone service later with a single refactor. The Stripe webhook handler is already effectively isolated — it's one Express route with an idempotency check. Extracting it means moving ~150 lines of code.

The monolith buys velocity now. The seams are clean enough that decomposition later is a real option, not a rewrite.

## Where the Boundary Is

Not everything is in the monolith. The file parsing (PDF, DOCX) runs in the same process on Vercel serverless. The OpenAI call is async but in-process. Email delivery is not in-process — Resend is called externally as fire-and-forget, because email delivery failure should never block a user's resume response.

That's the practical version of "microservices thinking": extract only the parts that genuinely benefit from isolation, and have a real reason beyond "it could scale independently someday."

## The Decision Framework

When I weigh an architecture choice now, the first question is: what's the cost of being wrong? If the monolith gets too big, decompose it — incremental, planned work. If a microservice architecture is wrong from day one, you're rebuilding distributed infrastructure. The asymmetry of downside risk is what made the choice obvious.

Build the monolith. Draw clean internal seams. Extract when the pain is real, not theoretical.`,
  },
  {
    id: 3,
    title: "Running a Production SaaS: Lessons from ResumePolish",
    slug: "building-resumepolish",
    status: "published",
    publishedAt: new Date("2026-02-18T12:00:00Z"),
    tags: ["SaaS", "DevOps", "AI", "Stripe", "Production"],
    summary: "What running ResumePolish under contract has taught me — auth flows, Stripe webhook security, serverless constraints, monitoring, and the production debugging that only shows up after you deploy.",
    content: `ResumePolish is an AI-powered resume optimization platform that I build and operate under contract, alongside IT support work for private and commercial clients. A user uploads their resume, selects their target industry and role, and gets a professionally rewritten version in under 30 seconds. It serves 2,000+ users.

## The Stack

React frontend, Express backend, PostgreSQL via Neon, deployed on Vercel serverless. Clerk for authentication, Stripe for payments, GPT-4o for the optimization itself. A deliberate monolith — shared TypeScript types between frontend and backend are worth more than the theoretical benefits of microservices for a small team.

## Stripe Webhooks: Never Trust the Client

The payment flow ends at a webhook, not a client-side confirmation. Stripe signs every webhook with HMAC-SHA256. You verify using the raw request body — not parsed JSON. After verification, duplicate events are rejected using the Stripe event ID as an idempotency key. Client-side checkout confirmation is never trusted.

## Serverless File Processing

Serverless functions have no persistent filesystem. Uploads use multer with memoryStorage — files go into a Node.js Buffer in memory, get parsed by pdfjs-dist or mammoth, and the extracted text goes directly to the OpenAI API. Nothing touches the filesystem.

## Prompt Versioning

Free users get standard optimization. Paid users get ATS keyword optimization, structured formatting, and a Resume Strength Score. The difference is in the prompt, stored in the database with version numbers and an is_active flag. A new prompt version goes live with a single SQL UPDATE — no code deployment required.

## Operations

Monitoring came first. Prometheus and Grafana showed where requests were failing, and fixing those paths took the error rate from 18% to under 1%. The app later moved from containers to serverless once it was clear its traffic didn't justify running a cluster. Recurring issues get a runbook, so each one only has to be solved once.`,
  },
  {
    id: 2,
    title: "CI/CD at Scale: Keeping the Trilinos HPC Framework Building",
    slug: "trilinos-cicd-at-scale",
    status: "published",
    publishedAt: new Date("2026-02-14T12:00:00Z"),
    tags: ["DevOps", "HPC", "CI/CD", "Linux"],
    summary: "What it looks like to support CI/CD for a C++ scientific computing framework used on U.S. Top 500 supercomputers — build permutations, GPU acceleration, MPI, and daily failure triage.",
    content: `As a contractor at Sandia National Laboratories (2019–2024), I supported DevOps and Linux systems for the Trilinos Project — a large C++ scientific computing framework of 66+ packages used on U.S. Top 500 supercomputers. I took the role over from a senior engineer with two decades on the project, on a 5-person team serving 50–100 researchers. Here's what keeping CI healthy at that scale looks like.

## What Is Trilinos?

Trilinos is an open-source collection of scientific libraries and tools for solving large-scale, complex multi-physics engineering and scientific problems. It's used in structural mechanics, climate modeling and many other research domains, and research teams depend on it being stable and buildable.

## The Configuration Matrix Problem

A single build of Trilinos isn't one thing. It's a combination of CUDA version, MPI implementation (OpenMPI, MPICH, Intel MPI), compiler toolchain, build options, and target platform. Multiply those out and you're looking at thousands of valid build permutations.

The job was to make sure the ones that should build, do — and that the ones that can't (conflicting requirements, unsupported combinations) are identified early and excluded before they waste machine time.

## Debugging Build Failures

CMake and TriBITS produce complex dependency trees. When a build fails, the error often isn't at the point of failure — it's buried three levels up in a toolchain interaction that only shows up on specific combinations. Root-cause analysis meant reading CMake output carefully, understanding how TriBITS resolves package dependencies, and knowing enough about compiler behavior to tell "this is a real bug" from "this is a configuration that was never going to work."

Some failures were intermittent — infrastructure instability, resource contention, transient network issues on the HPC schedulers. Telling a true code regression from a flaky environment meant baselining failure rates and looking at patterns across runs, not just individual failures.

## The Linux Side

CI is only as healthy as the machines under it. Alongside pipeline triage, the work included a rolling RHEL 7 to RHEL 8 migration of a 40-node cluster (3 weeks, zero research data loss), hardening login nodes with SELinux, restricted sudo and SSH key-only access, and onboarding new researchers.

## What Scale Changes

The difference between CI for a typical software project and CI for Trilinos is mostly the cost of being wrong. When a configuration matrix has thousands of permutations and runs on supercomputers, wasted builds are expensive — in machine time, in researchers waiting for results, and in trust in your stability signals.

I held a DOE L clearance (now inactive) for this work.`,
  },
  {
    id: 1,
    title: "Top 5 at Nationals: Competing in the 2021 Collegiate Penetration Testing Competition",
    slug: "cptc-2021-nationals",
    status: "published",
    publishedAt: new Date("2026-02-10T12:00:00Z"),
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

The same network and infrastructure concepts carried into my work maintaining the CyberPatriot competition platform on AWS: VPC networking, IAM, and network segmentation. Attacking well-defended systems teaches you how to defend them.

[CSUF News coverage of the 2021 CPTC qualifying run](https://news.fullerton.edu/2020/12/cybersecurity-students-secure-spot-in-national-competition/)`,
  },
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    order: 1,
    name: "ResumePolish.io — AI Resume Optimization SaaS",
    description: "Production SaaS that I build and operate under contract: GPT-4o tailors resumes to specific roles in under 30 seconds for 2,000+ users. Stripe webhook payments with HMAC-SHA256 verification, Clerk OAuth, versioned prompts that go live without a deploy, and serverless PDF/DOCX parsing. Prometheus and Grafana monitoring cut the error rate from 18% to under 1%. Alongside it: on-site and remote IT support for private and commercial clients.",
    role: "IT Support & DevOps Engineer (Contract)",
    techStack: ["React", "TypeScript", "Express", "PostgreSQL", "AWS", "Vercel", "Stripe", "Prometheus", "Grafana"],
    featured: true,
    link: "https://resumepolish.io",
    imageUrl: null,
    year: "2022 – Present",
  },
  {
    id: 2,
    order: 2,
    name: "GPS Receiver Test Automation — John Deere",
    description: "Built Ansible test infrastructure on WSL and Linux that configured and validated 50–100 GPS receivers, antennas and circuit boards at once over serial, bus and network interfaces. Ran synthetic-signal and GPS almanac tests, confirmed with live telemetry from a field test van, to catch receiver, antenna and microprocessor failures before field deployment. Managed engineers' access to lab and test-van equipment and tracked lab assets.",
    role: "DevOps & Test Infrastructure Engineer (Contract)",
    techStack: ["Ansible", "Linux", "WSL", "Python", "GNSS", "Hardware-in-the-loop Testing"],
    featured: true,
    link: null,
    imageUrl: null,
    year: "2023 – 2025",
  },
  {
    id: 3,
    order: 3,
    name: "Trilinos CI/CD & Linux Systems Support — Sandia National Laboratories",
    description: "Took over DevOps and systems support for Trilinos, Sandia's open-source C++ scientific computing library (66+ packages), on a 5-person team serving 50–100 researchers. Kept the Jenkins, GitHub Actions and CDash pipeline at 99.99% uptime through daily triage of build and test failures across CUDA, MPI and compiler configurations on HPC clusters. Led a rolling RHEL 7 to 8 migration of a 40-node cluster in 3 weeks with zero data loss, and hardened login nodes (SELinux, restricted sudo, SSH keys). Former DOE L clearance.",
    role: "Software Engineer: DevOps & Linux Systems Support (Contract)",
    techStack: ["RHEL", "Jenkins", "GitHub Actions", "CDash", "CMake", "TriBITS", "CUDA", "MPI", "C++", "SELinux"],
    featured: true,
    link: "https://github.com/trilinos/Trilinos",
    imageUrl: null,
    year: "2019 – 2024",
  },
  {
    id: 4,
    order: 4,
    name: "District IT Support & CyberPatriot Platform — NOCCCD",
    description: "Grew from lab intern to IT support technician to Linux team lead (contract) as the district's user base grew from ~500 to 4,000+. Resolved 85% of tickets on first contact in Jira and ServiceNow, moved 800 users from on-premises Active Directory to Azure AD (now Entra ID), set up MFA for 2,000+ users, and enrolled 200+ devices in Intune. Led the recovery when the CyberPatriot competition platform failed mid-event (5 engineers, ~10 servers, back in under 45 minutes), maintained its AWS services, and contributed infrastructure design to grant proposals that won $4M+.",
    role: "Linux Team Lead · IT Support Technician · CS Intern",
    techStack: ["Active Directory", "Entra ID", "Microsoft 365", "Intune", "PowerShell", "Jira", "ServiceNow", "VMware", "AWS", "Linux"],
    featured: true,
    link: null,
    imageUrl: null,
    year: "2014 – 2022",
  },
  {
    id: 5,
    order: 5,
    name: "CPTC 2021 — National Collegiate Penetration Testing Competition",
    description: "Cal State Fullerton team: top 5 of 67 universities (including Stanford, MIT and RIT) in a 17-hour professional penetration testing engagement against simulated corporate infrastructure, judged on findings, client communication and the written report.",
    role: "CSUF Team Member",
    techStack: ["Penetration Testing", "Linux", "Windows", "Network Enumeration", "Report Writing"],
    featured: false,
    link: "https://news.fullerton.edu/2020/12/cybersecurity-students-secure-spot-in-national-competition/",
    imageUrl: null,
    year: "2021",
  },
  {
    id: 6,
    order: 6,
    name: "Viral Clips — Hybrid CV + AI Highlight Pipeline",
    description: "R&D project: a 7-stage video pipeline that extracts gaming highlights from raw footage. OpenCV filters out ~85% of frames for free, and a vision API checks only the ambiguous 15% — near-AI accuracy at near-CV cost ($0.20–0.40 per video). Death-aware clip scoring with EasyOCR, auto-captions, and vertical export. Tested on 22GB of real footage.",
    role: "R&D Project",
    techStack: ["Python", "OpenCV", "FFmpeg", "EasyOCR", "Whisper", "NumPy"],
    featured: false,
    link: null,
    imageUrl: null,
    year: "2024",
  },
];
