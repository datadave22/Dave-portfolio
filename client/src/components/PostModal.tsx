import { type Post } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

interface PostModalProps {
  post: Post | null;
  onClose: () => void;
}

function renderContent(content: string) {
  // Split on markdown headings and blank lines, render with basic structure
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("## ")) {
      elements.push(
        <h3 key={key++} className="text-xl font-display font-medium mt-8 mb-3 text-foreground">
          {line.slice(3)}
        </h3>
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <h2 key={key++} className="text-2xl font-display font-medium mt-10 mb-4 text-foreground">
          {line.slice(2)}
        </h2>
      );
    } else if (line.startsWith("```")) {
      // collect code block
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={key++} className="my-4 p-4 bg-muted border border-border overflow-x-auto text-xs font-mono leading-relaxed text-muted-foreground">
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
    } else if (line.trim() === "") {
      // blank line — spacing handled by parent
    } else {
      // Regular paragraph — handle inline backtick code
      const parts = line.split(/(`[^`]+`)/g);
      const rendered = parts.map((part, pi) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={pi} className="px-1.5 py-0.5 bg-muted font-mono text-xs text-primary rounded-sm">{part.slice(1, -1)}</code>;
        }
        return part;
      });
      elements.push(
        <p key={key++} className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base">
          {rendered}
        </p>
      );
    }
  }
  return elements;
}

export function PostModal({ post, onClose }: PostModalProps) {
  useEffect(() => {
    if (!post) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [post, onClose]);

  return (
    <AnimatePresence>
      {post && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          <motion.div
            key="panel"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:top-12 md:bottom-12 w-full md:w-[780px] bg-card border border-border z-50 overflow-y-auto rounded-t-lg md:rounded-none"
          >
            {/* Sticky header */}
            <div className="sticky top-0 bg-card border-b border-border px-8 py-5 flex items-start justify-between gap-4 z-10">
              <div className="flex flex-wrap gap-2">
                {post.tags?.map((tag) => (
                  <span key={tag} className="text-xs font-mono text-primary">#{tag}</span>
                ))}
              </div>
              <button
                onClick={onClose}
                className="p-2 border border-border/50 hover:border-foreground transition-colors flex-shrink-0"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-8 py-10">
              {/* Meta */}
              <span className="text-xs font-mono text-muted-foreground block mb-4">
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Draft"}
              </span>

              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-display font-medium tracking-tight leading-tight mb-8">
                {post.title}
              </h2>

              {/* Divider */}
              <div className="w-full h-px bg-border mb-8" />

              {/* Content */}
              <div className="relative pl-6 border-l-2 border-border">
                <div className="absolute -left-[5px] top-0 w-2 h-2 bg-primary" />
                {renderContent(post.content)}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
