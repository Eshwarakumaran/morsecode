import { LESSONS_DATA, FLASHCARD_ITEMS } from './learnData.js';
import { MORSE_DATA, REVERSE_MORSE } from './morseData.js';
import { getIcon } from './icons.js';

export class LearnModule {
  constructor(container, audioEngine, gameState, ui) {
    this.container = container;
    this.audioEngine = audioEngine;
    this.gameState = gameState;
    this.ui = ui;

    this.activeTab = 'lessons'; // 'lessons', 'keyer', 'flashcards', 'translator'
    this.currentLessonId = 'lesson-1';
    this.currentQuizIndex = 0;
    this.currentQuizCorrect = 0;

    // Flashcard state
    this.flashcardCategory = 'all';
    this.currentFlashcardIdx = 0;
    this.flashcardIsFlipped = false;

    // Keyer state
    this.isKeyDown = false;
    this.keyDownTime = 0;
    this.keyerWpm = 12; // default comfortable beginner speed
    this.keyerSymbols = [];
    this.keyerDecodedChars = '';
    this.keyerGapTimer = null;
    this.keyerTargetLetter = 'E';
    this.keyerCleanups = [];

    // Translator state
    this.translatorSpeed = 12;
    this.isTranslatorPlaying = false;

    this.init();
  }

  init() {
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="learn-header-card card tilt">
        <div class="learn-header-content">
          <div class="learn-badge-pill">
            ${getIcon('award', 'pill-icon')}
            <span>Beginner's Academy</span>
          </div>
          <h2 class="learn-title">Learn Morse Code From Scratch</h2>
          <p class="learn-subtitle">Step-by-step visual &amp; auditory lessons, hands-on telegraph keying, smart flashcards, and live signal translation.</p>
        </div>
        <div class="learn-tabs-nav" role="tablist">
          <button class="learn-tab-btn ${this.activeTab === 'lessons' ? 'active' : ''}" data-tab="lessons" role="tab">
            <span class="tab-icon">${getIcon('learn')}</span>
            <span>Lessons</span>
          </button>
          <button class="learn-tab-btn ${this.activeTab === 'keyer' ? 'active' : ''}" data-tab="keyer" role="tab">
            <span class="tab-icon">${getIcon('radio')}</span>
            <span>Telegraph Keyer</span>
          </button>
          <button class="learn-tab-btn ${this.activeTab === 'flashcards' ? 'active' : ''}" data-tab="flashcards" role="tab">
            <span class="tab-icon">${getIcon('cards')}</span>
            <span>Flashcards</span>
          </button>
          <button class="learn-tab-btn ${this.activeTab === 'translator' ? 'active' : ''}" data-tab="translator" role="tab">
            <span class="tab-icon">${getIcon('lightbulb')}</span>
            <span>Signal Translator</span>
          </button>
        </div>
      </div>

      <div class="learn-tab-content-root" id="learn-tab-content">
      </div>
    `;

    this.setupTabEvents();
    this.renderCurrentTab();
  }

  setupTabEvents() {
    const tabBtns = this.container.querySelectorAll('.learn-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (this.activeTab === tab) return;
        this.activeTab = tab;
        tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
        this.renderCurrentTab();
      });
    });
  }

  renderCurrentTab() {
    const root = this.container.querySelector('#learn-tab-content');
    if (!root) return;

    this.cleanupKeyer();
    this.audioEngine.stop();

    if (this.activeTab === 'lessons') {
      this.renderLessonsTab(root);
    } else if (this.activeTab === 'keyer') {
      this.renderKeyerTab(root);
    } else if (this.activeTab === 'flashcards') {
      this.renderFlashcardsTab(root);
    } else if (this.activeTab === 'translator') {
      this.renderTranslatorTab(root);
    }

    this.ui.enableTilt3D();
  }

  /* ==========================================================================
     1. LESSONS TAB
     ========================================================================== */

  renderLessonsTab(root) {
    const completedCount = (this.gameState.stats.lessonsCompleted || []).length;
    const progressPercent = Math.round((completedCount / LESSONS_DATA.length) * 100);

    const currentLesson = LESSONS_DATA.find(l => l.id === this.currentLessonId) || LESSONS_DATA[0];

    root.innerHTML = `
      <div class="lessons-layout">
        <!-- Sidebar / Lesson selector -->
        <aside class="lessons-sidebar card tilt">
          <div class="lessons-progress-box">
            <div class="lessons-progress-labels">
              <span class="prog-title">Curriculum Progress</span>
              <span class="prog-score">${completedCount} / ${LESSONS_DATA.length}</span>
            </div>
            <div class="xp-bar" role="progressbar" aria-valuenow="${progressPercent}">
              <div class="xp-bar-fill" style="width: ${progressPercent}%;"></div>
            </div>
          </div>

          <nav class="lessons-list" aria-label="Beginner lessons">
            ${LESSONS_DATA.map(l => {
              const isCompleted = this.gameState.isLessonCompleted(l.id);
              const isActive = l.id === this.currentLessonId;
              return `
                <button class="lesson-nav-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" data-lesson-id="${l.id}">
                  <span class="nav-lesson-num">${isCompleted ? getIcon('check') : l.number}</span>
                  <div class="nav-lesson-info">
                    <div class="nav-lesson-title">${l.title}</div>
                    <div class="nav-lesson-sub">${l.subtitle}</div>
                  </div>
                  <span class="nav-lesson-icon">${getIcon(l.icon || 'sparkles')}</span>
                </button>
              `;
            }).join('')}
          </nav>
        </aside>

        <!-- Main Lesson Content -->
        <div class="lesson-content-pane card tilt" id="lesson-detail-pane">
        </div>
      </div>
    `;

    // Bind sidebar item clicks
    root.querySelectorAll('.lesson-nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentLessonId = btn.dataset.lessonId;
        this.currentQuizIndex = 0;
        this.renderLessonsTab(root);
      });
    });

    const pane = root.querySelector('#lesson-detail-pane');
    this.renderLessonDetail(pane, currentLesson);
  }

  renderLessonDetail(pane, lesson) {
    const isCompleted = this.gameState.isLessonCompleted(lesson.id);

    pane.innerHTML = `
      <div class="lesson-header">
        <div class="lesson-num-badge">Lesson ${lesson.number} of ${LESSONS_DATA.length}</div>
        <h2 class="lesson-active-title">${lesson.title}</h2>
        <p class="lesson-active-summary">${lesson.summary}</p>
      </div>

      <div class="lesson-body-section">
        ${lesson.concept}
      </div>

      <div class="lesson-chars-section">
        <h3 class="section-subheading">Characters Introduced in this Lesson</h3>
        <p class="section-subtext">Click any character card to hear its acoustic rhythm and see the signal beacon pulse.</p>
        <div class="lesson-chars-grid">
          ${lesson.characters.map(c => `
            <div class="lesson-char-card card" data-char="${c.char}">
              <div class="char-top">
                <span class="char-letter">${c.char}</span>
                <span class="char-tip">${c.tip}</span>
              </div>
              <div class="char-morse-visual">${this.formatMorseVisual(c.code)}</div>
              <div class="char-sound-tag">${c.sound}</div>
              <div class="char-mnemonic"><span class="mnemonic-icon">${getIcon('lightbulb')}</span> <span>${c.mnemonic}</span></div>
              <button class="btn btn-sm btn-char-play" data-play-char="${c.char}">
                ${getIcon('volume')}
                <span>Hear Sound</span>
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Practice / Quiz Section -->
      <div class="lesson-quiz-section" id="lesson-quiz-container">
      </div>
    `;

    // Bind character sound clicks
    pane.querySelectorAll('.btn-char-play').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const ch = btn.dataset.playChar;
        const charCard = btn.closest('.lesson-char-card');
        if (charCard) this.ui.correctGlow(charCard);
        this.audioEngine.playMorse(ch, 14);
      });
    });

    pane.querySelectorAll('.lesson-char-card').forEach(card => {
      card.addEventListener('click', () => {
        const ch = card.dataset.char;
        this.ui.correctGlow(card);
        this.audioEngine.playMorse(ch, 14);
      });
    });

    const quizContainer = pane.querySelector('#lesson-quiz-container');
    this.renderLessonQuiz(quizContainer, lesson);
  }

  renderLessonQuiz(container, lesson) {
    if (!lesson.quiz || lesson.quiz.length === 0) return;

    const q = lesson.quiz[this.currentQuizIndex];
    const isLast = this.currentQuizIndex === lesson.quiz.length - 1;
    const isCompleted = this.gameState.isLessonCompleted(lesson.id);

    container.innerHTML = `
      <div class="quiz-box card">
        <div class="quiz-header">
          <div class="quiz-badge">Quick Knowledge Check • Question ${this.currentQuizIndex + 1} of ${lesson.quiz.length}</div>
          ${isCompleted ? `<span class="quiz-completed-pill">${getIcon('check')} Lesson Completed (+40 XP)</span>` : ''}
        </div>
        <div class="quiz-question">${q.question}</div>
        <div class="quiz-options-grid">
          ${q.options.map(opt => `
            <button class="quiz-opt-btn" data-opt="${opt}">
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>
        <div class="quiz-feedback-box" id="quiz-feedback" hidden></div>
      </div>
    `;

    const feedback = container.querySelector('#quiz-feedback');
    const optButtons = container.querySelectorAll('.quiz-opt-btn');

    optButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = btn.dataset.opt;
        const isCorrect = selected === q.answer;

        optButtons.forEach(b => {
          b.disabled = true;
          if (b.dataset.opt === q.answer) {
            b.classList.add('correct');
          } else if (b === btn && !isCorrect) {
            b.classList.add('wrong');
          }
        });

        if (isCorrect) {
          this.audioEngine.playDing();
          const rect = btn.getBoundingClientRect();
          this.ui.particleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, '#34d399');
          feedback.hidden = false;
          feedback.className = 'quiz-feedback-box feedback-correct';
          feedback.innerHTML = `
            <div class="fb-text">${getIcon('check-circle')} <span><strong>Correct!</strong> ${q.explanation}</span></div>
            ${isLast ? `
              <button class="btn btn-primary btn-sm" id="btn-finish-lesson">
                <span>Complete Lesson &amp; Claim XP</span>
                ${getIcon('trophy')}
              </button>
            ` : `
              <button class="btn btn-primary btn-sm" id="btn-next-quiz">
                <span>Next Question</span>
                ${getIcon('arrow-right')}
              </button>
            `}
          `;

          const nextBtn = feedback.querySelector('#btn-next-quiz');
          if (nextBtn) {
            nextBtn.addEventListener('click', () => {
              this.currentQuizIndex++;
              this.renderLessonQuiz(container, lesson);
            });
          }

          const finishBtn = feedback.querySelector('#btn-finish-lesson');
          if (finishBtn) {
            finishBtn.addEventListener('click', () => {
              const isNew = this.gameState.completeLesson(lesson.id);
              if (isNew) {
                this.audioEngine.playLevelUp();
                this.ui.showToast(`Lesson ${lesson.number} Completed! +40 XP`, 'success', 3500);
              } else {
                this.ui.showToast(`Lesson ${lesson.number} Reviewed!`, 'info', 2500);
              }
              this.ui.renderStats();
              this.ui.renderBadges();

              // Auto advance to next lesson if available
              const nextIndex = LESSONS_DATA.findIndex(l => l.id === lesson.id) + 1;
              if (nextIndex < LESSONS_DATA.length) {
                this.currentLessonId = LESSONS_DATA[nextIndex].id;
                this.currentQuizIndex = 0;
              }
              this.render();
            });
          }
        } else {
          this.audioEngine.playBuzz();
          this.ui.wrongShake(btn);
          feedback.hidden = false;
          feedback.className = 'quiz-feedback-box feedback-wrong';
          feedback.innerHTML = `
            <div class="fb-text">${getIcon('x-circle')} <span><strong>Not quite!</strong> ${q.explanation}</span></div>
            <button class="btn btn-ghost btn-sm" id="btn-retry-quiz">
              ${getIcon('refresh')}
              <span>Try Again</span>
            </button>
          `;
          const retryBtn = feedback.querySelector('#btn-retry-quiz');
          if (retryBtn) {
            retryBtn.addEventListener('click', () => {
              this.renderLessonQuiz(container, lesson);
            });
          }
        }
      });
    });
  }

  /* ==========================================================================
     2. TELEGRAPH KEYER (CW STRAIGHT KEY SIMULATOR)
     ========================================================================== */

  renderKeyerTab(root) {
    const lettersPool = ['E', 'T', 'I', 'M', 'A', 'N', 'S', 'O', 'H', '5'];
    if (!this.keyerTargetLetter || !lettersPool.includes(this.keyerTargetLetter)) {
      this.keyerTargetLetter = lettersPool[Math.floor(Math.random() * lettersPool.length)];
    }

    root.innerHTML = `
      <div class="keyer-studio">
        <!-- Target & Stats Header -->
        <div class="keyer-top-bar card tilt">
          <div class="keyer-target-box">
            <div class="target-label">Practice Target:</div>
            <div class="target-character" id="keyer-target-char">${this.keyerTargetLetter}</div>
            <div class="target-morse" id="keyer-target-morse">${this.formatMorseVisual(MORSE_DATA[this.keyerTargetLetter] || '')}</div>
            <button class="btn btn-sm btn-ghost" id="keyer-next-target">
              ${getIcon('dice')}
              <span>New Target</span>
            </button>
          </div>

          <div class="keyer-beacon-indicator" id="keyer-beacon">
            <div class="beacon-bulb" id="beacon-bulb"></div>
            <div class="beacon-label">CW SIGNAL LAMP</div>
          </div>

          <div class="keyer-speed-box">
            <label for="keyer-wpm-slider">Keying Speed: <strong id="keyer-wpm-val">${this.keyerWpm} WPM</strong></label>
            <input type="range" id="keyer-wpm-slider" min="8" max="22" value="${this.keyerWpm}" step="1">
            <div class="wpm-timing-hint">Dit ≈ <span id="keyer-dit-ms">${Math.round(1200 / this.keyerWpm)}ms</span></div>
          </div>
        </div>

        <!-- Live Keyer Monitor -->
        <div class="keyer-screen-panel card tilt">
          <div class="keyer-screen-header">
            <span class="screen-title">
              ${getIcon('radio')}
              <span>Live Signal Oscilloscope &amp; Decoder</span>
            </span>
            <button class="btn btn-sm btn-ghost" id="keyer-clear-btn">
              ${getIcon('refresh')}
              <span>Clear Screen</span>
            </button>
          </div>

          <div class="keyer-live-strip" id="keyer-live-strip">
            <div class="live-strip-placeholder">Press the straight key or Spacebar to transmit Morse signals...</div>
          </div>

          <div class="keyer-decoded-row">
            <span class="decoded-label">Decoded Output:</span>
            <span class="decoded-text" id="keyer-decoded-text">_</span>
          </div>
        </div>

        <!-- The Physical CW Straight Key Instrument -->
        <div class="keyer-hardware-panel card tilt">
          <div class="keyer-controls-row">
            <button class="btn btn-morse-tap btn-dot-tap" id="keyer-tap-dot">
              <span class="tap-symbol">·</span>
              <span class="tap-text">Send Dit (.)</span>
            </button>
            <button class="btn btn-morse-tap btn-dash-tap" id="keyer-tap-dash">
              <span class="tap-symbol">—</span>
              <span class="tap-text">Send Dah (-)</span>
            </button>
          </div>

          <div class="straight-key-wrapper" id="straight-key-zone">
            <div class="straight-key-lever" id="straight-key-lever">
              <div class="key-knob">
                <span class="knob-ring"></span>
                <span class="knob-label">HOLD / TAP</span>
              </div>
              <div class="key-arm"></div>
              <div class="key-contact"></div>
            </div>
            <div class="straight-key-base">
              <span class="base-plate-text">BRASS CW TELEGRAPH STRAIGHT KEY</span>
            </div>
          </div>

          <div class="keyer-instruction-pill">
            <span class="pill-icon">${getIcon('info')}</span>
            <span><strong>Pro-Tip:</strong> Hold down the <strong>Spacebar</strong> on your keyboard, or click &amp; hold the lever above!</span>
          </div>
        </div>
      </div>
    `;

    this.setupKeyerEvents(root);
  }

  setupKeyerEvents(root) {
    const keyLever = root.querySelector('#straight-key-zone');
    const dotBtn = root.querySelector('#keyer-tap-dot');
    const dashBtn = root.querySelector('#keyer-tap-dash');
    const clearBtn = root.querySelector('#keyer-clear-btn');
    const nextTargetBtn = root.querySelector('#keyer-next-target');
    const wpmSlider = root.querySelector('#keyer-wpm-slider');
    const wpmVal = root.querySelector('#keyer-wpm-val');
    const ditMsVal = root.querySelector('#keyer-dit-ms');

    wpmSlider.addEventListener('input', () => {
      this.keyerWpm = parseInt(wpmSlider.value, 10);
      wpmVal.textContent = `${this.keyerWpm} WPM`;
      ditMsVal.textContent = `${Math.round(1200 / this.keyerWpm)}ms`;
    });

    nextTargetBtn.addEventListener('click', () => {
      const letters = ['E', 'T', 'I', 'M', 'A', 'N', 'S', 'O', 'H', '5', 'R', 'K', 'D', 'U', 'W', 'G'];
      const candidates = letters.filter(l => l !== this.keyerTargetLetter);
      this.keyerTargetLetter = candidates[Math.floor(Math.random() * candidates.length)];
      root.querySelector('#keyer-target-char').textContent = this.keyerTargetLetter;
      root.querySelector('#keyer-target-morse').innerHTML = this.formatMorseVisual(MORSE_DATA[this.keyerTargetLetter] || '');
    });

    clearBtn.addEventListener('click', () => {
      this.keyerSymbols = [];
      this.keyerDecodedChars = '';
      root.querySelector('#keyer-live-strip').innerHTML = '<div class="live-strip-placeholder">Transmitting ready...</div>';
      root.querySelector('#keyer-decoded-text').textContent = '_';
    });

    dotBtn.addEventListener('click', () => {
      this.injectKeyerSymbol('.');
      this.audioEngine.playDit();
    });
    dashBtn.addEventListener('click', () => {
      this.injectKeyerSymbol('-');
      this.audioEngine.playDah();
    });

    const onKeyDown = (e) => {
      if (e) e.preventDefault();
      if (this.isKeyDown) return;
      this.isKeyDown = true;
      this.keyDownTime = performance.now();
      this.audioEngine.startTone(700, 0.22);
      this.setBeaconActive(true);
      const lever = root.querySelector('#straight-key-lever');
      if (lever) lever.classList.add('pressed');
      if (this.keyerGapTimer) {
        clearTimeout(this.keyerGapTimer);
        this.keyerGapTimer = null;
      }
    };

    const onKeyUp = (e) => {
      if (e) e.preventDefault();
      if (!this.isKeyDown) return;
      this.isKeyDown = false;
      const duration = performance.now() - this.keyDownTime;
      this.audioEngine.stopTone();
      this.setBeaconActive(false);
      const lever = root.querySelector('#straight-key-lever');
      if (lever) lever.classList.remove('pressed');

      const unit = 1200 / this.keyerWpm;
      const threshold = unit * 2;
      const symbol = duration < threshold ? '.' : '-';
      this.injectKeyerSymbol(symbol);
    };

    keyLever.addEventListener('pointerdown', onKeyDown);
    window.addEventListener('pointerup', onKeyUp);
    this.keyerCleanups.push(() => {
      keyLever.removeEventListener('pointerdown', onKeyDown);
      window.removeEventListener('pointerup', onKeyUp);
    });

    const onKeydownDoc = (e) => {
      if (e.code === 'Space' && !e.repeat && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        onKeyDown();
      }
    };
    const onKeyupDoc = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        onKeyUp();
      }
    };
    document.addEventListener('keydown', onKeydownDoc);
    document.addEventListener('keyup', onKeyupDoc);
    this.keyerCleanups.push(() => {
      document.removeEventListener('keydown', onKeydownDoc);
      document.removeEventListener('keyup', onKeyupDoc);
    });
  }

  setBeaconActive(active) {
    const beacon = document.getElementById('beacon-bulb');
    if (beacon) {
      beacon.classList.toggle('active', active);
    }
  }

  injectKeyerSymbol(sym) {
    this.keyerSymbols.push(sym);
    this.renderKeyerLive();

    const unit = 1200 / this.keyerWpm;
    if (this.keyerGapTimer) clearTimeout(this.keyerGapTimer);

    this.keyerGapTimer = setTimeout(() => {
      this.decodeCurrentKeyerCharacter();
    }, unit * 3.2);
  }

  renderKeyerLive() {
    const strip = document.getElementById('keyer-live-strip');
    if (!strip) return;

    if (this.keyerSymbols.length === 0) {
      strip.innerHTML = '<div class="live-strip-placeholder">Transmitting ready...</div>';
      return;
    }

    strip.innerHTML = `
      <div class="current-morse-tokens">
        ${this.keyerSymbols.map(s => `
          <span class="live-token ${s === '.' ? 'token-dot' : 'token-dash'}">
            ${s === '.' ? '·' : '—'}
          </span>
        `).join('')}
      </div>
    `;
  }

  decodeCurrentKeyerCharacter() {
    if (this.keyerSymbols.length === 0) return;
    const code = this.keyerSymbols.join('');
    this.keyerSymbols = [];
    this.renderKeyerLive();

    const decoded = REVERSE_MORSE[code] || '?';
    this.keyerDecodedChars += decoded;

    const decodedEl = document.getElementById('keyer-decoded-text');
    if (decodedEl) {
      decodedEl.textContent = this.keyerDecodedChars;
    }

    // Check against target
    if (decoded === this.keyerTargetLetter) {
      this.audioEngine.playDing();
      const targetCharEl = document.getElementById('keyer-target-char');
      if (targetCharEl) {
        this.ui.correctGlow(targetCharEl);
        const rect = targetCharEl.getBoundingClientRect();
        this.ui.particleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, '#34d399');
      }
      this.ui.showToast(`Target matched! You keyed '${decoded}' (+10 XP)`, 'success', 2500);
      this.gameState.recordKeyerLetter(decoded);
      this.ui.renderStats();
      this.ui.renderBadges();

      setTimeout(() => {
        const nextBtn = document.getElementById('keyer-next-target');
        if (nextBtn) nextBtn.click();
      }, 1200);
    }
  }

  cleanupKeyer() {
    if (this.keyerGapTimer) {
      clearTimeout(this.keyerGapTimer);
      this.keyerGapTimer = null;
    }
    for (const fn of this.keyerCleanups) {
      try { fn(); } catch (e) {}
    }
    this.keyerCleanups = [];
    this.audioEngine.stopTone();
    this.isKeyDown = false;
  }

  /* ==========================================================================
     3. FLASHCARDS STUDIO
     ========================================================================== */

  renderFlashcardsTab(root) {
    const filtered = this.flashcardCategory === 'all'
      ? FLASHCARD_ITEMS
      : FLASHCARD_ITEMS.filter(f => f.category === this.flashcardCategory);

    if (this.currentFlashcardIdx >= filtered.length) {
      this.currentFlashcardIdx = 0;
    }

    const currentCard = filtered[this.currentFlashcardIdx] || FLASHCARD_ITEMS[0];
    const isMastered = (this.gameState.stats.flashcardsMastered || []).includes(currentCard.char.toUpperCase());
    const totalMastered = (this.gameState.stats.flashcardsMastered || []).length;
    const masteryPercent = Math.round((totalMastered / FLASHCARD_ITEMS.length) * 100);

    root.innerHTML = `
      <div class="flashcards-studio">
        <!-- Filter and Mastery Bar -->
        <div class="flashcards-top-bar card tilt">
          <div class="fc-filters">
            <button class="fc-filter-btn ${this.flashcardCategory === 'all' ? 'active' : ''}" data-cat="all">All (${FLASHCARD_ITEMS.length})</button>
            <button class="fc-filter-btn ${this.flashcardCategory === 'letters' ? 'active' : ''}" data-cat="letters">Letters (A-Z)</button>
            <button class="fc-filter-btn ${this.flashcardCategory === 'numbers' ? 'active' : ''}" data-cat="numbers">Numbers (0-9)</button>
            <button class="fc-filter-btn ${this.flashcardCategory === 'signals' ? 'active' : ''}" data-cat="signals">Signals</button>
          </div>

          <div class="fc-mastery-meter">
            <span class="fc-mastery-label">Mastered: <strong>${totalMastered} / ${FLASHCARD_ITEMS.length}</strong></span>
            <div class="xp-bar" role="progressbar" aria-valuenow="${masteryPercent}">
              <div class="xp-bar-fill" style="width: ${masteryPercent}%;"></div>
            </div>
          </div>
        </div>

        <!-- 3D Flip Flashcard -->
        <div class="flashcard-scene" id="flashcard-scene">
          <div class="flashcard-3d ${this.flashcardIsFlipped ? 'is-flipped' : ''}" id="flashcard-3d">
            <!-- Front Side -->
            <div class="flashcard-face flashcard-front card">
              <div class="fc-corner-badge">Card ${this.currentFlashcardIdx + 1} of ${filtered.length}</div>
              <div class="fc-character">${currentCard.char}</div>
              <div class="fc-sound-hint">${currentCard.sound}</div>
              <div class="fc-audio-action">
                <button class="btn btn-sm btn-primary" id="fc-play-audio">
                  ${getIcon('volume')}
                  <span>Play Sound</span>
                </button>
              </div>
              <div class="fc-click-hint">
                ${getIcon('repeat')}
                <span>Click card or press Space to flip</span>
              </div>
            </div>

            <!-- Back Side -->
            <div class="flashcard-face flashcard-back card">
              <div class="fc-corner-badge">
                ${isMastered ? `${getIcon('star')} Mastered` : 'Learning'}
              </div>
              <div class="fc-back-code">${this.formatMorseVisual(currentCard.code)}</div>
              <div class="fc-back-details">
                <div class="fc-back-item"><span class="lbl">Letter:</span> <strong>${currentCard.char}</strong></div>
                <div class="fc-back-item"><span class="lbl">Rhythm:</span> <em>${currentCard.sound}</em></div>
                <div class="fc-back-item"><span class="lbl">Mnemonic:</span> <span>${currentCard.mnemonic}</span></div>
              </div>
              <div class="fc-audio-action">
                <button class="btn btn-sm btn-ghost" id="fc-play-back-audio">
                  ${getIcon('volume')}
                  <span>Replay Rhythm</span>
                </button>
              </div>
              <div class="fc-click-hint">
                ${getIcon('repeat')}
                <span>Click to flip back</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Controls: Prev, Next, Mastered -->
        <div class="flashcard-actions-bar">
          <button class="btn btn-ghost" id="fc-prev-btn">
            ${getIcon('arrow-left')}
            <span>Previous</span>
          </button>

          <button class="btn btn-secondary ${isMastered ? 'mastered-active' : ''}" id="fc-master-btn">
            ${isMastered ? getIcon('check') : getIcon('star')}
            <span>${isMastered ? 'Mastered' : 'Mark as Mastered (+5 XP)'}</span>
          </button>

          <button class="btn btn-primary" id="fc-next-btn">
            <span>Next Card</span>
            ${getIcon('arrow-right')}
          </button>
        </div>
      </div>
    `;

    this.setupFlashcardEvents(root, filtered, currentCard);
  }

  setupFlashcardEvents(root, filtered, currentCard) {
    const scene = root.querySelector('#flashcard-scene');
    const cardEl = root.querySelector('#flashcard-3d');
    const prevBtn = root.querySelector('#fc-prev-btn');
    const nextBtn = root.querySelector('#fc-next-btn');
    const masterBtn = root.querySelector('#fc-master-btn');
    const playAudioBtn = root.querySelector('#fc-play-audio');
    const playBackAudioBtn = root.querySelector('#fc-play-back-audio');

    const flip = () => {
      this.flashcardIsFlipped = !this.flashcardIsFlipped;
      cardEl.classList.toggle('is-flipped', this.flashcardIsFlipped);
    };

    scene.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      flip();
    });

    if (playAudioBtn) {
      playAudioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.audioEngine.playMorse(currentCard.char, 14);
      });
    }
    if (playBackAudioBtn) {
      playBackAudioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.audioEngine.playMorse(currentCard.char, 14);
      });
    }

    prevBtn.addEventListener('click', () => {
      this.flashcardIsFlipped = false;
      this.currentFlashcardIdx = (this.currentFlashcardIdx - 1 + filtered.length) % filtered.length;
      this.renderFlashcardsTab(root);
    });

    nextBtn.addEventListener('click', () => {
      this.flashcardIsFlipped = false;
      this.currentFlashcardIdx = (this.currentFlashcardIdx + 1) % filtered.length;
      this.renderFlashcardsTab(root);
    });

    masterBtn.addEventListener('click', () => {
      const isNew = this.gameState.recordFlashcardMastered(currentCard.char);
      if (isNew) {
        this.audioEngine.playBadge();
        const rect = masterBtn.getBoundingClientRect();
        this.ui.particleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, '#fbbf24');
        this.ui.showToast(`Card '${currentCard.char}' marked as Mastered! +5 XP`, 'success', 2500);
      }
      this.ui.renderStats();
      this.ui.renderBadges();
      this.renderFlashcardsTab(root);
    });

    root.querySelectorAll('.fc-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.flashcardCategory = btn.dataset.cat;
        this.currentFlashcardIdx = 0;
        this.flashcardIsFlipped = false;
        this.renderFlashcardsTab(root);
      });
    });
  }

  /* ==========================================================================
     4. VISUAL SIGNAL TRANSLATOR
     ========================================================================== */

  renderTranslatorTab(root) {
    root.innerHTML = `
      <div class="translator-studio card tilt">
        <div class="trans-top-row">
          <div class="trans-title-wrap">
            <h3 class="trans-heading">Two-Way Morse Code &amp; Visual Signal Lamp</h3>
            <p class="trans-sub">Type any text or your name to instantly hear and see its Morse code light transmission.</p>
          </div>

          <div class="trans-beacon-box">
            <div class="trans-bulb" id="trans-signal-bulb"></div>
            <span class="beacon-caption">SIGNAL BEACON</span>
          </div>
        </div>

        <div class="trans-io-grid">
          <!-- Text Input -->
          <div class="trans-pane">
            <div class="trans-pane-header">
              <label for="trans-text-input">Plain Text Input</label>
              <button class="btn btn-sm btn-ghost" id="trans-clear-text">
                ${getIcon('refresh')}
                <span>Clear</span>
              </button>
            </div>
            <textarea id="trans-text-input" class="text-input text-area trans-textarea" rows="4" placeholder="Type here (e.g. SOS, HELLO MORSE)...">HELLO MORSE</textarea>
          </div>

          <!-- Morse Output -->
          <div class="trans-pane">
            <div class="trans-pane-header">
              <label for="trans-morse-input">Morse Code Output / Input</label>
              <button class="btn btn-sm btn-ghost" id="trans-copy-morse">
                ${getIcon('copy')}
                <span>Copy Code</span>
              </button>
            </div>
            <textarea id="trans-morse-input" class="text-input text-area trans-textarea trans-morse-font" rows="4" placeholder=".... . .-.. .-.. --- / -- --- .-. ... ."></textarea>
          </div>
        </div>

        <!-- Quick Phrases -->
        <div class="trans-quick-phrases">
          <span class="quick-title">Quick Phrases:</span>
          <button class="phrase-chip" data-phrase="SOS">SOS (Distress)</button>
          <button class="phrase-chip" data-phrase="HELLO WORLD">HELLO WORLD</button>
          <button class="phrase-chip" data-phrase="CQ CQ CQ">CQ (General Call)</button>
          <button class="phrase-chip" data-phrase="73">73 (Best Regards)</button>
          <button class="phrase-chip" data-phrase="MORSE CODE ACADEMY">MORSE CODE ACADEMY</button>
        </div>

        <!-- Controls: Speed Slider & Play/Stop -->
        <div class="trans-controls-bottom">
          <div class="trans-speed-control">
            <label for="trans-speed-slider">Playback Speed: <strong id="trans-speed-val">${this.translatorSpeed} WPM</strong></label>
            <input type="range" id="trans-speed-slider" min="6" max="24" value="${this.translatorSpeed}" step="1">
          </div>

          <div class="trans-play-actions">
            <button class="btn btn-primary btn-lg" id="trans-play-btn">
              <span id="trans-play-icon">${getIcon('play')}</span>
              <span id="trans-play-label">Play Sound &amp; Signal Light</span>
            </button>
            <button class="btn btn-ghost btn-lg" id="trans-stop-btn">
              ${getIcon('stop')}
              <span>Stop</span>
            </button>
          </div>
        </div>
      </div>
    `;

    this.setupTranslatorEvents(root);
  }

  setupTranslatorEvents(root) {
    const textInput = root.querySelector('#trans-text-input');
    const morseInput = root.querySelector('#trans-morse-input');
    const clearBtn = root.querySelector('#trans-clear-text');
    const copyBtn = root.querySelector('#trans-copy-morse');
    const speedSlider = root.querySelector('#trans-speed-slider');
    const speedVal = root.querySelector('#trans-speed-val');
    const playBtn = root.querySelector('#trans-play-btn');
    const stopBtn = root.querySelector('#trans-stop-btn');
    const bulb = root.querySelector('#trans-signal-bulb');

    const updateMorseFromText = () => {
      const text = textInput.value;
      const morse = text.toUpperCase().split(' ').map(w => {
        return w.split('').map(c => MORSE_DATA[c] || '').filter(Boolean).join(' ');
      }).join(' / ');
      morseInput.value = morse;
    };

    const updateTextFromMorse = () => {
      const morse = morseInput.value.trim();
      if (!morse) { textInput.value = ''; return; }
      const words = morse.split('/');
      const decoded = words.map(w => {
        return w.trim().split(/\s+/).map(code => REVERSE_MORSE[code] || '').join('');
      }).join(' ');
      textInput.value = decoded;
    };

    textInput.addEventListener('input', updateMorseFromText);
    morseInput.addEventListener('input', updateTextFromMorse);

    updateMorseFromText();

    clearBtn.addEventListener('click', () => {
      textInput.value = '';
      morseInput.value = '';
      this.audioEngine.stop();
      if (bulb) bulb.classList.remove('active');
    });

    copyBtn.addEventListener('click', () => {
      const text = morseInput.value;
      if (!text) return;
      navigator.clipboard.writeText(text);
      this.ui.showToast('Morse code copied to clipboard!', 'info', 2000);
    });

    speedSlider.addEventListener('input', () => {
      this.translatorSpeed = parseInt(speedSlider.value, 10);
      speedVal.textContent = `${this.translatorSpeed} WPM`;
    });

    root.querySelectorAll('.phrase-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        textInput.value = chip.dataset.phrase;
        updateMorseFromText();
      });
    });

    playBtn.addEventListener('click', async () => {
      const text = textInput.value.trim();
      if (!text) {
        this.ui.showToast('Please type some text to translate first.', 'info');
        return;
      }

      this.isTranslatorPlaying = true;
      root.querySelector('#trans-play-label').textContent = 'Transmitting...';
      root.querySelector('#trans-play-icon').innerHTML = getIcon('volume');

      this.gameState.recordTranslationPlayed();
      this.ui.renderBadges();

      await this.audioEngine.playMorse(text, this.translatorSpeed, ({ symbol, duration, state }) => {
        if (state === 'on' && bulb) {
          bulb.classList.add('active');
        } else if (state === 'off' && bulb) {
          bulb.classList.remove('active');
        } else if (state === 'complete') {
          if (bulb) bulb.classList.remove('active');
          this.isTranslatorPlaying = false;
          root.querySelector('#trans-play-label').textContent = 'Play Sound & Signal Light';
          root.querySelector('#trans-play-icon').innerHTML = getIcon('play');
        }
      });
    });

    stopBtn.addEventListener('click', () => {
      this.audioEngine.stop();
      if (bulb) bulb.classList.remove('active');
      this.isTranslatorPlaying = false;
      root.querySelector('#trans-play-label').textContent = 'Play Sound & Signal Light';
      root.querySelector('#trans-play-icon').innerHTML = getIcon('play');
    });
  }

  formatMorseVisual(code) {
    if (!code) return '';
    return code.split('').map(s => {
      if (s === '.') return `<span class="morse-dot-glyph">·</span>`;
      if (s === '-') return `<span class="morse-dash-glyph">—</span>`;
      if (s === ' ') return `<span class="morse-space-glyph">&nbsp;</span>`;
      if (s === '/') return `<span class="morse-slash-glyph">/</span>`;
      return s;
    }).join('');
  }
}
