import { create } from 'zustand';
import {
  type GameState,
  type AIResponse,
  type StoryEntry,
  type PlayerProfile,
  createNewGame,
  processAIResponse,
  addChapter,
  rewindToChapter,
  canFreeRewind,
  useFreeRewind,
  saveSave,
  getAllSaves,
  deleteSave,
} from './game-engine';

export type Screen = 'home' | 'play' | 'saves' | 'ending' | 'book' | 'help' | 'character-setup';

interface GameStore {
  // 导航
  screen: Screen;
  setScreen: (screen: Screen) => void;

  // 游戏状态
  gameState: GameState | null;
  isLoading: boolean;
  currentChoices: { id: number; text: string }[];
  streamingText: string;
  statChanges: Partial<GameState['stats']> | null;
  lastNarration: string;  // 最近一次AI返回的剧情文本（用于记录章节）
  lastStatChanges: Partial<GameState['stats']>;  // 最近一次属性变化（用于记录章节）

  // 存档
  saves: GameState[];

  // 操作
  startNewGame: (profile?: Partial<PlayerProfile>) => void;
  loadGame: (save: GameState) => void;
  refreshSaves: () => void;
  removeSave: (id: string) => void;

  // 游戏流程
  addPlayerAction: (action: string) => void;
  setStreamingText: (text: string) => void;
  applyAIResponse: (response: AIResponse) => void;
  setLoading: (loading: boolean) => void;
  setChoices: (choices: { id: number; text: string }[]) => void;
  setStatChanges: (changes: Partial<GameState['stats']> | null) => void;
  setLastNarration: (text: string) => void;

  // 宫册·章节记录
  recordChapter: (playerChoice: string, availableChoices: { id: number; text: string }[]) => void;

  // 改命·回退
  rewindToChapter: (chapterId: string) => void;

  // 自动存档
  autoSave: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  screen: 'home',
  setScreen: (screen) => set({ screen }),

  gameState: null,
  isLoading: false,
  currentChoices: [],
  streamingText: '',
  statChanges: null,
  lastNarration: '',
  lastStatChanges: {},
  saves: [],

  startNewGame: (profile) => {
    const newGame = createNewGame('存档一', profile);
    saveSave(newGame);
    set({
      gameState: newGame,
      screen: 'play',
      currentChoices: [],
      streamingText: '',
      statChanges: null,
      lastNarration: '',
      lastStatChanges: {},
    });
  },

  loadGame: (save) => {
    set({
      gameState: save,
      screen: 'play',
      currentChoices: save.pendingChoices || [],
      streamingText: '',
      statChanges: null,
      lastNarration: save.pendingNarration || '',
      lastStatChanges: save.pendingStatChanges || {},
    });
  },

  refreshSaves: () => {
    set({ saves: getAllSaves() });
  },

  removeSave: (id) => {
    deleteSave(id);
    set({ saves: getAllSaves() });
  },

  addPlayerAction: (action) => {
    const { gameState } = get();
    if (!gameState) return;

    const entry: StoryEntry = {
      role: 'player',
      content: action,
      timestamp: Date.now(),
    };

    set({
      gameState: {
        ...gameState,
        history: [...gameState.history, entry],
        updatedAt: Date.now(),
      },
      currentChoices: [],
    });
  },

  setStreamingText: (text) => set({ streamingText: text }),
  setLastNarration: (text) => set({ lastNarration: text }),

  applyAIResponse: (response) => {
    const { gameState } = get();
    if (!gameState) return;

    const diff: Partial<GameState['stats']> = {};
    for (const [k, v] of Object.entries(response.stat_changes)) {
      if (v !== 0) (diff as Record<string, number>)[k] = v as number;
    }

    const newState = processAIResponse(gameState, response);
    saveSave(newState);

    set({
      gameState: newState,
      currentChoices: response.choices,
      streamingText: '',
      statChanges: Object.keys(diff).length > 0 ? diff : null,
      isLoading: false,
      lastNarration: response.narration,
      lastStatChanges: response.stat_changes,
    });

    // 如果有结局，跳转结局页
    if (newState.ending) {
      setTimeout(() => set({ screen: 'ending' }), 2000);
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setChoices: (choices) => set({ currentChoices: choices }),
  setStatChanges: (changes) => set({ statChanges: changes }),

  // ====== 宫册·记录章节 ======
  recordChapter: (playerChoice, availableChoices) => {
    const { gameState, lastNarration, lastStatChanges } = get();
    if (!gameState || !lastNarration) return;

    const updatedState = addChapter(
      gameState,
      lastNarration,
      playerChoice,
      availableChoices,
      lastStatChanges,
    );

    saveSave(updatedState);
    set({ gameState: updatedState });
  },

  // ====== 改命·回退 ======
  rewindToChapter: (chapterId) => {
    const { gameState } = get();
    if (!gameState) return;

    const hasFree = canFreeRewind(gameState);
    let state = gameState;

    if (!hasFree) {
      // 扣银两
      if (state.stats.silver < 50) return;
      state = { ...state, stats: { ...state.stats, silver: state.stats.silver - 50 } };
    } else {
      state = useFreeRewind(state);
    }

    const rewound = rewindToChapter(state, chapterId);
    if (!rewound) return;

    saveSave(rewound);
    set({
      gameState: rewound,
      currentChoices: rewound.pendingChoices || [],
      lastNarration: rewound.pendingNarration || '',
      lastStatChanges: rewound.pendingStatChanges || {},
      streamingText: '',
      statChanges: null,
      isLoading: false,
    });
  },

  autoSave: () => {
    const { gameState } = get();
    if (gameState) saveSave(gameState);
  },
}));
