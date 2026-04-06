"use client";

import React, { useState } from "react";
import { useGameStore } from "@/lib/store";
import {
  AVATAR_OPTIONS,
  ORIGIN_OPTIONS,
  PERSONALITY_OPTIONS,
  type PlayerProfile,
} from "@/lib/game-engine";

export default function CharacterSetup() {
  const startNewGame = useGameStore((s) => s.startNewGame);
  const setScreen = useGameStore((s) => s.setScreen);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [surname, setSurname] = useState("沈");
  const [givenName, setGivenName] = useState("知意");
  const [avatarId, setAvatarId] = useState("gentle");
  const [origin, setOrigin] = useState("scholar");
  const [personality, setPersonality] = useState("patient");

  const selectedOrigin = ORIGIN_OPTIONS.find((o) => o.id === origin);
  const fullName = `${surname}${givenName}`;

  const handleStart = () => {
    const profile: Partial<PlayerProfile> = {
      surname,
      givenName,
      fullName,
      avatarId,
      origin,
      personality,
    };
    startNewGame(profile);
  };

  return (
    <div className="h-dvh flex flex-col items-center justify-start px-3 sm:px-4 pt-6 pb-4 safe-top safe-bottom overflow-hidden">
      {/* 返回 */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 shrink-0">
        <button
          onClick={() => (step > 1 ? setStep((step - 1) as 1 | 2 | 3) : setScreen("home"))}
          className="text-sm min-h-[44px] flex items-center active:scale-95"
          style={{ color: "var(--text-secondary)" }}
        >
          ← {step > 1 ? "上一步" : "返回"}
        </button>
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
          {step} / 3
        </span>
      </div>

      {/* 进度条 */}
      <div className="w-full max-w-md flex gap-1 mb-6 shrink-0">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className="flex-1 h-1 rounded-full transition-all duration-500"
            style={{
              background: s <= step ? "var(--palace-gold)" : "rgba(212,175,55,0.15)",
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-6">
        {/* ====== 第一步：姓名 + 头像 ====== */}
        {step === 1 && (
          <div className="animate-fade-in-up">
            <h2
              className="text-xl font-bold text-center mb-2 tracking-wider"
              style={{ color: "var(--palace-gold)" }}
            >
              你是何人？
            </h2>
            <p className="text-sm text-center mb-8" style={{ color: "var(--text-secondary)" }}>
              选择你在后宫中的身份
            </p>

            {/* 姓名输入 */}
            <div className="flex gap-3 mb-8">
              <div className="flex-shrink-0">
                <label className="text-xs block mb-2" style={{ color: "var(--text-secondary)" }}>
                  姓氏
                </label>
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value.slice(0, 2))}
                  className="input-palace w-20 text-center rounded"
                  style={{ fontSize: "16px" }}
                  maxLength={2}
                  placeholder="沈"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs block mb-2" style={{ color: "var(--text-secondary)" }}>
                  名字
                </label>
                <input
                  type="text"
                  value={givenName}
                  onChange={(e) => setGivenName(e.target.value.slice(0, 4))}
                  className="input-palace w-full text-center rounded"
                  style={{ fontSize: "16px" }}
                  maxLength={4}
                  placeholder="知意"
                />
              </div>
            </div>

            {/* 预览 */}
            {surname && givenName && (
              <div className="text-center mb-8">
                <span className="text-2xl font-bold" style={{ color: "var(--palace-gold)" }}>
                  {AVATAR_OPTIONS.find((a) => a.id === avatarId)?.emoji}{" "}
                  {fullName}
                </span>
              </div>
            )}

            {/* 头像选择 */}
            <label className="text-xs block mb-3" style={{ color: "var(--text-secondary)" }}>
              选择容貌气质
            </label>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {AVATAR_OPTIONS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => setAvatarId(avatar.id)}
                  className="p-3 border rounded text-center transition-all active:scale-95"
                  style={{
                    borderColor:
                      avatarId === avatar.id
                        ? "var(--palace-gold)"
                        : "var(--border-gold)",
                    background:
                      avatarId === avatar.id
                        ? "rgba(139,37,0,0.2)"
                        : "rgba(26,20,14,0.6)",
                  }}
                >
                  <div className="text-2xl mb-1">{avatar.emoji}</div>
                  <div
                    className="text-sm font-medium"
                    style={{
                      color:
                        avatarId === avatar.id
                          ? "var(--palace-gold)"
                          : "var(--text-primary)",
                    }}
                  >
                    {avatar.label}
                  </div>
                  <div
                    className="text-xs mt-1 leading-tight"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {avatar.desc}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!surname.trim() || !givenName.trim()}
              className="btn-palace w-full py-3 text-base font-bold min-h-[44px] active:scale-95"
            >
              下一步
            </button>
          </div>
        )}

        {/* ====== 第二步：出身 ====== */}
        {step === 2 && (
          <div className="animate-fade-in-up">
            <h2
              className="text-xl font-bold text-center mb-2 tracking-wider"
              style={{ color: "var(--palace-gold)" }}
            >
              你的出身
            </h2>
            <p className="text-sm text-center mb-8" style={{ color: "var(--text-secondary)" }}>
              出身决定你的初始资质与人脉
            </p>

            <div className="space-y-3 mb-8">
              {ORIGIN_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setOrigin(o.id)}
                  className="w-full p-4 border rounded text-left transition-all active:scale-[0.98]"
                  style={{
                    borderColor:
                      origin === o.id
                        ? "var(--palace-gold)"
                        : "var(--border-gold)",
                    background:
                      origin === o.id
                        ? "rgba(139,37,0,0.2)"
                        : "rgba(26,20,14,0.6)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="font-medium"
                      style={{
                        color:
                          origin === o.id
                            ? "var(--palace-gold)"
                            : "var(--text-primary)",
                      }}
                    >
                      {o.label}
                    </span>
                    {origin === o.id && (
                      <span style={{ color: "var(--palace-gold)" }}>✦</span>
                    )}
                  </div>
                  <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                    {o.desc}
                  </div>
                  {/* 属性加成 */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(o.statBonus)
                      .filter(([, v]) => v !== 0)
                      .map(([k, v]) => (
                        <span
                          key={k}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: "rgba(212,175,55,0.1)",
                            color: "#27AE60",
                          }}
                        >
                          {
                            {
                              favor: "宠爱",
                              scheming: "心机",
                              health: "健康",
                              influence: "势力",
                              silver: "银两",
                              wisdom: "智慧",
                              virtue: "德行",
                              cruelty: "狠毒",
                            }[k]
                          }{" "}
                          +{v}
                        </span>
                      ))}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(3)}
              className="btn-palace w-full py-3 text-base font-bold min-h-[44px] active:scale-95"
            >
              下一步
            </button>
          </div>
        )}

        {/* ====== 第三步：性格 + 确认 ====== */}
        {step === 3 && (
          <div className="animate-fade-in-up">
            <h2
              className="text-xl font-bold text-center mb-2 tracking-wider"
              style={{ color: "var(--palace-gold)" }}
            >
              你的性情
            </h2>
            <p className="text-sm text-center mb-8" style={{ color: "var(--text-secondary)" }}>
              性格影响 AI 为你续写的剧情风格
            </p>

            <div className="space-y-3 mb-8">
              {PERSONALITY_OPTIONS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPersonality(p.id)}
                  className="w-full p-4 border rounded text-left transition-all active:scale-[0.98]"
                  style={{
                    borderColor:
                      personality === p.id
                        ? "var(--palace-gold)"
                        : "var(--border-gold)",
                    background:
                      personality === p.id
                        ? "rgba(139,37,0,0.2)"
                        : "rgba(26,20,14,0.6)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{p.emoji}</span>
                    <div>
                      <span
                        className="font-medium"
                        style={{
                          color:
                            personality === p.id
                              ? "var(--palace-gold)"
                              : "var(--text-primary)",
                        }}
                      >
                        {p.label}
                      </span>
                      <div
                        className="text-xs mt-0.5"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {p.desc}
                      </div>
                    </div>
                    {personality === p.id && (
                      <span className="ml-auto" style={{ color: "var(--palace-gold)" }}>
                        ✦
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* 角色总览 */}
            <div
              className="p-4 border rounded mb-6"
              style={{
                borderColor: "var(--border-gold)",
                background: "rgba(26,20,14,0.8)",
              }}
            >
              <div className="text-center mb-3">
                <span className="text-3xl">
                  {AVATAR_OPTIONS.find((a) => a.id === avatarId)?.emoji}
                </span>
              </div>
              <div
                className="text-lg font-bold text-center mb-1"
                style={{ color: "var(--palace-gold)" }}
              >
                {fullName}
              </div>
              <div
                className="text-xs text-center mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                {selectedOrigin?.label} · {PERSONALITY_OPTIONS.find((p) => p.id === personality)?.label} ·{" "}
                {AVATAR_OPTIONS.find((a) => a.id === avatarId)?.label}
              </div>
              <div className="divider-gold mb-3" />
              <div className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {selectedOrigin?.desc}
              </div>
            </div>

            <button
              onClick={handleStart}
              className="btn-palace w-full py-3 text-base font-bold glow-gold min-h-[44px] active:scale-95"
            >
              入宫，开始你的命运
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
