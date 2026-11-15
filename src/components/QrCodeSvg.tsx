import React from 'react';

interface QrCodeSvgProps {
  seed?: string;
  size?: number;
  className?: string;
}

export const QrCodeSvg: React.FC<QrCodeSvgProps> = ({
  seed = 'HAILUZHONG2026',
  size = 84,
  className = '',
}) => {
  const gridSize = 15;
  const cells: boolean[][] = [];

  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  const isFinderArea = (r: number, c: number) => {
    const topLeft = r < 5 && c < 5;
    const topRight = r < 5 && c >= gridSize - 5;
    const bottomLeft = r >= gridSize - 5 && c < 5;
    return topLeft || topRight || bottomLeft;
  };

  for (let r = 0; r < gridSize; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < gridSize; c++) {
      if (isFinderArea(r, c)) {
        const lr = r >= gridSize - 5 ? r - (gridSize - 5) : r;
        const lc = c >= gridSize - 5 ? c - (gridSize - 5) : c;
        const border = lr === 0 || lr === 4 || lc === 0 || lc === 4;
        const center = lr === 2 && lc === 2;
        row.push(border || center);
      } else {
        const bit = ((hash >>> ((r * gridSize + c) % 24)) ^ (r * 7 + c * 13)) & 1;
        row.push(bit === 1);
      }
    }
    cells.push(row);
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${gridSize + 2} ${gridSize + 2}`}
      className={`rounded-lg bg-white p-1 border border-slate-200/80 ${className}`}
      role="img"
      aria-label="海露钟小程序二维码"
    >
      <rect width={gridSize + 2} height={gridSize + 2} fill="#FFFFFF" />
      {cells.map((row, r) =>
        row.map((filled, c) =>
          filled ? (
            <rect
              key={`${r}-${c}`}
              x={c + 1}
              y={r + 1}
              width={0.92}
              height={0.92}
              rx={0.18}
              fill="#0C4A6E"
            />
          ) : null
        )
      )}
    </svg>
  );
};
