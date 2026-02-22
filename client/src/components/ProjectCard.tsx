import { type Project } from "@shared/schema";
import { ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick?: (project: Project) => void;
}

export function ProjectCard({ project, index: _index, onClick }: ProjectCardProps) {
  const handleClick = () => onClick?.(project);

  return (
    <div
      className="group relative border-t border-border/60 py-12 first:border-t-0 cursor-pointer"
      data-testid={`card-project-${project.id}`}
      onClick={handleClick}
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
          <h3
            className="text-3xl font-display font-medium tracking-tight transition-opacity duration-200 group-hover:opacity-70"
            data-testid={`link-project-${project.id}`}
          >
            {project.name}
          </h3>
          <p className="text-muted-foreground leading-relaxed max-w-xl">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {project.techStack?.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 bg-muted text-[10px] uppercase tracking-wider font-medium text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action */}
        <div className="md:col-span-3 flex justify-end items-start">
          <span
            className="p-3 border border-border/50 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-foreground"
            data-testid={`button-project-arrow-${project.id}`}
          >
            <ArrowUpRight className="w-5 h-5" />
          </span>
        </div>
      </div>

      {/* Subtle line that extends on hover */}
      <div className="absolute bottom-0 left-0 h-px bg-primary w-0 group-hover:w-full transition-all duration-500" style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)' }} />
    </div>
  );
}
