import React, { useRef, useEffect } from "react";

type Mode = "red" | "blue" | "hybrid";

interface RiskSpiralProps {
  risk: number;        // E
  prevRisk: number;    // E_prev
  mode: Mode;
  width?: number;
  height?: number;
}

// Tunable constants
const BASE_RADIUS = 20;
const K = 5;           // risk → spiral growth scaling
const BASE_LINE_WIDTH = 1.5;
const MAX_THETA = 18 * Math.PI; // how many turns of the spiral

export const RiskSpiral: React.FC<RiskSpiralProps> = ({
  risk,
  prevRisk,
  mode,
  width = 320,
  height = 320,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Basic linear interpolation helper
  function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  // Color interpolation based on mode + ΔE
  function interpolateColor(mode: Mode, dE: number, tPulse: number): string {
    const intensity = Math.min(1, Math.abs(dE) / 10); // normalize magnitude a bit

    // base colors
    const red = { r: 255, g: 60, b: 60 };
    const orange = { r: 255, g: 160, b: 60 };
    const purple = { r: 180, g: 80, b: 255 };
    const blue = { r: 60, g: 140, b: 255 };
    const cyan = { r: 60, g: 220, b: 255 };

    let from, to;

    if (mode === "red") {
      if (dE >= 0) {
        // risk rising → red → orange
        from = red;
        to = orange;
      } else {
        // risk falling in red mode → red → purple (cooling)
        from = red;
        to = purple;
      }
    } else if (mode === "blue") {
      if (dE <= 0) {
        // risk dropping → blue → cyan
        from = blue;
        to = cyan;
      } else {
        // risk rising in blue mode → blue → purple (warming)
        from = blue;
        to = purple;
      }
    } else {
      // hybrid: pulse around purple toward red or blue
      const biasTowardRed = dE > 0 ? 1 : 0; // upwards drift → red side
      const hybridRedSide = {
        r: lerp(purple.r, red.r, 0.6),
        g: lerp(purple.g, red.g, 0.6),
        b: lerp(purple.b, red.b, 0.6),
      };
      const hybridBlueSide = {
        r: lerp(purple.r, blue.r, 0.6),
        g: lerp(purple.g, blue.g, 0.6),
        b: lerp(purple.b, blue.b, 0.6),
      };
      const hybridTarget = biasTowardRed ? hybridRedSide : hybridBlueSide;

      // hybrid also breathes with tPulse (0..1)
      const pulseMix = 0.3 + 0.4 * tPulse;
      from = purple;
      to = {
        r: lerp(purple.r, hybridTarget.r, pulseMix),
        g: lerp(purple.g, hybridTarget.g, pulseMix),
        b: lerp(purple.b, hybridTarget.b, pulseMix),
      };
    }

    const mix = intensity;
    const r = Math.round(lerp(from.r, to.r, mix));
    const g = Math.round(lerp(from.g, to.g, mix));
    const b = Math.round(lerp(from.b, to.b, mix));

    return `rgb(${r}, ${g}, ${b})`;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let startTime = performance.now();

    const render = (now: number) => {
      const t = (now - startTime) / 1000; // seconds
      const E = Math.max(0, risk);
      const Eprev = Math.max(0, prevRisk);
      const dE = E - Eprev;

      // spiral parameters
      const b = K * Math.log(1 + E); // radial growth rate
      const omega = 1 + Math.abs(dE); // angular frequency
      const pulse =
        mode === "hybrid" ? 0.1 * Math.sin(6 * t) : 0; // hybrid breathing

      // canvas setup
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // optional: subtle background glow
      ctx.fillStyle = "rgba(5, 10, 25, 0.9)";
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.translate(cx, cy);

      // timeline for hybrid color pulse (0..1)
      const tPulse = 0.5 + 0.5 * Math.sin(2 * t);

      // Start drawing the spiral
      const segments = 1200;
      const maxTheta = MAX_THETA;
      const dTheta = maxTheta / segments;

      let theta = 0;
      const lineWidthBase = BASE_LINE_WIDTH + Math.min(4, Math.abs(dE));

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = 0; i < segments; i++) {
        const radius = BASE_RADIUS + b * theta + pulse * radiusPulseScale(E);
        const angle = omega * theta + t;

        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        const progress = i / segments;

        ctx.strokeStyle = interpolateColor(mode, dE * progress, tPulse);
        ctx.lineWidth = lineWidthBase * (0.5 + 0.5 * progress);

        if (i === 0) {
          ctx.beginPath();
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        // Draw a segment every few points
        if (i % 5 === 0) {
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x, y);
        }

        theta += dTheta;
      }

      ctx.restore();

      animationRef.current = requestAnimationFrame(render);
    };

    function radiusPulseScale(E: number) {
      // Higher risk → stronger pulse effect
      return 5 + Math.min(30, E * 2);
    }

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [risk, prevRisk, mode]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        width,
        height,
        borderRadius: "999px",
        background: "radial-gradient(circle at 30% 20%, #222844, #050814)",
        boxShadow: "0 0 20px rgba(0,0,0,0.6)",
      }}
    />
  );
};