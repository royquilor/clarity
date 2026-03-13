"use client";

import { useState, useEffect, useRef } from "react";
import { GrainGradient, grainGradientPresets } from "@paper-design/shaders-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { AddIcon, EyeIcon, MinusSignIcon, PencilEditIcon } from "@hugeicons/core-free-icons";

const SHAPES = ["wave", "dots", "truchet", "corners", "ripple", "blob", "sphere"] as const;
type GrainGradientShape = typeof SHAPES[number];
const MAX_COLORS = 7;

const defaultParams = grainGradientPresets[0].params;

type ColorEntry = { hex: string; visible: boolean };

function toColorEntries(colors: string[]): ColorEntry[] {
  return colors.map((hex) => ({ hex, visible: true }));
}

export function GrainGradientBg({ showControls = false }: { showControls?: boolean }) {
  const [isMobile, setIsMobile] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [shape, setShape] = useState<GrainGradientShape>("ripple");
  const [speed, setSpeed] = useState(defaultParams.speed ?? 1);
  const [softness, setSoftness] = useState(0.8);
  const [intensity, setIntensity] = useState(0.9);
  const [noise, setNoise] = useState(0.12);
  const [scale, setScale] = useState(0.8);
  const [rotation, setRotation] = useState(defaultParams.rotation ?? 0);
  const [offsetX, setOffsetX] = useState(defaultParams.offsetX ?? 0);
  const [offsetY, setOffsetY] = useState(defaultParams.offsetY ?? 0);
  const [colorEntries, setColorEntries] = useState<ColorEntry[]>(
    toColorEntries(["#FFAA80"])
  );
  const [colorBack, setColorBack] = useState("#FAFAF9");
  const [blurValue, setBlurValue] = useState(0);
  const [blurVisible, setBlurVisible] = useState(true);

  // Breathing animation — slow sine drifts on scale + offset
  const rafRef = useRef<number>(0);
  const [breath, setBreath] = useState({ scale, offsetX, offsetY });

  useEffect(() => {
    if (isMobile || reduceMotion || !isVisible) return;
    const start = performance.now();
    const FRAME_INTERVAL = 1000 / 30; // 30fps
    let lastFrame = 0;
    function tick(now: number) {
      rafRef.current = requestAnimationFrame(tick);
      if (now - lastFrame < FRAME_INTERVAL) return;
      lastFrame = now;
      const t = (now - start) / 1000;
      setBreath({
        scale: scale + Math.sin(t * 0.18) * 0.04,
        offsetX: offsetX + Math.sin(t * 0.13) * 0.03,
        offsetY: offsetY + Math.cos(t * 0.11) * 0.025,
      });
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isMobile, reduceMotion, isVisible, scale, offsetX, offsetY]);

  const activeColors = colorEntries.filter((c) => c.visible).map((c) => c.hex);

  function updateColor(index: number, hex: string) {
    setColorEntries((prev) => prev.map((c, i) => (i === index ? { ...c, hex } : c)));
  }

  function toggleVisible(index: number) {
    setColorEntries((prev) => prev.map((c, i) => (i === index ? { ...c, visible: !c.visible } : c)));
  }

  function removeColor(index: number) {
    setColorEntries((prev) => prev.filter((_, i) => i !== index));
  }

  function addColor() {
    if (colorEntries.length < MAX_COLORS) {
      setColorEntries((prev) => [...prev, { hex: "#ffffff", visible: true }]);
    }
  }

  if (isMobile) {
    return (
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 40%, #FFAA80 0%, ${colorBack} 70%)` }}
      />
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ filter: blurVisible && blurValue > 0 ? `blur(${blurValue}px)` : undefined }}
      >
        <GrainGradient
          {...defaultParams}
          shape={shape}
          speed={speed}
          softness={softness}
          intensity={intensity}
          noise={noise}
          scale={breath.scale}
          rotation={rotation}
          offsetX={breath.offsetX}
          offsetY={breath.offsetY}
          colors={activeColors}
          colorBack={colorBack}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Edge fade — atmospheric blur vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, ${colorBack}cc 100%)
          `,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to bottom, ${colorBack}99 0%, transparent 18%, transparent 82%, ${colorBack}99 100%),
            linear-gradient(to right,  ${colorBack}88 0%, transparent 18%, transparent 82%, ${colorBack}88 100%)
          `,
        }}
      />

      {/* Dev controls panel */}
      {showControls && <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur border border-gray-200 rounded-xl shadow-lg p-4 w-72 text-sm font-sans overflow-y-auto max-h-[calc(100vh-2rem)]">

        {/* Fill / background color */}
        <div className="mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold">Fill</p>
            <button className="text-gray-400 hover:text-gray-600"><HugeiconsIcon icon={AddIcon} size={14} /></button>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
              <span className="px-2.5 py-1 bg-white font-medium">Solid</span>
              <span className="px-2.5 py-1 text-gray-400">Gradient</span>
              <span className="px-2.5 py-1 text-gray-400">Image</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600 ml-auto"><HugeiconsIcon icon={EyeIcon} size={14} /></button>
            <button className="text-gray-400 hover:text-red-400"><HugeiconsIcon icon={MinusSignIcon} size={14} /></button>
          </div>
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1.5 bg-white">
            <label className="cursor-pointer relative">
              <span className="block w-5 h-5 rounded" style={{ backgroundColor: colorBack }} />
              <input
                type="color"
                value={colorBack}
                onChange={(e) => setColorBack(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
            </label>
            <span className="text-gray-500 font-mono text-xs uppercase tracking-wide">
              {colorBack.replace("#", "")} / 100%
            </span>
          </div>
        </div>

        {/* Foreground colors */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold">Foreground</p>
            <div className="flex items-center gap-2 text-gray-400">
              <button className="hover:text-gray-600"><HugeiconsIcon icon={PencilEditIcon} size={14} /></button>
              <button
                className="hover:text-gray-600 disabled:opacity-30"
                onClick={addColor}
                disabled={colorEntries.length >= MAX_COLORS}
              >
                <HugeiconsIcon icon={AddIcon} size={14} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            {colorEntries.map((entry, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex items-center gap-2 flex-1 border border-gray-200 rounded-lg px-2 py-1.5 bg-white">
                  <label className="cursor-pointer relative">
                    <span
                      className="block w-5 h-5 rounded"
                      style={{ backgroundColor: entry.hex }}
                    />
                    <input
                      type="color"
                      value={entry.hex}
                      onChange={(e) => updateColor(i, e.target.value)}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                  </label>
                  <span className="text-gray-500 font-mono text-xs uppercase tracking-wide">
                    {entry.hex.replace("#", "")} / 100%
                  </span>
                </div>
                <button
                  className={`text-gray-400 hover:text-gray-600 ${!entry.visible ? "opacity-30" : ""}`}
                  onClick={() => toggleVisible(i)}
                >
                  <HugeiconsIcon icon={EyeIcon} size={14} />
                </button>
                <button
                  className="text-gray-400 hover:text-red-400"
                  onClick={() => removeColor(i)}
                >
                  <HugeiconsIcon icon={MinusSignIcon} size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold">Filters</p>
            <button className="text-gray-400 hover:text-gray-600"><HugeiconsIcon icon={AddIcon} size={14} /></button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 flex-1 border border-gray-200 rounded-lg px-2 py-1.5 bg-white">
              <span className="text-gray-400 text-xs">⠿</span>
              <select
                className="flex-1 bg-transparent text-xs text-gray-700 outline-none"
                value="blur"
                onChange={() => {}}
              >
                <option value="blur">Blur</option>
              </select>
            </div>
            <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-2 py-1.5 bg-white w-16">
              <span className="text-gray-400 text-xs">⊙</span>
              <input
                type="number"
                min={0}
                max={100}
                value={blurValue}
                onChange={(e) => setBlurValue(parseFloat(e.target.value) || 0)}
                className="w-full bg-transparent text-xs text-gray-700 outline-none tabular-nums"
              />
            </div>
            <button
              className={`text-gray-400 hover:text-gray-600 ${!blurVisible ? "opacity-30" : ""}`}
              onClick={() => setBlurVisible((v) => !v)}
            >
              <HugeiconsIcon icon={EyeIcon} size={14} />
            </button>
            <button className="text-gray-400 hover:text-red-400" onClick={() => setBlurValue(0)}>
              <HugeiconsIcon icon={MinusSignIcon} size={14} />
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="font-semibold mb-3">Parameters</p>

          <label className="block mb-1 text-gray-600">Shape</label>
          <select
            className="w-full border border-gray-200 rounded px-2 py-1 mb-3 bg-white"
            value={shape}
            onChange={(e) => setShape(e.target.value as GrainGradientShape)}
          >
            {SHAPES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>

          {[
            { label: "Speed", value: speed, set: setSpeed, min: 0, max: 2, step: 0.01, unit: "x" },
            { label: "Softness", value: softness, set: setSoftness, min: 0, max: 1, step: 0.01, unit: "%" },
            { label: "Intensity", value: intensity, set: setIntensity, min: 0, max: 1, step: 0.01, unit: "%" },
            { label: "Noise", value: noise, set: setNoise, min: 0, max: 1, step: 0.01, unit: "%" },
            { label: "Scale", value: scale, set: setScale, min: 0.01, max: 4, step: 0.01, unit: "x" },
            { label: "Rotation", value: rotation, set: setRotation, min: 0, max: 360, step: 1, unit: "°" },
            { label: "Offset X", value: offsetX, set: setOffsetX, min: -1, max: 1, step: 0.01, unit: "%" },
            { label: "Offset Y", value: offsetY, set: setOffsetY, min: -1, max: 1, step: 0.01, unit: "%" },
          ].map(({ label, value, set, min, max, step, unit }) => (
            <div key={label} className="mb-2">
              <div className="flex justify-between mb-0.5">
                <span className="text-gray-600">{label}</span>
                <span className="text-gray-400 text-xs tabular-nums">
                  {unit === "°" ? `${Math.round(value)}°` : `${Math.round(value * 100)}${unit}`}
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => set(parseFloat(e.target.value))}
                className="w-full accent-gray-600"
              />
            </div>
          ))}
        </div>
      </div>}
    </>
  );
}
