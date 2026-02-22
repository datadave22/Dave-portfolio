import { type Project } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ArrowUpRight } from "lucide-react";
import { useEffect } from "react";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel — slides in from right */}
          <motion.div
            key="panel"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-card border-l border-border z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-card border-b border-border px-8 py-5 flex items-center justify-between z-10">
              <span className="text-xs font-mono text-primary uppercase tracking-widest">
                {project.year} — {project.role}
              </span>
              <button
                onClick={onClose}
                className="p-2 border border-border/50 hover:border-foreground transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-8 py-10 space-y-10">
              {/* Title */}
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-medium tracking-tight leading-tight">
                  {project.name}
                </h2>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-mono text-primary uppercase tracking-widest mb-4">Overview</p>
                <p className="text-muted-foreground leading-relaxed text-base">{project.description}</p>
              </div>

              {/* Impact box */}
              <div className="p-4 bg-primary/5 border border-primary/20">
                <p className="text-xs font-mono text-primary uppercase tracking-wider mb-2">Role</p>
                <p className="text-sm leading-relaxed">{project.role}</p>
              </div>

              {/* Tech Stack */}
              <div>
                <p className="text-xs font-mono text-primary uppercase tracking-widest mb-4">Tech Stack</p>
                <div className="flex flex-wrap gap-2">
                  {project.techStack?.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 bg-muted text-[11px] uppercase tracking-wider font-medium text-muted-foreground border border-border/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* External link */}
              {project.link && (
                <div className="pt-4 border-t border-border">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-medium text-sm transition-opacity hover:opacity-80"
                  >
                    View Project <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
