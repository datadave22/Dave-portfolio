import { db } from "./db";
import {
  messages,
  type Post,
  type Project,
  type Message, type InsertMessage
} from "@shared/schema";
import { POSTS, PROJECTS } from "@shared/content";

export interface IStorage {
  // Posts
  getPosts(): Promise<Post[]>;
  getPost(slug: string): Promise<Post | undefined>;

  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;

  // Messages (null when no database is configured)
  createMessage(message: InsertMessage): Promise<Message | null>;
}

export class ContentStorage implements IStorage {
  async getPosts(): Promise<Post[]> {
    return POSTS.filter(p => p.status === "published");
  }

  async getPost(slug: string): Promise<Post | undefined> {
    return POSTS.find(p => p.slug === slug && p.status === "published");
  }

  async getProjects(): Promise<Project[]> {
    return [...PROJECTS].sort((a, b) => a.order - b.order);
  }

  async getProject(id: number): Promise<Project | undefined> {
    return PROJECTS.find(p => p.id === id);
  }

  async createMessage(message: InsertMessage): Promise<Message | null> {
    if (!db) return null;
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }
}

export const storage = new ContentStorage();
