import { getChallengePool } from './data.js';

const DEFAULT_DEV_DATE = '2026-10-20';

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getDateKey(date = new Date()) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export function getUTCDateKey(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).toISOString().slice(0, 10);
}

export function getEffectiveDate(overrideDate) {
  if (overrideDate) return overrideDate;
  const devOverride = typeof localStorage !== 'undefined' ? localStorage.getItem('chrono-dev-date') : null;
  return devOverride || getUTCDateKey();
}

export function getDailyChallenge(mode, overrideDate) {
  const dateKey = getEffectiveDate(overrideDate);
  const pool = getChallengePool(mode);
  const index = hashString(`${mode}:${dateKey}`) % Math.max(pool.length, 1);
  const item = pool[index];
  return { ...item, mode, dateKey };
}

export function getNextDailyCountdown(dateKey = getUTCDateKey()) {
  const next = new Date(Date.UTC(
    Number(dateKey.slice(0, 4)),
    Number(dateKey.slice(5, 7)) - 1,
    Number(dateKey.slice(8, 10)) + 1,
    0, 0, 0, 0
  ));
  const now = new Date();
  const diff = Math.max(0, next.getTime() - now.getTime());
  const hrs = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function formatDateLabel(dateKey) {
  const date = new Date(`${dateKey}T00:00:00Z`);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}
