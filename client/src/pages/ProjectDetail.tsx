import { useProject } from "@/hooks/use-content";
import { useRoute, Link } from "wouter";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:id");
  const id = params ? parseInt(params.id) : 0;
  const { data: project, isLoading } = useProject(id);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 px-6 flex justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-32 px-6 text-center">
        <h1 className="text-4xl font-display mb-4">Project Not Found</h1>
        <Link href="/projects" className="text-primary hover:underline">Back to Projects</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Work
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-border/60 pb-8">
            <div>
              <span className="text-primary font-mono text-xs uppercase tracking-wider mb-2 block">
                {project.year} — {project.role}
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-medium tracking-tight text-balance">
                {project.name}
              </h1>
            </div>

            {project.link && (
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors"
              >
                Visit Site <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-8 space-y-8">
              {project.imageUrl && (
                <div className="aspect-video bg-muted overflow-hidden">
                  <img 
                    src={project.imageUrl} 
                    alt={project.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="prose prose-neutral max-w-none text-foreground leading-relaxed">
                <p className="whitespace-pre-line text-lg text-muted-foreground">{project.description}</p>
              </div>
            </div>

            <div className="md:col-span-4 space-y-12">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-border pb-2">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack?.map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-muted/50 text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-border pb-2">My Role</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Responsible for end-to-end development, from initial architectural decisions to final deployment and optimization.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
