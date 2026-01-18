import { usePosts, useProjects } from "@/hooks/use-content";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeader } from "@/components/SectionHeader";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, MoveDown } from "lucide-react";

export default function Home() {
  const { data: posts } = usePosts();
  const { data: projects, isLoading: isProjectsLoading } = useProjects();

  // Filter featured projects or take first 3
  const featuredProjects = projects?.filter(p => p.featured).slice(0, 3) || projects?.slice(0, 3) || [];
  const latestPosts = posts?.slice(0, 3) || [];

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col justify-center px-6 relative overflow-hidden">
        {/* Abstract geometric background elements */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-muted/30 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-muted/20 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3" />

        <div className="max-w-7xl mx-auto w-full pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-medium tracking-tighter leading-[0.9] text-balance mb-8">
              DIGITAL<br />
              <span className="text-muted-foreground">ARCHITECT</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12"
          >
            <div className="md:col-span-5 md:col-start-8">
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
                Building refined digital experiences with a focus on structural elegance and user-centric functionality.
              </p>
              
              <div className="mt-8 flex gap-6 items-center">
                <Link href="/projects" className="inline-flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors">
                  View Selected Works <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  Get in Touch
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-6 md:left-12 flex items-center gap-4 text-xs font-mono text-muted-foreground"
        >
          <MoveDown className="w-4 h-4 animate-bounce" />
          SCROLL TO EXPLORE
        </motion.div>
      </section>

      {/* WORK SECTION */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            title="SELECTED WORKS" 
            subtitle="A curation of projects that define my approach to digital problem solving."
          />
          
          <div className="space-y-4">
            {isProjectsLoading ? (
              // Skeleton loading
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-48 w-full bg-muted/50 animate-pulse rounded-none mb-8" />
              ))
            ) : (
              featuredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))
            )}
          </div>

          <div className="mt-16 text-center md:text-left">
            <Link href="/projects" className="inline-block py-4 px-8 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-all duration-300 font-medium tracking-wide text-sm uppercase">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY / ABOUT SECTION */}
      <section className="py-24 bg-foreground text-background px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-primary text-xs font-mono mb-4 block uppercase tracking-widest">Philosophy</span>
            <h2 className="text-4xl md:text-5xl font-display leading-tight mb-8">
              Design is not just what it looks like and feels like. Design is how it works.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              I believe in subtracting the obvious and adding the meaningful. Every pixel should serve a purpose, every interaction should feel inevitable.
            </p>
            <div className="grid grid-cols-2 gap-8 mt-12">
              <div>
                <h4 className="text-3xl font-display mb-2">5+</h4>
                <p className="text-sm text-muted-foreground">Years Experience</p>
              </div>
              <div>
                <h4 className="text-3xl font-display mb-2">50+</h4>
                <p className="text-sm text-muted-foreground">Projects Delivered</p>
              </div>
            </div>
          </div>
          
          <div className="relative aspect-square md:aspect-[4/5] bg-neutral-800 overflow-hidden">
            {/* Abstract representation of code/structure */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-px opacity-20">
              {Array(36).fill(0).map((_, i) => (
                <div key={i} className="bg-neutral-700" />
              ))}
            </div>
            {/* Unsplash image representing abstract architecture */}
            {/* architecture concrete minimalist building */}
            <img 
              src="https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=1000" 
              alt="Architectural detail" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
            />
          </div>
        </div>
      </section>

      {/* INSIGHTS / BLOG SECTION */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            title="INSIGHTS" 
            subtitle="Thoughts on technology, design systems, and the future of the web."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestPosts.map((post, i) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group border border-border bg-card p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono text-muted-foreground">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <Link href={`/posts/${post.slug}`} className="block">
                  <h3 className="text-xl font-display font-medium mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                  {post.summary || post.content.substring(0, 100) + "..."}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
