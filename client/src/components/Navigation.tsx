import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const links = [
  { href: "/", label: "Overview" },
  { href: "/projects", label: "Work" },
  { href: "/posts", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-xl font-display font-bold tracking-tighter">
          PORTFOLIO<span className="text-primary">.</span>
        </Link>

        <div className="hidden md:flex gap-8">
          {links.map((link) => {
            const isActive = location === link.href;
            return (
              <Link key={link.href} href={link.href} className="relative group py-2">
                <span className={cn(
                  "text-sm font-medium transition-colors duration-200",
                  isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {link.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 w-full h-[1px] bg-foreground"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile menu trigger - placeholder for simplicity, assuming desktop-first request based on "architectural" */}
        <div className="md:hidden">
          <Link href="/contact" className="text-sm font-medium">Menu</Link>
        </div>
      </div>
    </nav>
  );
}
