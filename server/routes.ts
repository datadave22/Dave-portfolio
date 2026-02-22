import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { getResendClient } from "./resend";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Posts
  app.get(api.posts.list.path, async (req, res) => {
    const posts = await storage.getPosts();
    res.json(posts);
  });

  app.get(api.posts.get.path, async (req, res) => {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const post = await storage.getPost(slug);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  });

  // Projects
  app.get(api.projects.list.path, async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get(api.projects.get.path, async (req, res) => {
    const project = await storage.getProject(Number(req.params.id));
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  });

  // Contact
  app.post(api.contact.submit.path, async (req, res) => {
    try {
      const input = api.contact.submit.input.parse(req.body);
      await storage.createMessage(input);
      
      try {
        const { client, fromEmail } = await getResendClient();
        const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'full', timeStyle: 'short' });
        await client.emails.send({
          from: fromEmail,
          to: 'd86272796+portfolio@gmail.com',
          replyTo: input.email,
          subject: `[davejohnson.io] New contact from ${input.name}`,
          html: `
            <!DOCTYPE html>
            <html>
            <body style="font-family: 'Courier New', monospace; background: #0a0a0a; color: #e5e5e5; padding: 40px; max-width: 600px; margin: 0 auto;">
              <div style="border-left: 3px solid #22c55e; padding-left: 20px; margin-bottom: 32px;">
                <p style="color: #22c55e; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; margin: 0 0 4px;">Source</p>
                <p style="font-size: 18px; font-weight: 600; margin: 0;">davejohnson.io/contact</p>
                <p style="color: #737373; font-size: 12px; margin: 4px 0 0;">${timestamp}</p>
              </div>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #262626; color: #737373; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; width: 80px;">From</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #262626; font-size: 15px;">${input.name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #262626; color: #737373; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Reply To</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #262626; font-size: 15px;"><a href="mailto:${input.email}" style="color: #22c55e; text-decoration: none;">${input.email}</a></td>
                </tr>
              </table>
              <div style="margin-bottom: 8px;">
                <p style="color: #737373; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px;">Message</p>
                <div style="background: #111; border: 1px solid #262626; padding: 20px; line-height: 1.7; font-size: 15px; white-space: pre-wrap;">${input.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
              </div>
              <p style="color: #404040; font-size: 11px; margin-top: 32px; border-top: 1px solid #1a1a1a; padding-top: 16px;">
                Hit reply to respond directly to ${input.name} — reply-to is set to their address.
              </p>
            </body>
            </html>
          `
        });
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
      }
      
      res.json({ success: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const seedPost = async (post: Parameters<typeof storage.createPost>[0]) => {
    const existing = await storage.getPost(post.slug);
    if (!existing) await storage.createPost(post);
  };

  await seedPost({
      title: "Top 5 at Nationals: Competing in the 2021 Collegiate Penetration Testing Competition",
      slug: "cptc-2021-nationals",
      status: "published",
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

[CSUF News coverage of the 2021 CPTC qualifying run](https://news.fullerton.edu/2020/12/cybersecurity-students-secure-spot-in-national-competition/)`
    });
    await seedPost({
      title: "CI/CD at Scale: Managing Thousands of Build Configurations for the Trilinos HPC Framework",
      slug: "trilinos-cicd-at-scale",
      status: "published",
      tags: ["DevOps", "HPC", "CI/CD", "CUDA"],
      summary: "What it actually looks like to maintain CI/CD infrastructure for a C++ scientific computing framework used by U.S. Top 500 supercomputers — thousands of build permutations, GPU acceleration, and MPI implementations.",
      content: `For almost two years at Sandia National Laboratories, I maintained the CI/CD infrastructure for the Trilinos Project — a large-scale C++ scientific computing framework used by multiple U.S. Top 500 supercomputers. Here's what operating at that scale actually looks like.

## What Is Trilinos?

Trilinos is an open-source collection of scientific libraries and tools focused on solving large-scale, complex multi-physics engineering and scientific problems. It's used in structural mechanics simulations, climate modeling, nuclear weapons research, and a dozen other domains. Thousands of developers, scientists, and companies depend on it being stable and buildable.

## The Configuration Matrix Problem

A single build of Trilinos isn't one thing. It's a combination of CUDA version, MPI implementation (OpenMPI, MPICH, Intel MPI), compiler toolchain, build options, and target platform. Multiply those out and you're looking at thousands of valid build permutations.

My job was to ensure that the ones that should build, do — and the ones that can't (conflicting requirements, unsupported combinations) are identified early and excluded from the matrix before they waste machine time.

## Debugging Build Failures

CMake and TriBITS produce complex dependency trees. When a build fails, the error often isn't at the point of failure — it's buried three levels up in a toolchain interaction that only manifests on specific combinations. Root-cause analysis meant reading CMake output carefully, understanding how TriBITS resolves package dependencies, and knowing enough about compiler behavior to distinguish "this is a real bug" from "this is a configuration that was never going to work."

A subset of the failures were intermittent — infrastructure instability, resource contention, transient network issues on the HPC schedulers. Distinguishing a true code regression from a flaky environment required baselining failure rates and looking at patterns across runs, not just individual failures.

## What Scale Changes

The difference between managing CI for a typical software project and managing it for Trilinos is mostly about the cost of being wrong. When a configuration matrix has thousands of permutations and runs on supercomputers, wasted builds are expensive — in machine time, in developer time waiting for results, and in trust from the scientific computing community depending on your stability signals.`
    });
    await seedPost({
      title: "Building a Production SaaS Solo: Lessons from ResumePolish",
      slug: "building-resumepolish",
      status: "published",
      tags: ["SaaS", "Full-Stack", "AI", "Stripe", "Production"],
      summary: "What I learned shipping a full-stack AI SaaS from scratch — auth flows, Stripe webhook security, serverless constraints, and the production debugging that only shows up after you deploy.",
      content: `ResumePolish is an AI-powered resume optimization platform I built solo and deployed to production. A user uploads their resume, selects their target industry and role, and gets a professionally rewritten version in under 30 seconds.

## The Stack

React frontend, Express backend, PostgreSQL via Neon, deployed on Vercel serverless. Clerk for authentication, Stripe for payments, GPT-4o for the actual optimization. A deliberate monolith — shared TypeScript types between frontend and backend are worth more than the theoretical benefits of microservices at solo-developer scale.

## Stripe Webhooks: Never Trust the Client

The payment flow ends at a webhook, not a client-side confirmation. Stripe signs every webhook with HMAC-SHA256. You verify using the raw request body — not parsed JSON. After verification, I check for duplicate events using the Stripe event ID as an idempotency key. Client-side checkout confirmation is never trusted.

## Serverless File Processing

Serverless functions have no persistent filesystem. I use multer with memoryStorage — files go into a Node.js Buffer in memory, get parsed by pdfjs-dist or mammoth, and the extracted text goes directly to the OpenAI API. Nothing touches the filesystem.

## Prompt Architecture

Free users get standard optimization. Paid users get ATS keyword injection, Harvard-style formatting, and a Resume Strength Score. The differentiation is in the prompt, stored in the database with version numbers and an is_active boolean. New prompt versions can be activated with a single SQL UPDATE — no code deployment required.`
    });
    await seedPost({
      title: "Monolith Over Microservices: The Architecture Decision Behind ResumePolish",
      slug: "monolith-over-microservices",
      status: "published",
      tags: ["Architecture", "SaaS", "Systems Design", "Production"],
      summary: "Why I deliberately chose a monolith for ResumePolish when every blog post said otherwise — and the specific decision points that made microservices the wrong call at solo-developer scale.",
      content: `Every modern architecture article points toward microservices. Separate services for auth, payments, file processing, AI calls. Independent scaling. Technology heterogeneity. When I started building ResumePolish, I read those articles and then deliberately went the other direction.

Here's why — and the specific calculus behind it.

## The Deployment Unit Problem

Microservices promise independent deployability. In practice, for a solo developer shipping v1, that's a liability. Every feature that touches payments, file upload, and AI generation touches three services simultaneously. A schema change to the users table requires coordinating migrations across services that all read user state.

With a monolith, a single deployment ships everything. Zero coordination overhead. When you're the only engineer, coordination overhead isn't theoretical — it's your entire afternoon.

## Shared TypeScript Types: The Hidden Multiplier

The biggest practical win from a monolith isn't deployment simplicity. It's type safety end-to-end.

With a shared \`/shared\` directory, the same Zod schema that validates the POST /api/resume request on the server also types the frontend form. The same \`InsertUser\` type that Drizzle ORM uses for database writes is the type the React Query mutation expects on the client.

In a microservices setup, you manage this with a shared types package or API contract tooling (OpenAPI, Protobuf, tRPC cross-service). That's non-trivial infrastructure. At ResumePolish scale — one developer, sub-1000 users at launch — it would have been the most expensive architectural decision with the smallest return.

## The Scaling Argument Doesn't Hold Until It Does

The common microservices pitch: "What if your AI processing needs to scale independently from your auth service?" Valid question. My answer: not yet.

I designed for scale in the right places. The AI processing endpoint is stateless — it reads from DB, calls OpenAI, writes results back. It can be extracted into a standalone service later with a single refactor. The Stripe webhook handler is already effectively isolated — it's one Express route with an idempotency check. Extracting it means moving ~150 lines of code.

The monolith buys me velocity now. The seams are clean enough that decomposition later is a real option, not a rewrite.

## Where I Drew the Boundary

Not everything is in the monolith. The file parsing (PDF, DOCX) runs in the same process on Vercel serverless. The OpenAI call is async but in-process. What I didn't do is put email delivery in-process — I call Resend externally as a fire-and-forget, because email delivery failure should never block a user's resume response.

That's the practical version of "microservices thinking" applied correctly: extract only the parts that genuinely benefit from isolation, and have a real reason beyond "it could scale independently someday."

## The Decision Framework

When I advise on architecture now, the question I ask first is: what's the cost of being wrong? If the monolith gets too big, I decompose it — incremental, planned work. If the microservice architecture is wrong from day one, I'm rebuilding distributed infrastructure. The asymmetry of downside risk is what made the choice obvious.

Build the monolith. Draw clean internal seams. Extract when the pain is real, not theoretical.`
    });
    await seedPost({
      title: "The Algorithm Switch: Why I Replaced Pure Computer Vision with a Hybrid Model in Viral Clips",
      slug: "viral-clips-algorithm-switch",
      status: "published",
      tags: ["Computer Vision", "Machine Learning", "Python", "Systems Engineering"],
      summary: "I started Viral Clips with pure OpenCV — fast, cheap, deterministic. The false positive rate made it unusable. Here's the math behind the hybrid CV+AI model that got it to near-human accuracy at near-CV cost.",
      content: `Viral Clips is a 7-stage pipeline that automatically extracts gaming highlights from raw footage. The core problem: given hours of raw gameplay, find the 30–90 second clips worth posting. I built the first version with pure computer vision. It didn't work well enough. Here's why, and what I replaced it with.

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

But LLM/vision API calls on every frame are economically insane. At 24fps over a 2-hour session, that's 172,800 frames. At Claude Vision API pricing, that's hundreds of dollars per video.

The insight: **use CV to discard the obvious 85%, then use AI only on the ambiguous 15%.**

## The Hybrid Pipeline

Stage 1–3: Standard CV scoring as before. Frames that score in the bottom 70% of the delta distribution are immediately discarded — no action happening, no need for further processing.

Stage 4: The "ambiguous zone" — frames that score in the middle 15% get sent to Claude Vision API with a structured prompt:

\`Is this frame from a gaming highlight moment? Specifically: is there an active kill, elimination, objective capture, or significant in-game event visible? Respond with: HIGHLIGHT / TRANSITION / DEAD_TIME and a 1-sentence reason.\`

The structured response lets me parse programmatically without relying on free-text output.

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

In Viral Clips, the expensive boundary is semantic understanding. Everything below that boundary — "is there motion in this frame?" — is CV territory. That's the architecture.`
    });

  const existingProjects = await storage.getProjects();
  if (existingProjects.length === 0) {
    await storage.createProject({
      name: "Trilinos CI/CD Infrastructure — Sandia National Laboratories",
      description: "Managed CI/CD pipelines for the Trilinos C++ scientific computing framework supporting multiple U.S. Top 500 supercomputers. Configuration matrices spanning thousands of build permutations across CUDA versions, MPI implementations, and compiler toolchains. Debugged complex CMake/TriBITS failures and implemented automated validation across GPU-accelerated workflows. Operated under DOE L-clearance.",
      role: "DevOps / MLOps Platform Engineer",
      techStack: ["C++", "CMake", "TriBITS", "CUDA", "MPI", "Jenkins", "GitLab CI", "Linux", "Bash"],
      featured: true,
      link: "https://github.com/trilinos/Trilinos",
      year: "2022"
    });
    await storage.createProject({
      name: "StarFire GNSS Firmware Validation — John Deere Advanced R&D",
      description: "Validated 50–100 firmware iterations per cycle for StarFire GNSS receivers supporting GPS, Galileo, GLONASS, and BeiDou constellations. Processed GB-to-TB telemetry datasets monthly to validate ML positioning algorithms. Automated test pipelines achieving improvements that scaled to millions in annual cost savings.",
      role: "Software Engineer / Embedded Systems Security",
      techStack: ["Python", "pandas", "NumPy", "SciPy", "MATLAB", "Embedded Linux", "GNSS/RTK"],
      featured: true,
      year: "2023"
    });
    await storage.createProject({
      name: "ResumePolish — AI Resume Optimization SaaS",
      description: "Full-stack SaaS platform using GPT-4o to tailor resumes for specific roles in under 30 seconds. Implements Stripe webhook payments with HMAC-SHA256 signature verification, Clerk OAuth, and a prompt versioning system for atomic AI updates without deployments. Built for Vercel serverless with buffer-based PDF/DOCX parsing and a freemium credit-pack revenue model.",
      role: "Founder / Full-Stack Developer",
      techStack: ["React", "TypeScript", "Express", "PostgreSQL", "Drizzle ORM", "OpenAI GPT-4o", "Stripe", "Clerk", "Vercel"],
      featured: true,
      year: "2024"
    });
    await storage.createProject({
      name: "Viral Clips — Hybrid CV + AI Gaming Highlight Pipeline",
      description: "7-stage video processing pipeline that extracts gaming highlights from raw footage automatically. Uses OpenCV as a cost filter (85% of frames) with Claude Vision API confirmation on the ambiguous 15% — near-AI accuracy at near-CV cost ($0.20–0.40 per video). Death-aware clip scoring, auto-captions, and vertical format export. Tested on 22GB of real footage.",
      role: "Creator / Systems Engineer",
      techStack: ["Python", "OpenCV", "FFmpeg", "EasyOCR", "Whisper", "Claude Vision API", "NumPy"],
      featured: true,
      year: "2024"
    });
    await storage.createProject({
      name: "CPTC 2021 — National Collegiate Penetration Testing Competition",
      description: "Top 5 finish out of 67 universities globally (Stanford, MIT, RIT) in a 17-hour professional penetration testing competition. Built and maintained AWS cyber range infrastructure (EC2, S3, VPC, IAM) supporting 800–2,000 participants. Contributed technical input to federal grant proposals securing $4M+ in cybersecurity education funding.",
      role: "Penetration Tester / Cloud Infrastructure Engineer",
      techStack: ["AWS", "EC2", "VPC", "IAM", "Docker", "SELinux", "PAM", "iptables"],
      featured: true,
      link: "https://news.fullerton.edu/2020/12/cybersecurity-students-secure-spot-in-national-competition/",
      year: "2021"
    });
  }
}
