import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Posts
  app.get(api.posts.list.path, async (req, res) => {
    const posts = await storage.getPosts();
    res.json(posts);
  });

  app.get(api.posts.get.path, async (req, res) => {
    const post = await storage.getPost(req.params.slug);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  });

  // Projects
  app.get(api.projects.list.path, async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get(api.projects.get.path, async (req, res) => {
    const project = await storage.getProject(Number(req.params.id));
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  });

  // Contact
  app.post(api.contact.submit.path, async (req, res) => {
    try {
      const input = api.contact.submit.input.parse(req.body);
      await storage.createMessage(input);
      res.json({ success: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingPosts = await storage.getPosts();
  if (existingPosts.length === 0) {
    await storage.createPost({
      title: "The Art of Subtraction",
      slug: "art-of-subtraction",
      content: "Good design is as much about what you leave out as what you put in. In a world of infinite possibilities, restraint is the ultimate skill.",
      status: "published",
      tags: ["Design", "Philosophy"],
      summary: "Exploring the power of minimalism in complex systems."
    });
    await storage.createPost({
      title: "Systemic Thinking in UI",
      slug: "systemic-thinking",
      content: "Interfaces are not static pages; they are living systems. Understanding the relationships between components is crucial for scalability.",
      status: "published",
      tags: ["Engineering", "Systems"],
      summary: "How to build scalable UI architectures that last."
    });
    await storage.createPost({
      title: "Motion as Meaning",
      slug: "motion-as-meaning",
      content: "Animation should never be decorative. It must serve a purpose: to guide, to inform, or to delight with intent.",
      status: "published",
      tags: ["Motion", "UX"],
      summary: "Defining the role of animation in modern digital products."
    });
  }

  const existingProjects = await storage.getProjects();
  if (existingProjects.length === 0) {
    await storage.createProject({
      name: "Helios Financial",
      description: "A next-generation banking interface designed for high-net-worth individuals. Focused on data visualization and security.",
      role: "Lead Product Designer",
      techStack: ["React", "D3.js", "Node.js"],
      featured: true,
      year: "2023"
    });
    await storage.createProject({
      name: "Nexus OS",
      description: "An open-source operating system concept for distributed computing. Built with a focus on modularity and performance.",
      role: "System Architect",
      techStack: ["Rust", "WebAssembly", "C++"],
      featured: true,
      year: "2024"
    });
    await storage.createProject({
      name: "Aura Smart Home",
      description: "IoT dashboard and mobile application for controlling smart home devices with intuitive gestures.",
      role: "UX Engineer",
      techStack: ["React Native", "GraphQL", "IoT"],
      featured: false,
      year: "2022"
    });
  }
}
