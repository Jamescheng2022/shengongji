"use client";

import React, { useState } from "react";

interface ActionInputProps {
  onAction: (action: string) => void;
  options?: { id: number; text: string }[];
  disabled?: boolean;
}

export const ActionInput: React.FC<ActionInputProps> = ({
  onAction,
  options = [],
  disabled = false,
}) => {
  const [mode, setMode] = useState<"options" | "input">("options");
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim() && !disabled) {
      onAction(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="space-y-3">
      {/* 模式切换 */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setMode("options")}
          className="text-xs px-3 py-1 rounded-full transition-all"
          style={{
            background: mode === "options" ? "rgba(139,37,0,0.3)" : "transparent",
            color: mode === "options" ? "var(--palace-gold)" : "var(--text-secondary)",
            border: `1px solid ${mode === "options" ? "var(--border-gold-bright)" : "var(--border-gold)"}`,
          }}
        >
          预设选项
        </button>
        <button
          onClick={() => setMode("input")}
          className="text-xs px-3 py-1 rounded-full transition-all"
          style={{
            background: mode === "input" ? "rgba(139,37,0,0.3)" : "transparent",
            color: mode === "input" ? "var(--palace-gold)" : "var(--text-secondary)",
            border: `1px solid ${mode === "input" ? "var(--border-gold-bright)" : "var(--border-gold)"}`,
          }}
        >
          自由输入
        </button>
      </div>

      {/* 选项模式 */}
      {mode === "options" && (
        <div className="space-y-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => !disabled && onAction(opt.text)}
              disabled={disabled}
              className="btn-choice w-full block"
            >
              <span className="text-xs mr-2" style={{ color: "var(--palace-gold)", opacity: 0.5 }}>
                {opt.id}.
              </span>
              {opt.text}
            </button>
          ))}
        </div>
      )}

      {/* 自由输入模式 */}
      {mode === "input" && (
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="输入你的行动..."
            disabled={disabled}
            className="input-palace flex-1 rounded"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={disabled || !inputValue.trim()}
            className="btn-palace px-5 rounded"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};
