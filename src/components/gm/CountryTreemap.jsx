import React, { useState } from 'react';

// Computes 2D Treemap layout recursively by dividing the bounding box
// along the larger dimension proportionally to the item values.
function layoutTreemap(items, x = 0, y = 0, width = 100, height = 100) {
  if (!items || items.length === 0) return [];
  if (items.length === 1) {
    return [
      {
        ...items[0],
        x,
        y,
        width,
        height,
      },
    ];
  }

  const totalValue = items.reduce((acc, it) => acc + (it.value || 1), 0);
  let running = 0;
  let splitIdx = 1;
  const half = totalValue / 2;

  for (let i = 0; i < items.length - 1; i++) {
    running += items[i].value || 1;
    if (running >= half) {
      const diff1 = Math.abs(running - half);
      const diff0 = Math.abs(running - (items[i].value || 1) - half);
      splitIdx = diff0 < diff1 && i > 0 ? i : i + 1;
      break;
    }
    splitIdx = i + 1;
  }
  if (splitIdx <= 0) splitIdx = 1;
  if (splitIdx >= items.length) splitIdx = items.length - 1;

  const left = items.slice(0, splitIdx);
  const right = items.slice(splitIdx);
  const leftValue = left.reduce((acc, it) => acc + (it.value || 1), 0);
  const leftRatio = leftValue / totalValue;

  if (width >= height) {
    const leftW = width * leftRatio;
    return [
      ...layoutTreemap(left, x, y, leftW, height),
      ...layoutTreemap(right, x + leftW, y, width - leftW, height),
    ];
  } else {
    const topH = height * leftRatio;
    return [
      ...layoutTreemap(left, x, y, width, topH),
      ...layoutTreemap(right, x, y + topH, width, height - topH),
    ];
  }
}

export default function CountryTreemap({ categories = [] }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const rects = layoutTreemap(categories);

  return (
    <div className="relative w-full h-[480px] rounded-xl overflow-hidden bg-black/40 p-1 border border-white/[0.04] select-none">
      {rects.map((rect, idx) => {
        const isHovered = hoveredIdx === idx;
        const isTiny = rect.width < 14 || rect.height < 14;
        const isSmall = rect.width < 22 || rect.height < 20;

        return (
          <div
            key={rect.name || idx}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              position: 'absolute',
              left: `${rect.x}%`,
              top: `${rect.y}%`,
              width: `${rect.width}%`,
              height: `${rect.height}%`,
              padding: '2px',
              transition: 'transform 0.15s ease, z-index 0.15s ease',
              zIndex: isHovered ? 20 : 1,
            }}
          >
            <div
              className={`w-full h-full rounded-lg p-2.5 md:p-3.5 flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-200 border border-white/10 ${
                rect.color || 'bg-[#00947c]'
              } ${isHovered ? 'brightness-110 shadow-xl scale-[1.01]' : 'hover:brightness-105'}`}
            >
              {/* Category Name */}
              <div className="min-w-0">
                <span
                  className={`font-semibold text-white block leading-tight ${
                    isTiny
                      ? 'text-[10px] truncate'
                      : isSmall
                      ? 'text-xs truncate'
                      : 'text-xs md:text-sm line-clamp-2'
                  }`}
                  title={`${rect.name} (${rect.count})`}
                >
                  {rect.name}
                </span>
              </div>

              {/* Count beneath name */}
              <div className="mt-1">
                <span
                  className={`font-mono text-white/90 block ${
                    isTiny
                      ? 'text-[9px]'
                      : isSmall
                      ? 'text-[11px]'
                      : 'text-xs md:text-sm font-medium'
                  }`}
                >
                  {rect.count}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
