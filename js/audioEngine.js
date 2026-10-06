import { MORSE_DATA } from './morseData.js';

export class AudioEngine {
  constructor() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.scheduledOscillators = [];
    this.masterGain = this.context.createGain();
    this.masterGain.gain.value = 1;
    this.masterGain.connect(this.context.destination);
    this._defaultWpm = 15;
    this._continuousOsc = null;
    this._continuousGain = null;
    this._playTimeouts = [];
  }

  async ensureContext() {
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  startTone(freq = 700, gainVal = 0.2) {
    this.ensureContext();
    if (this._continuousOsc) return;
    try {
      const now = this.context.currentTime;
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(gainVal, now + 0.005);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      this._continuousOsc = osc;
      this._continuousGain = gain;
    } catch (e) {}
  }

  stopTone() {
    if (!this._continuousOsc || !this._continuousGain) return;
    try {
      const now = this.context.currentTime;
      this._continuousGain.gain.cancelScheduledValues(now);
      this._continuousGain.gain.setValueAtTime(this._continuousGain.gain.value, now);
      this._continuousGain.gain.linearRampToValueAtTime(0, now + 0.008);
      this._continuousOsc.stop(now + 0.01);
    } catch (e) {}
    this._continuousOsc = null;
    this._continuousGain = null;
  }

  playTone(freq, durationMs, startDelayMs = 0, type = 'sine', gainVal = 0.15) {
    const now = this.context.currentTime;
    const startAt = now + (startDelayMs / 1000);
    const durationSec = durationMs / 1000;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = type;
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0, startAt);
    gain.gain.linearRampToValueAtTime(gainVal, startAt + 0.005);
    gain.gain.setValueAtTime(gainVal, startAt + durationSec - 0.01);
    gain.gain.linearRampToValueAtTime(0, startAt + durationSec);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startAt);
    osc.stop(startAt + durationSec + 0.02);

    const entry = { osc, gain, stopAt: startAt + durationSec + 0.02 };
    this.scheduledOscillators.push(entry);
    osc.onended = () => {
      const idx = this.scheduledOscillators.indexOf(entry);
      if (idx !== -1) this.scheduledOscillators.splice(idx, 1);
    };

    return osc;
  }

  async playMorse(text, wpm = 15, onSymbol = null) {
    this.stop();
    await this.ensureContext();
    const unit = 1200 / wpm;
    const upper = text.toUpperCase();
    const words = upper.split(/\s+/).filter(w => w.length > 0);

    let offset = 0;

    for (let wi = 0; wi < words.length; wi++) {
      const word = words[wi];
      for (let ci = 0; ci < word.length; ci++) {
        const ch = word[ci];
        const pattern = MORSE_DATA[ch];
        if (!pattern) continue;

        const symbols = pattern.split('');
        for (let si = 0; si < symbols.length; si++) {
          const sym = symbols[si];
          const dur = sym === '.' ? unit : sym === '-' ? unit * 3 : 0;
          if (dur > 0) {
            this.playTone(700, dur, offset, 'sine', 0.2);
            if (typeof onSymbol === 'function') {
              const symTimer = setTimeout(() => {
                onSymbol({ symbol: sym, char: ch, duration: dur, state: 'on' });
                const offTimer = setTimeout(() => {
                  onSymbol({ symbol: sym, char: ch, duration: dur, state: 'off' });
                }, dur);
                this._playTimeouts.push(offTimer);
              }, offset);
              this._playTimeouts.push(symTimer);
            }
          }
          offset += dur;
          if (si < symbols.length - 1) {
            offset += unit;
          }
        }
        if (ci < word.length - 1) {
          offset += unit * 3;
        }
      }
      if (wi < words.length - 1) {
        offset += unit * 7;
      }
    }

    const totalMs = offset;
    return new Promise((resolve) => {
      const finishTimer = setTimeout(() => {
        if (typeof onSymbol === 'function') {
          onSymbol({ state: 'complete' });
        }
        resolve();
      }, totalMs + 50);
      this._playTimeouts.push(finishTimer);
    });
  }

  stop() {
    this.stopTone();
    for (const tid of this._playTimeouts) {
      clearTimeout(tid);
    }
    this._playTimeouts = [];

    for (const entry of this.scheduledOscillators) {
      try {
        entry.osc.onended = null;
        entry.gain.gain.cancelScheduledValues(this.context.currentTime);
        entry.gain.gain.setValueAtTime(0, this.context.currentTime);
        entry.osc.stop(this.context.currentTime);
      } catch (e) {}
    }
    this.scheduledOscillators.length = 0;
  }

  async playDing() {
    await this.ensureContext();
    this.playTone(880, 80, 0, 'sine', 0.2);
    this.playTone(1320, 120, 80, 'sine', 0.2);
    return new Promise((resolve) => setTimeout(resolve, 220));
  }

  async playBuzz() {
    await this.ensureContext();
    this.playTone(180, 150, 0, 'square', 0.18);
    return new Promise((resolve) => setTimeout(resolve, 180));
  }

  async playLevelUp() {
    await this.ensureContext();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    for (let i = 0; i < notes.length; i++) {
      this.playTone(notes[i], 100, i * 100, 'triangle', 0.22);
    }
    return new Promise((resolve) => setTimeout(resolve, 450));
  }

  async playBadge() {
    await this.ensureContext();
    this.playTone(540, 60, 0, 'sine', 0.2);
    this.playTone(720, 60, 70, 'sine', 0.2);
    this.playTone(540, 60, 140, 'sine', 0.2);
    this.playTone(720, 60, 210, 'sine', 0.2);
    return new Promise((resolve) => setTimeout(resolve, 290));
  }

  async playDit() {
    await this.ensureContext();
    const unit = 1200 / this._defaultWpm;
    this.playTone(700, unit, 0, 'sine', 0.2);
    return new Promise((resolve) => setTimeout(resolve, unit + 20));
  }

  async playDah() {
    await this.ensureContext();
    const unit = 1200 / this._defaultWpm;
    this.playTone(700, unit * 3, 0, 'sine', 0.2);
    return new Promise((resolve) => setTimeout(resolve, unit * 3 + 20));
  }
}

