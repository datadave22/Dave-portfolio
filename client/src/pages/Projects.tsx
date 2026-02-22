import { useState } from "react";
import { useProjects } from "@/hooks/use-content";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectModal } from "@/components/ProjectModal";
import { SectionHeader } from "@/components/SectionHeader";
import { type Project } from "@shared/schema";

export default function Projects() {
  const { data: projects, isLoading } = useProjects();
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <div className="min-h-screen pt-32 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="WORK ARCHIVE"
          subtitle="A comprehensive list of selected commercial and personal projects. Click any project for full details."
          className="mb-16"
        />

        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 w-full bg-muted/30 animate-pulse" />
              ))}
            </div>
          ) : (
            projects?.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onClick={setSelected}
              />
            ))
          )}
        </div>

        {projects?.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            No projects found. Check back later.
          </div>
        )}
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
