import { MORSE_DATA, REVERSE_MORSE, BEGINNER_LETTERS, INTERMEDIATE_WORDS, ADVANCED_SENTENCES } from './morseData.js';
import { getIcon } from './icons.js';

function sentenceMorse(text) {
  return text.toUpperCase().split(' ').map(word => word.split('').map(c => MORSE_DATA[c]).filter(Boolean).join(' ')).join(' / ');
}

function normalize(str) {
  return str.trim().toLowerCase().replace(/\s+/g, ' ');
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

function computeAccuracy(a, b) {
  const normA = normalize(a);
  const normB = normalize(b);
  if (normA === normB) return 100;
  const maxLen = Math.max(normA.length, normB.length);
  if (maxLen === 0) return 100;
  const dist = levenshtein(normA, normB);
  return Math.max(0, Math.round((1 - dist / maxLen) * 100));
}

export class GameModes {
  constructor(container, audioEngine, gameState, ui) {
    this.container = container;
    this.audioEngine = audioEngine;
    this.gameState = gameState;
    this.ui = ui;
    this.currentMode = null;
    this.questionNum = 0;
    this.sessionCorrect = 0;
    this.sessionStreak = 0;
    this.currentQuestion = null;
    this.currentWPM = 15;
    this.userMorseTokens = [];
    this._keyHandler = null;
    this._cleanups = [];
  }

  startMode(modeId) {
    this.currentMode = modeId;
    this.questionNum = 0;
    this.sessionCorrect = 0;
    this.sessionStreak = 0;
    this.currentQuestion = null;
    this.userMorseTokens = [];
    this._detachKeyHandler();
    this._runCleanups();
    this.container.innerHTML = '';
    this._buildSessionHeader();
    this.nextQuestion();
  }

  _runCleanups() {
    for (const fn of this._cleanups) {
      try { fn(); } catch (e) {}
    }
    this._cleanups = [];
  }

  _buildSessionHeader() {
    const header = document.createElement('div');
    header.className = 'session-header';
    header.innerHTML = `
      <div class="session-header-top">
        <button class="btn-exit" id="mode-exit-btn">
          ${getIcon('arrow-left')}
          <span>Exit</span>
        </button>
        <h2 class="mode-title">${this._modeTitle(this.currentMode)}</h2>
        <div class="session-spacer"></div>
      </div>
      <div class="session-stats">
        <div class="stat-item"><span class="stat-label">Question</span><span class="stat-value" id="stat-question">1</span></div>
        <div class="stat-item"><span class="stat-label">Score</span><span class="stat-value" id="stat-score">0</span></div>
        <div class="stat-item"><span class="stat-label">Streak</span><span class="stat-value" id="stat-streak">0</span></div>
      </div>
      <div id="practice-root"></div>
    `;
    this.container.appendChild(header);
    this.practiceRoot = header.querySelector('#practice-root');
    const exitBtn = header.querySelector('#mode-exit-btn');
    const onExit = () => {
      this.audioEngine.stop();
      this._detachKeyHandler();
      this._runCleanups();
      window.dispatchEvent(new CustomEvent('game:exit-mode'));
    };
    exitBtn.addEventListener('click', onExit);
    this._cleanups.push(() => exitBtn.removeEventListener('click', onExit));
    this._refreshStats();
  }

  _modeTitle(id) {
    switch (id) {
      case 'beginner': return 'Beginner Mode';
      case 'intermediate': return 'Intermediate Mode';
      case 'advanced': return 'Advanced Mode';
      case 'master': return 'Master Mode';
      default: return 'Practice';
    }
  }

  _refreshStats() {
    const qEl = document.getElementById('stat-question');
    const sEl = document.getElementById('stat-score');
    const stEl = document.getElementById('stat-streak');
    if (qEl) qEl.textContent = String(this.questionNum);
    if (sEl) sEl.textContent = String(this.sessionCorrect);
    if (stEl) stEl.textContent = String(this.sessionStreak);
  }

  _bumpQuestion() {
    this.questionNum++;
    this._refreshStats();
  }

  _recordCorrectFeedback(mode, detail, btnEl) {
    this.gameState.recordCorrect(mode, detail);
    this.sessionCorrect++;
    this.sessionStreak++;
    if (btnEl) this.ui.correctGlow(btnEl);
    const rect = (btnEl || this.practiceRoot).getBoundingClientRect();
    this.ui.particleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, '#22c55e');
    this.audioEngine.playDing();
    this._refreshStats();
  }

  _recordWrongFeedback(btnEl) {
    this.gameState.recordWrong();
    this.sessionStreak = 0;
    if (btnEl) this.ui.wrongShake(btnEl);
    this.audioEngine.playBuzz();
    this._refreshStats();
  }

  _pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  _pickNRandom(arr, n, exclude = []) {
    const pool = arr.filter(x => !exclude.includes(x));
    const result = [];
    const copy = pool.slice();
    for (let i = 0; i < n && copy.length > 0; i++) {
      const idx = Math.floor(Math.random() * copy.length);
      result.push(copy[idx]);
      copy.splice(idx, 1);
    }
    return result;
  }

  nextQuestion() {
    this._detachKeyHandler();
    this._runCleanups();
    this._bumpQuestion();
    switch (this.currentMode) {
      case 'beginner': this._buildBeginner(); break;
      case 'intermediate': this._buildIntermediate(); break;
      case 'advanced': this._buildAdvanced(); break;
      case 'master': this._buildMaster(); break;
    }
  }

  _buildBeginner() {
    const letter = this._pickRandom(BEGINNER_LETTERS);
    this.currentQuestion = { letter };
    this.practiceRoot.innerHTML = `
      <div class="question-card">
        <div class="question-prompt">Identify this letter</div>
        <div class="morse-display" id="beginner-morse">${MORSE_DATA[letter]}</div>
        <div class="replay-row">
          <button class="btn-replay" id="beginner-replay">
            ${getIcon('volume')}
            <span>Play Sound</span>
          </button>
        </div>
        <div class="options-grid" id="beginner-options"></div>
        <div class="feedback-area" id="beginner-feedback"></div>
      </div>
    `;
    const optionsWrap = this.practiceRoot.querySelector('#beginner-options');
    const distractors = this._pickNRandom(BEGINNER_LETTERS, 3, [letter]);
    const options = [letter, ...distractors].sort(() => Math.random() - 0.5);
    const buttons = [];
    for (const opt of options) {
      const btn = document.createElement('button');
      btn.className = 'btn-option';
      btn.textContent = opt;
      btn.dataset.value = opt;
      optionsWrap.appendChild(btn);
      buttons.push(btn);
    }
    const replayBtn = this.practiceRoot.querySelector('#beginner-replay');
    const doReplay = () => this.audioEngine.playMorse(letter, 15);
    replayBtn.addEventListener('click', doReplay);
    this._cleanups.push(() => replayBtn.removeEventListener('click', doReplay));
    setTimeout(() => doReplay(), 100);
    const feedback = this.practiceRoot.querySelector('#beginner-feedback');
    let locked = false;
    for (const btn of buttons) {
      const handler = () => {
        if (locked) return;
        locked = true;
        const picked = btn.dataset.value;
        if (picked === letter) {
          this._recordCorrectFeedback('beginner', letter, btn);
          feedback.innerHTML = `<div class="feedback correct">${getIcon('check-circle')} <span>Correct! It was <strong>${letter}</strong></span></div>`;
        } else {
          this._recordWrongFeedback(btn);
          let correctBtn = buttons.find(b => b.dataset.value === letter);
          if (correctBtn) this.ui.correctGlow(correctBtn);
          feedback.innerHTML = `<div class="feedback wrong">${getIcon('x-circle')} <span>Wrong. Correct answer: <strong>${letter}</strong></span></div>`;
        }
        setTimeout(() => this.nextQuestion(), 1200);
      };
      btn.addEventListener('click', handler);
      this._cleanups.push(() => btn.removeEventListener('click', handler));
    }
  }

  _buildIntermediate() {
    const word = this._pickRandom(INTERMEDIATE_WORDS);
    this.currentQuestion = { word };
    this.practiceRoot.innerHTML = `
      <div class="question-card">
        <div class="question-prompt">Type the word you hear</div>
        <div class="replay-row">
          <button class="btn-replay" id="intermediate-replay">
            ${getIcon('volume')}
            <span>Play Sound</span>
          </button>
        </div>
        <div class="input-row">
          <input type="text" id="intermediate-input" class="text-input" autocomplete="off" spellcheck="false" placeholder="Type word here...">
          <button class="btn-submit" id="intermediate-submit">Submit</button>
        </div>
        <div class="letter-highlight" id="intermediate-highlight"></div>
        <div class="feedback-area" id="intermediate-feedback"></div>
      </div>
    `;
    const input = this.practiceRoot.querySelector('#intermediate-input');
    const submitBtn = this.practiceRoot.querySelector('#intermediate-submit');
    const replayBtn = this.practiceRoot.querySelector('#intermediate-replay');
    const feedback = this.practiceRoot.querySelector('#intermediate-feedback');
    const highlight = this.practiceRoot.querySelector('#intermediate-highlight');
    const doReplay = () => this.audioEngine.playMorse(word, 15);
    replayBtn.addEventListener('click', doReplay);
    this._cleanups.push(() => replayBtn.removeEventListener('click', doReplay));
    setTimeout(() => { doReplay(); input.focus(); }, 100);
    let locked = false;
    const grade = () => {
      if (locked) return;
      const answer = input.value.trim().toUpperCase();
      if (answer.length === 0) { this.ui.showToast('Please type an answer', 'info'); return; }
      locked = true;
      const isCorrect = answer === word;
      let html = '';
      const maxLen = Math.max(word.length, answer.length);
      for (let i = 0; i < maxLen; i++) {
        const wc = i < word.length ? word[i] : '';
        const ac = i < answer.length ? answer[i] : '';
        const cls = wc === ac ? 'letter-correct' : 'letter-wrong';
        const disp = ac || '·';
        html += `<span class="letter-chip ${cls}">${disp}</span>`;
      }
      highlight.innerHTML = html;
      if (isCorrect) {
        this._recordCorrectFeedback('intermediate', word, submitBtn);
        feedback.innerHTML = `<div class="feedback correct">${getIcon('check-circle')} <span>Perfect! <strong>${word}</strong></span></div>`;
      } else {
        this._recordWrongFeedback(submitBtn);
        feedback.innerHTML = `<div class="feedback wrong">${getIcon('x-circle')} <span>Answer: <strong>${word}</strong></span></div>`;
      }
      setTimeout(() => this.nextQuestion(), 1600);
    };
    submitBtn.addEventListener('click', grade);
    this._cleanups.push(() => submitBtn.removeEventListener('click', grade));
    this._keyHandler = (e) => {
      if (e.key === 'Enter') { e.preventDefault(); grade(); }
    };
    input.addEventListener('keydown', this._keyHandler);
    this._cleanups.push(() => input.removeEventListener('keydown', this._keyHandler));
  }

  _buildAdvanced() {
    const sentence = this._pickRandom(ADVANCED_SENTENCES);
    this.currentQuestion = { sentence };
    this.currentWPM = 15;
    this.practiceRoot.innerHTML = `
      <div class="question-card">
        <div class="question-prompt">Transcribe the sentence</div>
        <div class="wpm-control">
          <label for="advanced-wpm">Speed: <span id="advanced-wpm-label">15 WPM</span></label>
          <input type="range" id="advanced-wpm" min="10" max="25" step="1" value="15">
        </div>
        <div class="replay-row">
          <button class="btn-replay" id="advanced-replay">
            ${getIcon('volume')}
            <span>Play Sound</span>
          </button>
        </div>
        <div class="input-row">
          <textarea id="advanced-input" class="text-input text-area" rows="4" placeholder="Type sentence here..."></textarea>
        </div>
        <div class="input-row">
          <button class="btn-submit" id="advanced-submit">Submit</button>
        </div>
        <div class="accuracy-banner" id="advanced-banner"></div>
        <div class="feedback-area" id="advanced-feedback"></div>
      </div>
    `;
    const textarea = this.practiceRoot.querySelector('#advanced-input');
    const submitBtn = this.practiceRoot.querySelector('#advanced-submit');
    const replayBtn = this.practiceRoot.querySelector('#advanced-replay');
    const wpmSlider = this.practiceRoot.querySelector('#advanced-wpm');
    const wpmLabel = this.practiceRoot.querySelector('#advanced-wpm-label');
    const feedback = this.practiceRoot.querySelector('#advanced-feedback');
    const banner = this.practiceRoot.querySelector('#advanced-banner');
    const onWpm = () => {
      this.currentWPM = parseInt(wpmSlider.value, 10);
      wpmLabel.textContent = `${this.currentWPM} WPM`;
    };
    wpmSlider.addEventListener('input', onWpm);
    this._cleanups.push(() => wpmSlider.removeEventListener('input', onWpm));
    const doReplay = () => this.audioEngine.playMorse(sentence, this.currentWPM);
    replayBtn.addEventListener('click', doReplay);
    this._cleanups.push(() => replayBtn.removeEventListener('click', doReplay));
    setTimeout(() => { doReplay(); textarea.focus(); }, 100);
    let locked = false;
    const grade = () => {
      if (locked) return;
      const answer = textarea.value;
      if (answer.trim().length === 0) { this.ui.showToast('Please type an answer', 'info'); return; }
      locked = true;
      const accuracy = computeAccuracy(sentence, answer);
      const isCorrect = accuracy >= 95;
      let bannerClass = accuracy >= 95 ? 'accuracy-perfect' : accuracy >= 80 ? 'accuracy-good' : accuracy >= 60 ? 'accuracy-mid' : 'accuracy-low';
      banner.innerHTML = `<div class="${bannerClass}">Accuracy: <strong>${accuracy}%</strong></div>`;
      if (isCorrect) {
        this._recordCorrectFeedback('advanced', null, submitBtn);
        feedback.innerHTML = `<div class="feedback correct">Excellent! 95%+ accuracy achieved.</div>`;
      } else {
        this._recordWrongFeedback(submitBtn);
        feedback.innerHTML = `<div class="feedback wrong">Expected: <strong>${sentence}</strong></div>`;
      }
      setTimeout(() => this.nextQuestion(), 2400);
    };
    submitBtn.addEventListener('click', grade);
    this._cleanups.push(() => submitBtn.removeEventListener('click', grade));
    this._keyHandler = (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); grade(); }
    };
    textarea.addEventListener('keydown', this._keyHandler);
    this._cleanups.push(() => textarea.removeEventListener('keydown', this._keyHandler));
  }

  _buildMaster() {
    const useWord = Math.random() < 0.5;
    const target = useWord ? this._pickRandom(INTERMEDIATE_WORDS) : this._pickRandom(BEGINNER_LETTERS);
    this.currentQuestion = { target };
    this.userMorseTokens = [];
    this.practiceRoot.innerHTML = `
      <div class="question-card">
        <div class="question-prompt">Encode this in Morse: <span class="target-display" id="master-target">${target}</span></div>
        <div class="morse-live" id="master-live">&nbsp;</div>
        <div class="morse-buttons">
          <button class="btn-morse btn-dot" id="master-dot" title="Dot (.)">·</button>
          <button class="btn-morse btn-dash" id="master-dash" title="Dash (-)">—</button>
          <button class="btn-morse btn-space" id="master-space" title="Letter gap (Space)">/</button>
          <button class="btn-morse btn-back" id="master-back" title="Backspace">${getIcon('backspace')}</button>
        </div>
        <div class="input-row">
          <button class="btn-submit" id="master-submit">Submit</button>
        </div>
        <div class="morse-compare" id="master-compare"></div>
        <div class="feedback-area" id="master-feedback"></div>
      </div>
    `;
    const dotBtn = this.practiceRoot.querySelector('#master-dot');
    const dashBtn = this.practiceRoot.querySelector('#master-dash');
    const spaceBtn = this.practiceRoot.querySelector('#master-space');
    const backBtn = this.practiceRoot.querySelector('#master-back');
    const submitBtn = this.practiceRoot.querySelector('#master-submit');
    const liveEl = this.practiceRoot.querySelector('#master-live');
    const feedback = this.practiceRoot.querySelector('#master-feedback');
    const compare = this.practiceRoot.querySelector('#master-compare');
    const renderLive = () => {
      if (this.userMorseTokens.length === 0) { liveEl.innerHTML = '&nbsp;'; return; }
      const html = this.userMorseTokens.map(t => {
        if (t === '/') return `<span class="morse-sep">/</span>`;
        const pretty = t.replace(/\./g, '·').replace(/-/g, '—');
        return `<span class="morse-token">${pretty}</span>`;
      }).join(' ');
      liveEl.innerHTML = html;
    };
    const addToken = (t) => {
      if (t === '/') {
        if (this.userMorseTokens.length > 0 && this.userMorseTokens[this.userMorseTokens.length - 1] !== '/') {
          this.userMorseTokens.push('/');
        }
      } else if (t === '.') {
        const last = this.userMorseTokens[this.userMorseTokens.length - 1];
        if (last && last !== '/') {
          this.userMorseTokens[this.userMorseTokens.length - 1] = last + '.';
        } else {
          this.userMorseTokens.push('.');
        }
        this.audioEngine.playDit();
      } else if (t === '-') {
        const last = this.userMorseTokens[this.userMorseTokens.length - 1];
        if (last && last !== '/') {
          this.userMorseTokens[this.userMorseTokens.length - 1] = last + '-';
        } else {
          this.userMorseTokens.push('-');
        }
        this.audioEngine.playDah();
      }
      renderLive();
    };
    const backspace = () => {
      if (this.userMorseTokens.length === 0) return;
      const last = this.userMorseTokens[this.userMorseTokens.length - 1];
      if (last === '/' || last.length <= 1) {
        this.userMorseTokens.pop();
      } else {
        this.userMorseTokens[this.userMorseTokens.length - 1] = last.slice(0, -1);
      }
      renderLive();
    };
    const onDot = () => addToken('.');
    const onDash = () => addToken('-');
    const onSpace = () => addToken('/');
    const onBack = () => backspace();
    dotBtn.addEventListener('click', onDot);
    dashBtn.addEventListener('click', onDash);
    spaceBtn.addEventListener('click', onSpace);
    backBtn.addEventListener('click', onBack);
    this._cleanups.push(() => dotBtn.removeEventListener('click', onDot));
    this._cleanups.push(() => dashBtn.removeEventListener('click', onDash));
    this._cleanups.push(() => spaceBtn.removeEventListener('click', onSpace));
    this._cleanups.push(() => backBtn.removeEventListener('click', onBack));
    let locked = false;
    const grade = () => {
      if (locked) return;
      if (this.userMorseTokens.length === 0) { this.ui.showToast('Enter some Morse first', 'info'); return; }
      locked = true;
      const userLetters = [];
      let buf = [];
      for (const t of this.userMorseTokens) {
        if (t === '/') {
          if (buf.length) { userLetters.push(buf.join(' ')); buf = []; }
        } else {
          buf.push(t);
        }
      }
      if (buf.length) userLetters.push(buf.join(' '));
      const userMorseStr = userLetters.join(' / ');
      const expectedMorse = sentenceMorse(target);
      const isCorrect = userMorseStr === expectedMorse;
      const prettyExp = expectedMorse.replace(/\./g, '·').replace(/-/g, '—');
      const prettyUser = userMorseStr.replace(/\./g, '·').replace(/-/g, '—');
      compare.innerHTML = `
        <div class="compare-row"><span class="compare-label">Expected:</span><span class="compare-val">${prettyExp}</span></div>
        <div class="compare-row"><span class="compare-label">Your answer:</span><span class="compare-val ${isCorrect ? 'correct' : 'wrong'}">${prettyUser}</span></div>
      `;
      if (isCorrect) {
        this._recordCorrectFeedback('master', target, submitBtn);
        feedback.innerHTML = `<div class="feedback correct">Perfect Morse encoding!</div>`;
      } else {
        this._recordWrongFeedback(submitBtn);
        feedback.innerHTML = `<div class="feedback wrong">Target was <strong>${target}</strong>. Expected Morse above.</div>`;
      }
      setTimeout(() => this.nextQuestion(), 2200);
    };
    submitBtn.addEventListener('click', grade);
    this._cleanups.push(() => submitBtn.removeEventListener('click', grade));
    this._keyHandler = (e) => {
      if (e.key === '.' || e.key === '·') { e.preventDefault(); addToken('.'); }
      else if (e.key === '-' || e.key === '—') { e.preventDefault(); addToken('-'); }
      else if (e.key === ' ') { e.preventDefault(); addToken('/'); }
      else if (e.key === 'Backspace') { e.preventDefault(); backspace(); }
      else if (e.key === 'Enter') { e.preventDefault(); grade(); }
    };
    document.addEventListener('keydown', this._keyHandler);
    this._cleanups.push(() => document.removeEventListener('keydown', this._keyHandler));
    renderLive();
  }

  _detachKeyHandler() {
    if (this._keyHandler) {
      document.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = null;
    }
  }
}

