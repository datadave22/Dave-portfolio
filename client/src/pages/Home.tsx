import { usePosts, useProjects } from "@/hooks/use-content";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeader } from "@/components/SectionHeader";
import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Github, Mail, Cpu, GitMerge, Database, Shield } from "lucide-react";
import { SiPython, SiCplusplus, SiDocker, SiLinux, SiTypescript, SiGit } from "react-icons/si";
import {
  sectionVariants,
  heroGeometryVariants,
  heroTextVariants,
  horizontalLineVariants,
  fadeUpStaggerVariants,
  staggerContainer,
  staggerItem,
  viewportConfig,
  viewportOnceConfig,
  duration,
} from "@/lib/motion";

export default function Home() {
  const { data: posts } = usePosts();
  const { data: projects, isLoading: isProjectsLoading } = useProjects();
  const prefersReducedMotion = useReducedMotion();

  const featuredProjects = projects?.filter(p => p.featured).slice(0, 3) || projects?.slice(0, 3) || [];
  const latestPosts = posts?.slice(0, 3) || [];

  const technicalSkills = [
    { icon: SiPython, name: "Python" },
    { icon: SiCplusplus, name: "C++" },
    { icon: SiTypescript, name: "TypeScript" },
    { icon: SiDocker, name: "Docker" },
    { icon: SiLinux, name: "Linux" },
    { icon: SiGit, name: "Git" },
  ];

  const professionalStrengths = [
    { icon: Cpu, title: "HPC & GPU Computing", desc: "CUDA-accelerated builds, MPI workflows, configuration matrices across thousands of build permutations on U.S. Top 500 supercomputers" },
    { icon: GitMerge, title: "Platform Engineering & CI/CD", desc: "Trilinos, CMake/TriBITS, Jenkins, GitHub Actions — root-cause analysis on complex pipeline failures at national lab scale" },
    { icon: Database, title: "Systems Design & Scale", desc: "Intentional trade-offs: monolith vs. microservices, connection pooling strategies, and architecture decisions before 100K-user problems arrive" },
    { icon: Shield, title: "Security & Regulated Environments", desc: "DOE L-clearance, penetration testing, embedded firmware hardening, CPTC national competitor (Top 5, 2021)" },
  ];

  return (
    <div className="min-h-screen">
      {/* ═══════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col justify-center px-6 relative overflow-hidden">
        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          animate="visible"
          variants={heroGeometryVariants}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-[15%] right-[10%] w-[35vw] h-[45vh] bg-muted/30" />
          <motion.div 
            variants={prefersReducedMotion ? undefined : horizontalLineVariants}
            className="absolute top-1/3 left-0 w-[60%] h-px bg-border origin-left"
          />
          <div className="absolute top-[20%] right-[30%] w-px h-[40vh] bg-primary/20" />
          <div className="absolute bottom-[25%] right-[15%] w-24 h-24 rounded-full border border-border" />
        </motion.div>

        <div className="max-w-7xl mx-auto w-full pt-20 relative z-10">
          <motion.div
            initial={prefersReducedMotion ? false : "hidden"}
            animate="visible"
            variants={heroTextVariants}
          >
            <motion.div
              variants={prefersReducedMotion ? undefined : horizontalLineVariants}
              className="w-16 h-px bg-foreground mb-8 origin-left"
            />
            
            <p className="text-primary text-sm font-mono uppercase tracking-widest mb-4">
              Senior Platform Engineer — HPC · MLOps · Distributed Systems
            </p>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-medium tracking-tighter leading-[0.95] text-balance mb-6">
              DAVID<br />
              <span className="text-muted-foreground">JOHNSON</span>
            </h1>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : "hidden"}
            animate="visible"
            variants={heroTextVariants}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-8"
          >
            <div className="md:col-span-6 md:col-start-7">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light mb-6">
                7+ years building production infrastructure at DOE national labs and Fortune 500 R&D. CI/CD pipelines spanning thousands of build configurations, GPU-accelerated computing environments, and full-stack systems shipped to production.
              </p>
              <p className="text-base text-muted-foreground/80 leading-relaxed mb-8">
                From Trilinos on U.S. Top 500 supercomputers to AI-powered SaaS with live Stripe payments — I build systems that scale and make deliberate trade-offs before the traffic arrives.
              </p>
              
              <div className="flex flex-wrap gap-4 items-center">
                <Link 
                  href="/projects" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-medium text-sm transition-opacity duration-200 hover:opacity-80"
                  data-testid="link-projects-hero"
                >
                  View Projects <ArrowRight className="w-4 h-4" />
                </Link>
                <a 
                  href="https://github.com/datadave22"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 border border-border text-muted-foreground font-medium text-sm transition-colors duration-200 hover:text-foreground hover:border-foreground"
                  data-testid="link-github"
                >
                  <Github className="w-4 h-4" /> GitHub
                </a>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center gap-2 text-muted-foreground transition-opacity duration-200 hover:opacity-70"
                  data-testid="link-contact-hero"
                >
                  <Mail className="w-4 h-4" /> Contact
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: duration.standard }}
          className="absolute bottom-12 left-6 md:left-12 flex items-center gap-4 text-xs font-mono text-muted-foreground"
        >
          <div className="w-px h-8 bg-muted-foreground/50" />
          <span>SCROLL</span>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          ABOUT / PROFESSIONAL SUMMARY
          ═══════════════════════════════════════════════════════ */}
      <motion.section 
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={viewportConfig}
        variants={sectionVariants}
        className="py-24 bg-foreground text-background px-6 relative overflow-hidden"
      >
        <motion.div 
          initial={prefersReducedMotion ? false : { x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 0.1 }}
          transition={{ duration: duration.slow, ease: [0.4, 0.0, 0.2, 1] }}
          viewport={viewportOnceConfig}
          className="absolute top-0 left-0 w-1/3 h-full bg-background/10"
        />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start relative z-10">
          <motion.div
            variants={prefersReducedMotion ? undefined : staggerContainer}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnceConfig}
          >
            <motion.span 
              variants={prefersReducedMotion ? undefined : staggerItem}
              className="text-primary text-xs font-mono mb-4 block uppercase tracking-widest"
            >
              Professional Summary
            </motion.span>
            <motion.h2 
              variants={prefersReducedMotion ? undefined : staggerItem}
              className="text-3xl md:text-4xl font-display leading-tight mb-8"
            >
              Platform engineering at national-lab scale, SaaS in production
            </motion.h2>
            <motion.p 
              variants={prefersReducedMotion ? undefined : staggerItem}
              className="text-neutral-400 text-lg leading-relaxed mb-6"
            >
              I spent two years at Sandia National Laboratories owning CI/CD for the Trilinos scientific software collection — thousands of build configurations, GPU clusters, and U.S. Top 500 supercomputers. Since then I've shipped ResumePolish.io from zero to paying users, solo. I make deliberate trade-offs: monolith vs. microservices, connection pool sizing, queuing strategies — before scale becomes the emergency.
            </motion.p>
            <motion.div 
              variants={prefersReducedMotion ? undefined : staggerItem}
              className="flex flex-wrap gap-3 mt-8"
            >
              <span className="px-3 py-1 bg-neutral-800 text-neutral-300 text-sm border border-neutral-700">Trilinos / Sandia Labs</span>
              <span className="px-3 py-1 bg-neutral-800 text-neutral-300 text-sm border border-neutral-700">ResumePolish.io Founder</span>
              <span className="px-3 py-1 bg-neutral-800 text-neutral-300 text-sm border border-neutral-700">CPTC National Top 5</span>
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={prefersReducedMotion ? undefined : staggerContainer}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnceConfig}
            className="space-y-6"
          >
            {professionalStrengths.map((strength, i) => (
              <motion.div 
                key={strength.title}
                variants={prefersReducedMotion ? undefined : staggerItem}
                className="flex gap-4 items-start p-4 bg-neutral-800/50 border border-neutral-700"
              >
                <strength.icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-medium mb-1">{strength.title}</h4>
                  <p className="text-sm text-neutral-400">{strength.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════
          TECHNICAL SKILLS
          ═══════════════════════════════════════════════════════ */}
      <motion.section 
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={viewportConfig}
        variants={sectionVariants}
        className="py-24 md:py-32 px-6 relative"
      >
        <motion.div 
          variants={prefersReducedMotion ? undefined : horizontalLineVariants}
          className="absolute top-24 left-0 w-1/4 h-px bg-primary/30 origin-left"
        />
        
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            title="TECHNICAL EXPERTISE" 
            subtitle="Core technologies and professional skills driving business-focused engineering."
          />
          
          <motion.div 
            variants={prefersReducedMotion ? undefined : staggerContainer}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnceConfig}
            className="grid grid-cols-3 md:grid-cols-6 gap-6 mb-16"
          >
            {technicalSkills.map((skill) => (
              <motion.div 
                key={skill.name}
                variants={prefersReducedMotion ? undefined : staggerItem}
                className="flex flex-col items-center gap-3 p-6 border border-border bg-card transition-colors hover:border-primary/50"
              >
                <skill.icon className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm font-medium text-center">{skill.name}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={prefersReducedMotion ? undefined : staggerContainer}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnceConfig}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <motion.div variants={prefersReducedMotion ? undefined : staggerItem} className="p-6 border border-border bg-card">
              <h3 className="text-lg font-display font-medium mb-4">Core Technical Skills</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary" /> Languages: Python, C++, TypeScript, Bash</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary" /> Infra: Docker, Kubernetes, Jenkins, GitHub Actions</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary" /> HPC: MPI, CUDA, CMake/TriBITS, Trilinos</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary" /> Platforms: Linux (RHEL/Ubuntu), AWS, PostgreSQL</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary" /> Security: Penetration testing, CPTC, DOE L-clearance</li>
              </ul>
            </motion.div>
            <motion.div variants={prefersReducedMotion ? undefined : staggerItem} className="p-6 border border-border bg-card">
              <h3 className="text-lg font-display font-medium mb-4">Engineering Approach</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary" /> Trade-off analysis before scale hits (100K+ user design)</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary" /> Monolith vs. microservices — right tool, right time</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary" /> Connection pooling, queue depth, and async patterns</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary" /> Failure mode analysis and root-cause debugging</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary" /> Solo SaaS → production (auth, billing, infra, observability)</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════
          PROJECTS SECTION
          ═══════════════════════════════════════════════════════ */}
      <motion.section 
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={viewportConfig}
        variants={sectionVariants}
        className="py-24 md:py-32 px-6 bg-muted/30 relative"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            title="FEATURED PROJECTS" 
            subtitle="Solutions designed to solve real problems and deliver measurable business impact."
          />
          
          <motion.div 
            variants={prefersReducedMotion ? undefined : staggerContainer}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnceConfig}
            className="space-y-4"
          >
            {isProjectsLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-48 w-full bg-muted/50 animate-pulse mb-8" />
              ))
            ) : (
              featuredProjects.map((project, index) => (
                <motion.div key={project.id} variants={prefersReducedMotion ? undefined : staggerItem}>
                  <ProjectCard project={project} index={index} />
                </motion.div>
              ))
            )}
          </motion.div>

          <motion.div 
            variants={prefersReducedMotion ? undefined : fadeUpStaggerVariants}
            custom={4}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnceConfig}
            className="mt-16 text-center md:text-left"
          >
            <Link 
              href="/projects" 
              className="inline-block py-4 px-8 border border-foreground text-foreground font-medium tracking-wide text-sm uppercase transition-all duration-300 hover:bg-foreground hover:text-background"
              data-testid="link-all-projects"
            >
              View All Projects
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════
          CYBERSECURITY EXPERIENCE
          ═══════════════════════════════════════════════════════ */}
      <motion.section 
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={viewportConfig}
        variants={sectionVariants}
        className="py-24 md:py-32 px-6 relative"
      >
        <motion.div 
          variants={prefersReducedMotion ? undefined : horizontalLineVariants}
          className="absolute top-24 right-0 w-1/4 h-px bg-primary/30 origin-right"
        />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary text-xs font-mono mb-4 block uppercase tracking-widest">
                Applied Security
              </span>
              <h2 className="text-3xl md:text-4xl font-display leading-tight mb-6">
                CPTC National Top 5, 2021
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Competed in the Collegiate Penetration Testing Competition at CSUF — placed Top 5 nationally in 2021. Realistic enterprise engagement scenarios: web app exploitation, lateral movement, privilege escalation, and professional executive-facing reporting.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Combined with a DOE L-clearance and embedded firmware work at John Deere, this isn't checkbox security — it's applied threat modeling and defense-in-depth across systems that matter.
              </p>
            </div>
            <div className="relative aspect-square bg-muted/50 overflow-hidden border border-border">
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="w-24 h-24 text-primary/20" />
              </div>
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-px opacity-30">
                {Array(36).fill(0).map((_, i) => (
                  <div key={i} className="bg-muted-foreground/10" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════
          RESUMEPOLISH CTA
          ═══════════════════════════════════════════════════════ */}
      <motion.section
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={viewportConfig}
        variants={sectionVariants}
        className="py-24 md:py-32 px-6 bg-foreground text-background relative overflow-hidden"
      >
        <motion.div
          initial={prefersReducedMotion ? false : { x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 0.07 }}
          transition={{ duration: duration.slow }}
          viewport={viewportOnceConfig}
          className="absolute top-0 right-0 w-1/2 h-full bg-background/10 pointer-events-none"
        />
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div
            variants={prefersReducedMotion ? undefined : staggerContainer}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnceConfig}
          >
            <motion.span
              variants={prefersReducedMotion ? undefined : staggerItem}
              className="text-primary text-xs font-mono mb-4 block uppercase tracking-widest"
            >
              Built by this engineer
            </motion.span>
            <motion.h2
              variants={prefersReducedMotion ? undefined : staggerItem}
              className="text-3xl md:text-4xl font-display leading-tight mb-6"
            >
              ResumePolish.io
            </motion.h2>
            <motion.p
              variants={prefersReducedMotion ? undefined : staggerItem}
              className="text-neutral-400 text-lg leading-relaxed mb-4"
            >
              AI-powered resume optimization built and shipped solo. Upload your resume, select the role — get a professionally rewritten version in under 30 seconds.
            </motion.p>
            <motion.p
              variants={prefersReducedMotion ? undefined : staggerItem}
              className="text-neutral-500 leading-relaxed mb-8"
            >
              Full-stack: React, Express, PostgreSQL, Stripe, GPT-4o. The architecture decisions behind it are documented in the Insights section.
            </motion.p>
            <motion.div
              variants={prefersReducedMotion ? undefined : staggerItem}
              className="flex flex-wrap gap-4"
            >
              <a
                href="https://resumepolish.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background font-medium text-sm transition-opacity hover:opacity-80"
              >
                Try ResumePolish.io <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/posts/monolith-over-microservices"
                className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-700 text-neutral-300 font-medium text-sm transition-colors hover:border-neutral-400 hover:text-white"
              >
                Read the architecture post
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={prefersReducedMotion ? undefined : staggerContainer}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnceConfig}
            className="space-y-4"
          >
            {[
              { label: "AI Engine", value: "GPT-4o — ATS keyword injection, Harvard-style formatting" },
              { label: "Payments", value: "Stripe webhooks with HMAC-SHA256 — freemium + credit packs" },
              { label: "Auth", value: "Clerk OAuth — Google, GitHub, email" },
              { label: "Processing", value: "Serverless buffer-based PDF/DOCX parsing, no filesystem" },
              { label: "Prompt versioning", value: "Atomic AI updates via SQL — no redeploy required" },
            ].map((item) => (
              <motion.div
                key={item.label}
                variants={prefersReducedMotion ? undefined : staggerItem}
                className="flex gap-4 p-4 bg-neutral-800/40 border border-neutral-700"
              >
                <div>
                  <span className="text-xs font-mono text-primary uppercase tracking-wider block mb-1">{item.label}</span>
                  <span className="text-sm text-neutral-300">{item.value}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════
          INSIGHTS / BLOG SECTION
          ═══════════════════════════════════════════════════════ */}
      <motion.section 
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={viewportConfig}
        variants={sectionVariants}
        className="py-24 md:py-32 px-6 bg-muted/30 relative"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            title="INSIGHTS" 
            subtitle="Technical articles and thoughts on software engineering, security, and best practices."
          />
          
          <motion.div 
            variants={prefersReducedMotion ? undefined : staggerContainer}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnceConfig}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {latestPosts.map((post) => (
              <motion.article 
                key={post.id}
                variants={prefersReducedMotion ? undefined : staggerItem}
                className="group border border-border bg-card p-6 transition-all duration-300"
                data-testid={`card-post-${post.id}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono text-muted-foreground">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                  </span>
                  <div className="w-2 h-2 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                <Link href={`/posts/${post.slug}`} className="block" data-testid={`link-post-${post.slug}`}>
                  <h3 className="text-xl font-display font-medium mb-3 transition-opacity duration-200 group-hover:opacity-70">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                  {post.summary || post.content.substring(0, 100) + "..."}
                </p>
                <div className="mt-4 h-px bg-border w-0 group-hover:w-full transition-all duration-300" />
              </motion.article>
            ))}
          </motion.div>

          <motion.div 
            variants={prefersReducedMotion ? undefined : fadeUpStaggerVariants}
            custom={4}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnceConfig}
            className="mt-12 text-center md:text-left"
          >
            <Link 
              href="/posts" 
              className="inline-flex items-center gap-2 text-foreground font-medium transition-opacity duration-200 hover:opacity-70"
              data-testid="link-all-posts"
            >
              View All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════
          CONTACT CTA
          ═══════════════════════════════════════════════════════ */}
      <motion.section 
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={viewportConfig}
        variants={sectionVariants}
        className="py-24 md:py-32 px-6 relative"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-display font-medium mb-6">
            Let's Build Something Together
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
            Open to senior platform, infrastructure, or ML engineer roles. Also available for fractional technical leadership and architecture consulting.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background font-medium text-sm transition-opacity duration-200 hover:opacity-80"
              data-testid="link-contact-cta"
            >
              Get In Touch <Mail className="w-4 h-4" />
            </Link>
            <a 
              href="https://github.com/datadave22"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-4 border border-border text-foreground font-medium text-sm transition-colors duration-200 hover:border-foreground"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
