import { scoreAnswer, getScoreLabel } from '../scoring.js';

export function renderNoillirkGame(state, challenge, app) {
  const container = document.createElement('section');
  container.className = 'page';

  const promptText = challenge.prompt || 'Name a widely recognized thing from history.';

  container.innerHTML = `
    <article class="game-card">
      <div class="question-header">
        <div>
          <div class="section-label">Noillirk</div>
          <h2>Think common, not niche</h2>
        </div>
        <div class="pill">Popular answer</div>
      </div>

      <div class="prompt-box">
        <div class="section-label">Prompt</div>
        <strong>${promptText}</strong>
      </div>

      <p>In this mode, the most common recognized answer gets the biggest score. This is the opposite of Krillion: you want the obvious answer, not the obscure one.</p>

      <div class="answer-field">
        <label>
          <span class="section-label">Your answer</span>
          <input id="noillirk-answer" type="text" autocomplete="off" spellcheck="false" placeholder="Write the most familiar answer you think the majority would choose" value="${state?.draft || ''}" />
        </label>
        <button id="submit-noillirk" type="button">Lock answer</button>
      </div>

      <div class="result ${state?.lastResult ? 'visible' : ''} ${state?.lastResult?.correct ? 'success' : state?.lastResult ? 'error' : ''}" id="noillirk-result">
        ${state?.lastResult ? state.lastResult.message : ''}
      </div>

      <div class="fact-box">
        <div class="section-label">Scoring</div>
        <p>Recognized, familiar, obvious answers are worth more. This mode rewards the answer most people would name first.</p>
        <p><strong>Current label:</strong> ${state?.lastResult ? getScoreLabel(state.lastResult.score) : 'Waiting for your answer'}</p>
      </div>
    </article>
  `;

  container.querySelector('#submit-noillirk').addEventListener('click', () => {
    const input = container.querySelector('#noillirk-answer');
    const answer = input.value;
    state.draft = answer;

    const evaluation = scoreAnswer(challenge, answer, 'noillirk');
    const message = evaluation.isCorrect
      ? `Correct — ${challenge.accepted?.[0] || challenge.title || 'the obvious answer'} scores ${evaluation.score}. That’s exactly the high-recognition answer this mode rewards.`
      : `Not quite. The strongest, most recognizable answer is ${challenge.accepted?.[0] || challenge.title || 'the obvious answer'}.`;

    state.lastResult = {
      mode: 'noillirk',
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
