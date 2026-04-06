"use client";

import React, { useState } from "react";
import { useGameStore } from "@/lib/store";
import type { EndingType } from "@/lib/game-engine";
import PosterGenerator from "./PosterGenerator";
import ShareButton from "./ShareButton";

const ENDING_INFO: Record<NonNullable<EndingType>, { title: string; desc: string; isHappy: boolean }> = {
  queen: {
    title: "母仪天下",
    desc: "历经百集风雨，沈知意终于登上皇后之位。从一个汉军旗秀女，到母仪天下的一国之母，这条路上的每一步，都浸透了智慧与坚韧。",
    isHappy: true,
  },
  peaceful: {
    title: "岁月静好",
    desc: "沈知意在后宫中安然度过了百集光阴。虽未登上皇后之位，却以自己的方式在这深宫中觅得了一方清净。善终，已是最好的结局。",
    isHappy: true,
  },
  death_poison: {
    title: "鸩酒之殇",
    desc: "一杯鸩酒，终结了沈知意在后宫的所有挣扎。权力的游戏没有怜悯，败者的下场，不过是一抹被抹去的痕迹。",
    isHappy: false,
  },
  death_illness: {
    title: "红颜薄命",
    desc: "深宫的阴冷与算计终于压垮了沈知意。在一个无人问津的夜晚，她在自己的寝殿中悄然离世，如同一朵无声凋零的花。",
    isHappy: false,
  },
  cold_palace: {
    title: "冷宫幽怨",
    desc: "失去了所有恩宠与势力，沈知意被打入冷宫。残垣断壁间，只有岁月无情地流逝。曾经的繁华如梦，再无人记得她的名字。",
    isHappy: false,
  },
  exile: {
    title: "天涯孤客",
    desc: "一纸诏书，沈知意被逐出京城，流放边疆。紫禁城的红墙在身后越来越远，她知道，此生再无归路。",
    isHappy: false,
  },
  suicide: {
    title: "玉碎昆冈",
    desc: "宁为玉碎，不为瓦全。沈知意在绝望中选择了最后的尊严。白绫三尺，了却了这一生的恩怨情仇。",
    isHappy: false,
  },
  become_nun: {
    title: "青灯古佛",
    desc: "看透了后宫的虚妄，沈知意遁入空门。晨钟暮鼓中，曾经的爱恨嗔痴化作一缕青烟，随风散去。这或许不是最好的结局，却是最通透的选择。",
    isHappy: false,
  },
};

export default function EndingScreen() {
  const gameState = useGameStore((s) => s.gameState);
  const startNewGame = useGameStore((s) => s.startNewGame);
  const setScreen = useGameStore((s) => s.setScreen);
  const [showPoster, setShowPoster] = useState(false);

  if (!gameState?.ending) {
    return null;
  }

  const info = ENDING_INFO[gameState.ending];

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-8 sm:py-12 text-center safe-top safe-bottom">
      {/* 海报生成层 */}
      {showPoster && (
        <PosterGenerator gameState={gameState} onClose={() => setShowPoster(false)} />
      )}

      {/* 结局类型标签 */}
      <p
        className="text-xs sm:text-sm tracking-[0.3em] sm:tracking-[0.5em] mb-4 sm:mb-6"
        style={{ color: info.isHappy ? "var(--palace-gold)" : "var(--text-secondary)" }}
      >
        {info.isHappy ? "— 善 终 —" : "— 终 局 —"}
      </p>

      {/* 标题 */}
      <h1
        className="text-3xl sm:text-4xl md:text-5xl font-black tracking-widest mb-6 sm:mb-8 animate-fade-in-up"
        style={{ color: info.isHappy ? "var(--palace-gold)" : "var(--palace-red-light)" }}
      >
        {info.title}
      </h1>

      {/* 描述 */}
      <p
        className="max-w-md text-sm sm:text-base leading-relaxed mb-5 sm:mb-6 animate-fade-in-up"
        style={{ color: "var(--text-primary)", animationDelay: "0.3s" }}
      >
        {info.desc}
      </p>

      {/* 统计 */}
      <div
        className="flex gap-6 sm:gap-8 mb-8 sm:mb-12 text-xs sm:text-sm animate-fade-in-up"
        style={{ color: "var(--text-secondary)", animationDelay: "0.6s" }}
      >
        <div>
          <div className="text-xl sm:text-2xl font-bold" style={{ color: "var(--text-gold)" }}>
            {gameState.currentEpisode}
          </div>
          <div>存活集数</div>
        </div>
        <div className="w-px" style={{ background: "var(--border-gold)" }} />
        <div>
          <div className="text-xl sm:text-2xl font-bold" style={{ color: "var(--text-gold)" }}>
            {gameState.rank}
          </div>
          <div>最终位份</div>
        </div>
      </div>

      {/* 分隔线 */}
      <div className="w-20 sm:w-24 divider-gold mb-8 sm:mb-10" />

      {/* 操作 */}
      <div className="flex flex-col gap-3 w-full max-w-xs animate-fade-in-up" style={{ animationDelay: "0.9s" }}>
        <ShareButton 
          gameState={gameState} 
          onGeneratePoster={() => setShowPoster(true)} 
          className="mb-3 sm:mb-4"
        />
        <button onClick={() => setScreen("character-setup")} className="btn-palace bg-white/5 border-white/20 text-white min-h-[44px] active:scale-95">
          重新开始
        </button>
        <button onClick={() => setScreen("home")} className="btn-palace bg-white/5 border-white/20 text-white min-h-[44px] active:scale-95">
          返回首页
        </button>
      </div>
    </div>
  );
}
