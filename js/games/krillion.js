import { normalizeAnswer, scoreAnswer, getScoreLabel } from '../scoring.js';

export function renderKrillionGame(state, challenge, app) {
  const container = document.createElement('section');
  container.className = 'page';
  const isCorrect = state?.lastResult?.mode === 'krillion' && state?.lastResult?.correct;

  container.innerHTML = `
    <article class="game-card">
      <div class="question-header">
        <div>
          <div class="section-label">Historical Krillion</div>
          <h2>${challenge.title || 'Name the historical event'}</h2>
        </div>
        <div class="pill">${challenge.category || 'History'}</div>
      </div>

      <p>${challenge.description || 'Enter the answer that best fits this historical category.'}</p>

      <div class="answer-field">
        <label>
          <span class="section-label">Your answer</span>
          <input id="krillion-answer" type="text" autocomplete="off" placeholder="Type your answer" aria-label="Historical answer" value="${state?.draft || ''}" />
        </label>
        <button id="submit-krillion" type="button">Check answer</button>
      </div>

      <div class="result ${state?.lastResult ? 'visible' : ''} ${state?.lastResult?.correct ? 'success' : state?.lastResult ? 'error' : ''}" id="krillion-result">
        ${state?.lastResult ? state.lastResult.message : ''}
      </div>

      <div class="fact-box">
        <div class="section-label">Scoring</div>
        <p>Rare or specific answers score more. The score reflects how unusual and historically precise the answer is.</p>
        <p><strong>Label:</strong> ${state?.lastResult ? getScoreLabel(state.lastResult.score) : 'Awaiting answer'}</p>
      </div>
    </article>
  `;

  container.querySelector('#submit-krillion').addEventListener('click', () => {
    const input = container.querySelector('#krillion-answer');
    const answer = input.value;
    const evaluation = scoreAnswer(challenge, answer, 'krillion');
    const message = evaluation.isCorrect
      ? `Correct — ${challenge.title} earns ${evaluation.score} points. Less common historical answers score more.`
      : `Not quite. The answer is ${challenge.title}. Try a more specific or accurate historical name.`;

    state.lastResult = { mode: 'krillion', correct: evaluation.isCorrect, score: evaluation.score, message };
    state.completed = true;
    app.render();
  });

  return container;
}
