import React from 'react';

export default function Barcode({ answers = [] }) {
  // Generate deterministic widths based on answers
  const bars = [];
  let seed = answers.reduce((acc, curr, idx) => acc + (curr.isCorrect ? 7 : 3) * (idx + 1), 42);

  for (let i = 0; i < 38; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    const width = (seed % 3) + 1; // 1, 2, or 3px
    const isGap = (seed % 7) === 0;
    bars.push({ width, isGap });
  }

  return (
    <div className="w-full flex flex-col items-center justify-center opacity-85 select-none" aria-hidden="true">
      <svg
        className="w-full h-12 text-ink"
        viewBox="0 0 160 48"
        preserveAspectRatio="none"
      >
        <g fill="currentColor">
          {bars.reduce((acc, bar, i) => {
            const currentX = acc.x;
            acc.x += bar.width + 1.5;
            if (!bar.isGap) {
              acc.elements.push(
                <rect key={i} x={currentX} y="0" width={bar.width} height="48" rx="0.5" />
              );
            }
            return acc;
          }, { x: 4, elements: [] }).elements}
        </g>
      </svg>
      <span className="text-[10px] font-mono tracking-widest text-ink-muted mt-1 uppercase">
        GLB-A1-{answers.filter((a) => a.isCorrect).length.toString().padStart(2, '0')}-MUC
      </span>
    </div>
  );
}
