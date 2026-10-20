import { getDailyChallenge, formatDateLabel, getNextDailyCountdown } from './daily.js';
import { renderKrillionGame } from './games/krillion.js';
import { renderNoillirkGame } from './games/noillirk.js';
import { renderBeforeAfterGame } from './games/before-after.js';
import { renderDiscoverGame } from './games/connections.js';
import { initializeTheme, loadState, saveState, setTheme, getStatsSummary } from './storage.js';

const app = document.getElementById('app');

const defaultState = {
  view: 'today',
  theme: 'dark',
  daily: {},
  stats: {
    totalGamesPlayed: 0,
    bestScores: { krillion: 0, noillirk: 0, beforeafter: 0, discover: 0 },
    totalCorrect: 0,
    discovered: [],
    timeline: [],
    recentArticles: []
  }
};

let state = loadState();
state = { ...defaultState, ...state, stats: { ...defaultState.stats, ...(state.stats || {}) } };

function persistState() {
  saveState(state);
}

function updateNav(view) {
  document.querySelectorAll('.nav-button').forEach((button) => {
    const isActive = button.dataset.view === view;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function renderTodayView() {
  const stats = getStatsSummary();
  const challengeKrillion = getDailyChallenge('krillion');
  const challengeNoillirk = getDailyChallenge('noillirk');

  app.innerHTML = `
    <section class="page">
      <article class="hero-card">
        <div class="hero-copy">
          <div class="section-label">Today</div>
          <h1>CHRONO</h1>
          <p>Daily history in a few quick, beautiful rounds. Play a challenge, learn a fact, and continue later without losing progress.</p>
          <div class="hero-actions">
            <button class="primary-button" type="button" data-view="krillion">Play Krillion</button>
            <button class="secondary-button" type="button" data-view="beforeafter">Check timeline</button>
          </div>
        </div>
        <div class="hero-metrics">
          <div class="metric"><strong>${stats.totalGamesPlayed || 0}</strong><span>games</span></div>
          <div class="metric"><strong>${stats.totalCorrect || 0}</strong><span>correct</span></div>
          <div class="metric"><strong>${stats.bestScores.krillion || 0}</strong><span>best</span></div>
        </div>
      </article>

      <div class="panel-grid">
        <section class="panel">
          <div class="section-label">Daily challenge</div>
          <h2>${formatDateLabel(challengeKrillion.dateKey)}</h2>
          <div class="challenge-grid">
            <div class="challenge-card">
              <div class="challenge-meta"><h3>Krillion</h3><span class="pill">Daily</span></div>
              <p>${challengeKrillion.title || 'Historical category challenge'} • ${challengeKrillion.category || 'History'}</p>
              <button class="primary-button" type="button" data-view="krillion">Start</button>
            </div>
            <div class="challenge-card">
              <div class="challenge-meta"><h3>Noillirk</h3><span class="pill">Daily</span></div>
              <p>${challengeNoillirk.title || 'Famous historical answer'} • ${challengeNoillirk.category || 'History'}</p>
              <button class="secondary-button" type="button" data-view="noillirk">Open</button>
            </div>
          </div>
        </section>

        <aside class="panel">
          <div class="section-label">Next challenge</div>
          <h2>${getNextDailyCountdown()}</h2>
          <p>UTC-based daily seed. The challenge changes once per calendar day.</p>
          <ul class="list">
            <li>Deterministic daily mode</li>
            <li>Local-only progress saved</li>
            <li>Resume any time</li>
          </ul>
        </aside>
      </div>
    </section>
  `;

  attachNavigationHandlers();
}

function renderKrillionView() {
  const challenge = getDailyChallenge('krillion');
  const stateLocal = state.daily.krillion || { draft: '', lastResult: null };
  state.daily.krillion = stateLocal;
  app.innerHTML = '';
  app.append(renderKrillionGame(stateLocal, challenge, {
    render: () => {
      state.daily.krillion = stateLocal;
      persistState();
      renderApp();
    }
  }));
}

function renderNoillirkView() {
  const challenge = getDailyChallenge('noillirk');
  const stateLocal = state.daily.noillirk || { draft: '', lastResult: null };
  state.daily.noillirk = stateLocal;
  app.innerHTML = '';
  app.append(renderNoillirkGame(stateLocal, challenge, {
    render: () => {
      state.daily.noillirk = stateLocal;
      persistState();
      renderApp();
    }
  }));
}

function renderBeforeAfterView() {
  const challenge = getDailyChallenge('beforeafter');
  const stateLocal = state.daily.beforeafter || { selected: null, lastResult: null };
  state.daily.beforeafter = stateLocal;
  app.innerHTML = '';
  app.append(renderBeforeAfterGame(stateLocal, challenge, {
    render: () => {
      state.daily.beforeafter = stateLocal;
      persistState();
      renderApp();
    }
  }));
}

function renderDiscoverView() {
  const challenge = getDailyChallenge('discover');
  const stateLocal = state.daily.discover || { selected: null, lastResult: null };
  state.daily.discover = stateLocal;
  app.innerHTML = '';
  app.append(renderDiscoverGame(stateLocal, challenge, {
    render: () => {
      state.daily.discover = stateLocal;
      persistState();
      renderApp();
    }
  }));
}

function renderStatsView() {
  const stats = getStatsSummary();
  app.innerHTML = `
    <section class="page">
      <div class="stats-grid">
        <article class="stat-card">
          <div class="section-label">Progress</div>
          <strong>${stats.totalGamesPlayed || 0}</strong>
          <p>Games played in this browser.</p>
        </article>
        <article class="stat-card">
          <div class="section-label">Correct</div>
          <strong>${stats.totalCorrect || 0}</strong>
          <p>Accurate answers recorded locally.</p>
        </article>
        <article class="stat-card">
          <div class="section-label">Best score</div>
          <strong>${Math.max(...Object.values(stats.bestScores || {})) || 0}</strong>
          <p>Highest score saved for any mode.</p>
        </article>
      </div>
    </section>
  `;
}

function attachNavigationHandlers() {
  document.querySelectorAll('[data-view]').forEach((button) => {
    button.addEventListener('click', () => {
      const view = button.dataset.view;
      state.view = view;
      persistState();
      renderApp();
    });
  });
}

function wireGlobalNavigation() {
  document.querySelectorAll('.nav-button').forEach((button) => {
    button.addEventListener('click', () => {
      state.view = button.dataset.view || 'today';
      persistState();
      renderApp();
    });
  });
}

function renderApp() {
  updateNav(state.view || 'today');
  if (state.view === 'krillion') return renderKrillionView();
  if (state.view === 'noillirk') return renderNoillirkView();
  if (state.view === 'beforeafter') return renderBeforeAfterGameView();
  if (state.view === 'discover') return renderDiscoverGameView();
  if (state.view === 'stats') return renderStatsView();
  renderTodayView();
}

function renderBeforeAfterGameView() {
  const challenge = getDailyChallenge('beforeafter');
  const stateLocal = state.daily.beforeafter || { selected: null, lastResult: null };
  state.daily.beforeafter = stateLocal;
  app.innerHTML = '';
  app.append(renderBeforeAfterGame(stateLocal, challenge, {
    render: () => {
      state.daily.beforeafter = stateLocal;
      persistState();
      renderApp();
    }
  }));
}

function renderDiscoverGameView() {
  const challenge = getDailyChallenge('discover');
  const stateLocal = state.daily.discover || { selected: null, lastResult: null };
  state.daily.discover = stateLocal;
  app.innerHTML = '';
  app.append(renderDiscoverGame(stateLocal, challenge, {
    render: () => {
      state.daily.discover = stateLocal;
      persistState();
      renderApp();
    }
  }));
}

initializeTheme();
wireGlobalNavigation();
state.view = state.view || 'today';
renderApp();

const themeToggle = document.createElement('button');
themeToggle.type = 'button';
themeToggle.className = 'secondary-button';
themeToggle.style.position = 'fixed';
themeToggle.style.right = '16px';
themeToggle.style.bottom = '16px';
themeToggle.textContent = 'Theme';
themeToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(next);
});
document.body.appendChild(themeToggle);

window.addEventListener('beforeunload', () => persistState());
