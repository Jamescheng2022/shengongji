"use client";

import React from "react";
import type { Stats, Rank } from "@/lib/game-engine";
import { RANK_ORDER, getRankTitle } from "@/lib/game-engine";

interface StatPanelProps {
  stats: Stats;
  rank: Rank;
  episode: number;
}

const STAT_CONFIG = [
  { key: "favor" as const, label: "宠爱", icon: "♥", color: "#E74C3C" },
  { key: "scheming" as const, label: "心机", icon: "◆", color: "#9B59B6" },
  { key: "health" as const, label: "健康", icon: "✚", color: "#27AE60" },
  { key: "influence" as const, label: "势力", icon: "⚑", color: "#2980B9" },
  { key: "wisdom" as const, label: "智慧", icon: "✦", color: "#F39C12" },
  { key: "virtue" as const, label: "德行", icon: "☯", color: "#1ABC9C" },
  { key: "cruelty" as const, label: "狠毒", icon: "✕", color: "#C0392B" },
  { key: "silver" as const, label: "银两", icon: "⊕", color: "#D4AF37" },
];

export const StatPanel: React.FC<StatPanelProps> = ({ stats, rank, episode }) => {
  return (
    <div className="px-4 md:px-8 py-4" style={{ background: "var(--bg-card)" }}>
      <div className="max-w-2xl mx-auto">
        {/* 位份与集数 */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>位份：</span>
            <span className="font-semibold" style={{ color: "var(--palace-gold)" }}>
              {getRankTitle(rank)}
            </span>
          </div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            存活 <span style={{ color: "var(--text-gold)" }}>{episode}</span> / 100 集
          </div>
        </div>

        {/* 位份进度 */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
            <span>晋升之路</span>
            <span>{RANK_ORDER.indexOf(rank) + 1} / {RANK_ORDER.length}</span>
          </div>
          <div className="flex gap-1">
            {RANK_ORDER.map((r, i) => (
              <div
                key={r}
                className="h-1.5 flex-1 rounded-full transition-colors duration-500"
                title={r}
                style={{
                  background:
                    i <= RANK_ORDER.indexOf(rank)
                      ? "var(--palace-gold)"
                      : "rgba(212,175,55,0.15)",
                }}
              />
            ))}
          </div>
        </div>

        <div className="divider-gold mb-4" />

        {/* 属性网格 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STAT_CONFIG.map((cfg) => {
            const val = stats[cfg.key];
            const maxVal = cfg.key === "silver" ? 9999 : (cfg.key === "virtue" ? 200 : 100);
            const displayVal = cfg.key === "virtue" ? val : val;
            const barPct =
              cfg.key === "silver"
                ? Math.min(100, (val / 2000) * 100)
                : cfg.key === "virtue"
                ? ((val + 100) / 200) * 100
                : val;

            return (
              <div key={cfg.key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    <span style={{ color: cfg.color }}>{cfg.icon}</span> {cfg.label}
                  </span>
                  <span className="text-xs font-mono" style={{ color: "var(--text-primary)" }}>
                    {cfg.key === "silver" ? val : displayVal}
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.max(0, Math.min(100, barPct))}%`,
                      background: cfg.color,
                      opacity: 0.7,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
