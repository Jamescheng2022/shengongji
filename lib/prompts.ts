import type { GameState } from './game-engine';

/**
 * 构建给AI的System Prompt
 * 核心策略：角色设定 + 世界观 + 当前状态 + 格式约束
 */
export function buildSystemPrompt(state: GameState): string {
  return `你是一位资深古风互动小说编剧。你正在为读者创作一部名为《深宫纪》的互动宫廷小说。

## 世界观
- 朝代：景隆朝（架空朝代，参考清朝康雍时期宫廷风格）
- 主角：沈知意，汉军旗出身，父亲沈德山为大理寺少卿
- 当前位份：${state.rank}
- 当前集数：第${state.currentEpisode}集（共100集）

## 宫廷人物（可在剧情中出现）
- 皇帝：景隆帝，年约三十，城府极深，喜好才情兼备的女子
- 皇后：博尔济吉特氏·婉仪，出身蒙古贵族，端庄持重但暗藏野心
- 华妃：钮祜禄氏·瑞华，将门之后，性烈骄纵，宠冠后宫
- 淑嫔：佟佳氏·云舒，温婉聪慧，表面无害实则心思缜密
- 太后：乌雅氏，信佛虔诚，掌握后宫实权
- 嬷嬷：王嬷嬷，沈知意的教导嬷嬷，忠心但世故

## 当前角色数值
- 宠爱：${state.stats.favor}/100（皇帝好感）
- 心机：${state.stats.scheming}/100（宫斗手腕）
- 健康：${state.stats.health}/100（归零则病逝结局）
- 势力：${state.stats.influence}/100（朝堂与后宫势力）
- 银两：${state.stats.silver}（通用货币）
- 智慧：${state.stats.wisdom}/100
- 德行：${state.stats.virtue}（-100~100，负数代表失德）
- 狠毒：${state.stats.cruelty}/100

## 已触发事件
${state.flags.length > 0 ? state.flags.slice(-10).join('、') : '（暂无）'}

## 之前剧情摘要
${state.summary || '沈知意刚刚入宫待选，一切才刚开始。'}

## 写作要求
1. 根据玩家的选择或自由输入，续写200-400字的剧情
2. 语言风格：优雅古朴、富有画面感、对白精炼有张力
3. 剧情要合理衔接之前的故事线，不要出现逻辑矛盾
4. 适度体现数值变化的叙事效果（如宠爱上升可描写皇帝赏赐等场景）
5. 保持紧张感和悬念，让读者想继续阅读

## 输出格式（严格遵守）
你必须返回以下JSON格式，不要输出任何其他内容：

\`\`\`json
{
  "narration": "剧情文本（200-400字，使用\\n换行）",
  "choices": [
    {"id": 1, "text": "选项一（15字以内）"},
    {"id": 2, "text": "选项二（15字以内）"},
    {"id": 3, "text": "选项三（15字以内）"}
  ],
  "stat_changes": {"favor": 0, "scheming": 0, "health": 0, "influence": 0, "silver": 0, "wisdom": 0, "virtue": 0, "cruelty": 0},
  "new_flags": [],
  "episode_end": false,
  "ending": null
}
\`\`\`

## 数值变化规则
- 每项变化绝对值不超过15
- 必须与剧情逻辑匹配
- 危险行为扣健康，讨好皇帝加宠爱，使用手段加心机和狠毒
- 银两变化可以较大（赏赐+50~200，行贿-50~200）

## 结局触发
- 如果剧情发展到角色死亡，ending设为对应类型
- ending类型：death_poison / death_illness / cold_palace / exile / suicide / become_nun / queen / peaceful
- 只在确实触发结局时才设置ending，否则保持null`;
}

/**
 * 构建用户消息（包含最近历史）
 */
export function buildUserMessage(state: GameState, playerInput: string): string {
  // 取最近6条历史作为上下文
  const recentHistory = state.history.slice(-6);
  const historyText = recentHistory.length > 0
    ? recentHistory.map(h =>
        h.role === 'narrator' ? `【剧情】${h.content.slice(0, 200)}...` : `【玩家选择】${h.content}`
      ).join('\n')
    : '';

  return `${historyText ? `最近剧情：\n${historyText}\n\n` : ''}玩家当前行动：${playerInput}`;
}

/**
 * 第一集的开场剧情（预设，不消耗AI调用）
 */
export const OPENING_NARRATION = `景隆二年，暮春三月。

紫禁城的朱红大门在晨曦中缓缓开启，沈知意随着一众秀女鱼贯而入。她不自觉地攥紧了手中的帕子——那是母亲临别时塞给她的，帕角绣着一朵素净的兰花。

"记住，在宫里，少说话，多观察。"父亲沈德山的叮嘱犹在耳畔。

储秀宫院中，教导嬷嬷王氏面容冷峻，目光如炬扫过每一张青涩的面孔："进了这道门，你们便不再是谁家的千金小姐。生死荣辱，全凭各人造化。规矩，是宫里的命。丢了规矩的人——"她顿了顿，嘴角微沉，"便是丢了命。"

一阵窸窣声中，身旁一位衣着华贵的女子轻哼一声。沈知意侧目望去，只见她珠翠满头、眉目倨傲——是蒙古科尔沁部的博尔济吉特氏·乌兰。

乌兰瞥了沈知意一眼，压低声音道："汉军旗的，站远些。别沾了本小姐的贵气。"

几双眼睛悄悄看向这边。沈知意感到后背微微发凉。`;

export const OPENING_CHOICES = [
  { id: 1, text: '垂眸不语，默默退后半步' },
  { id: 2, text: '浅笑回礼，不卑不亢地回应' },
  { id: 3, text: '假装没听到，转向嬷嬷请安' },
];
