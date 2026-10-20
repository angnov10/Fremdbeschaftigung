export function normalizeAnswer(raw) {
  return String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getAllowedAnswers(record) {
  const combined = [record.title, record.accepted, record.aliases, record.prompt]
    .flat()
    .filter(Boolean)
    .map((value) => String(value));

  const names = [...new Set(combined.map(normalizeAnswer).filter(Boolean))];
  return names;
}

export function scoreAnswer(record, answer, mode = 'krillion') {
  const normalized = normalizeAnswer(answer);
  const allowed = getAllowedAnswers(record);
  const isCorrect = allowed.includes(normalized) || (record.accepted || []).some((accepted) => normalizeAnswer(accepted) === normalized);

  const base = Number(record.score || 85);
  const modeBonus = mode === 'noillirk' ? 12 : 0;
  const score = Math.max(25, Math.round(base + modeBonus));

  return {
    isCorrect,
    score,
    normalized,
    allowed,
    reason: isCorrect ? (mode === 'noillirk' ? 'Popular answer, strong fit, high recognition.' : 'Rare-but-valid historical answer.') : 'Not a matched historical answer.'
  };
}

export function getScoreLabel(score) {
  if (score >= 95) return 'Legendary';
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Strong';
  if (score >= 55) return 'Good';
  return 'Starter';
}
