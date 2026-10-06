export class GameState {
  static BADGES = [
    { id: 'FIRST_CORRECT', title: 'First Steps', description: 'Answer your first question correctly', icon: 'target' },
    { id: 'FIFTY_CORRECT', title: 'Half Century', description: 'Answer 50 questions correctly', icon: 'trophy' },
    { id: 'STREAK_10', title: 'On Fire', description: 'Get a streak of 10 correct answers', icon: 'flame' },
    { id: 'STREAK_20', title: 'Unstoppable', description: 'Get a streak of 20 correct answers', icon: 'diamond' },
    { id: 'LEVEL_3', title: 'Rising Star', description: 'Reach level 3', icon: 'star' },
    { id: 'LEVEL_5', title: 'Morse Enthusiast', description: 'Reach level 5', icon: 'sparkles' },
    { id: 'LEVEL_10', title: 'Morse Master', description: 'Reach level 10', icon: 'crown' },
    { id: 'BEGINNER_CLEAR', title: 'Letter Perfect', description: 'Complete 26 correct answers in Beginner mode', icon: 'learn' },
    { id: 'INTERMEDIATE_CLEAR', title: 'Word Wizard', description: 'Complete 20 correct answers in Intermediate mode', icon: 'reference' },
    { id: 'MASTERED_LETTERS', title: 'Alphabet Ace', description: 'Practice every letter A-Z at least once', icon: 'alphabet' },
    { id: 'FIRST_LESSON', title: 'Curious Cadet', description: 'Complete your first Beginner Morse lesson', icon: 'baby' },
    { id: 'LESSONS_HALF', title: 'Halfway Scout', description: 'Complete 4 Beginner Morse lessons', icon: 'compass' },
    { id: 'LESSONS_MASTER', title: 'Morse Graduate', description: 'Complete all 8 Beginner Morse lessons', icon: 'graduation' },
    { id: 'KEYER_HERO', title: 'Telegrapher', description: 'Key 10 correct letters on the Morse Keyer', icon: 'radio' },
    { id: 'FLASHCARD_MASTER', title: 'Memory Master', description: 'Master 15 flashcards in the Learning Studio', icon: 'cards' },
    { id: 'TRANSLATOR_SCOUT', title: 'Signal Master', description: 'Play a message with the visual signal lamp', icon: 'lightbulb' }
  ];

  static LEVEL_THRESHOLDS = [100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];

  static STORAGE_KEY = 'morseMasterState';

  static BADGE_CONDITIONS = {
    FIRST_CORRECT: (s) => s.stats.totalCorrect >= 1,
    FIFTY_CORRECT: (s) => s.stats.totalCorrect >= 50,
    STREAK_10: (s) => s.streak >= 10,
    STREAK_20: (s) => s.streak >= 20,
    LEVEL_3: (s) => s.level >= 3,
    LEVEL_5: (s) => s.level >= 5,
    LEVEL_10: (s) => s.level >= 10,
    BEGINNER_CLEAR: (s) => s.stats.beginnerCorrect >= 26,
    INTERMEDIATE_CLEAR: (s) => s.stats.intermediateCorrect >= 20,
    MASTERED_LETTERS: (s) => s.stats.lettersSeen.length >= 26,
    FIRST_LESSON: (s) => (s.stats.lessonsCompleted || []).length >= 1,
    LESSONS_HALF: (s) => (s.stats.lessonsCompleted || []).length >= 4,
    LESSONS_MASTER: (s) => (s.stats.lessonsCompleted || []).length >= 8,
    KEYER_HERO: (s) => (s.stats.keyerLettersSent || 0) >= 10,
    FLASHCARD_MASTER: (s) => (s.stats.flashcardsMastered || []).length >= 15,
    TRANSLATOR_SCOUT: (s) => (s.stats.translationsPlayed || 0) >= 1
  };

  constructor() {
    this.xp = 0;
    this.level = 1;
    this.streak = 0;
    this.badges = [];
    this.stats = {
      totalCorrect: 0,
      totalAttempts: 0,
      beginnerCorrect: 0,
      intermediateCorrect: 0,
      lettersSeen: [],
      lessonsCompleted: [],
      flashcardsMastered: [],
      keyerLettersSent: 0,
      translationsPlayed: 0
    };
    this.onLevelUp = null;
    this.onBadgeUnlock = null;
    this.load();
  }

  save() {
    const data = {
      xp: this.xp,
      level: this.level,
      streak: this.streak,
      badges: this.badges,
      stats: this.stats
    };
    localStorage.setItem(GameState.STORAGE_KEY, JSON.stringify(data));
  }

  load() {
    const raw = localStorage.getItem(GameState.STORAGE_KEY);
    if (!raw) {
      this.resetStats();
      return;
    }
    try {
      const data = JSON.parse(raw);
      this.xp = typeof data.xp === 'number' ? data.xp : 0;
      this.level = typeof data.level === 'number' ? data.level : 1;
      this.streak = typeof data.streak === 'number' ? data.streak : 0;
      this.badges = Array.isArray(data.badges) ? data.badges : [];
      if (data.stats && typeof data.stats === 'object') {
        this.stats = {
          totalCorrect: typeof data.stats.totalCorrect === 'number' ? data.stats.totalCorrect : 0,
          totalAttempts: typeof data.stats.totalAttempts === 'number' ? data.stats.totalAttempts : 0,
          beginnerCorrect: typeof data.stats.beginnerCorrect === 'number' ? data.stats.beginnerCorrect : 0,
          intermediateCorrect: typeof data.stats.intermediateCorrect === 'number' ? data.stats.intermediateCorrect : 0,
          lettersSeen: Array.isArray(data.stats.lettersSeen) ? data.stats.lettersSeen : [],
          lessonsCompleted: Array.isArray(data.stats.lessonsCompleted) ? data.stats.lessonsCompleted : [],
          flashcardsMastered: Array.isArray(data.stats.flashcardsMastered) ? data.stats.flashcardsMastered : [],
          keyerLettersSent: typeof data.stats.keyerLettersSent === 'number' ? data.stats.keyerLettersSent : 0,
          translationsPlayed: typeof data.stats.translationsPlayed === 'number' ? data.stats.translationsPlayed : 0
        };
      } else {
        this.resetStats();
      }
    } catch (e) {
      this.resetStats();
    }
  }

  resetStats() {
    this.xp = 0;
    this.level = 1;
    this.streak = 0;
    this.badges = [];
    this.stats = {
      totalCorrect: 0,
      totalAttempts: 0,
      beginnerCorrect: 0,
      intermediateCorrect: 0,
      lettersSeen: [],
      lessonsCompleted: [],
      flashcardsMastered: [],
      keyerLettersSent: 0,
      translationsPlayed: 0
    };
  }

  _checkBadges() {
    const newBadges = [];
    for (const badge of GameState.BADGES) {
      if (!this.badges.includes(badge.id)) {
        const condition = GameState.BADGE_CONDITIONS[badge.id];
        if (condition && condition(this)) {
          this.badges.push(badge.id);
          newBadges.push(badge.id);
          if (this.onBadgeUnlock) {
            this.onBadgeUnlock(badge);
          }
        }
      }
    }
    return newBadges;
  }

  addXP(amount, modeId) {
    let levelUps = 0;
    this.xp += amount;
    const maxLevel = GameState.LEVEL_THRESHOLDS.length;
    while (this.level < maxLevel && this.xp >= GameState.LEVEL_THRESHOLDS[this.level - 1]) {
      this.level++;
      levelUps++;
      if (this.onLevelUp) {
        this.onLevelUp(this.level);
      }
    }
    return levelUps;
  }

  completeLesson(lessonId) {
    if (!this.stats.lessonsCompleted) this.stats.lessonsCompleted = [];
    const isNew = !this.stats.lessonsCompleted.includes(lessonId);
    if (isNew) {
      this.stats.lessonsCompleted.push(lessonId);
      this.addXP(40, 'lesson');
    }
    this._checkBadges();
    this.save();
    return isNew;
  }

  isLessonCompleted(lessonId) {
    return (this.stats.lessonsCompleted || []).includes(lessonId);
  }

  recordFlashcardMastered(char) {
    if (!this.stats.flashcardsMastered) this.stats.flashcardsMastered = [];
    const upper = char.toUpperCase();
    if (!this.stats.flashcardsMastered.includes(upper)) {
      this.stats.flashcardsMastered.push(upper);
      this.addXP(5, 'flashcard');
      this._checkBadges();
      this.save();
      return true;
    }
    return false;
  }

  recordKeyerLetter(letter) {
    this.stats.keyerLettersSent = (this.stats.keyerLettersSent || 0) + 1;
    this.addXP(10, 'keyer');
    this._checkBadges();
    this.save();
  }

  recordTranslationPlayed() {
    this.stats.translationsPlayed = (this.stats.translationsPlayed || 0) + 1;
    this._checkBadges();
    this.save();
  }

  recordCorrect(mode, letterOrWord) {
    this.stats.totalAttempts++;
    this.streak++;
    this.stats.totalCorrect++;
    if (mode === 'beginner') {
      this.stats.beginnerCorrect++;
    }
    if (mode === 'intermediate') {
      this.stats.intermediateCorrect++;
    }
    if (letterOrWord && letterOrWord.length === 1 && /^[A-Za-z]$/.test(letterOrWord)) {
      const upper = letterOrWord.toUpperCase();
      if (!this.stats.lettersSeen.includes(upper)) {
        this.stats.lettersSeen.push(upper);
      }
    }
    const baseXP = this.getXPForMode(mode);
    const multiplier = this.streakMultiplier();
    const xpAmount = Math.round(baseXP * multiplier);
    const levelUps = this.addXP(xpAmount, mode);
    const newBadges = this._checkBadges();
    this.save();
    return { levelUps, newBadges };
  }

  recordWrong() {
    this.stats.totalAttempts++;
    this.streak = 0;
    this.save();
  }

  streakMultiplier() {
    if (this.streak >= 20) return 3;
    if (this.streak >= 10) return 2;
    if (this.streak >= 5) return 1.5;
    return 1;
  }

  getXPForMode(modeId) {
    switch (modeId) {
      case 'beginner': return 10;
      case 'intermediate': return 25;
      case 'advanced': return 50;
      case 'master': return 75;
      default: return 10;
    }
  }

  hasBadge(id) {
    return this.badges.includes(id);
  }

  getProgressToNextLevel() {
    const maxLevel = GameState.LEVEL_THRESHOLDS.length;
    if (this.level >= maxLevel) {
      const finalThreshold = GameState.LEVEL_THRESHOLDS[maxLevel - 1];
      return { current: this.xp, next: finalThreshold, percent: 100 };
    }
    const prevThreshold = this.level === 1 ? 0 : GameState.LEVEL_THRESHOLDS[this.level - 2];
    const nextThreshold = GameState.LEVEL_THRESHOLDS[this.level - 1];
    const current = this.xp - prevThreshold;
    const next = nextThreshold - prevThreshold;
    const percent = Math.min(100, Math.max(0, Math.floor((current / next) * 100)));
    return { current, next, percent };
  }

  getAccuracyPercent() {
    if (this.stats.totalAttempts === 0) return 0;
    return Math.max(0, Math.min(100, (this.stats.totalCorrect / this.stats.totalAttempts) * 100));
  }
}
