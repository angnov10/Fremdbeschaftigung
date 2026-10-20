import { getRecordById } from '../data.js';

export function renderDiscoverGame(state, challenge, app) {
  const container = document.createElement('section');
  container.className = 'page';

  const fromRecord = getRecordById(challenge.from) || { title: String(challenge.from || 'First connection').replace(/_/g, ' ') };
  const toRecord = getRecordById(challenge.to) || { title: String(challenge.to || 'Second connection').replace(/_/g, ' ') };

  const options = [
    { id: 'from', label: fromRecord.title },
    { id: 'to', label: toRecord.title }
  ];

  container.innerHTML = `
    <article class="timeline-card">
      <div>
        <div class="section-label">Discover</div>
        <h2>Historical connection challenge</h2>
      </div>

      <p>${challenge.prompt || 'Connect the two ideas through history.'}</p>

      <div class="option-list">
        ${options.map((option) => `
          <button class="option-button ${state?.selected === option.id ? 'selected' : ''}" data-choice="${option.id}" type="button">${option.label}</button>
        `).join('')}
      </div>

      <div class="answer-field">
        <button id="check-connection" type="button">Submit connection</button>
      </div>

      <div class="result ${state?.lastResult ? 'visible' : ''} ${state?.lastResult?.correct ? 'success' : state?.lastResult ? 'error' : ''}" id="connection-result">
        ${state?.lastResult ? state.lastResult.message : ''}
      </div>
    </article>
  `;

  container.querySelectorAll('.option-button').forEach((button) => {
    button.addEventListener('click', () => {
      state.selected = button.dataset.choice;
      container.querySelectorAll('.option-button').forEach((btn) => btn.classList.toggle('selected', btn.dataset.choice === state.selected));
    });
  });

  container.querySelector('#check-connection').addEventListener('click', () => {
    const correct = state.selected === 'from';
    const message = correct
      ? `Correct — ${challenge.explanation}`
      : `Not quite. This relationship works through historical exchange and innovation: ${challenge.explanation}`;

    state.lastResult = { mode: 'discover', correct, message };
    state.completed = true;
    app.render();
  });

  return container;
}
