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
    "Linux Systems & Internals",
    "HPC (CPU/GPU) Environments",
    "Cloud & Container Platforms (AWS, Docker, Kubernetes)",
    "Reproducible ML Infrastructure",
    "Secure & Regulated Environments",
  ];

  const experience = [
    {
      company: "John Deere",
      role: "Advanced R&D Lab — DevOps/MLOps Platform Engineer",
      period: "2023 – Present",
      highlights: [
        "Built and maintained CI/CD pipelines for ML model deployment across hybrid cloud infrastructure",
        "Automated infrastructure provisioning using Terraform and Ansible, reducing deployment time by 60%",
        "Designed reproducible ML training environments using Docker and Kubernetes",
        "Collaborated with data science teams to optimize GPU utilization for deep learning workloads",
      ],
      impact: "Reduced model deployment cycle from weeks to hours while maintaining security compliance.",
    },
    {
      company: "U.S. Department of Energy",
      role: "National Laboratory — HPC Systems Engineer",
      period: "2021 – 2023",
      highlights: [
        "Managed high-performance computing clusters supporting scientific research applications",
        "Implemented automated monitoring and alerting systems for critical infrastructure",
        "Developed custom tooling for resource scheduling and workload optimization",
        "Maintained compliance with federal security requirements (FedRAMP, NIST)",
      ],
      impact: "Improved cluster utilization by 35% through intelligent workload scheduling.",
    },
    {
      company: "CyberPatriot / CPTC",
      role: "Collegiate Penetration Testing Competition",
      period: "2019 – 2021",
      highlights: [
        "Led team in realistic enterprise penetration testing scenarios",
        "Performed vulnerability assessments and developed remediation strategies",
        "Delivered professional security reports to simulated executive stakeholders",
        "Placed in national competition finals demonstrating advanced offensive security skills",
      ],
      impact: "Developed real-world security assessment and reporting skills under competitive pressure.",
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
                Senior DevOps / MLOps Platform Engineer
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
            Results-driven platform engineer with expertise in building and scaling 
            CI/CD infrastructure, managing high-performance computing environments, 
            and implementing secure, reproducible ML pipelines. Proven track record 
            of reducing deployment friction while maintaining compliance in regulated 
            environments. Combines deep systems knowledge with practical security 
            experience from competitive penetration testing.
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
