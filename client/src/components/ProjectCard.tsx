import { type Project } from "@shared/schema";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative border-t border-border/60 py-12 first:border-t-0"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Year / Role Meta */}
        <div className="md:col-span-3 flex flex-col justify-between h-full">
          <div className="space-y-1">
            <span className="text-xs font-mono text-muted-foreground block">{project.year}</span>
            <span className="text-sm font-medium text-primary">{project.role}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-6 space-y-4">
          <Link href={`/projects/${project.id}`} className="block group-hover:opacity-70 transition-opacity">
            <h3 className="text-3xl font-display font-medium tracking-tight">
              {project.name}
            </h3>
          </Link>
          <p className="text-muted-foreground leading-relaxed max-w-xl">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {project.techStack?.map((tech) => (
              <span key={tech} className="px-2 py-1 bg-muted text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action */}
        <div className="md:col-span-3 flex justify-end items-start">
          <Link href={`/projects/${project.id}`} className="p-3 rounded-full border border-border/50 hover:bg-foreground hover:text-background transition-all duration-300">
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
