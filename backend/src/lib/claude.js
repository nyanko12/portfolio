const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODELS = {
  haiku: process.env.CLAUDE_HAIKU_MODEL || 'claude-haiku-4-5-20251001',
  sonnet: process.env.CLAUDE_SONNET_MODEL || 'claude-sonnet-4-6',
};

function selectModel(level) {
  return level <= 2 ? MODELS.haiku : MODELS.sonnet;
}

async function callClaude(prompt, level) {
  const model = selectModel(level);
  const message = await client.messages.create({
    model,
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });
  return { text: message.content[0].text, model };
}

// JSON崩れ対策: コードフェンス除去 + 最大2回リトライ
async function parseClaudeJson(prompt, level, attempt = 1) {
  const { text, model } = await callClaude(prompt, level);
  const cleaned = text
    .replace(/^```[\w]*\n?/, '')
    .replace(/\n?```$/, '')
    .trim();
  try {
    return { data: JSON.parse(cleaned), model };
  } catch {
    if (attempt < 2) {
      return parseClaudeJson(prompt, level, attempt + 1);
    }
    throw new Error('JSON parse failed after 2 attempts');
  }
}

module.exports = { parseClaudeJson, selectModel };
