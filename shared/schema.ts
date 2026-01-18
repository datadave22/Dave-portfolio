import { pgTable, text, serial, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Blog / Updates
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  publishedAt: timestamp("published_at").defaultNow(),
  status: text("status", { enum: ["draft", "published"] }).default("draft").notNull(),
  tags: text("tags").array(),
  summary: text("summary"), // For list views
});

// Projects / Work
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  role: text("role").notNull(),
  techStack: text("tech_stack").array(),
  featured: boolean("featured").default(false),
  link: text("link"),
  imageUrl: text("image_url"),
  year: text("year"), // e.g. "2024"
  order: serial("order"), // For manual ordering if needed
});

// Contact Messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod Schemas
export const insertPostSchema = createInsertSchema(posts).omit({ id: true, publishedAt: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, order: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });

// Types
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
