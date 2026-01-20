import { usePosts, useProjects } from "@/hooks/use-content";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeader } from "@/components/SectionHeader";
import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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

  return (
    <div className="min-h-screen">
      {/* ═══════════════════════════════════════════════════════
          HERO SECTION
          Geometry loads first, text fades in second
          Entry-based transitions only - no continuous parallax
          ═══════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col justify-center px-6 relative overflow-hidden">
        {/* Geometric Background Elements - Structural, not decorative */}
        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          animate="visible"
          variants={heroGeometryVariants}
          className="absolute inset-0 pointer-events-none"
        >
          {/* Primary geometric plane - muted warm gray */}
          <div className="absolute top-[15%] right-[10%] w-[35vw] h-[45vh] bg-muted/40" />
          
          {/* Horizontal structural line */}
          <motion.div 
            variants={prefersReducedMotion ? undefined : horizontalLineVariants}
            className="absolute top-1/3 left-0 w-[60%] h-px bg-border origin-left"
          />
          
          {/* Vertical accent line */}
          <div className="absolute top-[20%] right-[30%] w-px h-[40vh] bg-primary/20" />
          
          {/* Grid structural element - fixed opacity, no randomization */}
          <div className="absolute bottom-[10%] left-[5%] w-32 h-32 grid grid-cols-4 grid-rows-4 gap-px opacity-30">
            {Array(16).fill(0).map((_, i) => (
              <div key={i} className="bg-muted-foreground/10" />
            ))}
          </div>
          
          {/* Circle accent - used sparingly */}
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
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-medium tracking-tighter leading-[0.9] text-balance mb-8">
              DIGITAL<br />
              <span className="text-muted-foreground">ARCHITECT</span>
            </h1>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : "hidden"}
            animate="visible"
            variants={heroTextVariants}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12"
          >
            <div className="md:col-span-5 md:col-start-8">
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
                Building refined digital experiences with a focus on structural elegance and user-centric functionality.
              </p>
              
              <div className="mt-8 flex gap-6 items-center">
                <Link 
                  href="/projects" 
                  className="inline-flex items-center gap-2 text-foreground font-medium transition-opacity duration-200 hover:opacity-70"
                  data-testid="link-view-works"
                >
                  View Selected Works <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center gap-2 text-muted-foreground transition-opacity duration-200 hover:opacity-70"
                  data-testid="link-contact-hero"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
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
          WORK SECTION
          Section-based scroll choreography
          ═══════════════════════════════════════════════════════ */}
      <motion.section 
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={viewportConfig}
        variants={sectionVariants}
        className="py-24 md:py-32 px-6 relative"
      >
        {/* Geometric anchor - horizontal line extends on entry */}
        <motion.div 
          variants={prefersReducedMotion ? undefined : horizontalLineVariants}
          className="absolute top-24 left-0 w-1/4 h-px bg-primary/30 origin-left"
        />
        
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            title="SELECTED WORKS" 
            subtitle="A curation of projects that define my approach to digital problem solving."
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
          PHILOSOPHY / ABOUT SECTION
          Inverted colors, editorial spread layout
          ═══════════════════════════════════════════════════════ */}
      <motion.section 
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={viewportConfig}
        variants={sectionVariants}
        className="py-24 bg-foreground text-background px-6 relative overflow-hidden"
      >
        {/* Geometric backdrop - rectangular plane with entry animation */}
        <motion.div 
          initial={prefersReducedMotion ? false : { x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 0.1 }}
          transition={{ duration: duration.slow, ease: [0.4, 0.0, 0.2, 1] }}
          viewport={viewportOnceConfig}
          className="absolute top-0 left-0 w-1/3 h-full bg-background/10"
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
              Philosophy
            </motion.span>
            <motion.h2 
              variants={prefersReducedMotion ? undefined : staggerItem}
              className="text-4xl md:text-5xl font-display leading-tight mb-8"
            >
              Design is not just what it looks like and feels like. Design is how it works.
            </motion.h2>
            <motion.p 
              variants={prefersReducedMotion ? undefined : staggerItem}
              className="text-neutral-400 text-lg leading-relaxed mb-6"
            >
              I believe in subtracting the obvious and adding the meaningful. Every pixel should serve a purpose, every interaction should feel inevitable.
            </motion.p>
            <motion.div 
              variants={prefersReducedMotion ? undefined : staggerItem}
              className="grid grid-cols-2 gap-8 mt-12"
            >
              <div>
                <h4 className="text-3xl font-display mb-2">5+</h4>
                <p className="text-sm text-neutral-500">Years Experience</p>
              </div>
              <div>
                <h4 className="text-3xl font-display mb-2">50+</h4>
                <p className="text-sm text-neutral-500">Projects Delivered</p>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Geometric representation - deterministic stagger, no randomization */}
          <motion.div 
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: duration.slow, ease: [0.4, 0.0, 0.2, 1] }}
            viewport={viewportOnceConfig}
            className="relative aspect-square md:aspect-[4/5] bg-neutral-800 overflow-hidden"
          >
            {/* Abstract grid structure - fixed stagger pattern, no randomization */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-px">
              {Array(64).fill(0).map((_, i) => {
                const row = Math.floor(i / 8);
                const col = i % 8;
                const opacityValue = 0.1 + ((row + col) % 5) * 0.04;
                return (
                  <div 
                    key={i} 
                    className="bg-neutral-600"
                    style={{ opacity: opacityValue }}
                  />
                );
              })}
            </div>
            
            {/* Overlapping geometric forms */}
            <div className="absolute top-8 left-8 w-1/2 h-1/2 border border-neutral-600" />
            <div className="absolute bottom-8 right-8 w-1/3 h-1/3 bg-primary/20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-neutral-500" />
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════
          INSIGHTS / BLOG SECTION
          Clean cards with staggered entry
          ═══════════════════════════════════════════════════════ */}
      <motion.section 
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={viewportConfig}
        variants={sectionVariants}
        className="py-24 md:py-32 px-6 relative"
      >
        {/* Geometric anchor */}
        <motion.div 
          variants={prefersReducedMotion ? undefined : horizontalLineVariants}
          className="absolute top-24 right-0 w-1/3 h-px bg-border origin-right"
        />
        
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            title="INSIGHTS" 
            subtitle="Thoughts on technology, design systems, and the future of the web."
          />
          
          <motion.div 
            variants={prefersReducedMotion ? undefined : staggerContainer}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnceConfig}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {latestPosts.map((post, i) => (
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
                
                {/* Subtle line that extends on hover */}
                <div className="mt-4 h-px bg-border w-0 group-hover:w-full transition-all duration-300" />
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
