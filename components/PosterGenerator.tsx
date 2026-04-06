"use client";

import React, { useRef, useEffect, useState } from "react";
import { type GameState, type Stats, getRankTitle } from "@/lib/game-engine";

interface PosterGeneratorProps {
  gameState: GameState;
  onClose: () => void;
}

const ENDING_NAME_MAP: Record<string, string> = {
  queen: "母仪天下",
  peaceful: "岁月静好",
  death_poison: "鸩酒之殇",
  death_illness: "红颜薄命",
  cold_palace: "冷宫幽怨",
  exile: "天涯孤客",
  suicide: "玉碎昆冈",
  become_nun: "青灯古佛",
};

export default function PosterGenerator({ gameState, onClose }: PosterGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [posterUrl, setPosterUrl] = useState<string>("");

  const generatePoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. 背景绘制
    const gradient = ctx.createLinearGradient(0, 0, 0, 1000);
    gradient.addColorStop(0, "#4a0000");
    gradient.addColorStop(1, "#1a1a2e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 750, 1000);

    // 绘制宫殿轮廓 (剪影)
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.beginPath();
    ctx.moveTo(0, 800);
    ctx.lineTo(150, 750);
    ctx.lineTo(200, 700);
    ctx.lineTo(250, 750);
    ctx.lineTo(500, 750);
    ctx.lineTo(550, 700);
    ctx.lineTo(600, 750);
    ctx.lineTo(750, 800);
    ctx.lineTo(750, 1000);
    ctx.lineTo(0, 1000);
    ctx.closePath();
    ctx.fill();

    // 2. 顶部标题 「深宫纪」
    ctx.fillStyle = "#D4AF37";
    ctx.textAlign = "center";
    ctx.font = "bold 80px 'Noto Serif SC', 'Source Han Serif SC', serif";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 10;
    ctx.fillText("深 宫 纪", 375, 150);
    ctx.shadowBlur = 0;

    // 3. 副标题
    ctx.font = "24px 'Noto Serif SC', 'Source Han Serif SC', serif";
    ctx.fillStyle = "rgba(212, 175, 55, 0.8)";
    ctx.fillText("AI 宫 廷 剧 · 你 来 演", 375, 200);

    // 4. 分隔线
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(275, 230);
    ctx.lineTo(475, 230);
    ctx.stroke();

    // 5. 主文案
    const endingName = gameState.ending ? ENDING_NAME_MAP[gameState.ending] : "未知结局";
    ctx.fillStyle = "#F5F0E8";
    ctx.font = "32px 'Noto Serif SC', 'Source Han Serif SC', serif";
    ctx.fillText(`我用 ${gameState.currentEpisode} 回`, 375, 300);
    ctx.fillText(`从秀女一步步 ${endingName === "母仪天下" ? "成就" : "走到"}`, 375, 350);

    // 6. 属性展示
    const { favor, influence, silver } = gameState.stats;
    ctx.font = "28px Arial";
    ctx.fillStyle = "#D4AF37";
    const statsText = `❤️${favor}   👑${influence}   🪙${silver}`;
    ctx.fillText(statsText, 375, 450);

    // 7. 结局名称 (大字)
    ctx.fillStyle = "#D4AF37";
    ctx.font = "bold 100px 'Noto Serif SC', 'Source Han Serif SC', serif";
    ctx.fillText(endingName, 375, 600);

    // 8. Hashtags
    ctx.font = "24px 'Noto Serif SC', 'Source Han Serif SC', serif";
    ctx.fillStyle = "rgba(245, 240, 232, 0.6)";
    ctx.fillText("#深宫纪 #AI宫斗 #你的后宫你做主", 375, 750);

    // 9. 底部提示
    ctx.font = "20px 'Noto Serif SC', 'Source Han Serif SC', serif";
    ctx.fillStyle = "rgba(245, 240, 232, 0.4)";
    ctx.fillText("长按识别小程序码，开始你的宫廷人生", 375, 930);

    // 边框
    ctx.strokeStyle = "rgba(212, 175, 55, 0.3)";
    ctx.lineWidth = 20;
    ctx.strokeRect(10, 10, 730, 980);

    setPosterUrl(canvas.toDataURL("image/png"));
  };

  useEffect(() => {
    // 延迟一丢丢确保字体加载（虽然简单实现不一定能保证）
    const timer = setTimeout(generatePoster, 100);
    return () => clearTimeout(timer);
  }, [gameState]);

  const handleSave = () => {
    const link = document.createElement("a");
    link.download = `深宫纪_结局_${Date.now()}.png`;
    link.href = posterUrl;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4 animate-fade-in">
      <div className="relative w-full max-w-[450px] aspect-[3/4] bg-[#1a1a2e] rounded-lg overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          width={750}
          height={1000}
          className="hidden"
        />
        {posterUrl ? (
          <img src={posterUrl} alt="Game Poster" className="w-full h-full object-contain" />
        ) : (
          <div className="flex items-center justify-center h-full text-gold">生成中...</div>
        )}
      </div>

      <div className="mt-6 flex gap-4 w-full max-w-[450px]">
        <button
          onClick={handleSave}
          className="flex-1 py-3 bg-[#D4AF37] text-[#1a1a2e] font-bold rounded-full shadow-lg active:scale-95 transition-transform"
        >
          保存图片
        </button>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-white/10 text-white font-medium rounded-full border border-white/20 active:scale-95 transition-transform"
        >
          关闭
        </button>
      </div>

      <p className="mt-4 text-white/40 text-xs">手机端可长按图片保存</p>
    </div>
  );
}
