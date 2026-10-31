import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { getResendClient } from "./resend";

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
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const post = await storage.getPost(slug);
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
      try {
        await storage.createMessage(input);
      } catch (dbError) {
        console.error('Failed to store contact message:', dbError);
      }

      if (!process.env.RESEND_API_KEY) {
        return res.status(503).json({
          message: 'The contact form is temporarily unavailable. Please email datadavejohnson@gmail.com directly.',
        });
      }

      try {
        const { client, fromEmail } = await getResendClient();
        const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'full', timeStyle: 'short' });
        await client.emails.send({
          from: fromEmail,
          to: 'd86272796+portfolio@gmail.com',
          replyTo: input.email,
          subject: `[davejohnson.io] New contact from ${input.name}`,
          html: `
            <!DOCTYPE html>
            <html>
            <body style="font-family: 'Courier New', monospace; background: #0a0a0a; color: #e5e5e5; padding: 40px; max-width: 600px; margin: 0 auto;">
              <div style="border-left: 3px solid #22c55e; padding-left: 20px; margin-bottom: 32px;">
                <p style="color: #22c55e; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; margin: 0 0 4px;">Source</p>
                <p style="font-size: 18px; font-weight: 600; margin: 0;">davejohnson.io/contact</p>
                <p style="color: #737373; font-size: 12px; margin: 4px 0 0;">${timestamp}</p>
              </div>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #262626; color: #737373; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; width: 80px;">From</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #262626; font-size: 15px;">${input.name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #262626; color: #737373; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Reply To</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #262626; font-size: 15px;"><a href="mailto:${input.email}" style="color: #22c55e; text-decoration: none;">${input.email}</a></td>
                </tr>
              </table>
              <div style="margin-bottom: 8px;">
                <p style="color: #737373; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px;">Message</p>
                <div style="background: #111; border: 1px solid #262626; padding: 20px; line-height: 1.7; font-size: 15px; white-space: pre-wrap;">${input.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
              </div>
              <p style="color: #404040; font-size: 11px; margin-top: 32px; border-top: 1px solid #1a1a1a; padding-top: 16px;">
                Hit reply to respond directly to ${input.name} — reply-to is set to their address.
              </p>
            </body>
            </html>
          `
        });
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
      }
      
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


  return httpServer;
}
