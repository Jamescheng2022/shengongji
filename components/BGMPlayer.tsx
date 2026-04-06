"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

export default function BGMPlayer() {
  const [isMounted, setIsMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAudio, setHasAudio] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldResumeRef = useRef(false);

  const safePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;

    try {
      if (audio.readyState === 0) {
        audio.load();
      }
      await audio.play();
      setIsPlaying(true);
      setHasAudio(true);
      setLoadError(false);
      return true;
    } catch {
      setIsPlaying(false);
      return false;
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = "metadata";

    const handleReady = () => {
      setHasAudio(true);
      setLoadError(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setHasAudio(true);
      setLoadError(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      setLoadError(true);
    };

    const cleanupResumeListeners = () => {
      document.removeEventListener("click", tryResume);
      document.removeEventListener("touchstart", tryResume);
      document.removeEventListener("keydown", tryResume);
      document.removeEventListener("WeixinJSBridgeReady", tryResume as EventListener);
    };

    const tryResume = async () => {
      if (!shouldResumeRef.current) return;
      const played = await safePlay();
      if (played) {
        shouldResumeRef.current = false;
        cleanupResumeListeners();
      }
    };

    audio.addEventListener("loadedmetadata", handleReady);
    audio.addEventListener("canplay", handleReady);
    audio.addEventListener("canplaythrough", handleReady);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);

    const saved = localStorage.getItem("bgm_enabled");
    if (saved === "true") {
      shouldResumeRef.current = true;
      document.addEventListener("click", tryResume, { once: true });
      document.addEventListener("touchstart", tryResume, { once: true });
      document.addEventListener("keydown", tryResume, { once: true });
      document.addEventListener("WeixinJSBridgeReady", tryResume as EventListener, { once: true });
      void tryResume();
    }

    audio.load();

    return () => {
      cleanupResumeListeners();
      audio.removeEventListener("loadedmetadata", handleReady);
      audio.removeEventListener("canplay", handleReady);
      audio.removeEventListener("canplaythrough", handleReady);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
      audio.pause();
      audio.src = "";
    };
  }, [safePlay]);

  const toggleBGM = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      shouldResumeRef.current = false;
      localStorage.setItem("bgm_enabled", "false");
      return;
    }

    const played = await safePlay();
    localStorage.setItem("bgm_enabled", played ? "true" : "false");

    if (!played) {
      setLoadError(true);
    }
  };

  if (!isMounted) return null;

  const title = loadError
    ? "点此重试背景音乐"
    : isPlaying
      ? "暂停背景音乐"
      : "播放背景音乐";

  return (
    <>
      <audio ref={audioRef} preload="metadata" playsInline className="hidden">
        <source src="/audio/bgm.mp3" type="audio/mpeg" />
      </audio>

      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => void toggleBGM()}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg active:scale-95"
          style={{
            background: isPlaying ? "var(--palace-gold)" : "rgba(0,0,0,0.6)",
            color: isPlaying ? "var(--ink-black)" : "var(--palace-gold)",
            border: isPlaying
              ? "none"
              : loadError || !hasAudio
                ? "1px solid rgba(255,255,255,0.35)"
                : "1px solid rgba(212,175,55,0.4)",
          }}
          title={title}
          aria-label={title}
        >
          <span className="text-xl">{isPlaying ? "♫" : "♪"}</span>
        </button>
      </div>
    </>
  );
}
