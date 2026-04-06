"use client";

import React, { useEffect } from "react";
import { useGameStore } from "@/lib/store";
import HomeScreen from "@/components/HomeScreen";
import PlayScreen from "@/components/PlayScreen";
import SavesScreen from "@/components/SavesScreen";
import EndingScreen from "@/components/EndingScreen";
import BookScreen from "@/components/BookScreen";
import HelpScreen from "@/components/HelpScreen";
import CharacterSetup from "@/components/CharacterSetup";
import BGMPlayer from "@/components/BGMPlayer";

export default function App() {
  const screen = useGameStore((s) => s.screen);
  const refreshSaves = useGameStore((s) => s.refreshSaves);

  useEffect(() => {
    refreshSaves();
  }, [refreshSaves]);

  return (
    <div className="min-h-screen">
      {screen === "home" && <HomeScreen />}
      {screen === "play" && <PlayScreen />}
      {screen === "saves" && <SavesScreen />}
      {screen === "ending" && <EndingScreen />}
      {screen === "book" && <BookScreen />}
      {screen === "help" && <HelpScreen />}
      {screen === "character-setup" && <CharacterSetup />}
      
      <BGMPlayer />
    </div>
  );
}
