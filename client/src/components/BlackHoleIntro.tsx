import { useEffect, useRef, useState, useCallback } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";

interface Particle {
  x: number;
  y: number;
  z: number;
  r1: number;
  r2: number;
  r3: number;
  theta1: number;
  theta2: number;
  theta3: number;
  rho1: number;
  rho2: number;
  rho3: number;
  speed: number;
  size: number;
  opacity: number;
  hue: number;
  type: "circle" | "line" | "polygon";
}

interface BlackHoleIntroProps {
  onComplete: () => void;
}

export function BlackHoleIntro({ onComplete }: BlackHoleIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const seedRef = useRef<number>(Math.random() * 10000);
  const [isVisible, setIsVisible] = useState(true);
  const hasStartedFadeOut = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  const fadeOut = useCallback(() => {
    if (hasStartedFadeOut.current) return;
    hasStartedFadeOut.current = true;

    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut",
      onComplete: () => {
        setIsVisible(false);
        onComplete();
      },
    });
  }, [onComplete]);

  useEffect(() => {
    if (prefersReducedMotion) {
      const timer = setTimeout(() => fadeOut(), 500);
      return () => clearTimeout(timer);
    }

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    canvas.width = width;
    canvas.height = height;

    const seed = seedRef.current;
    const seededRandom = (offset: number) => {
      const x = Math.sin(seed + offset) * 10000;
      return x - Math.floor(x);
    };

    const goldenRatio = 1.618033988749;
    const isMobile = width < 768;
    const numParticles = isMobile ? 400 : 800;

    const createParticle = (index: number): Particle => {
      const maxRadius = Math.max(width, height) * 0.8;
      
      return {
        x: 0,
        y: 0,
        z: seededRandom(index * 0.1) * 1000,
        r1: 150 + seededRandom(index * 0.2) * maxRadius,
        r2: 150 + seededRandom(index * 0.3) * maxRadius,
        r3: 100 + seededRandom(index * 0.4) * 500,
        theta1: seededRandom(index * 0.5) * Math.PI * 2,
        theta2: seededRandom(index * 0.6) * Math.PI * 2,
        theta3: seededRandom(index * 0.7) * Math.PI * 2,
        rho1: seededRandom(index * 0.8) * Math.PI * 2,
        rho2: seededRandom(index * 0.9) * Math.PI * 2,
        rho3: seededRandom(index * 1.0) * Math.PI * 2,
        speed: 0.0002 + seededRandom(index * 1.1) * 0.0008,
        size: 1 + seededRandom(index * 1.2) * 3,
        opacity: 0.3 + seededRandom(index * 1.3) * 0.7,
        hue: seededRandom(index * 1.4),
        type: ["circle", "line", "polygon"][Math.floor(seededRandom(index * 1.5) * 3)] as Particle["type"],
      };
    };

    particlesRef.current = Array.from({ length: numParticles }, (_, i) => createParticle(i));

    const getColor = (hue: number, opacity: number, zDepth: number) => {
      const normalizedZ = Math.max(0, Math.min(1, zDepth / 1000));
      const adjustedOpacity = opacity * (0.3 + normalizedZ * 0.7);
      
      if (hue < 0.4) {
        const h = 35 + hue * 20;
        return `hsla(${h}, 70%, 55%, ${adjustedOpacity})`;
      } else if (hue < 0.7) {
        const h = 220 + (hue - 0.4) * 60;
        return `hsla(${h}, 40%, 45%, ${adjustedOpacity})`;
      } else {
        const h = 280 + (hue - 0.7) * 40;
        return `hsla(${h}, 30%, 40%, ${adjustedOpacity})`;
      }
    };

    const drawEventHorizon = () => {
      const maxRadius = Math.min(width, height) * 0.35;
      
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, maxRadius
      );
      gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
      gradient.addColorStop(0.15, "rgba(0, 0, 0, 0.98)");
      gradient.addColorStop(0.3, "rgba(10, 10, 15, 0.9)");
      gradient.addColorStop(0.5, "rgba(20, 15, 25, 0.6)");
      gradient.addColorStop(0.7, "rgba(30, 25, 35, 0.3)");
      gradient.addColorStop(0.85, "rgba(20, 20, 25, 0.1)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      const innerRadius = 30;
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fill();

      const t = timeRef.current * 0.0003;
      const glowRadius = innerRadius * 1.8;
      const glowGradient = ctx.createRadialGradient(
        centerX, centerY, innerRadius * 0.9,
        centerX, centerY, glowRadius
      );
      const glowOpacity = 0.08 + Math.sin(t) * 0.03;
      glowGradient.addColorStop(0, `rgba(180, 140, 80, 0)`);
      glowGradient.addColorStop(0.5, `rgba(180, 140, 80, ${glowOpacity})`);
      glowGradient.addColorStop(1, `rgba(180, 140, 80, 0)`);

      ctx.beginPath();
      ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();
    };

    const drawParticle = (p: Particle, t: number) => {
      const pullFactor = 1 - Math.min(1, t * p.speed * 0.5);
      const currentR1 = p.r1 * pullFactor;
      const currentR2 = p.r2 * pullFactor;
      const currentR3 = p.r3 * pullFactor;

      const x = centerX + currentR1 * Math.cos(p.theta1 + p.rho1 + t * p.speed);
      const y = centerY + currentR2 * Math.sin(p.theta2 + p.rho2 + t * p.speed * goldenRatio);
      const z = currentR3 * Math.cos(p.theta3 + p.rho3 + t * p.speed * 0.5);

      const normalizedZ = (z + 500) / 1000;
      const scale = 0.3 + normalizedZ * 0.7;
      const adjustedSize = p.size * scale;

      const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      const minDistance = 35;
      if (distanceFromCenter < minDistance) return;

      const proximityFade = Math.min(1, (distanceFromCenter - minDistance) / 100);
      const color = getColor(p.hue, p.opacity * proximityFade, z + 500);

      ctx.save();
      ctx.globalAlpha = proximityFade;

      switch (p.type) {
        case "circle":
          ctx.beginPath();
          ctx.arc(x, y, adjustedSize, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
          break;

        case "line":
          const angle = p.theta1 + t * p.speed * 2;
          const length = adjustedSize * 4;
          ctx.beginPath();
          ctx.moveTo(x - Math.cos(angle) * length / 2, y - Math.sin(angle) * length / 2);
          ctx.lineTo(x + Math.cos(angle) * length / 2, y + Math.sin(angle) * length / 2);
          ctx.strokeStyle = color;
          ctx.lineWidth = scale;
          ctx.stroke();
          break;

        case "polygon":
          const sides = 3 + Math.floor(p.hue * 3);
          ctx.beginPath();
          for (let i = 0; i <= sides; i++) {
            const a = (i / sides) * Math.PI * 2 + t * p.speed;
            const px = x + Math.cos(a) * adjustedSize * 1.5;
            const py = y + Math.sin(a) * adjustedSize * 1.5;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.strokeStyle = color;
          ctx.lineWidth = scale * 0.8;
          ctx.stroke();
          break;
      }

      ctx.restore();
    };

    const animate = (timestamp: number) => {
      timeRef.current = timestamp;

      ctx.fillStyle = "rgba(5, 5, 8, 1)";
      ctx.fillRect(0, 0, width, height);

      const sortedParticles = [...particlesRef.current].sort((a, b) => a.z - b.z);
      sortedParticles.forEach(p => drawParticle(p, timestamp));

      drawEventHorizon();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);

    const handleScroll = () => {
      if (window.scrollY > 50) fadeOut();
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) fadeOut();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") fadeOut();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fadeOut, prefersReducedMotion]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#050508]"
      style={{ touchAction: "none" }}
      data-testid="black-hole-intro"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        data-testid="black-hole-canvas"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium tracking-tight text-white mb-4">
          David Johnson
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-2xl font-light">
          Technology & Cybersecurity Professional
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-xs font-mono tracking-widest animate-pulse pointer-events-none">
        {prefersReducedMotion ? "LOADING..." : "SCROLL TO ENTER"}
      </div>
    </div>
  );
}
