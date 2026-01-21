import { Link } from "wouter";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h3 className="text-lg font-display font-bold tracking-tight mb-2">
            DAVID J.<span className="text-muted-foreground"> JOHNSON</span>
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Building secure software systems and delivering measurable business impact.
          </p>
        </div>

        <div className="flex gap-8 text-sm">
          <a 
            href="https://github.com/datadave22" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-testid="link-footer-github"
          >
            GitHub
          </a>
          <Link 
            href="/projects" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Projects
          </Link>
          <Link 
            href="/contact" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </Link>
        </div>

        <div className="text-xs text-muted-foreground">
          © {currentYear} David J. Johnson. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
