"use client";

import React, { useEffect } from "react";
import { useGameStore } from "@/lib/store";
import { getRankTitle } from "@/lib/game-engine";

export default function SavesScreen() {
  const saves = useGameStore((s) => s.saves);
  const loadGame = useGameStore((s) => s.loadGame);
  const removeSave = useGameStore((s) => s.removeSave);
  const setScreen = useGameStore((s) => s.setScreen);
  const refreshSaves = useGameStore((s) => s.refreshSaves);

  useEffect(() => {
    refreshSaves();
  }, [refreshSaves]);

  return (
    <div className="min-h-dvh flex flex-col items-center px-3 sm:px-4 py-6 sm:py-8 safe-top safe-bottom">
      {/* 返回 */}
      <button
        onClick={() => setScreen("home")}
        className="self-start mb-4 sm:mb-6 text-sm min-h-[44px] flex items-center active:scale-95"
        style={{ color: "var(--text-secondary)" }}
      >
        ← 返回
      </button>

      <h2
        className="text-xl sm:text-2xl font-bold tracking-widest mb-6 sm:mb-8"
        style={{ color: "var(--palace-gold)" }}
      >
        读取存档
      </h2>

      {saves.length === 0 ? (
        <div className="text-center mt-16 sm:mt-20 px-4" style={{ color: "var(--text-secondary)" }}>
          <p className="text-base sm:text-lg mb-2">暂无存档</p>
          <p className="text-sm opacity-60">开始新游戏后将自动创建存档</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full max-w-2xl">
          {saves
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .map((save) => (
              <div
                key={save.id}
                className="p-4 sm:p-5 border animate-fade-in-up"
                style={{
                  background: "var(--bg-card)",
                  borderColor: "var(--border-gold)",
                }}
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span
                    className="font-semibold text-sm sm:text-base"
                    style={{ color: "var(--text-gold)" }}
                  >
                    {save.playerProfile?.fullName || ""} {getRankTitle(save.rank, save.playerProfile)}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    第{save.currentEpisode}集
                  </span>
                </div>

                {/* 核心属性 */}
                <div className="grid grid-cols-3 gap-2 mb-3 sm:mb-4 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <span>❤️ {save.stats.favor}</span>
                  <span>💚 {save.stats.health}</span>
                  <span>👑 {save.stats.influence}</span>
                </div>

                {/* 时间 */}
                <div className="text-xs mb-3 sm:mb-4" style={{ color: "var(--text-secondary)", opacity: 0.5 }}>
                  {new Date(save.updatedAt).toLocaleString("zh-CN")}
                </div>

                {/* 操作 */}
                <div className="flex gap-3">
                  <button
                    onClick={() => loadGame(save)}
                    className="btn-palace flex-1 text-sm py-2.5 min-h-[44px] active:scale-95"
                  >
                    载入
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("确定删除此存档？")) removeSave(save.id);
                    }}
                    className="text-sm px-4 py-2.5 min-h-[44px] border transition-colors active:scale-95"
                    style={{
                      color: "var(--text-secondary)",
                      borderColor: "var(--border-gold)",
                      opacity: 0.6,
                    }}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
