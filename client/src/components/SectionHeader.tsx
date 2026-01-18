import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ title, subtitle, className = "" }: SectionHeaderProps) {
  return (
    <div className={`mb-16 md:mb-24 ${className}`}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="block w-12 h-[2px] bg-primary mb-6" />
        <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight text-foreground mb-4">
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground text-lg max-w-lg leading-relaxed">
            {subtitle}
          </p>
        )}
      </motion.div>
    </div>
  );
}
