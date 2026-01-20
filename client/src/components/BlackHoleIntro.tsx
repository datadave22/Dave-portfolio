import { useEffect, useRef, useState, useCallback } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";

interface Shape {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: "triangle" | "circle" | "square" | "angle";
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  angleValue?: number;
}

interface BlackHoleIntroProps {
  onComplete: () => void;
}

export function BlackHoleIntro({ onComplete }: BlackHoleIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<Shape[]>([]);
  const animationFrameRef = useRef<number>(0);
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
      const timer = setTimeout(() => {
        fadeOut();
      }, 500);
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

    const colors = [
      "rgba(255, 255, 255, 0.8)",
      "rgba(200, 200, 200, 0.7)",
      "rgba(150, 150, 150, 0.6)",
      "rgba(100, 100, 100, 0.5)",
    ];

    const shapeTypes: Shape["type"][] = ["triangle", "circle", "square", "angle"];

    const createShape = (forceOutside = false): Shape => {
      let x: number, y: number;

      if (forceOutside) {
        const side = Math.floor(Math.random() * 4);
        const margin = 100;
        switch (side) {
          case 0: x = Math.random() * width; y = -margin; break;
          case 1: x = width + margin; y = Math.random() * height; break;
          case 2: x = Math.random() * width; y = height + margin; break;
          default: x = -margin; y = Math.random() * height; break;
        }
      } else {
        const angle = Math.random() * Math.PI * 2;
        const distance = 200 + Math.random() * Math.max(width, height) * 0.5;
        x = centerX + Math.cos(angle) * distance;
        y = centerY + Math.sin(angle) * distance;
      }

      const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];

      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: 8 + Math.random() * 24,
        type,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        opacity: 0.3 + Math.random() * 0.7,
        color: colors[Math.floor(Math.random() * colors.length)],
        angleValue: type === "angle" ? 1 + Math.floor(Math.random() * 10) : undefined,
      };
    };

    const numShapes = 60;
    shapesRef.current = Array.from({ length: numShapes }, () => createShape());

    const blackHoleRadius = 40;
    const eventHorizonRadius = 80;
    const gravitationalRange = Math.max(width, height) * 0.8;
    const gravitationalStrength = 0.00015;

    const drawBlackHole = () => {
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, eventHorizonRadius * 3
      );
      gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
      gradient.addColorStop(0.3, "rgba(0, 0, 0, 0.95)");
      gradient.addColorStop(0.5, "rgba(20, 20, 30, 0.6)");
      gradient.addColorStop(0.7, "rgba(40, 40, 60, 0.3)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, eventHorizonRadius * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, blackHoleRadius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fill();

      const glowGradient = ctx.createRadialGradient(
        centerX, centerY, blackHoleRadius * 0.8,
        centerX, centerY, blackHoleRadius * 1.5
      );
      glowGradient.addColorStop(0, "rgba(60, 60, 80, 0)");
      glowGradient.addColorStop(0.5, "rgba(80, 80, 120, 0.15)");
      glowGradient.addColorStop(1, "rgba(60, 60, 80, 0)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, blackHoleRadius * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();
    };

    const drawShape = (shape: Shape) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      ctx.globalAlpha = shape.opacity;

      const colorWithOpacity = shape.color.replace(/[\d.]+\)$/, `${shape.opacity})`);
      ctx.strokeStyle = colorWithOpacity;
      ctx.fillStyle = "transparent";
      ctx.lineWidth = 1.5;

      switch (shape.type) {
        case "triangle":
          ctx.beginPath();
          ctx.moveTo(0, -shape.size / 2);
          ctx.lineTo(-shape.size / 2, shape.size / 2);
          ctx.lineTo(shape.size / 2, shape.size / 2);
          ctx.closePath();
          ctx.stroke();
          break;

        case "circle":
          ctx.beginPath();
          ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
          ctx.stroke();
          break;

        case "square":
          ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
          break;

        case "angle":
          const angleRad = ((shape.angleValue || 5) / 10) * Math.PI;
          ctx.beginPath();
          ctx.moveTo(-shape.size / 2, 0);
          ctx.lineTo(0, 0);
          ctx.lineTo(Math.cos(angleRad) * shape.size / 2, -Math.sin(angleRad) * shape.size / 2);
          ctx.stroke();

          ctx.font = `${Math.max(8, shape.size * 0.3)}px monospace`;
          ctx.fillStyle = colorWithOpacity;
          ctx.fillText(`${shape.angleValue}`, shape.size * 0.3, shape.size * 0.4);
          break;
      }

      ctx.restore();
    };

    const updateShape = (shape: Shape): boolean => {
      const dx = centerX - shape.x;
      const dy = centerY - shape.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < blackHoleRadius) {
        return false;
      }

      if (distance < gravitationalRange) {
        const force = gravitationalStrength * (1 / (distance * distance)) * 10000;
        const ax = (dx / distance) * force;
        const ay = (dy / distance) * force;

        shape.vx += ax;
        shape.vy += ay;

        if (distance < eventHorizonRadius * 2) {
          shape.opacity *= 0.98;
          shape.size *= 0.995;
        }
      }

      const maxSpeed = 15;
      const speed = Math.sqrt(shape.vx * shape.vx + shape.vy * shape.vy);
      if (speed > maxSpeed) {
        shape.vx = (shape.vx / speed) * maxSpeed;
        shape.vy = (shape.vy / speed) * maxSpeed;
      }

      shape.x += shape.vx;
      shape.y += shape.vy;
      shape.rotation += shape.rotationSpeed;

      if (distance < eventHorizonRadius * 1.5) {
        shape.rotationSpeed *= 1.02;
      }

      return shape.opacity > 0.05 && shape.size > 2;
    };

    let lastSpawnTime = 0;
    const spawnInterval = 200;

    const animate = (timestamp: number) => {
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(0, 0, width, height);

      drawBlackHole();

      shapesRef.current = shapesRef.current.filter(updateShape);
      shapesRef.current.forEach(drawShape);

      if (timestamp - lastSpawnTime > spawnInterval && shapesRef.current.length < numShapes) {
        shapesRef.current.push(createShape(true));
        lastSpawnTime = timestamp;
      }

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
      if (window.scrollY > 50) {
        fadeOut();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        fadeOut();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        fadeOut();
      }
    };

    const handleClick = () => {
      fadeOut();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    container.addEventListener("click", handleClick);

    const autoFadeTimeout = setTimeout(() => {
      fadeOut();
    }, 6000);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      container.removeEventListener("click", handleClick);
      clearTimeout(autoFadeTimeout);
    };
  }, [fadeOut, prefersReducedMotion]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black cursor-pointer"
      style={{ touchAction: "none" }}
      data-testid="black-hole-intro"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        data-testid="black-hole-canvas"
      />

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-xs font-mono tracking-widest animate-pulse">
        {prefersReducedMotion ? "LOADING..." : "SCROLL OR CLICK TO ENTER"}
      </div>

      <div className="absolute top-8 right-8 text-white/20 text-xs font-mono">
        <div className="w-8 h-px bg-white/20 mb-2" />
        <span>EST. 2024</span>
      </div>
    </div>
  );
}
