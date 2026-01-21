import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMessageSchema } from "@shared/schema";
import { type InsertMessage } from "@shared/schema";
import { useSendMessage } from "@/hooks/use-content";
import { useToast } from "@/hooks/use-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { motion } from "framer-motion";
import { Loader2, FileText, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export default function Contact() {
  const { toast } = useToast();
  const mutation = useSendMessage();

  const form = useForm<InsertMessage>({
    resolver: zodResolver(insertMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: InsertMessage) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Message Sent",
          description: "Thank you for reaching out. I'll respond shortly.",
        });
        form.reset();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
        <div>
          <SectionHeader 
            title="GET IN TOUCH" 
            subtitle="Available for engineering roles and technical consultation."
            className="mb-12"
          />
          
          <div className="space-y-8 text-lg text-muted-foreground">
            <p>
              Interested in collaboration, engineering roles, or technical consultation? 
              Feel free to reach out — I respond promptly.
            </p>
            <div>
              <h4 className="text-foreground font-display font-medium mb-2">Resume</h4>
              <Link 
                href="/resume"
                className="inline-flex items-center gap-2 hover:text-primary transition-colors"
                data-testid="link-resume-contact"
              >
                <FileText className="w-4 h-4" /> View my resume for detailed experience
              </Link>
            </div>
            <div>
              <h4 className="text-foreground font-display font-medium mb-2">GitHub</h4>
              <a 
                href="https://github.com/datadave22" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-primary transition-colors"
                data-testid="link-github-contact"
              >
                <ExternalLink className="w-4 h-4" /> github.com/datadave22
              </a>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border p-8 md:p-10 shadow-sm"
        >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium tracking-wide uppercase">Name</label>
              <input
                {...form.register("name")}
                id="name"
                className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                placeholder="Your name"
                data-testid="input-name"
              />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium tracking-wide uppercase">Email</label>
              <input
                {...form.register("email")}
                id="email"
                type="email"
                className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                placeholder="your@email.com"
                data-testid="input-email"
              />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium tracking-wide uppercase">Message</label>
              <textarea
                {...form.register("message")}
                id="message"
                rows={5}
                className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50 resize-none"
                placeholder="Tell me about your project or opportunity..."
                data-testid="input-message"
              />
              {form.formState.errors.message && (
                <p className="text-xs text-destructive">{form.formState.errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-foreground text-background font-medium py-4 px-6 hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              data-testid="button-submit"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
