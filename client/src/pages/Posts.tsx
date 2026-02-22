import { useState } from "react";
import { usePosts } from "@/hooks/use-content";
import { SectionHeader } from "@/components/SectionHeader";
import { PostModal } from "@/components/PostModal";
import { motion } from "framer-motion";
import { type Post } from "@shared/schema";
import { staggerContainer, staggerItem } from "@/lib/motion";

export default function Posts() {
  const { data: posts, isLoading } = usePosts();
  const [selected, setSelected] = useState<Post | null>(null);

  return (
    <div className="min-h-screen pt-32 px-6 pb-20">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          title="INSIGHTS"
          subtitle="Technical articles on platform engineering, architecture decisions, and real production trade-offs."
          className="mb-16"
        />

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 w-full bg-muted/30 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {posts?.map((post) => (
              <motion.article
                key={post.id}
                variants={staggerItem}
                onClick={() => setSelected(post)}
                className="group relative border border-border bg-card p-8 cursor-pointer transition-all duration-300 hover:border-primary/40"
                data-testid={`card-post-${post.id}`}
              >
                {/* Top row: date + tags */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <span className="text-xs font-mono text-muted-foreground">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                      : "Draft"}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {post.tags?.map((tag) => (
                      <span key={tag} className="text-xs font-mono text-primary">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-3 transition-opacity duration-200 group-hover:opacity-70">
                  {post.title}
                </h2>

                {/* Summary */}
                <p className="text-muted-foreground leading-relaxed max-w-3xl text-sm md:text-base">
                  {post.summary || post.content.substring(0, 160) + "..."}
                </p>

                {/* Read indicator */}
                <div className="mt-6 flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors duration-200">
                    Read Article
                  </span>
                  <div className="h-px bg-border w-8 group-hover:w-16 group-hover:bg-primary transition-all duration-300" />
                </div>

                {/* Bottom border sweep */}
                <div className="absolute bottom-0 left-0 h-px bg-primary w-0 group-hover:w-full transition-all duration-500" style={{ transitionTimingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)" }} />
              </motion.article>
            ))}
          </motion.div>
        )}

        {posts?.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            No articles published yet. Check back soon.
          </div>
        )}
      </div>

      <PostModal post={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
