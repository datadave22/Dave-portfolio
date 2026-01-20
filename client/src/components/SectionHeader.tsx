import { motion, useReducedMotion } from "framer-motion";
import { horizontalLineVariants, fadeUpStaggerVariants, viewportOnceConfig, duration, easing } from "@/lib/motion";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ title, subtitle, className = "" }: SectionHeaderProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`mb-16 md:mb-24 ${className}`}>
      <motion.div
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={viewportOnceConfig}
      >
        {/* Horizontal line - extends on entry */}
        <motion.span 
          variants={horizontalLineVariants}
          className="block w-12 h-[2px] bg-primary mb-6 origin-left" 
        />
        
        <motion.h2 
          variants={fadeUpStaggerVariants}
          custom={0}
          className="text-4xl md:text-5xl font-display font-medium tracking-tight text-foreground mb-4"
        >
          {title}
        </motion.h2>
        
        {subtitle && (
          <motion.p 
            variants={fadeUpStaggerVariants}
            custom={1}
            className="text-muted-foreground text-lg max-w-lg leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
