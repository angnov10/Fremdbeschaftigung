import { scoreAnswer, getScoreLabel } from '../scoring.js';

export function renderKrillionGame(state, challenge, app) {
  const container = document.createElement('section');
  container.className = 'page';

  const promptText = challenge.prompt || 'Name a historically important person, place, event or idea.';
  const answerText = state?.draft || '';

  container.innerHTML = `
    <article class="game-card">
      <div class="question-header">
        <div>
          <div class="section-label">Krillion</div>
          <h2>Rare answer, better score</h2>
        </div>
        <div class="pill">Daily prompt</div>
      </div>

      <div class="prompt-box">
        <div class="section-label">Prompt</div>
        <strong>${promptText}</strong>
      </div>

      <div class="answer-field">
        <label>
          <span class="section-label">Your answer</span>
          <input id="krillion-answer" type="text" autocomplete="off" spellcheck="false" placeholder="Type a precise answer — not just a rough category" value="${answerText}" />
        </label>
        <button id="submit-krillion" type="button">Submit answer</button>
      </div>

      <div class="result ${state?.lastResult ? 'visible' : ''} ${state?.lastResult?.correct ? 'success' : state?.lastResult ? 'error' : ''}" id="krillion-result">
        ${state?.lastResult ? state.lastResult.message : ''}
      </div>

      <div class="fact-box">
        <div class="section-label">Score logic</div>
        <p>Obvious answers score less. Rare but historically valid answers score more. The point is to be specific without guessing randomly.</p>
        <p><strong>Current label:</strong> ${state?.lastResult ? getScoreLabel(state.lastResult.score) : 'Waiting for your answer'}</p>
      </div>
    </article>
  `;

  container.querySelector('#submit-krillion').addEventListener('click', () => {
    const input = container.querySelector('#krillion-answer');
    const answer = input.value;
    state.draft = answer;

    const evaluation = scoreAnswer(challenge, answer, 'krillion');
    const message = evaluation.isCorrect
      ? `Correct — ${challenge.accepted?.[0] || challenge.title || 'This answer'} scores ${evaluation.score}. Rare but valid historical answers are the sweet spot.`
      : `Not quite. A stronger answer would be ${challenge.accepted?.[0] || challenge.title || 'the historically accurate answer'}.`;

    state.lastResult = {
      mode: 'krillion',
      correct: evaluation.isCorrect,
      score: evaluation.score,
      message,
      reason: evaluation.reason
    };
    state.completed = true;
    app.render();
  });

  return container;
}
