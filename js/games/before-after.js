import { getRecordById } from '../data.js';

export function renderBeforeAfterGame(state, challenge, app) {
  const container = document.createElement('section');
  container.className = 'page';

  const leftRecord = getRecordById(challenge.left) || { title: String(challenge.left || 'Event A').replace(/_/g, ' ') };
  const rightRecord = getRecordById(challenge.right) || { title: String(challenge.right || 'Event B').replace(/_/g, ' ') };

  const choiceButtons = [
    { value: 'left', label: leftRecord.title },
    { value: 'right', label: rightRecord.title }
  ];

  container.innerHTML = `
    <article class="timeline-card">
      <div>
        <div class="section-label">Before / After</div>
        <h2>Which event happened first?</h2>
      </div>

      <div class="event-grid">
        ${choiceButtons.map((button) => `
          <button class="event-card ${state?.selected === button.value ? 'selected' : ''}" data-choice="${button.value}" type="button">
            <span class="year">${button.label.includes('A') || button.label.includes('B') ? 'Date unknown' : 'Historical'}</span>
            <strong>${button.label}</strong>
          </button>
        `).join('')}
      </div>

      <div class="answer-field">
        <button id="check-beforeafter" type="button">Check timeline</button>
      </div>

      <div class="result ${state?.lastResult ? 'visible' : ''} ${state?.lastResult?.correct ? 'success' : state?.lastResult ? 'error' : ''}" id="beforeafter-result">
        ${state?.lastResult ? state.lastResult.message : ''}
      </div>
    </article>
  `;

  container.querySelectorAll('.event-card').forEach((button) => {
    button.addEventListener('click', () => {
      state.selected = button.dataset.choice;
      container.querySelectorAll('.event-card').forEach((card) => card.classList.toggle('selected', card.dataset.choice === state.selected));
    });
  });

  container.querySelector('#check-beforeafter').addEventListener('click', () => {
    const selected = state.selected || 'left';
    const correct = challenge.correct === selected;
    const message = correct
      ? `Correct — ${challenge.explanation}`
      : `Not this time. ${challenge.explanation}`;

    state.lastResult = { mode: 'beforeafter', correct, message };
    state.completed = true;
    app.render();
  });

  return container;
}
