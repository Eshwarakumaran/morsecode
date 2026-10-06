import { MORSE_DATA } from './morseData.js';
import { AudioEngine } from './audioEngine.js';
import { GameState } from './gameState.js';
import { GameModes } from './levels.js';
import { LearnModule } from './learn.js';
import { UI } from './ui.js';

let audioEngine;
let gameState;
let ui;
let gameModes;
let learnModule;
let currentMode = null;
let audioReady = false;

function ensureAudioFirstGesture() {
  if (audioReady) return;
  audioReady = true;
  audioEngine.ensureContext();
}

function init() {
  audioEngine = new AudioEngine();
  gameState = new GameState();

  const gameStateRef = { current: gameState };
  const audioEngineRef = { current: audioEngine };

  ui = new UI(gameStateRef, audioEngineRef);
  gameModes = new GameModes(document.getElementById('practice-root'), audioEngine, gameState, ui);
  learnModule = new LearnModule(document.getElementById('learn-root'), audioEngine, gameState, ui);

  gameState.onLevelUp = (newLevel) => {
    ui.fireLevelUpRing();
    ui.showToast(`Level Up! You are now Level ${newLevel} 🎉`, 'success', 4200);
    audioEngine.playLevelUp();
    ui.renderStats();
    ui.renderBadges();
    setTimeout(() => ui.enableTilt3D(), 50);
  };

  gameState.onBadgeUnlock = (badge) => {
    ui.showToast(`Badge Unlocked: ${badge.icon} ${badge.title}`, 'success', 4000);
    audioEngine.playBadge();
    ui.renderBadges();
    setTimeout(() => ui.enableTilt3D(), 50);
  };

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      ensureAudioFirstGesture();
      let view = link.getAttribute('data-view') || '';
      view = view.replace(/^view-/, '');
      if (view) ui.showView(view);
    });
  });

  document.querySelectorAll('[data-view-target]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      ensureAudioFirstGesture();
      let target = btn.getAttribute('data-view-target') || '';
      target = target.replace(/^view-/, '');
      if (target) ui.showView(target);
    });
  });

  document.querySelectorAll('.level-card').forEach((card) => {
    card.addEventListener('click', () => {
      ensureAudioFirstGesture();
      audioEngine.stop();
      const levelId = card.getAttribute('data-level');
      const map = { '1': 'beginner', '2': 'intermediate', '3': 'advanced', '4': 'master' };
      const modeId = map[levelId];
      if (!modeId) return;
      currentMode = modeId;
      ui.showView('practice');
      setTimeout(() => {
        gameModes.startMode(modeId);
      }, 350);
    });
  });

  window.addEventListener('game:exit-mode', () => {
    ensureAudioFirstGesture();
    audioEngine.stop();
    currentMode = null;
    ui.showView('home');
    setTimeout(() => {
      ui.renderStats();
      ui.renderBadges();
      ui.enableTilt3D();
    }, 400);
  });

  document.addEventListener('click', ensureAudioFirstGesture, { once: true });
  document.addEventListener('keydown', ensureAudioFirstGesture, { once: true });

  ui.showView('home');
  ui.renderStats();
  ui.renderBadges();
  ui.renderReference();
  ui.enableTilt3D();

  ui.showToast('Welcome to Morse Code Master! 🎧', 'info', 3500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
