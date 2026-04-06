"use client";

import React, { useState, useEffect, useRef } from "react";

export default function BGMPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 初始化设置：从 localStorage 读取偏好
  useEffect(() => {
    const saved = localStorage.getItem("bgm_enabled");
    // 即使 saved 是 true，由于浏览器自动播放限制，我们也需要用户互动后再真正播放
    // 所以这里只同步状态，不自动执行音效
  }, []);

  const playNote = (freq: number, startTime: number, duration: number) => {
    if (!audioCtxRef.current) return;
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();

    osc.type = "triangle"; // 类似古琴/古筝的柔和音色
    osc.frequency.setValueAtTime(freq, startTime);
    
    // 模拟拨弦感：快速升到最高音量，然后缓慢衰减
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(audioCtxRef.current.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  const startMelody = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }

    const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C4 to C5 pentatonic
    
    const playLoop = () => {
      const now = audioCtxRef.current!.currentTime;
      let time = now + 0.1;
      
      // 生成一段 4 小节的旋律
      for (let i = 0; i < 8; i++) {
        const freq = pentatonic[Math.floor(Math.random() * pentatonic.length)];
        const duration = 1.5 + Math.random() * 2;
        playNote(freq, time, duration);
        time += 1.5 + Math.random() * 1;
      }

      timerRef.current = setTimeout(playLoop, 12000); // 每 12 秒生成一波旋律
    };

    playLoop();
  };

  const stopMelody = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const toggleBGM = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    localStorage.setItem("bgm_enabled", String(nextState));

    if (nextState) {
      startMelody();
    } else {
      stopMelody();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggleBGM}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
          isPlaying 
            ? "bg-palace-gold text-ink-black animate-spin-slow" 
            : "bg-black/60 text-palace-gold border border-palace-gold/40 hover:bg-black/80"
        }`}
        title={isPlaying ? "暂停背景音乐" : "播放背景音乐"}
      >
        <span className="text-xl">{isPlaying ? "♫" : "♪"}</span>
        {isPlaying && (
          <span className="absolute inset-0 rounded-full border border-palace-gold animate-ping" style={{ animationDuration: '3s' }} />
        )}
      </button>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
