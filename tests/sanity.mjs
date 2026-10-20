import { strict as assert } from 'node:assert';
import { getDailyChallenge, getUTCDateKey } from '../js/daily.js';
import { normalizeAnswer, scoreAnswer } from '../js/scoring.js';

const challenge = getDailyChallenge('krillion', '2026-10-20');
assert.ok(challenge && challenge.title, 'Daily challenge should resolve for a given date.');
assert.equal(challenge.dateKey, '2026-10-20');

const answer = normalizeAnswer('  World War II  ');
assert.equal(answer, 'world war ii');

const evalResult = scoreAnswer({ title: 'World War II', aliases: ['world war ii', 'ww2'], score: 150, difficulty: 1 }, 'ww2', 'noillirk');
assert.equal(evalResult.isCorrect, true);
assert.ok(evalResult.score > 0, 'Scoring should return a positive result.');

const nowKey = getUTCDateKey(new Date('2026-10-20T12:00:00Z'));
assert.equal(nowKey, '2026-10-20');

console.log('sanity checks passed');
