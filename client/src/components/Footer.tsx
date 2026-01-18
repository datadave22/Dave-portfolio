import { Link } from "wouter";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h3 className="text-lg font-display font-bold tracking-tight mb-2">
            DESIGN<span className="text-muted-foreground">ENGINEER</span>
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Crafting digital experiences with precision and purpose.
            Based in the cloud, available worldwide.
          </p>
        </div>

        <div className="flex gap-8 text-sm">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            GitHub
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            Twitter
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            LinkedIn
          </a>
        </div>

        <div className="text-xs text-muted-foreground">
          © {currentYear} All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
