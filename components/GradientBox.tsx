// app/components/GradientBox.tsx
'use client';

import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, X } from 'lucide-react';
import { useState } from 'react';

// HSL/HEX変換関数（簡易版）-------------------
function hexToHsl(hex: string) {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16) / 255;
    g = parseInt(hex.slice(3, 5), 16) / 255;
    b = parseInt(hex.slice(5, 7), 16) / 255;
  }
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;
  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  return (
    '#' +
    [r, g, b].map((x) => x.toString(16).padStart(2, '0').toUpperCase()).join('')
  );
}
// ------------------------------------------------

const randomHexColor = (): string =>
  '#' +
  Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0');

type SavedGrad = { id: string; colors: [string, string] };

export default function GradientBox() {
  const [colors, setColors] = useState<[string, string]>([
    '#F582A8',
    '#FCE0E2',
  ]);
  const [animationKey, setAnimationKey] = useState(0);
  const [saved, setSaved] = useState<SavedGrad[]>([]);
  const [copied, setCopied] = useState<[boolean, boolean]>([false, false]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleClick = () => {
    const newColors: [string, string] = [colors[1], randomHexColor()];
    setColors(newColors);
    setAnimationKey((prev) => prev + 1);
    setCopied([false, false]);
  };

  const handleCopy = async (idx: 0 | 1) => {
    await navigator.clipboard.writeText(colors[idx].toUpperCase());
    setCopied([idx === 0, idx === 1]);
    setTimeout(() => setCopied([false, false]), 1200);
  };

  const handleSave = () => {
    const id = `${colors[0]}-${colors[1]}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    setSaved((prev) => [...prev, { id, colors }]);
  };

  const handleRecall = (g: [string, string]) => {
    setColors(g);
    setAnimationKey((prev) => prev + 1);
    setCopied([false, false]);
  };

  const handleDelete = (id: string) => {
    setSaved((prev) => prev.filter((item) => item.id !== id));
  };

  const getGradient = ([c1, c2]: [string, string]) =>
    `linear-gradient(135deg, ${c1}, ${c2})`;

  return (
    <div className="w-full flex flex-col font-sans mt-10 sm:mt-6 lg:mt-0">
      {/* メインカード（今のグラデーション） */}
      <div className="relative w-full aspect-[16/9] mb-8 overflow-hidden rounded-4xl shadow-lg shadow-black/10">
        <button
          className="absolute top-5 right-5 z-10 p-2 rounded-full bg-white/70 transition-colors"
          onClick={handleSave}
          title="ブックマークとして保存"
        >
          <Bookmark className="w-6 h-6 text-neutral-400" />
        </button>
        <motion.div
          key={animationKey}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{ background: getGradient(colors) }}
          className="absolute inset-0"
        />
      </div>
      {/* カラーコード表示 */}
      <div className="mb-2 flex items-center justify-center gap-2 text-xl font-mono tracking-wider">
        <span
          className="cursor-pointer relative hover:underline text-sm font-mono"
          onClick={() => handleCopy(0)}
          title="クリックで色1をコピー"
        >
          {colors[0].toUpperCase()}
          {copied[0] && (
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded bg-neutral-900 px-2 py-1 text-xs text-white whitespace-nowrap">
              コピーしました！
            </span>
          )}
        </span>
        {/* 点線の矢印 */}
        <span className="text-neutral-200">→</span>
        <span
          className="cursor-pointer relative hover:underline text-sm font-mono"
          onClick={() => handleCopy(1)}
          title="クリックで色2をコピー"
        >
          {colors[1].toUpperCase()}
          {copied[1] && (
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded bg-neutral-900 px-2 py-1 text-xs text-white whitespace-nowrap">
              コピーしました！
            </span>
          )}
        </span>
      </div>

      {/* 保存済みカード一覧 */}

      <div className="flex flex-wrap gap-3 justify-start w-full mt-8 p-2">
        <h2 className="w-full text-lg font-bold mb-2 text-[#333]">ALL</h2>

        <AnimatePresence>
          {saved.map(({ id, colors: g }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{
                duration: 0.2,
                ease: 'easeInOut',
              }}
              className="relative 
          w-[100px] h-[100px]
          sm:w-[120px] sm:h-[200px]
          rounded-3xl
          cursor-pointer
          transition-all
          hover:shadow-lg hover:shadow-black/10"
              style={{
                background: getGradient(g),
              }}
              onMouseEnter={() => setHoveredCard(id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleRecall(g)}
              title="クリックで呼び出し"
            >
              <AnimatePresence>
                {hoveredCard === id && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{
                      duration: 0.2,
                      ease: 'easeInOut',
                    }}
                    className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(id);
                    }}
                    title="削除"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 一覧の下で中央寄せにする */}
      <div className="flex justify-end w-full mb-6 fixed bottom-0 left-0 right-0 pr-5 pb-5">
        <button
          onClick={handleClick}
          className="
      rounded-full
      bg-neutral-500
      px-5 py-4
      text-xl text-white
      shadow-2xl
      transition-all
      active:scale-95
      font-sans
    "
          style={{ zIndex: 999 }}
        >
          {/* リセットボタン */}
          <FontAwesomeIcon icon={faRotateLeft} />
        </button>
      </div>
    </div>
  );
}
