import { MORSE_DATA } from './morseData.js';
import { getIcon } from './icons.js';

export class UI {
  constructor(gameStateRef, audioEngineRef) {
    this.gameStateRef = gameStateRef;
    this.audioEngineRef = audioEngineRef;

    this.viewHome = this.ensureEl('view-home');
    this.viewLearn = this.ensureEl('view-learn');
    this.viewPractice = this.ensureEl('view-practice');
    this.viewReference = this.ensureEl('view-reference');
    this.practiceRoot = this.ensureEl('practice-root');
    this.learnRoot = this.ensureEl('learn-root');
    this.referenceGrid = this.ensureEl('reference-grid');
    this.badgesGrid = this.ensureEl('badges-grid');
    this.statsPanel = this.ensureEl('stats-panel');
    this.toastContainer = this.ensureEl('toast-container');
    this.particles = this.ensureEl('particles');
    this.levelUpRing = this.ensureEl('level-up-ring');
    this.levelCards = document.querySelectorAll('.level-card');
    this.navLinks = document.querySelectorAll('.nav-link');

    this.currentViewId = 'home';
    this.views = {
      home: this.viewHome,
      learn: this.viewLearn,
      practice: this.viewPractice,
      reference: this.viewReference
    };

    this.renderStats();
    this.renderBadges();
    this.renderReference();

    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
      navToggle.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
          navLinks.classList.toggle('open');
        }
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!expanded));
      });
    }
  }

  ensureEl(id) {
    return document.getElementById(id);
  }

  get gameState() {
    return this.gameStateRef.current || this.gameStateRef;
  }

  get audioEngine() {
    return this.audioEngineRef.current || this.audioEngineRef;
  }

  showView(viewId) {
    const target = this.views[viewId];
    if (!target) return;

    const current = this.views[this.currentViewId];
    const allViews = Object.values(this.views);

    const animateOut = (el) => new Promise((resolve) => {
      if (!el || el.hidden || el.style.display === 'none') {
        resolve();
        return;
      }
      el.style.transition = 'opacity 200ms ease, transform 200ms ease';
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      setTimeout(resolve, 200);
    });

    animateOut(current).then(() => {
      for (const v of allViews) {
        if (v) {
          v.style.display = 'none';
          v.hidden = true;
          v.style.opacity = '';
          v.style.transform = '';
          v.style.transition = '';
        }
      }

      this.currentViewId = viewId;
      target.hidden = false;
      target.style.display = 'block';
      target.style.opacity = '0';
      target.style.transform = 'translateY(10px)';

      requestAnimationFrame(() => {
        target.style.transition = 'opacity 350ms cubic-bezier(0.34, 1.56, 0.64, 1), transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1)';
        requestAnimationFrame(() => {
          target.style.opacity = '1';
          target.style.transform = 'translateY(0)';
          setTimeout(() => {
            target.style.transition = '';
            target.style.opacity = '';
            target.style.transform = '';
          }, 360);
        });
      });

      for (const link of this.navLinks) {
        const linkView = link.dataset.view;
        const targetViewId = 'view-' + viewId;
        if (linkView === targetViewId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }

  renderStats() {
    const gs = this.gameState;
    const progress = gs.getProgressToNextLevel();
    const accuracy = gs.getAccuracyPercent();
    const streak = gs.streak;
    const level = gs.level;
    const xp = gs.xp;

    const xpBarFill = document.getElementById('xp-bar-fill');
    if (xpBarFill) {
      xpBarFill.style.width = progress.percent + '%';
    }

    const xpBar = document.querySelector('.xp-bar');
    if (xpBar) {
      xpBar.setAttribute('aria-valuenow', progress.percent);
    }

    const levelNum = document.getElementById('stats-level-num');
    if (levelNum) {
      levelNum.textContent = String(level);
    }

    const levelNames = ['', 'Beginner', 'Novice', 'Intermediate', 'Advanced', 'Skilled', 'Expert', 'Veteran', 'Elite', 'Master', 'Legend'];
    const levelName = document.getElementById('stats-level-name');
    if (levelName) {
      levelName.textContent = levelNames[level] || 'Level ' + level;
    }

    const xpCurrent = document.getElementById('stats-xp-current');
    if (xpCurrent) {
      xpCurrent.textContent = String(progress.current);
    }

    const xpNext = document.getElementById('stats-xp-next');
    if (xpNext) {
      xpNext.textContent = String(progress.next);
    }

    const streakEl = document.getElementById('stats-streak');
    if (streakEl) {
      streakEl.textContent = String(streak);
    }

    const totalXp = document.getElementById('stats-total-xp');
    if (totalXp) {
      totalXp.textContent = String(xp);
    }
  }

  renderBadges() {
    if (!this.badgesGrid) return;
    const gs = this.gameState;
    this.badgesGrid.innerHTML = '';

    for (const badge of gs.constructor.BADGES) {
      const unlocked = gs.hasBadge(badge.id);
      const card = document.createElement('div');
      card.className = 'badge-card card tilt ' + (unlocked ? 'unlocked' : 'locked');
      card.setAttribute('data-badge', badge.id.toLowerCase());
      card.setAttribute('role', 'article');
      card.setAttribute('aria-label', badge.title + ' badge: ' + (unlocked ? 'unlocked' : 'locked'));
      card.setAttribute('tabindex', '0');
      card.title = badge.description;

      const icon = document.createElement('div');
      icon.className = 'badge-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.innerHTML = getIcon(badge.icon || 'sparkles');

      const name = document.createElement('div');
      name.className = 'badge-name';
      name.textContent = badge.title;

      const desc = document.createElement('div');
      desc.className = 'badge-desc';
      desc.textContent = badge.description;

      card.appendChild(icon);
      card.appendChild(name);
      card.appendChild(desc);
      this.badgesGrid.appendChild(card);
    }

    this.enableTilt3D();
  }

  renderReference() {
    if (!this.referenceGrid) return;
    this.referenceGrid.innerHTML = '';

    const entries = Object.entries(MORSE_DATA);

    const isLetter = (ch) => /^[A-Z]$/.test(ch);
    const isDigit = (ch) => /^[0-9]$/.test(ch);

    const sortKey = ([ch]) => {
      if (isLetter(ch)) return '0_' + ch;
      if (isDigit(ch)) return '1_' + ch;
      return '2_' + ch;
    };

    entries.sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

    let lastCategory = '';
    for (const [char, code] of entries) {
      let category = '';
      if (isLetter(char)) category = 'Letters';
      else if (isDigit(char)) category = 'Numbers';
      else category = 'Punctuation';

      if (category !== lastCategory) {
        const cat = document.createElement('div');
        cat.className = 'ref-category';
        cat.textContent = category;
        this.referenceGrid.appendChild(cat);
        lastCategory = category;
      }

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'card ref-card';
      btn.setAttribute('data-char', char);
      btn.setAttribute('aria-label', 'Play morse code for ' + char);

      const spanChar = document.createElement('span');
      spanChar.className = 'ref-char';
      spanChar.textContent = char;

      const spanCode = document.createElement('span');
      spanCode.className = 'ref-code';
      spanCode.textContent = code;

      btn.appendChild(spanChar);
      btn.appendChild(spanCode);

      btn.addEventListener('click', async () => {
        const ae = this.audioEngine;
        if (ae && typeof ae.ensureContext === 'function') {
          await ae.ensureContext();
        }
        if (ae && typeof ae.playMorse === 'function') {
          ae.playMorse(char, 18);
        }
        this.correctGlow(btn);
      });

      this.referenceGrid.appendChild(btn);
    }

    const searchInput = document.getElementById('ref-search');
    if (searchInput && !searchInput._filterAttached) {
      searchInput._filterAttached = true;
      searchInput.addEventListener('input', (e) => {
        const q = (e.target.value || '').trim().toUpperCase();
        const entries = this.referenceGrid.querySelectorAll('.ref-card');
        let lastHiddenCat = null;
        for (const entry of entries) {
          const ch = (entry.dataset.char || '').toUpperCase();
          entry.style.display = (!q || ch.includes(q) || (MORSE_DATA[ch] && MORSE_DATA[ch].includes(q))) ? '' : 'none';
        }
        const cats = this.referenceGrid.querySelectorAll('.ref-category');
        for (const cat of cats) {
          let next = cat.nextElementSibling;
          let anyShow = false;
          while (next && !next.classList.contains('ref-category')) {
            if (next.style.display !== 'none') {
              anyShow = true;
              break;
            }
            next = next.nextElementSibling;
          }
          cat.style.display = anyShow ? '' : 'none';
        }
      });
    }
  }

  enableTilt3D() {
    const elements = document.querySelectorAll('.tilt');
    for (const el of elements) {
      if (el._tiltAttached) continue;
      el._tiltAttached = true;

      el.addEventListener('pointerenter', (e) => {
        el.style.willChange = 'transform';
      });

      el.addEventListener('pointermove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const nx = (x / rect.width) * 2 - 1;
        const ny = (y / rect.height) * 2 - 1;
        const rotateX = ny * -8;
        const rotateY = nx * 8;
        el.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateZ(20px) scale(var(--tilt-scale, 1.02))';
      });

      el.addEventListener('pointerleave', () => {
        el.style.transition = 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)';
        el.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
        el.style.willChange = '';
        setTimeout(() => {
          el.style.transition = '';
          el.style.transform = '';
        }, 410);
      });
    }
  }

  showToast(message, type = 'info', duration = 3000) {
    if (!this.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.setAttribute('role', 'status');

    const iconMap = {
      success: 'check-circle',
      error: 'x-circle',
      info: 'info',
      warning: 'alert'
    };

    const icon = document.createElement('div');
    icon.className = 'toast-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = getIcon(iconMap[type] || 'info');

    const content = document.createElement('div');
    content.className = 'toast-content';
    content.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(content);

    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'opacity 300ms cubic-bezier(0.34, 1.56, 0.64, 1), transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)';

    this.toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
        setTimeout(() => {
          toast.style.transition = '';
        }, 310);
      });
    });

    setTimeout(() => {
      toast.style.transition = 'opacity 300ms ease';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  correctGlow(element) {
    if (!element) return;
    element.classList.add('correct-glow');
    setTimeout(() => {
      element.classList.remove('correct-glow');
    }, 700);
  }

  wrongShake(element) {
    if (!element) return;
    element.classList.add('shake');
    setTimeout(() => {
      element.classList.remove('shake');
    }, 600);
  }

  particleBurst(originX, originY, color = '#34d399', count = 16) {
    if (!this.particles) return;

    let x;
    let y;

    if (typeof originX === 'number' && typeof originY === 'number') {
      x = originX;
      y = originY;
      const elAtPoint = document.elementFromPoint(x, y);
      if (!elAtPoint) {
        x = window.innerWidth / 2;
        y = window.innerHeight / 2;
      }
    } else {
      x = window.innerWidth / 2;
      y = window.innerHeight / 2;
    }

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';

      const size = 3 + Math.random() * 3;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.background = color;
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.boxShadow = '0 0 ' + (size * 2) + 'px ' + color;

      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 80;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      const duration = 600 + Math.random() * 300;

      this.particles.appendChild(p);

      const anim = p.animate([
        { transform: 'translate(-50%, -50%) translate(0, 0) scale(1)', opacity: 1 },
        { transform: 'translate(-50%, -50%) translate(' + dx + 'px, ' + dy + 'px) scale(0)', opacity: 0 }
      ], {
        duration: duration,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'forwards'
      });

      anim.onfinish = () => {
        if (p.parentNode) {
          p.parentNode.removeChild(p);
        }
      };
    }
  }

  fireLevelUpRing() {
    if (!this.levelUpRing) return;
    this.levelUpRing.classList.add('animate');
    setTimeout(() => {
      this.levelUpRing.classList.remove('animate');
    }, 1000);
  }

  setupKeyboardShortcuts(handlers) {
    const { onEnter, onKeyR, onEscape } = handlers || {};
    document.addEventListener('keydown', (e) => {
      const target = e.target;
      if (target) {
        const tag = (target.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea' || target.isContentEditable) {
          return;
        }
      }

      if (e.code === 'Enter' && typeof onEnter === 'function') {
        e.preventDefault();
        onEnter();
      } else if (e.code === 'KeyR' && typeof onKeyR === 'function') {
        e.preventDefault();
        onKeyR();
      } else if (e.code === 'Escape' && typeof onEscape === 'function') {
        e.preventDefault();
        onEscape();
      }
    });
  }
}

