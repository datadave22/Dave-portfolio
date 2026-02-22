import { usePosts } from "@/hooks/use-content";
import { SectionHeader } from "@/components/SectionHeader";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Posts() {
  const { data: posts, isLoading } = usePosts();

  return (
    <div className="min-h-screen pt-32 px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <SectionHeader 
          title="WRITING"
          subtitle="Technical articles on platform engineering, scale decisions, and systems thinking."
          className="mb-16"
        />

        <div className="space-y-12">
          {isLoading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 w-full bg-muted/30 animate-pulse" />
              ))}
            </div>
          ) : (
            posts?.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group border-l-2 border-border pl-6 hover:border-primary transition-colors duration-300"
              >
                <div className="text-xs font-mono text-muted-foreground mb-2">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                </div>
                <Link href={`/posts/${post.slug}`} className="block">
                  <h2 className="text-2xl font-display font-medium mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-muted-foreground leading-relaxed max-w-2xl">
                  {post.summary || post.content.substring(0, 150) + "..."}
                </p>
                <Link href={`/posts/${post.slug}`} className="inline-block mt-4 text-sm font-medium underline underline-offset-4 decoration-border group-hover:decoration-primary transition-all">
                  Read Article
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
