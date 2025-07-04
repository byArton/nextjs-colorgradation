// components/GradientBox.tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

// ランダムな16進カラー生成
const randomHexColor = (): string =>
  '#' +
  Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0');

export default function GradientBox() {
  // colors[0]: 左側の色, colors[1]: 右側の色
  const [colors, setColors] = useState<string[]>([
    randomHexColor(),
    randomHexColor(),
  ]);

  const handleClick = () => {
    setColors(([_, prev2]) => [prev2, randomHexColor()]);
  };

  const gradient = `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      `${colors[0].toUpperCase()} → ${colors[1].toUpperCase()}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={colors.join('-')}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.3, type: 'spring' }}
          style={{
            background: gradient,
            borderRadius: '2rem',
            width: 320,
            height: 200,
            boxShadow: '0 4px 32px 0 rgba(0,0,0,0.08)',
            marginBottom: 32,
            marginTop: 64,
          }}
          className="flex items-center justify-center"
        />
      </AnimatePresence>
      {/* HEX色表記 */}
      <div className="mb-4 text-lg font-mono tracking-wide select-all text-center">
        {colors[0].toUpperCase()} → {colors[1].toUpperCase()}
      </div>
      {/* ボタン */}
      <button
        onClick={handleClick}
        className="rounded-2xl bg-neutral-900 text-white px-8 py-3 font-semibold shadow hover:bg-neutral-800 active:scale-95 transition-all"
      >
        カラーを変更
      </button>
    </div>
  );
}
