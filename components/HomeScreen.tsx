"use client";

import React, { useState, useEffect } from "react";
import { useGameStore } from "@/lib/store";
import { getLatestSave, getRankTitle, type GameState } from "@/lib/game-engine";

export default function HomeScreen() {
  const startNewGame = useGameStore((s) => s.startNewGame);
  const loadGame = useGameStore((s) => s.loadGame);
  const setScreen = useGameStore((s) => s.setScreen);

  const [latestSave, setLatestSave] = useState<GameState | null>(null);

  // 只在客户端读取 localStorage，避免 hydration 不匹配
  useEffect(() => {
    setLatestSave(getLatestSave());
  }, []);

  return (
    <div className="min-h-screen bg-palace flex flex-col items-center justify-center px-4 relative">
      {/* 半透明遮罩 */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* 内容层 */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* 装饰线 */}
        <div className="w-32 divider-gold mb-8" />

        {/* 标题 */}
        <h1
          className="text-5xl md:text-7xl font-black tracking-[0.3em] mb-3 text-center"
          style={{ color: "var(--palace-gold)" }}
        >
          深宫纪
        </h1>
        <p className="text-sm tracking-[0.5em] mb-2" style={{ color: "var(--text-secondary)" }}>
          S H E N G O N G J I
        </p>
        <p
          className="text-xs tracking-widest mb-12"
          style={{ color: "var(--text-secondary)", opacity: 0.6 }}
        >
          AI 互动宫廷小说 · 存活即胜利
        </p>

        {/* 装饰线 */}
        <div className="w-24 divider-gold mb-10" />

        {/* 菜单 */}
        <div className="flex flex-col gap-4 w-full max-w-xs">
          {/* 继续游戏 */}
          {latestSave && (
            <button
              onClick={() => loadGame(latestSave)}
              className="btn-palace glow-gold"
            >
              <div className="font-semibold">继续游戏</div>
              <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                第{latestSave.currentEpisode}集 · {getRankTitle(latestSave.rank)}
              </div>
            </button>
          )}

          {/* 新的开始 */}
          <button onClick={startNewGame} className="btn-palace">
            新的开始
          </button>

          {/* 读取存档 */}
          <button onClick={() => setScreen("saves")} className="btn-palace">
            读取存档
          </button>

          {/* 玩法说明 */}
          <button onClick={() => setScreen("help")} className="btn-palace">
            玩法说明
          </button>

          {/* 宫册 */}
          {latestSave && latestSave.chapters && latestSave.chapters.length > 0 && (
            <button
              onClick={() => {
                loadGame(latestSave);
                setTimeout(() => setScreen("book"), 50);
              }}
              className="btn-palace"
            >
              <div>我的宫册</div>
              <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                已记{latestSave.chapters.length}回
              </div>
            </button>
          )}
        </div>

        {/* 底部信息 */}
        <div className="mt-16 text-center">
          <p className="text-xs" style={{ color: "var(--text-secondary)", opacity: 0.4 }}>
            景隆朝 · 架空历史 · 纯属虚构
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)", opacity: 0.3 }}>
            v0.1 Beta
          </p>
        </div>
      </div>
    </div>
  );
}
