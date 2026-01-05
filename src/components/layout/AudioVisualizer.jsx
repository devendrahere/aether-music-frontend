import { useEffect, useRef } from "react";

const THEME = {
  colors: ["hsla(141, 73%, 42%, 1.00)", "hsla(141, 100%, 74%, 1.00)"],
  lineWidth: 2,
  spread: 12,
  rangeLimit: 0.33,
  gravity: 0.7,      
  sensitivity: 3,   // Slightly lowered to prevent early clipping
  peakThreshold: 0.02,
  containerPadding: 1, // Ensures wave only uses 75% of available height
};

export default function EnergeticContainedWave({ audioRef, className = "" }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const prevHeightsRef = useRef([]);

  useEffect(() => {
    if (!audioRef?.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const setupAudio = () => {
      if (!window.__audioCtx) {
        window.__audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        window.__analyser = window.__audioCtx.createAnalyser();
        window.__analyser.fftSize = 1024; 
        window.__analyser.smoothingTimeConstant = 0.3;

        const source = window.__audioCtx.createMediaElementSource(audioRef.current);
        source.connect(window.__analyser);
        window.__analyser.connect(window.__audioCtx.destination);
      }
      analyserRef.current = window.__analyser;
      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
      prevHeightsRef.current = new Array(analyserRef.current.frequencyBinCount).fill(0);
    };

    setupAudio();

    const drawWave = (rawData) => {
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const spread = THEME.spread * dpr;
      const limit = Math.floor(rawData.length * THEME.rangeLimit);
      
      const gradient = ctx.createLinearGradient(centerX - 300, 0, centerX + 300, 0);
      gradient.addColorStop(0, THEME.colors[1]);
      gradient.addColorStop(0.5, THEME.colors[0]);
      gradient.addColorStop(1, THEME.colors[1]);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = THEME.lineWidth * dpr;
      ctx.shadowBlur = 10 * dpr;
      ctx.shadowColor = "rgba(0, 210, 255, 0.6)";
      ctx.lineCap = "round";

      const drawSide = (direction) => {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);

        for (let i = 0; i < limit; i++) {
          const rawValue = rawData[i] / 255;
          
          let value = Math.pow(rawValue, 1) * THEME.sensitivity;
          if (rawValue > THEME.peakThreshold) value *= 0.9;

          // Smooth Gravity fall-off
          if (value < prevHeightsRef.current[i]) {
            value = prevHeightsRef.current[i] * THEME.gravity;
          }
          prevHeightsRef.current[i] = value;

          // HEIGHT CONTAINMENT LOGIC:
          // 1. Taper edges so they fade to 0
          const taper = Math.pow(1 - (i / limit),8);
          
          // 2. Reduce center amplitude with inverse taper
          const centerDamping = 0.05 + (i / limit) * 1; // 0.4 at center, 1.0 at edges
          
          // 3. Limit the max vertical reach to a percentage of canvas height
          // Total height = canvas.height * containerPadding
          // Divided by 2 because it's mirrored top/bottom
          const safeHalfHeight = (canvas.height * THEME.containerPadding) / 0.5;
          
          // 4. Apply NON-LINEAR transformation for natural wave behavior
          // Exponential scaling makes high amplitudes more dramatic, low amplitudes compressed
          const expScale = Math.pow(value, 4); // Exponential curve - reverse of logarithmic
          
          // Add subtle sine wave modulation for organic feel
          const organicMod = 1 + Math.sin(i * 0.3) * 0.15;
          
          // Natural asymptotic limiter - approaches safeHalfHeight but never exceeds it
          // Using tanh (hyperbolic tangent) which naturally bounds output to (0, 1)
          const scaledValue = expScale * taper * centerDamping * organicMod * 0.3; // Apply center damping
          const normalized = Math.tanh(scaledValue); // Bound to (-1, 1)
          const h = (safeHalfHeight-safeHalfHeight*.314)* 0.7 * normalized; // Much smaller waves
          
          const x = centerX + i * spread * direction;
          const y = centerY + (i % 2 === 0 ? -h : h);

          const nextX = centerX + (i + 1) * spread * direction;
          const xc = (x + nextX) / 2;
          
          ctx.quadraticCurveTo(x, y, xc, centerY);
        }
        ctx.stroke();
      };

      drawSide(1);
      drawSide(-1);
    };

    const animate = () => {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      drawWave(dataArrayRef.current);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [audioRef]);

  return <canvas ref={canvasRef} className={className} />;
}