import { scoreAnswer, getScoreLabel } from '../scoring.js';

export function renderNoillirkGame(state, challenge, app) {
  const container = document.createElement('section');
  container.className = 'page';

  container.innerHTML = `
    <article class="game-card">
      <div class="question-header">
        <div>
          <div class="section-label">Historical Noillirk</div>
          <h2>${challenge.title || 'Name the famous historical figure or event'}</h2>
        </div>
        <div class="pill">${challenge.category || 'History'}</div>
      </div>

      <p>In this mode, the most recognizable answer earns the highest score. Think of the famous, widely known name rather than the rarest variant.</p>

      <div class="answer-field">
        <label>
          <span class="section-label">Your answer</span>
          <input id="noillirk-answer" type="text" autocomplete="off" placeholder="Type the famous answer" aria-label="Noillirk answer" value="${state?.draft || ''}" />
        </label>
        <button id="submit-noillirk" type="button">Submit</button>
      </div>

      <div class="result ${state?.lastResult ? 'visible' : ''} ${state?.lastResult?.correct ? 'success' : state?.lastResult ? 'error' : ''}" id="noillirk-result">
        ${state?.lastResult ? state.lastResult.message : ''}
      </div>

      <div class="fact-box">
        <div class="section-label">Score</div>
        <p><strong>Label:</strong> ${state?.lastResult ? getScoreLabel(state.lastResult.score) : 'Waiting for answer'}</p>
      </div>
    </article>
  `;

  container.querySelector('#submit-noillirk').addEventListener('click', () => {
    const input = container.querySelector('#noillirk-answer');
    const answer = input.value;
    const evaluation = scoreAnswer(challenge, answer, 'noillirk');
    const message = evaluation.isCorrect
      ? `Correct — ${challenge.title} scores ${evaluation.score}. In this mode, the most recognized answer wins more.`
      : `Close, but not quite. The correct answer is ${challenge.title}.`;

    state.lastResult = { mode: 'noillirk', correct: evaluation.isCorrect, score: evaluation.score, message };
    state.completed = true;
    app.render();
  });

  return container;
}
