// =============================================
// 深宫纪 - 游戏引擎核心
// =============================================

// ---------- 类型定义 ----------

export interface Stats {
  favor: number;      // 宠爱 0-100
  scheming: number;   // 心机 0-100
  health: number;     // 健康 0-100
  influence: number;  // 势力 0-100
  silver: number;     // 银两 0-9999
  wisdom: number;     // 智慧 0-100
  virtue: number;     // 德行 -100~100
  cruelty: number;    // 狠毒 0-100
}

export type Rank =
  | '秀女' | '采女' | '美人' | '贵人'
  | '嫔' | '妃' | '贵妃' | '皇贵妃' | '皇后';

export const RANK_ORDER: Rank[] = [
  '秀女', '采女', '美人', '贵人', '嫔', '妃', '贵妃', '皇贵妃', '皇后',
];

export interface StoryEntry {
  role: 'narrator' | 'player';
  content: string;
  timestamp: number;
}

export type EndingType =
  | 'death_poison'   // 赐毒酒
  | 'death_illness'  // 病逝
  | 'cold_palace'    // 打入冷宫
  | 'exile'          // 流放
  | 'suicide'        // 自尽
  | 'become_nun'     // 出家
  | 'queen'          // 封后
  | 'peaceful'       // 善终
  | null;

// ---------- 宫册·章节系统 ----------

export interface Chapter {
  id: string;               // 章节唯一ID
  index: number;            // 章节序号（从1开始）
  episode: number;          // 对应集数
  title: string;            // 章节标题
  narration: string;        // 剧情正文
  playerChoice: string;     // 玩家的选择（本章结尾做出的选择）
  availableChoices: { id: number; text: string }[];  // 当时提供的选项
  statChanges: Partial<Stats>;   // 本章属性变化
  statSnapshot: Stats;           // 本章结束时的属性快照
  rankAtTime: Rank;              // 本章时的位份
  flagsSnapshot?: string[];      // 本章选择前的 flags 快照
  summarySnapshot?: string;      // 本章选择前的摘要快照
  timestamp: number;             // 记录时间
}

// ---------- 角色档案 ----------

export interface PlayerProfile {
  surname: string;       // 姓氏（如"沈"）
  givenName: string;     // 名字（如"知意"）
  fullName: string;      // 完整名字
  avatarId: string;      // 头像ID（对应预设古风头像）
  origin: string;        // 出身（如"书香门第"、"将门虎女"等）
  personality: string;   // 性格倾向（如"隐忍"、"果决"、"温婉"等）
}

export const AVATAR_OPTIONS: { id: string; label: string; emoji: string; desc: string }[] = [
  { id: 'gentle',    label: '温婉',   emoji: '🌸', desc: '眉眼如画，温柔似水' },
  { id: 'elegant',   label: '端庄',   emoji: '🪷', desc: '仪态万千，气度不凡' },
  { id: 'clever',    label: '灵秀',   emoji: '🦋', desc: '慧黠灵动，古灵精怪' },
  { id: 'cold',      label: '清冷',   emoji: '❄️', desc: '冷若冰霜，不近人情' },
  { id: 'fierce',    label: '刚烈',   emoji: '🔥', desc: '性烈如火，宁折不弯' },
  { id: 'charming',  label: '妩媚',   emoji: '🌙', desc: '风情万种，倾国倾城' },
];

export const ORIGIN_OPTIONS: { id: string; label: string; desc: string; statBonus: Partial<Stats> }[] = [
  { id: 'scholar',   label: '书香门第', desc: '父亲任大理寺少卿，清正不阿', statBonus: { wisdom: 10, virtue: 10 } },
  { id: 'military',  label: '将门虎女', desc: '父亲是镇守边关的参将', statBonus: { influence: 10, health: 5 } },
  { id: 'merchant',  label: '商贾之家', desc: '家族经营江南丝绸生意，富甲一方', statBonus: { silver: 200, scheming: 5 } },
  { id: 'noble',     label: '没落贵族', desc: '祖上曾是开国功臣，如今门庭冷落', statBonus: { influence: 5, favor: 5, scheming: 5 } },
  { id: 'common',    label: '寒门碧玉', desc: '出身清贫却才情出众，被选入宫', statBonus: { wisdom: 5, virtue: 5, health: 5 } },
];

export const PERSONALITY_OPTIONS: { id: string; label: string; emoji: string; desc: string }[] = [
  { id: 'patient',    label: '隐忍', emoji: '🌊', desc: '善于隐藏锋芒，伺机而动' },
  { id: 'decisive',   label: '果决', emoji: '⚔️', desc: '行事雷厉风行，当断则断' },
  { id: 'graceful',   label: '温婉', emoji: '🍃', desc: '以柔克刚，化敌为友' },
  { id: 'cunning',    label: '机敏', emoji: '🦊', desc: '心思七窍玲珑，算无遗策' },
  { id: 'righteous',  label: '正直', emoji: '☀️', desc: '秉持正道，不屑阴谋' },
];

export const DEFAULT_PROFILE: PlayerProfile = {
  surname: '沈',
  givenName: '知意',
  fullName: '沈知意',
  avatarId: 'gentle',
  origin: 'scholar',
  personality: 'patient',
};

export interface GameState {
  id: string;
  name: string;           // 存档名
  playerProfile: PlayerProfile;  // 角色档案
  currentEpisode: number;
  stats: Stats;
  rank: Rank;
  history: StoryEntry[];  // 最近剧情（仅保留最近 MAX_HISTORY 条）
  summary: string;        // 之前剧情的压缩摘要
  flags: string[];        // 已触发事件标记
  ending: EndingType;
  chapters: Chapter[];    // 宫册·所有章节
  pendingNarration: string;               // 当前等待玩家选择的剧情文本
  pendingChoices: { id: number; text: string }[];  // 当前等待玩家选择的选项
  pendingStatChanges: Partial<Stats>;     // 当前剧情对应的属性变化
  freeRewindsToday: number;    // 今日已用免费改命次数
  lastRewindDate: string;      // 上次改命日期（用于重置每日次数）
  createdAt: number;
  updatedAt: number;
}

export interface AIResponse {
  narration: string;
  choices: { id: number; text: string }[];
  stat_changes: Partial<Stats>;
  new_flags?: string[];
  episode_end?: boolean;
  ending?: EndingType;
  title?: string;
}

// ---------- 常量 ----------

const MAX_HISTORY = 20;
const FREE_REWINDS_PER_DAY = 1;

const RANK_THRESHOLDS: Record<Rank, { favor: number; influence: number; episode: number }> = {
  '秀女':   { favor: 0,  influence: 0,  episode: 0 },
  '采女':   { favor: 10, influence: 5,  episode: 1 },
  '美人':   { favor: 25, influence: 15, episode: 5 },
  '贵人':   { favor: 40, influence: 25, episode: 12 },
  '嫔':     { favor: 55, influence: 35, episode: 25 },
  '妃':     { favor: 65, influence: 50, episode: 40 },
  '贵妃':   { favor: 75, influence: 65, episode: 60 },
  '皇贵妃': { favor: 85, influence: 80, episode: 80 },
  '皇后':   { favor: 95, influence: 90, episode: 95 },
};

// ---------- 核心函数 ----------

export function createNewGame(name: string = '存档一', profile?: Partial<PlayerProfile>): GameState {
  const p: PlayerProfile = {
    ...DEFAULT_PROFILE,
    ...profile,
    fullName: profile?.fullName || `${profile?.surname || DEFAULT_PROFILE.surname}${profile?.givenName || DEFAULT_PROFILE.givenName}`,
  };

  // 根据出身加成初始属性
  const originBonus = ORIGIN_OPTIONS.find(o => o.id === p.origin)?.statBonus || {};

  const baseStats: Stats = {
    favor: 15,
    scheming: 20,
    health: 100,
    influence: 5,
    silver: 200,
    wisdom: 30,
    virtue: 10,
    cruelty: 0,
  };

  return {
    id: `save_${Date.now()}`,
    name,
    playerProfile: p,
    currentEpisode: 1,
    stats: clampStats(applyStatChanges(baseStats, originBonus)),
    rank: '秀女',
    history: [],
    summary: '',
    flags: [],
    ending: null,
    chapters: [],
    pendingNarration: '',
    pendingChoices: [],
    pendingStatChanges: {},
    freeRewindsToday: 0,
    lastRewindDate: new Date().toISOString().slice(0, 10),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/** 钳制数值到合法范围 */
export function clampStats(stats: Stats): Stats {
  return {
    favor: Math.max(0, Math.min(100, Math.round(stats.favor))),
    scheming: Math.max(0, Math.min(100, Math.round(stats.scheming))),
    health: Math.max(0, Math.min(100, Math.round(stats.health))),
    influence: Math.max(0, Math.min(100, Math.round(stats.influence))),
    silver: Math.max(0, Math.min(9999, Math.round(stats.silver))),
    wisdom: Math.max(0, Math.min(100, Math.round(stats.wisdom))),
    virtue: Math.max(-100, Math.min(100, Math.round(stats.virtue))),
    cruelty: Math.max(0, Math.min(100, Math.round(stats.cruelty))),
  };
}

/** 应用属性变化 */
export function applyStatChanges(current: Stats, changes: Partial<Stats>): Stats {
  const newStats = { ...current };
  for (const [key, value] of Object.entries(changes)) {
    if (key in newStats && typeof value === 'number') {
      (newStats as Record<string, number>)[key] += value;
    }
  }
  return clampStats(newStats);
}

/** 检查是否应该晋升 */
export function checkPromotion(state: GameState): Rank {
  const currentIdx = RANK_ORDER.indexOf(state.rank);
  let newRank = state.rank;

  for (let i = currentIdx + 1; i < RANK_ORDER.length; i++) {
    const rank = RANK_ORDER[i];
    const threshold = RANK_THRESHOLDS[rank];
    if (
      state.stats.favor >= threshold.favor &&
      state.stats.influence >= threshold.influence &&
      state.currentEpisode >= threshold.episode
    ) {
      newRank = rank;
    } else {
      break;
    }
  }
  return newRank;
}

/** 检查结局条件 */
export function checkEnding(state: GameState): EndingType {
  if (state.stats.health <= 0) return 'death_illness';
  if (state.stats.favor <= 0 && state.currentEpisode > 5) return 'cold_palace';
  if (state.rank === '皇后' && state.currentEpisode >= 100) return 'queen';
  if (state.currentEpisode >= 100) return 'peaceful';
  return null;
}

/** 处理AI响应，更新游戏状态 */
export function processAIResponse(state: GameState, response: AIResponse): GameState {
  const newStats = applyStatChanges(state.stats, response.stat_changes);
  const newHistory = [
    ...state.history,
    { role: 'narrator' as const, content: response.narration, timestamp: Date.now() },
  ].slice(-MAX_HISTORY);

  const newState: GameState = {
    ...state,
    stats: newStats,
    history: newHistory,
    flags: [...state.flags, ...(response.new_flags || [])],
    pendingNarration: response.narration,
    pendingChoices: response.choices,
    pendingStatChanges: response.stat_changes,
    currentEpisode: response.episode_end
      ? state.currentEpisode + 1
      : state.currentEpisode,
    updatedAt: Date.now(),
  };

  // 检查晋升
  const newRank = checkPromotion(newState);
  if (newRank !== newState.rank) {
    newState.rank = newRank;
    newState.flags.push(`promoted_to_${newRank}`);
  }

  // 检查结局
  const ending = response.ending || checkEnding(newState);
  if (ending) {
    newState.ending = ending;
  }

  return newState;
}

// ---------- 宫册·章节操作 ----------

/** 添加一个新章节到宫册 */
export function addChapter(
  state: GameState,
  narration: string,
  playerChoice: string,
  availableChoices: { id: number; text: string }[],
  statChanges: Partial<Stats>,
  title?: string,
): GameState {
  const chapterIndex = state.chapters.length + 1;
  const chapter: Chapter = {
    id: `ch_${Date.now()}_${chapterIndex}`,
    index: chapterIndex,
    episode: state.currentEpisode,
    title: title || `第${chapterIndex}回`,
    narration,
    playerChoice,
    availableChoices,
    statChanges,
    statSnapshot: { ...state.stats },
    rankAtTime: state.rank,
    flagsSnapshot: [...state.flags],
    summarySnapshot: state.summary,
    timestamp: Date.now(),
  };

  return {
    ...state,
    chapters: [...state.chapters, chapter],
  };
}

function rebuildHistoryForPendingChapter(chapters: Chapter[], targetIdx: number): StoryEntry[] {
  if (targetIdx <= 0) return [];

  const rebuilt: StoryEntry[] = [];

  for (let i = 0; i < targetIdx; i++) {
    rebuilt.push({
      role: 'player',
      content: chapters[i].playerChoice,
      timestamp: chapters[i].timestamp,
    });

    rebuilt.push({
      role: 'narrator',
      content: chapters[i + 1].narration,
      timestamp: chapters[i + 1].timestamp,
    });
  }

  return rebuilt.slice(-MAX_HISTORY);
}

/** 改命回退：回退到指定章节，删除之后所有章节，恢复属性快照 */
export function rewindToChapter(state: GameState, chapterId: string): GameState | null {
  const idx = state.chapters.findIndex(c => c.id === chapterId);
  if (idx < 0) return null;

  const targetChapter = state.chapters[idx];
  const keptChapters = state.chapters.slice(0, idx);

  return {
    ...state,
    chapters: keptChapters,
    stats: { ...targetChapter.statSnapshot },
    rank: targetChapter.rankAtTime,
    currentEpisode: targetChapter.episode,
    history: rebuildHistoryForPendingChapter(state.chapters, idx),
    flags: targetChapter.flagsSnapshot ? [...targetChapter.flagsSnapshot] : [...state.flags],
    summary: targetChapter.summarySnapshot ?? state.summary,
    ending: null,
    pendingNarration: targetChapter.narration,
    pendingChoices: [...targetChapter.availableChoices],
    pendingStatChanges: { ...targetChapter.statChanges },
    updatedAt: Date.now(),
  };
}

/** 检查是否可以免费改命 */
export function canFreeRewind(state: GameState): boolean {
  const today = new Date().toISOString().slice(0, 10);
  if (state.lastRewindDate !== today) {
    return true; // 新的一天，重置次数
  }
  return state.freeRewindsToday < FREE_REWINDS_PER_DAY;
}

/** 消耗一次免费改命 */
export function useFreeRewind(state: GameState): GameState {
  const today = new Date().toISOString().slice(0, 10);
  if (state.lastRewindDate !== today) {
    return { ...state, freeRewindsToday: 1, lastRewindDate: today };
  }
  return { ...state, freeRewindsToday: state.freeRewindsToday + 1 };
}

// ---------- 辅助函数 ----------

/** 获取位份排名进度 (0~1) */
export function getRankProgress(rank: Rank): number {
  const idx = RANK_ORDER.indexOf(rank);
  return idx / (RANK_ORDER.length - 1);
}

/** 获取位份中文描述（支持自定义姓名） */
export function getRankTitle(rank: Rank, profile?: PlayerProfile): string {
  const surname = profile?.surname || '沈';
  const givenFirst = profile?.givenName?.[0] || '知';
  const titles: Record<Rank, string> = {
    '秀女': '秀女',
    '采女': '采女',
    '美人': `${surname}美人`,
    '贵人': `${surname}贵人`,
    '嫔': `${givenFirst}嫔`,
    '妃': `${givenFirst}妃`,
    '贵妃': `${givenFirst}贵妃`,
    '皇贵妃': `${surname}皇贵妃`,
    '皇后': `${surname}皇后`,
  };
  return titles[rank];
}

// ---------- AI 解析工具 ----------

export function parseAIOutput(raw: string): AIResponse {
  // 去掉可能的思考过程 <think>...</think>
  let cleaned = raw.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

  // 尝试多种 JSON 提取方式
  // 1. ```json ... ```
  const jsonBlockMatch = cleaned.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonBlockMatch) {
    return JSON.parse(jsonBlockMatch[1]);
  }

  // 2. ``` ... ``` (无 json 标记)
  const codeBlockMatch = cleaned.match(/```\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    const inner = codeBlockMatch[1].trim();
    if (inner.startsWith('{')) {
      return JSON.parse(inner);
    }
  }

  // 3. 直接找最外层 { ... }
  const braceStart = cleaned.indexOf('{');
  const braceEnd = cleaned.lastIndexOf('}');
  if (braceStart !== -1 && braceEnd > braceStart) {
    const jsonStr = cleaned.slice(braceStart, braceEnd + 1);
    return JSON.parse(jsonStr);
  }

  throw new Error('No valid JSON found in AI output');
}

export function cleanNarration(raw: string): string {
  let text = raw
    .replace(/<think>[\s\S]*?<\/think>/g, '')
    .replace(/```json[\s\S]*?```/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .trim();
  return text || '（剧情生成中，请稍候...）';
}

// ---------- 存档系统 ----------

const SAVE_KEY = 'shengongji_saves';

export function getAllSaves(): GameState[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(SAVE_KEY);
    const saves: GameState[] = data ? JSON.parse(data) : [];
    // 兼容旧存档：补齐 chapters 字段
    return saves.map(s => ({
      ...s,
      playerProfile: s.playerProfile || DEFAULT_PROFILE,
      chapters: (s.chapters || []).map(chapter => ({
        ...chapter,
        flagsSnapshot: chapter.flagsSnapshot || [],
        summarySnapshot: chapter.summarySnapshot || '',
      })),
      pendingNarration: s.pendingNarration || '',
      pendingChoices: s.pendingChoices || [],
      pendingStatChanges: s.pendingStatChanges || {},
      freeRewindsToday: s.freeRewindsToday || 0,
      lastRewindDate: s.lastRewindDate || new Date().toISOString().slice(0, 10),
    }));
  } catch {
    return [];
  }
}

export function saveSave(state: GameState): void {
  if (typeof window === 'undefined') return;
  const saves = getAllSaves();
  const idx = saves.findIndex(s => s.id === state.id);
  if (idx >= 0) {
    saves[idx] = state;
  } else {
    saves.push(state);
  }
  localStorage.setItem(SAVE_KEY, JSON.stringify(saves));
}

export function deleteSave(id: string): void {
  if (typeof window === 'undefined') return;
  const saves = getAllSaves().filter(s => s.id !== id);
  localStorage.setItem(SAVE_KEY, JSON.stringify(saves));
}

export function getLatestSave(): GameState | null {
  const saves = getAllSaves();
  if (saves.length === 0) return null;
  return saves.sort((a, b) => b.updatedAt - a.updatedAt)[0];
}
