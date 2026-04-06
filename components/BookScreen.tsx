"use client";

import React, { useState } from "react";
import { useGameStore } from "@/lib/store";
import { getRankTitle, canFreeRewind, type Chapter, type Stats } from "@/lib/game-engine";

const STAT_LABELS: Record<string, string> = {
  favor: "宠爱", scheming: "心机", health: "健康", influence: "势力",
  silver: "银两", wisdom: "智慧", virtue: "德行", cruelty: "狠毒",
};

export default function BookScreen() {
  const gameState = useGameStore((s) => s.gameState);
  const setScreen = useGameStore((s) => s.setScreen);
  const rewindTo = useGameStore((s) => s.rewindToChapter);

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showRewindConfirm, setShowRewindConfirm] = useState<string | null>(null);

  if (!gameState) return null;

  const chapters = gameState.chapters;
  const currentChapter = selectedIdx !== null ? chapters[selectedIdx] : null;
  const hasFreeRewind = canFreeRewind(gameState);

  const handleRewind = (chapterId: string) => {
    rewindTo(chapterId);
    setShowRewindConfirm(null);
    setScreen("play");
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* 顶栏 */}
      <header
        className="flex items-center justify-between px-4 py-3 border-b shrink-0"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-gold)" }}
      >
        <button
          onClick={() => setScreen("play")}
          className="text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          ← 返回游戏
        </button>
        <h2 className="text-base font-semibold tracking-widest" style={{ color: "var(--palace-gold)" }}>
          宫 册
        </h2>
        <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
          共{chapters.length}回
        </div>
      </header>

      {chapters.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center" style={{ color: "var(--text-secondary)" }}>
            <p className="text-lg mb-2">宫册尚空</p>
            <p className="text-sm opacity-60">随着剧情推进，你的故事将在此汇集成册</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* ====== 左：章节目录 ====== */}
          <aside
            className="w-48 md:w-60 border-r overflow-y-auto custom-scrollbar shrink-0"
            style={{ background: "var(--bg-card)", borderColor: "var(--border-gold)" }}
          >
            <div className="py-2">
              {chapters.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => setSelectedIdx(idx)}
                  className="w-full text-left px-4 py-3 border-b transition-all"
                  style={{
                    borderColor: "rgba(212,175,55,0.08)",
                    background: selectedIdx === idx ? "rgba(139,37,0,0.2)" : "transparent",
                    color: selectedIdx === idx ? "var(--palace-gold)" : "var(--text-secondary)",
                  }}
                >
                  <div className="text-sm font-medium">{ch.title}</div>
                  <div className="text-xs mt-1 opacity-60">
                    第{ch.episode}集 · {getRankTitle(ch.rankAtTime)}
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* ====== 右：章节内容 ====== */}
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            {currentChapter ? (
              <div className="max-w-2xl mx-auto px-6 md:px-10 py-8">
                {/* 章节标题 */}
                <div className="text-center mb-8">
                  <div className="text-xs tracking-widest mb-2" style={{ color: "var(--text-secondary)" }}>
                    第{currentChapter.episode}集
                  </div>
                  <h3
                    className="text-2xl font-bold tracking-wider"
                    style={{ color: "var(--palace-gold)" }}
                  >
                    {currentChapter.title}
                  </h3>
                  <div className="text-xs mt-2" style={{ color: "var(--text-secondary)", opacity: 0.5 }}>
                    {getRankTitle(currentChapter.rankAtTime)} · {new Date(currentChapter.timestamp).toLocaleString("zh-CN")}
                  </div>
                  <div className="w-16 divider-gold mx-auto mt-4" />
                </div>

                {/* 剧情正文 */}
                <div
                  className="leading-loose text-base whitespace-pre-wrap mb-8"
                  style={{ color: "var(--text-primary)" }}
                >
                  {currentChapter.narration}
                </div>

                {/* 当时的选项 + 玩家的选择 */}
                {currentChapter.playerChoice && (
                  <div className="mb-8">
                    <div className="divider-gold mb-4" />
                    <div className="text-xs mb-3 tracking-wider" style={{ color: "var(--text-secondary)" }}>
                      抉择时刻
                    </div>
                    <div className="space-y-2">
                      {currentChapter.availableChoices.map((opt) => {
                        const isChosen = opt.text === currentChapter.playerChoice;
                        return (
                          <div
                            key={opt.id}
                            className="px-4 py-2.5 border text-sm"
                            style={{
                              borderColor: isChosen ? "var(--palace-gold)" : "var(--border-gold)",
                              background: isChosen ? "rgba(139,37,0,0.2)" : "transparent",
                              color: isChosen ? "var(--palace-gold)" : "var(--text-secondary)",
                              opacity: isChosen ? 1 : 0.5,
                            }}
                          >
                            {isChosen && (
                              <span className="text-xs mr-2" style={{ color: "var(--palace-gold)" }}>✦</span>
                            )}
                            {opt.text}
                            {isChosen && (
                              <span className="text-xs ml-2 opacity-60">← 你的选择</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* 改命按钮 */}
                    <button
                      onClick={() => setShowRewindConfirm(currentChapter.id)}
                      className="mt-4 text-xs px-4 py-2 border rounded transition-all hover:opacity-100"
                      style={{
                        borderColor: "rgba(212,175,55,0.3)",
                        color: "var(--palace-red-light)",
                        opacity: 0.7,
                      }}
                    >
                      ↺ 改命 — 回到此处重新选择
                    </button>
                  </div>
                )}

                {/* 属性变化 */}
                {Object.keys(currentChapter.statChanges).length > 0 && (
                  <div className="mb-8">
                    <div className="divider-gold mb-4" />
                    <div className="text-xs mb-3 tracking-wider" style={{ color: "var(--text-secondary)" }}>
                      命运变动
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(currentChapter.statChanges)
                        .filter(([, v]) => v !== 0)
                        .map(([key, val]) => (
                          <span
                            key={key}
                            className="text-sm px-3 py-1 border rounded"
                            style={{
                              borderColor: "var(--border-gold)",
                              color: (val as number) > 0 ? "#27AE60" : "#E74C3C",
                            }}
                          >
                            {STAT_LABELS[key]} {(val as number) > 0 ? "+" : ""}{val}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {/* 章节翻页 */}
                <div className="flex justify-between items-center pt-6">
                  <button
                    onClick={() => setSelectedIdx(Math.max(0, (selectedIdx ?? 0) - 1))}
                    disabled={selectedIdx === 0}
                    className="text-sm transition-colors disabled:opacity-20"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    ← 前一回
                  </button>
                  <span className="text-xs" style={{ color: "var(--text-secondary)", opacity: 0.4 }}>
                    {(selectedIdx ?? 0) + 1} / {chapters.length}
                  </span>
                  <button
                    onClick={() => setSelectedIdx(Math.min(chapters.length - 1, (selectedIdx ?? 0) + 1))}
                    disabled={selectedIdx === chapters.length - 1}
                    className="text-sm transition-colors disabled:opacity-20"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    后一回 →
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center h-full">
                <p className="text-sm" style={{ color: "var(--text-secondary)", opacity: 0.5 }}>
                  ← 请从目录中选择一个章节
                </p>
              </div>
            )}
          </main>
        </div>
      )}

      {/* ====== 改命确认弹窗 ====== */}
      {showRewindConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div
            className="max-w-sm w-full mx-4 p-6 border animate-fade-in-up"
            style={{ background: "var(--bg-primary)", borderColor: "var(--palace-gold)" }}
          >
            <h3 className="text-lg font-bold mb-4 text-center" style={{ color: "var(--palace-gold)" }}>
              改命
            </h3>
            <p className="text-sm leading-relaxed mb-2" style={{ color: "var(--text-primary)" }}>
              回到此处将删除之后的所有剧情章节，恢复当时的属性状态，让你重新做出选择。
            </p>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              {hasFreeRewind ? (
                <>今日还有 <span style={{ color: "var(--palace-gold)" }}>1次</span> 免费改命机会</>
              ) : (
                <>今日免费次数已用完，需消耗 <span style={{ color: "var(--palace-gold)" }}>50银两</span></>
              )}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRewindConfirm(null)}
                className="flex-1 py-2.5 border text-sm"
                style={{ borderColor: "var(--border-gold)", color: "var(--text-secondary)" }}
              >
                取消
              </button>
              <button
                onClick={() => handleRewind(showRewindConfirm)}
                className="btn-palace flex-1 py-2.5 text-sm"
                disabled={!hasFreeRewind && gameState.stats.silver < 50}
              >
                {hasFreeRewind ? "免费改命" : "消耗50银两"}
              </button>
            </div>
            {!hasFreeRewind && gameState.stats.silver < 50 && (
              <p className="text-xs text-center mt-3" style={{ color: "#E74C3C" }}>
                银两不足，无法改命
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
