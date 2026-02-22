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
        await client.emails.send({
          from: fromEmail,
          to: 'd86272796+portfolio@gmail.com',
          subject: `New Contact Form Message from ${input.name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${input.name}</p>
            <p><strong>Email:</strong> ${input.email}</p>
            <p><strong>Message:</strong></p>
            <p>${input.message.replace(/\n/g, '<br>')}</p>
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
  const existingPosts = await storage.getPosts();
  if (existingPosts.length === 0) {
    await storage.createPost({
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
    await storage.createPost({
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
    await storage.createPost({
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
  }

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
