export function normalizeAnswer(raw) {
  return String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ');
}

export function getAllowedAnswers(record) {
  const names = [record.title, ...(record.aliases || [])];
  return [...new Set(names.map(normalizeAnswer).filter(Boolean))];
}

export function scoreAnswer(record, answer, mode = 'krillion') {
  const normalized = normalizeAnswer(answer);
  const aliases = getAllowedAnswers(record);
  const isCorrect = aliases.includes(normalized);

  const base = Number(record.score || 100);
  const rarityBonus = Number(record.difficulty || 2) === 1 ? 20 : Number(record.difficulty || 2) === 2 ? 10 : 0;
  const modeMultiplier = mode === 'noillirk' ? 1.2 : 1;
  const score = Math.max(20, Math.round((base + rarityBonus) * modeMultiplier));

  return { isCorrect, score, normalized, aliases };
}

export function getScoreLabel(score) {
  if (score >= 140) return 'Epic';
  if (score >= 120) return 'Strong';
  if (score >= 100) return 'Good';
  if (score >= 80) return 'Solid';
  return 'Starter';
}
