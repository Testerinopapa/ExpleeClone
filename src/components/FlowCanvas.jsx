import React, { useEffect, useRef, useState, useMemo } from 'react';

const defaultConfig = {
  numPaths: 8,
  dotsPerPath: 3,
  dotSize: 1.5,
  dotPrimaryColor: "#10b981",
  dotSecondaryColor: "rgba(0, 0, 0, 0.18)",
  primaryDotRatio: 0.25,
  pathColor: "rgba(0, 0, 0, 0.24)",
  startSpread: 1,
  finishSpread: 0.04,
  curvature: 0.5,
  speed: 0.5,
  curveType: "s-curve"
};

function bezierPoint(t, p) {
  const r = 1 - t;
  const n = r * r;
  const i = n * r;
  const a = t * t;
  const l = a * t;
  return {
    x: i * p.p0.x + 3 * n * t * p.p1.x + 3 * r * a * p.p2.x + l * p.p3.x,
    y: i * p.p0.y + 3 * n * t * p.p1.y + 3 * r * a * p.p2.y + l * p.p3.y
  };
}

function computeLut(p) {
  const lut = new Float64Array(65);
  let r = p.p0;
  for (let n = 1; n <= 64; n++) {
    const pt = bezierPoint(n / 64, p);
    const lx = pt.x - r.x;
    const ly = pt.y - r.y;
    lut[n] = lut[n - 1] + Math.sqrt(lx * lx + ly * ly);
    r = pt;
  }
  const totalLength = lut[64];
  if (totalLength > 0) {
    for (let n = 1; n <= 64; n++) {
      lut[n] /= totalLength;
    }
  }
  return { lut, totalLength };
}

function computePath(index, numPaths, isReversed, cfg, width, height) {
  const c = numPaths > 1 ? (index - (numPaths - 1) / 2) / ((numPaths - 1) / 2) : 0;
  const startY = height / 2 + (height / 2) * c * cfg.startSpread;
  const finishY = height / 2 + (height / 2) * c * cfg.finishSpread;
  const startX = isReversed ? width : 0;
  const finishX = isReversed ? 0 : width;
  const h = cfg.curvature;

  const cp1X = isReversed ? startX - width * h : startX + width * h;
  const cp1Y = startY;
  const cp2X = isReversed ? finishX + width * h : finishX - width * h;
  const cp2Y = finishY;

  return {
    p0: { x: startX, y: startY },
    p1: { x: cp1X, y: cp1Y },
    p2: { x: cp2X, y: cp2Y },
    p3: { x: finishX, y: finishY }
  };
}

function pseudoRand(seed) {
  const t = 10000 * Math.sin(9999 * seed);
  return t - Math.floor(t);
}

function binarySearchLut(lut, u) {
  const r = lut.length - 1;
  if (u <= 0) return 0;
  if (u >= 1) return 1;
  let n = 0, i = r;
  while (n < i - 1) {
    const mid = (n + i) >> 1;
    if (lut[mid] < u) n = mid;
    else i = mid;
  }
  const a = lut[i] - lut[n];
  const l = a < 1e-10 ? 0 : (u - lut[n]) / a;
  return (n + l) / r;
}

export default function FlowCanvas({
  width = 400,
  height = 500,
  config = {},
  preserveAspectRatio = "xMaxYMid meet",
  paused = false,
  className = "w-full h-full block"
}) {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(null);
  const [seed] = useState(() => Math.random() * 1000);

  const cfg = useMemo(() => ({ ...defaultConfig, ...config }), [config]);
  const pathsData = useMemo(() => {
    const paths = [];
    const luts = [];
    const lengths = [];
    for (let i = 0; i < cfg.numPaths; i++) {
      const p = computePath(i, cfg.numPaths, false, cfg, width, height);
      const { lut, totalLength } = computeLut(p);
      paths.push(p);
      luts.push(lut);
      lengths.push(totalLength);
    }
    return { paths, luts, lengths };
  }, [cfg, width, height]);

  const dotsRef = useRef([]);
  const pathAnimRef = useRef([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize dots and path animations
  useEffect(() => {
    const dots = [];
    for (let t = 0; t < cfg.numPaths; t++) {
      const duration = 3 + Math.abs(t - (cfg.numPaths - 1) / 2) / ((cfg.numPaths - 1) / 2 || 1);
      for (let n = 0; n < cfg.dotsPerPath; n++) {
        const iSeed = seed + 100 * t + n;
        const aSeed = seed + 200 * t + n + 500;
        const isPrimary = pseudoRand(seed + 300 * t + n + 1000) < cfg.primaryDotRatio;
        const oOffset = pseudoRand(aSeed);
        const uDelay = 2 * pseudoRand(iSeed);
        dots.push({
          virtualTime: oOffset * duration * 1000,
          delayRemaining: uDelay * 1000,
          initialFade: 0,
          duration,
          color: isPrimary ? cfg.dotPrimaryColor : cfg.dotSecondaryColor,
          pathIndex: t,
          isPrimary
        });
      }
    }
    dotsRef.current = dots;

    const pathAnims = [];
    for (let t = 0; t < cfg.numPaths; t++) {
      pathAnims.push({
        elapsed: 0,
        delay: (t / cfg.numPaths) * 0.3
      });
    }
    pathAnimRef.current = pathAnims;
  }, [cfg, seed]);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const displayW = canvas.offsetWidth;
      const displayH = canvas.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round(displayW * dpr);
      const h = Math.round(displayH * dpr);
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    return () => ro.disconnect();
  }, [mounted]);

  // Main animation render loop
  useEffect(() => {
    if (!mounted || paused) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = (time) => {
      if (!isRunning) return;
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = Math.min(100, time - lastTimeRef.current);
      lastTimeRef.current = time;

      const dpr = window.devicePixelRatio || 1;
      const displayW = canvas.offsetWidth;
      const displayH = canvas.offsetHeight;

      // Coordinate scaling based on preserveAspectRatio
      const sx = displayW / width;
      const sy = displayH / height;
      const s = Math.min(sx, sy);
      const l = width * s;
      const n = height * s;
      let tx = 0;
      let ty = 0;
      if (preserveAspectRatio.includes('xMid')) tx = (displayW - l) / 2;
      else if (preserveAspectRatio.includes('xMax')) tx = displayW - l;
      if (preserveAspectRatio.includes('YMid')) ty = (displayH - n) / 2;
      else if (preserveAspectRatio.includes('YMax')) ty = displayH - n;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.setTransform(s * dpr, 0, 0, s * dpr, tx * dpr, ty * dpr);
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.strokeStyle = cfg.pathColor;
      ctx.globalAlpha = 0.16;

      const { paths, luts, lengths } = pathsData;
      const dtSeconds = dt / 1000;

      // Draw paths
      for (let e = 0; e < paths.length; e++) {
        const p = paths[e];
        const anim = pathAnimRef.current[e];
        if (!anim) continue;
        anim.elapsed += dtSeconds;
        const progress = 1 - Math.pow(1 - Math.min(1, Math.max(0, anim.elapsed - anim.delay) / 1.2), 3);
        if (progress <= 0) continue;

        if (progress < 1) {
          ctx.setLineDash([progress * lengths[e], lengths[e]]);
        } else {
          ctx.setLineDash([]);
        }

        ctx.beginPath();
        ctx.moveTo(p.p0.x, p.p0.y);
        ctx.bezierCurveTo(p.p1.x, p.p1.y, p.p2.x, p.p2.y, p.p3.x, p.p3.y);
        ctx.stroke();
      }

      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      // Draw dots
      const B = cfg.dotSize;
      const V = 2 * B;

      for (let pass = 0; pass < 2; pass++) {
        const isPrimaryPass = pass === 1;
        for (let i = 0; i < dotsRef.current.length; i++) {
          const dot = dotsRef.current[i];
          if (dot.isPrimary !== isPrimaryPass) continue;
          const p = paths[dot.pathIndex];
          const lut = luts[dot.pathIndex];
          if (!p || !lut) continue;

          if (dot.delayRemaining > 0) {
            dot.delayRemaining -= dt;
            continue;
          }

          if (dot.initialFade < 1) {
            dot.initialFade = Math.min(1, dot.initialFade + dt / 300);
          }

          dot.virtualTime += dt * cfg.speed;
          const totalMs = dot.duration * 1000;
          const u = (dot.virtualTime % totalMs) / totalMs;

          let alpha = 1;
          if (u < 0.05) alpha = u / 0.05;
          else if (u > 0.95) alpha = (1 - u) / 0.05;
          alpha *= dot.initialFade;

          if (alpha <= 0) continue;

          const tParam = binarySearchLut(lut, u);
          const pos = bezierPoint(tParam, p);

          ctx.globalAlpha = alpha;
          ctx.fillStyle = dot.color;
          ctx.fillRect(pos.x - B, pos.y - B, V, V);
        }
      }

      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [mounted, paused, pathsData, cfg, preserveAspectRatio, width, height]);

  if (!mounted) {
    return <div className="w-full h-full" />;
  }

  return <canvas ref={canvasRef} className={className} />;
}
