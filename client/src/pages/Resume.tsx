import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import {
  sectionVariants,
  staggerContainer,
  staggerItem,
  viewportOnceConfig,
} from "@/lib/motion";

export default function Resume() {
  const prefersReducedMotion = useReducedMotion();

  const coreStrengths = [
    "CI/CD Automation & Pipeline Engineering",
    "HPC (CPU/GPU) Environments — MPI, CUDA, Trilinos",
    "Linux Systems & Internals (RHEL, Ubuntu)",
    "Container Platforms — Docker, Kubernetes",
    "Embedded Systems & Firmware Security",
    "Secure & Regulated Environments (DOE L-clearance)",
    "Full-Stack SaaS — React, Node.js, PostgreSQL",
    "Penetration Testing & Threat Modeling",
  ];

  const experience = [
    {
      company: "John Deere",
      role: "Advanced R&D — Software Engineer, Embedded Systems & Security",
      period: "Dec 2023 – Present",
      highlights: [
        "Firmware hardening and security analysis for embedded systems in agricultural and autonomous equipment",
        "Threat modeling and vulnerability assessment across constrained embedded environments",
        "Developed tooling to automate security validation workflows in the hardware bring-up pipeline",
        "Cross-functional collaboration with hardware, firmware, and product security teams",
      ],
      impact: "Strengthened security posture for embedded platforms operating in safety-critical, real-world deployments.",
    },
    {
      company: "Sandia National Laboratories",
      role: "DevOps / MLOps Platform Engineer — Trilinos Project (DOE)",
      period: "Jan 2022 – Nov 2023",
      highlights: [
        "Owned CI/CD infrastructure for Trilinos — a 50+ package scientific software collection used on U.S. Top 500 supercomputers",
        "Managed thousands of CMake/TriBITS build configurations across CUDA, MPI, and compiler matrix permutations",
        "Debugged complex pipeline failures spanning Jenkins, GitHub Actions, and RHEL HPC cluster environments",
        "Built reproducible ML infrastructure and GPU-accelerated build environments for research computing teams",
      ],
      impact: "Sustained CI reliability for a mission-critical open-source project under DOE L-clearance with zero tolerance for undetected regressions.",
    },
    {
      company: "CSUF — CPTC Team",
      role: "Collegiate Penetration Testing Competition — National Competitor",
      period: "Aug 2018 – Nov 2022",
      highlights: [
        "Placed Top 5 nationally in the 2021 CPTC — realistic enterprise penetration testing against simulated corporate infrastructure",
        "Led web application exploitation, lateral movement, and privilege escalation phases",
        "Delivered executive-facing reports with vulnerability findings, risk ratings, and remediation guidance",
        "Also competed in CyberPatriot and multiple regional CTF events throughout undergraduate studies",
      ],
      impact: "Developed applied offensive security skills and professional reporting under high-stakes competitive pressure.",
    },
  ];

  const independentWork = [
    {
      project: "ResumePolish.io",
      role: "Founder & Solo Engineer",
      period: "2024 – Present",
      description: "AI-powered resume analysis SaaS. Built full-stack from scratch: React frontend, Node.js/Express API, PostgreSQL, Stripe billing, and OpenAI integration. Designed the architecture to handle growth — deliberate choices on connection pooling, async job queues, and monolithic-vs-service boundaries before traffic warranted it.",
    },
    {
      project: "Viral Clips",
      role: "Founder & Solo Engineer",
      period: "2024",
      description: "Automated video content repurposing tool. ML pipeline for clip extraction and highlight detection. Explored unit economics and infrastructure costs at scale before deciding on build-vs-buy trade-offs for video processing.",
    },
  ];

  return (
    <div className="min-h-screen pt-32 px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          animate="visible"
          variants={sectionVariants}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-2">
                David Johnson
              </h1>
              <p className="text-xl text-muted-foreground">
                Senior Platform Engineer — HPC · Embedded Systems · MLOps
              </p>
            </div>
            <a
              href="https://github.com/datadave22"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-medium text-sm transition-opacity duration-200 hover:opacity-80"
              data-testid="link-github-resume-header"
            >
              <ExternalLink className="w-4 h-4" /> View on GitHub
            </a>
          </div>

          <div className="w-full h-px bg-border mb-12" />
        </motion.div>

        {/* Summary */}
        <motion.section
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnceConfig}
          variants={sectionVariants}
          className="mb-16"
        >
          <h2 className="text-xs font-mono text-primary uppercase tracking-widest mb-4">
            Summary
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Platform engineer with 7+ years spanning U.S. national labs, Fortune 500 R&D, and solo SaaS. At Sandia National Laboratories I owned CI/CD for Trilinos across thousands of build configurations on Top 500 supercomputers. At John Deere I work on embedded systems security for safety-critical equipment. Between those, I built and shipped ResumePolish.io from zero to production — solo. I design systems with scale trade-offs in mind before the traffic arrives: connection pooling, queue depth, service boundaries, and failure modes.
          </p>
        </motion.section>

        {/* Core Technical Strengths */}
        <motion.section
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnceConfig}
          variants={sectionVariants}
          className="mb-16"
        >
          <h2 className="text-xs font-mono text-primary uppercase tracking-widest mb-6">
            Core Technical Strengths
          </h2>
          <motion.div
            variants={prefersReducedMotion ? undefined : staggerContainer}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnceConfig}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {coreStrengths.map((strength) => (
              <motion.div
                key={strength}
                variants={prefersReducedMotion ? undefined : staggerItem}
                className="flex items-center gap-3 p-4 border border-border bg-card"
              >
                <span className="w-2 h-2 bg-primary flex-shrink-0" />
                <span className="text-sm">{strength}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Professional Experience */}
        <motion.section
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnceConfig}
          variants={sectionVariants}
          className="mb-16"
        >
          <h2 className="text-xs font-mono text-primary uppercase tracking-widest mb-8">
            Professional Experience
          </h2>
          <motion.div
            variants={prefersReducedMotion ? undefined : staggerContainer}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnceConfig}
            className="space-y-12"
          >
            {experience.map((job) => (
              <motion.div
                key={job.company}
                variants={prefersReducedMotion ? undefined : staggerItem}
                className="relative pl-6 border-l-2 border-border"
              >
                <div className="absolute -left-[5px] top-0 w-2 h-2 bg-primary" />
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-display font-medium">{job.company}</h3>
                    <p className="text-muted-foreground">{job.role}</p>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground whitespace-nowrap">
                    {job.period}
                  </span>
                </div>
                <ul className="space-y-2 mb-4">
                  {job.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-1 h-1 bg-muted-foreground mt-2 flex-shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>
                <div className="p-3 bg-primary/5 border border-primary/20">
                  <span className="text-xs font-mono text-primary uppercase tracking-wider">Impact:</span>
                  <p className="text-sm mt-1">{job.impact}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Independent Work */}
        <motion.section
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnceConfig}
          variants={sectionVariants}
          className="mb-16"
        >
          <h2 className="text-xs font-mono text-primary uppercase tracking-widest mb-8">
            Independent Work
          </h2>
          <motion.div
            variants={prefersReducedMotion ? undefined : staggerContainer}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnceConfig}
            className="space-y-6"
          >
            {independentWork.map((item) => (
              <motion.div
                key={item.project}
                variants={prefersReducedMotion ? undefined : staggerItem}
                className="relative pl-6 border-l-2 border-border"
              >
                <div className="absolute -left-[5px] top-0 w-2 h-2 bg-primary" />
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-xl font-display font-medium">{item.project}</h3>
                    <p className="text-muted-foreground">{item.role}</p>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground whitespace-nowrap">
                    {item.period}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Education */}
        <motion.section
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnceConfig}
          variants={sectionVariants}
          className="mb-16"
        >
          <h2 className="text-xs font-mono text-primary uppercase tracking-widest mb-6">
            Education
          </h2>
          <div className="relative pl-6 border-l-2 border-border">
            <div className="absolute -left-[5px] top-0 w-2 h-2 bg-primary" />
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-2">
              <div>
                <h3 className="text-xl font-display font-medium">California State University, Fullerton</h3>
                <p className="text-muted-foreground">B.S. Computer Science — GPA 3.5</p>
              </div>
              <span className="text-sm font-mono text-muted-foreground whitespace-nowrap">2018 – 2022</span>
            </div>
            <p className="text-sm text-muted-foreground">CPTC team lead, CyberPatriot competitor, coursework in systems programming, algorithms, and computer security.</p>
          </div>
        </motion.section>

        {/* Contact CTA */}
        <motion.section
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnceConfig}
          variants={sectionVariants}
          className="text-center pt-12 border-t border-border"
        >
          <h2 className="text-2xl font-display font-medium mb-4">
            Interested in working together?
          </h2>
          <p className="text-muted-foreground mb-8">
            I'm available for engineering roles, technical consultation, and collaboration opportunities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-medium text-sm transition-opacity duration-200 hover:opacity-80"
              data-testid="link-contact-resume"
            >
              Get In Touch
            </a>
            <a
              href="https://github.com/datadave22"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-muted-foreground font-medium text-sm transition-colors duration-200 hover:text-foreground hover:border-foreground"
              data-testid="link-github-resume"
            >
              <ExternalLink className="w-4 h-4" /> GitHub
            </a>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
