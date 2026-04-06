import { buildSystemPrompt, buildUserMessage } from '@/lib/prompts';
import { GameState, AIResponse, parseAIOutput } from '@/lib/game-engine';
import { setCache } from '@/lib/prefetch-cache';

export const maxDuration = 30; // Vercel setting

export async function POST(req: Request) {
  try {
    const { gameState, options } = await req.json();
    if (!gameState || !options || !Array.isArray(options)) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
    }

    const apiKey = process.env.ZHIPU_API_KEY;
    const baseURL = process.env.AI_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4';
    const model = process.env.AI_MODEL || 'glm-4-flash';

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 });
    }

    const systemPrompt = buildSystemPrompt(gameState);

    const fetchOption = async (optionText: string): Promise<AIResponse | null> => {
      const userMessage = buildUserMessage(gameState, optionText);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      try {
        const response = await fetch(`${baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userMessage },
            ],
            stream: false,
            temperature: 0.85,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) return null;

        const data = await response.json();
        const rawContent = data.choices?.[0]?.message?.content || '';
        const aiResponse = parseAIOutput(rawContent);

        // 存入缓存
        setCache(`${gameState.id}_${optionText}`, aiResponse);
        return aiResponse;
      } catch (err) {
        console.error(`[prefetch] Error fetching option "${optionText}":`, err);
        return null;
      } finally {
        clearTimeout(timeoutId);
      }
    };

    // 并行请求
    const results = await Promise.all(options.slice(0, 3).map(opt => fetchOption(opt)));

    const responseData = {
      choice1: results[0],
      choice2: results[1],
      choice3: results[2],
    };

    return new Response(JSON.stringify(responseData), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('[prefetch] Global error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
