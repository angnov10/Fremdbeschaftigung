const STORAGE_KEY = 'chrono-state-v1';

const defaultState = {
  theme: 'dark',
  view: 'today',
  daily: {},
  stats: {
    totalGamesPlayed: 0,
    bestScores: {
      krillion: 0,
      noillirk: 0,
      beforeafter: 0,
      discover: 0
    },
    totalCorrect: 0,
    discovered: [],
    timeline: [],
    recentArticles: []
  }
};

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    return { ...structuredClone(defaultState), ...parsed, stats: { ...structuredClone(defaultState.stats), ...(parsed.stats || {}) } };
  } catch (error) {
    console.warn('Could not read local storage state:', error);
    return structuredClone(defaultState);
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function recordResult(mode, title, score, correct) {
  const state = loadState();
  state.stats.totalGamesPlayed = Number(state.stats.totalGamesPlayed || 0) + 1;
  state.stats.bestScores[mode] = Math.max(Number(state.stats.bestScores[mode] || 0), Number(score || 0));
  if (correct) {
    state.stats.totalCorrect = Number(state.stats.totalCorrect || 0) + 1;
  }
  if (title) {
    state.stats.discovered = Array.from(new Set([...(state.stats.discovered || []), title]));
  }
  saveState(state);
}

export function getStatsSummary() {
  const state = loadState();
  return state.stats;
}

export function setTheme(theme) {
  const state = loadState();
  state.theme = theme;
  saveState(state);
  document.documentElement.dataset.theme = theme;
}

export function initializeTheme() {
  const state = loadState();
  document.documentElement.dataset.theme = state.theme || 'dark';
}
