"use client";

import React from "react";
import { useGameStore } from "@/lib/store";

export default function HelpScreen() {
  const setScreen = useGameStore((s) => s.setScreen);

  return (
    <div className="min-h-screen bg-palace flex items-center justify-center px-4 py-8 relative">
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-xl bg-paper px-6 md:px-12 py-10 md:py-16 shadow-2xl border-2 border-palace-gold/30 rounded-sm overflow-y-auto max-h-[90vh] custom-scrollbar">
        {/* 卷轴装饰 */}
        <div className="absolute top-4 left-4 right-4 h-px bg-gradient-to-r from-transparent via-palace-gold/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 h-px bg-gradient-to-r from-transparent via-palace-gold/50 to-transparent" />

        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 tracking-widest text-palace-red" style={{ fontFamily: '"Noto Serif SC", serif' }}>
          《深宫纪》玩法指南
        </h1>

        <div className="space-y-8 text-ink-black leading-relaxed">
          <section>
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-palace-red border-b border-palace-red/10 pb-1">
              <span>📜</span> 你是谁
            </h2>
            <p className="text-sm md:text-base">
              你是沈知意，汉军旗出身，书香门第之女。父亲沈德山任大理寺少卿，清正不阿。景隆二年选秀入宫，从此踏入这后宫棋局。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-palace-red border-b border-palace-red/10 pb-1">
              <span>🎯</span> 你的目标
            </h2>
            <p className="text-sm md:text-base">
              从秀女一步步晋升，在尔虞我诈的后宫中存活100回。你的每一个选择都将影响命运走向——是母仪天下，还是香消玉殒？
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-palace-red border-b border-palace-red/10 pb-1">
              <span>🎮</span> 怎么玩
            </h2>
            <p className="text-sm md:text-base">
              每回合阅读剧情后做出选择。三个预设选项各有利弊，也可以自由输入你的想法。AI 会根据你的选择续写独一无二的故事。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-palace-red border-b border-palace-red/10 pb-1">
              <span>📊</span> 核心属性
            </h2>
            <p className="text-sm md:text-base">
              宠爱（皇上恩宠）、健康（身体状况）、势力（后宫同盟）、银两（可用资财）。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-palace-red border-b border-palace-red/10 pb-1">
              <span>🔄</span> 改命系统
            </h2>
            <p className="text-sm md:text-base">
              每日可免费回退1次，回到命运的转折点重新选择。超出免费次数需消耗50银两。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-palace-red border-b border-palace-red/10 pb-1">
              <span>🏆</span> 八种结局
            </h2>
            <p className="text-sm md:text-base italic">
              封后/善终/冷宫/流放/赐死/病逝/自尽/出家——你的命运，你来书写。
            </p>
          </section>
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setScreen("home")}
            className="px-8 py-3 bg-palace-red text-paper rounded-sm shadow-lg hover:bg-red-900 transition-colors tracking-widest font-bold"
          >
            知道了，开始我的宫廷人生
          </button>
        </div>
      </div>
    </div>
  );
}
