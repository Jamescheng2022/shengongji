"use client";

import React, { useState } from "react";
import { type GameState } from "@/lib/game-engine";

interface ShareButtonProps {
  gameState: GameState;
  onGeneratePoster: () => void;
  className?: string;
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

export default function ShareButton({ gameState, onGeneratePoster, className = "" }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("链接已复制");
    setIsOpen(false);
  };

  const copyText = () => {
    const ending = gameState.ending ? ENDING_NAME_MAP[gameState.ending] : "未知结局";
    const action = gameState.ending === "queen" ? "位登后座" : "起起落落";
    const text = `我在《深宫纪》中从秀女一步步${action}，用了${gameState.currentEpisode}回。结局：${ending}。你也来试试？ #深宫纪 #AI宫斗 #你的后宫你做主`;
    
    navigator.clipboard.writeText(text);
    showToast("文案已复制");
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`btn-palace flex items-center justify-center gap-2 ${className}`}
      >
        <span className="text-xl">📤</span>
        分享成就
      </button>

      {/* Share Sheet / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 animate-fade-in" onClick={() => setIsOpen(false)}>
          <div 
            className="w-full md:max-w-md bg-[#1a1a2e] border-t md:border border-[#D4AF37]/30 rounded-t-3xl md:rounded-3xl p-6 md:p-8 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-6 md:hidden" />
            <h3 className="text-xl font-bold text-gold text-center mb-8">分享给好友</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <button onClick={copyLink} className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl group-active:scale-90 transition-transform">🔗</div>
                <span className="text-xs text-white/60">复制链接</span>
              </button>
              
              <button onClick={() => { onGeneratePoster(); setIsOpen(false); }} className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-2xl text-gold group-active:scale-90 transition-transform">🖼️</div>
                <span className="text-xs text-white/60">生成海报</span>
              </button>
              
              <button onClick={copyText} className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl group-active:scale-90 transition-transform">📝</div>
                <span className="text-xs text-white/60">复制文案</span>
              </button>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-10 py-3 text-white/40 hover:text-white transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* Simple Toast */}
      {toast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] px-6 py-3 bg-[#D4AF37] text-[#1a1a2e] font-bold rounded-full shadow-2xl animate-fade-in">
          {toast}
        </div>
      )}
    </>
  );
}
