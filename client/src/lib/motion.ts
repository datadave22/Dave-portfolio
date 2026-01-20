import { Variants, Transition } from "framer-motion";

// ═══════════════════════════════════════════════════════
// MOTION TOKENS (MANDATORY)
// ═══════════════════════════════════════════════════════

export const easing = {
  standard: [0.4, 0.0, 0.2, 1] as const,
  exit: [0.4, 0.0, 1, 1] as const,
};

export const duration = {
  fast: 0.3,
  standard: 0.6,
  slow: 0.9,
};

export const distance = {
  small: 24,
  medium: 48,
  large: 72,
};

// ═══════════════════════════════════════════════════════
// SECTION VARIANTS
// Entry: Y +48px, opacity 0, scale 0.98
// Active: Y 0, opacity 1, scale 1
// Exit: Y -24px, opacity 0, scale 0.98
// ═══════════════════════════════════════════════════════

export const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: distance.medium,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: duration.slow,
      ease: easing.standard,
    },
  },
  exit: {
    opacity: 0,
    y: -distance.small,
    scale: 0.98,
    transition: {
      duration: duration.standard,
      ease: easing.exit,
    },
  },
};

// ═══════════════════════════════════════════════════════
// GEOMETRY VARIANTS
// For abstract geometric elements (lines, planes, blocks)
// ═══════════════════════════════════════════════════════

export const horizontalLineVariants: Variants = {
  hidden: {
    scaleX: 0,
    opacity: 0,
  },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: duration.slow,
      ease: easing.standard,
    },
  },
};

export const verticalLineVariants: Variants = {
  hidden: {
    scaleY: 0,
    opacity: 0,
  },
  visible: {
    scaleY: 1,
    opacity: 1,
    transition: {
      duration: duration.slow,
      ease: easing.standard,
    },
  },
};

export const planeSlideVariants: Variants = {
  hidden: {
    x: -distance.large,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: duration.slow,
      ease: easing.standard,
    },
  },
};

export const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: distance.medium,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.standard,
      ease: easing.standard,
    },
  },
};

export const fadeUpStaggerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: distance.small,
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.standard,
      ease: easing.standard,
      delay: i * 0.1,
    },
  }),
};

// ═══════════════════════════════════════════════════════
// HERO-SPECIFIC VARIANTS
// Geometry loads first, text fades in second
// ═══════════════════════════════════════════════════════

export const heroGeometryVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.slow,
      ease: easing.standard,
    },
  },
};

export const heroTextVariants: Variants = {
  hidden: {
    opacity: 0,
    y: distance.medium,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.slow,
      ease: easing.standard,
      delay: 0.3, // Text comes after geometry
    },
  },
};

// ═══════════════════════════════════════════════════════
// HOVER TRANSITIONS
// Minimal: 1-2px translate OR slight opacity shift
// Duration: 150-200ms
// ═══════════════════════════════════════════════════════

export const hoverTransition: Transition = {
  duration: 0.2,
  ease: easing.standard,
};

export const hoverVariants: Variants = {
  initial: {
    y: 0,
    opacity: 1,
  },
  hover: {
    y: -2,
    transition: hoverTransition,
  },
};

// ═══════════════════════════════════════════════════════
// VIEWPORT CONFIG
// For whileInView animations
// ═══════════════════════════════════════════════════════

export const viewportConfig = {
  once: false,
  amount: 0.3,
  margin: "-50px",
};

export const viewportOnceConfig = {
  once: true,
  amount: 0.3,
};

// ═══════════════════════════════════════════════════════
// STAGGER CONTAINER
// For staggered child animations
// ═══════════════════════════════════════════════════════

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: distance.small,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.standard,
      ease: easing.standard,
    },
  },
};
