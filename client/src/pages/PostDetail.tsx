import { usePost } from "@/hooks/use-content";
import { useRoute, Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function PostDetail() {
  const [, params] = useRoute("/posts/:slug");
  const slug = params?.slug || "";
  const { data: post, isLoading } = usePost(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 px-6 flex justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-32 px-6 text-center">
        <h1 className="text-4xl font-display mb-4">Post Not Found</h1>
        <Link href="/posts" className="text-primary hover:underline">Back to Journal</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 px-6 pb-20">
      <article className="max-w-3xl mx-auto">
        <Link href="/posts" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Journal
        </Link>

        <header className="mb-12">
          <div className="flex gap-3 mb-6">
            {post.tags?.map(tag => (
              <span key={tag} className="text-xs font-mono uppercase tracking-wider text-primary bg-primary/5 px-2 py-1 rounded-sm">
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-medium leading-tight mb-6">
            {post.title}
          </h1>
          <time className="text-muted-foreground font-mono text-sm block">
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'Draft'}
          </time>
        </header>

        <div className="prose prose-lg prose-neutral max-w-none prose-headings:font-display prose-headings:font-medium prose-p:text-muted-foreground prose-a:text-primary">
          <p>{post.content}</p>
        </div>
      </article>
    </div>
  );
}
