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
    "Help Desk & Desktop Support — Windows, macOS, imaging",
    "Active Directory, Group Policy & Microsoft 365",
    "Entra ID (Azure AD), Intune & MFA",
    "Linux Systems Administration (RHEL)",
    "CI/CD — Jenkins, GitHub Actions, CDash",
    "Scripting — PowerShell, Bash, Python, Ansible",
    "AWS Operations — EC2, S3, IAM, VPC, RDS, Lambda",
    "Former DOE L Clearance · CPTC 2021 Top 5",
  ];

  const experience = [
    {
      company: "ResumePolish.io and contract clients",
      role: "IT Support & DevOps Engineer (Contract)",
      period: "2022 – Present",
      highlights: [
        "Provide on-site and remote IT support to private and commercial clients: network cabling, Mac and Windows onboarding with VPN and proxy setup, device wiping and reimaging, and asset tracking",
        "Support a web app with 2,000+ users, monitored with Prometheus and Grafana",
        "Maintain the app's production AWS services (EC2, S3, IAM, VPC, RDS, Lambda), and moved it from containers to serverless once it was clear its scale didn't justify Kubernetes",
        "Automate maintenance with Bash and Python, and keep runbooks so recurring issues only get solved once",
      ],
      impact: "Cut the app's error rate from 18% to under 1%.",
    },
    {
      company: "John Deere",
      role: "DevOps & Test Infrastructure Engineer (Contract)",
      period: "Feb 2023 – Feb 2025",
      highlights: [
        "Built WSL and Linux test infrastructure with Ansible that configured and validated 50–100 GPS receivers, antennas and circuit boards at once over serial, bus and network interfaces",
        "Ran synthetic-signal and GPS almanac tests, confirmed with live telemetry from a field test van",
        "Managed access for engineers on lab and test-van equipment, and tracked lab assets from YubiKeys and laptops to network gear and prototype boards",
        "Wired test benches linking circuit boards, serial and diagnostic ports to tractor microcontrollers and embedded sensors such as LiDAR",
      ],
      impact: "Caught receiver, antenna and microprocessor failures before field deployment.",
    },
    {
      company: "Sandia National Laboratories",
      role: "Software Engineer: DevOps & Linux Systems Support (Contract)",
      period: "2019 – 2024",
      highlights: [
        "Took over DevOps and systems support for Trilinos, Sandia's open-source scientific computing library (66+ packages), succeeding a senior engineer with two decades on the project, on a 5-person team serving 50–100 researchers",
        "Kept the Jenkins, GitHub Actions and CDash CI/CD pipeline at 99.99% uptime through daily triage of build and test failures on HPC clusters",
        "Hardened login nodes (SELinux, restricted sudo, SSH key-only auth), managed user access on restricted networks under a DOE L clearance (now inactive), and onboarded 20+ researchers",
      ],
      impact: "Led a rolling RHEL 7 to RHEL 8 migration of a 40-node cluster in 3 weeks with zero research data loss.",
    },
    {
      company: "North Orange County Community College District & CyberPatriot",
      role: "Linux Team Lead (2018–2022) · IT Support Technician (2017–2018) · CS Intern (2014–2017)",
      period: "2014 – 2022",
      highlights: [
        "Supported growth from ~500 to 4,000+ users across district sites; resolved 85% of tickets on first contact in Jira and ServiceNow and cut the Tier 2 backlog 40%",
        "Migrated 800 users from on-premises Active Directory to Azure AD (now Microsoft Entra ID), set up MFA for 2,000+ users in the Office 365 move, and enrolled 200+ devices in Intune at 97% compliance",
        "Led recovery when the competition platform failed mid-event: directed 5 engineers to restore ~10 servers and hundreds of VMs for 500–1,000 concurrent users in under 45 minutes",
        "Cut onboarding from 4 hours to 30 minutes with a PowerShell script; racked and cabled servers and network gear, and reimaged VMware VMs and lab machines by the hundreds",
      ],
      impact: "Grew from lab intern to IT support technician to Linux team lead over 8 years.",
    },
  ];

  const independentWork = [
    {
      project: "CPTC 2021 — Collegiate Penetration Testing Competition",
      role: "Cal State Fullerton team",
      period: "2021",
      description: "Placed top 5 of 67 universities in a professional penetration testing competition against simulated corporate infrastructure, with a written findings report.",
    },
    {
      project: "Viral Clips",
      role: "R&D project",
      period: "2024",
      description: "Automated video pipeline that turns raw gaming footage into short vertical clips with clip extraction and highlight detection.",
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
                IT Support & Systems Administrator — Windows · Microsoft 365 · Linux · DevOps
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
            IT support and systems administrator with 10+ years in IT. At the North Orange County Community College District I grew from lab intern to IT support technician to Linux team lead, supporting a user base that grew from about 500 to 4,000+. Since then I've supported researchers' Linux systems and the Trilinos CI/CD pipeline at Sandia National Laboratories, built Ansible test automation for GPS receivers at John Deere, and run releases, monitoring and AWS services for ResumePolish.io. Earlier: General Manager at Verizon and Off-Site Supervisor at FedEx Freight.
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
            Projects & Competitions
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
                <p className="text-muted-foreground">B.S. Computer Science, Emphasis in Mathematics — GPA 3.5</p>
              </div>
              <span className="text-sm font-mono text-muted-foreground whitespace-nowrap">Expected 2027</span>
            </div>
            <p className="text-sm text-muted-foreground">CPTC 2021 national competitor (top 5 of 67 universities).</p>
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
            Hiring for IT support or systems administration?
          </h2>
          <p className="text-muted-foreground mb-8">
            I'm open to IT support, help desk, systems administrator and IT operations roles in Los Angeles and Orange County, or remote. Any shift, including overnight.
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
