export const LESSONS_DATA = [
  {
    id: 'lesson-1',
    number: 1,
    title: 'The Foundations: Dits, Dahs & Rhythm',
    subtitle: 'Understand the core building blocks and the golden 1-3-7 timing rule',
    icon: 'zap',
    summary: 'Morse code is not a visual code—it is a musical language of short and long acoustic pulses called Dits and Dahs.',
    concept: `
      <div class="lesson-concept-box">
        <h3><span class="concept-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-icon"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span> The Golden 1-3-7 Timing Rule</h3>
        <p>Every Morse signal is built on one simple unit of time, <strong>1 Dit length (T)</strong>:</p>
        <div class="timing-rules-grid">
          <div class="timing-card">
            <div class="timing-badge dot-badge">· Dit (Dot)</div>
            <div class="timing-val">1 Unit</div>
            <div class="timing-desc">Short tap of sound. Pronounced <em>"di"</em> or <em>"dit"</em>.</div>
          </div>
          <div class="timing-card">
            <div class="timing-badge dash-badge">— Dah (Dash)</div>
            <div class="timing-val">3 Units</div>
            <div class="timing-desc">Long tone, exactly equal to <strong>3 dits</strong> in duration.</div>
          </div>
          <div class="timing-card">
            <div class="timing-badge gap-badge">Letter Gap</div>
            <div class="timing-val">3 Units</div>
            <div class="timing-desc">Pause between letters within a word.</div>
          </div>
          <div class="timing-card">
            <div class="timing-badge word-badge">Word Gap</div>
            <div class="timing-val">7 Units</div>
            <div class="timing-desc">Pause between distinct words.</div>
          </div>
        </div>
      </div>
    `,
    characters: [
      { char: 'E', code: '.', sound: 'dit', mnemonic: 'Shortest sound for the most common letter.', tip: '1 Dit' },
      { char: 'T', code: '-', sound: 'dah', mnemonic: 'One long solid tone. Think: "TALL".', tip: '1 Dah' }
    ],
    quiz: [
      {
        question: 'How long is a Dah compared to a Dit?',
        options: ['Equal length', 'Twice as long', 'Three times as long (3 units)', 'Four times as long'],
        answer: 'Three times as long (3 units)',
        explanation: 'In standard Morse timing, a Dah is strictly equal in length to 3 Dits.'
      },
      {
        question: 'What is the standard pause duration between two words?',
        options: ['1 unit', '3 units', '5 units', '7 units'],
        answer: '7 units',
        explanation: 'The inter-word spacing is 7 dit units, giving your ear time to separate words.'
      }
    ]
  },
  {
    id: 'lesson-2',
    number: 2,
    title: 'Single-Element Foundations: E and T',
    subtitle: 'Master the two simplest, most frequent letters in English',
    icon: 'sprout',
    summary: 'Because E and T appear most often in English, Samuel Morse assigned them the absolute shortest codes possible: 1 Dit and 1 Dah.',
    concept: `
      <div class="lesson-concept-box">
        <h3><span class="concept-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-icon"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg></span> The Sound Principle</h3>
        <p>Never count dots and dashes on paper! Instead, train your brain to recognize the auditory rhythm:</p>
        <ul class="lesson-bullet-list">
          <li><strong>E</strong> sounds like a quick click: <em>"dit"</em>.</li>
          <li><strong>T</strong> sounds like a prolonged beep: <em>"DAH"</em>.</li>
        </ul>
      </div>
    `,
    characters: [
      { char: 'E', code: '.', sound: 'dit', mnemonic: 'The quick spark of sound.', tip: 'Single Dit' },
      { char: 'T', code: '-', sound: 'dah', mnemonic: 'The steady pillar of sound: "TALL".', tip: 'Single Dah' }
    ],
    quiz: [
      {
        question: 'Which letter is represented by a single Dit (.)?',
        options: ['T', 'E', 'A', 'I'],
        answer: 'E',
        explanation: 'E is a single Dit (.).'
      },
      {
        question: 'Which letter is represented by a single Dah (-)?',
        options: ['M', 'O', 'T', 'N'],
        answer: 'T',
        explanation: 'T is a single Dah (-).'
      }
    ]
  },
  {
    id: 'lesson-3',
    number: 3,
    title: 'The Dit Family: E, I, S, H, 5',
    subtitle: 'Learn characters formed purely of repeating short pulses',
    icon: 'ladder',
    summary: 'Notice how each letter adds exactly one more dit like counting steps on a staircase: E (1), I (2), S (3), H (4), and the number 5 (5).',
    concept: `
      <div class="lesson-concept-box">
        <h3><span class="concept-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-icon"><path d="M6 3v18"/><path d="M18 3v18"/><path d="M6 7h12"/><path d="M6 12h12"/><path d="M6 17h12"/></svg></span> The Dit Staircase</h3>
        <p>Listen to the rapid rhythm as the number of dits increases:</p>
        <div class="staircase-visual">
          <div class="stair-step"><span class="stair-letter">E</span> <span class="stair-code">·</span> <span class="stair-count">1 dit</span></div>
          <div class="stair-step"><span class="stair-letter">I</span> <span class="stair-code">··</span> <span class="stair-count">2 dits</span></div>
          <div class="stair-step"><span class="stair-letter">S</span> <span class="stair-code">···</span> <span class="stair-count">3 dits</span></div>
          <div class="stair-step"><span class="stair-letter">H</span> <span class="stair-code">····</span> <span class="stair-count">4 dits</span></div>
          <div class="stair-step"><span class="stair-letter">5</span> <span class="stair-code">·····</span> <span class="stair-count">5 dits</span></div>
        </div>
      </div>
    `,
    characters: [
      { char: 'E', code: '.', sound: 'dit', mnemonic: '1 dot: "Eh"', tip: '1 Dit' },
      { char: 'I', code: '..', sound: 'di-dit', mnemonic: '2 dots: "I-tem" or "In-sect"', tip: '2 Dits' },
      { char: 'S', code: '...', sound: 'di-di-dit', mnemonic: '3 dots: "S-S-S" (triple hiss)', tip: '3 Dits' },
      { char: 'H', code: '....', sound: 'di-di-di-dit', mnemonic: '4 dots: "Hip-pi-ty-hop" / "Ha-ha-ha-ha"', tip: '4 Dits' },
      { char: '5', code: '.....', sound: 'di-di-di-di-dit', mnemonic: '5 dots for the number 5!', tip: '5 Dits' }
    ],
    quiz: [
      {
        question: 'What is the Morse code for the letter S?',
        options: ['..', '...', '....', '.-.'],
        answer: '...',
        explanation: 'S is 3 dits (...), famous from the SOS signal.'
      },
      {
        question: 'Which letter has 4 dits (....)?',
        options: ['H', 'S', 'F', 'B'],
        answer: 'H',
        explanation: 'H is 4 dits (....).'
      }
    ]
  },
  {
    id: 'lesson-4',
    number: 4,
    title: 'The Dah Family: T, M, O, 0',
    subtitle: 'Learn characters formed purely of long continuous tones',
    icon: 'waves',
    summary: 'Just like the Dit staircase, the Dah family builds from 1 dash up to 5 dashes: T (1), M (2), O (3), and 0 (5).',
    concept: `
      <div class="lesson-concept-box">
        <h3><span class="concept-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-icon"><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg></span> The Heavy Dah Cadence</h3>
        <p>Feel the deep, measured cadence of long tones:</p>
        <div class="staircase-visual">
          <div class="stair-step"><span class="stair-letter">T</span> <span class="stair-code">—</span> <span class="stair-count">1 dah</span></div>
          <div class="stair-step"><span class="stair-letter">M</span> <span class="stair-code">——</span> <span class="stair-count">2 dahs</span></div>
          <div class="stair-step"><span class="stair-letter">O</span> <span class="stair-code">———</span> <span class="stair-count">3 dahs</span></div>
          <div class="stair-step"><span class="stair-letter">0</span> <span class="stair-code">—————</span> <span class="stair-count">5 dahs</span></div>
        </div>
      </div>
    `,
    characters: [
      { char: 'T', code: '-', sound: 'dah', mnemonic: '"TALL" (single dash)', tip: '1 Dah' },
      { char: 'M', code: '--', sound: 'dah-dah', mnemonic: '"MAIL-MAN" (two long syllables)', tip: '2 Dahs' },
      { char: 'O', code: '---', sound: 'dah-dah-dah', mnemonic: '"OH-MY-GOD" (three heavy tones)', tip: '3 Dahs' },
      { char: '0', code: '-----', sound: 'dah-dah-dah-dah-dah', mnemonic: '5 long dahs for zero!', tip: '5 Dahs' }
    ],
    quiz: [
      {
        question: 'What is the Morse code for the letter M?',
        options: ['-', '--', '---', '--.'],
        answer: '--',
        explanation: 'M is two dahs (--).'
      },
      {
        question: 'Which letter is made of 3 Dahs (---)?',
        options: ['O', 'M', 'S', 'G'],
        answer: 'O',
        explanation: 'O is 3 dahs (---), the middle letter of SOS.'
      }
    ]
  },
  {
    id: 'lesson-5',
    number: 5,
    title: 'Symmetrical Opposites: A/N, U/D, V/B, W/G, K/R',
    subtitle: 'Double your speed by learning 10 letters as reciprocal pairs',
    icon: 'repeat',
    summary: 'Many Morse letters are exact opposites of each other! When you learn one, you instantly unlock its counterpart.',
    concept: `
      <div class="lesson-concept-box">
        <h3><span class="concept-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-icon"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/></svg></span> Mirror Pairs Strategy</h3>
        <p>Flip the rhythm to remember the inverse letter:</p>
        <div class="pairs-grid">
          <div class="pair-card">
            <span class="pair-left"><strong>A</strong>: ·— (di-DAH)</span>
            <span class="pair-divider">⇄</span>
            <span class="pair-right"><strong>N</strong>: —· (DAH-dit)</span>
          </div>
          <div class="pair-card">
            <span class="pair-left"><strong>U</strong>: ··— (di-di-DAH)</span>
            <span class="pair-divider">⇄</span>
            <span class="pair-right"><strong>D</strong>: —·· (DAH-di-dit)</span>
          </div>
          <div class="pair-card">
            <span class="pair-left"><strong>V</strong>: ···— (3 dits + 1 dah)</span>
            <span class="pair-divider">⇄</span>
            <span class="pair-right"><strong>B</strong>: —··· (1 dah + 3 dits)</span>
          </div>
          <div class="pair-card">
            <span class="pair-left"><strong>W</strong>: ·—— (1 dit + 2 dahs)</span>
            <span class="pair-divider">⇄</span>
            <span class="pair-right"><strong>G</strong>: ——· (2 dahs + 1 dit)</span>
          </div>
          <div class="pair-card">
            <span class="pair-left"><strong>K</strong>: —·— (dah-di-dah)</span>
            <span class="pair-divider">⇄</span>
            <span class="pair-right"><strong>R</strong>: ·—· (di-dah-dit)</span>
          </div>
        </div>
      </div>
    `,
    characters: [
      { char: 'A', code: '.-', sound: 'di-dah', mnemonic: '"a-BOUT"', tip: 'Opposite of N' },
      { char: 'N', code: '-.', sound: 'dah-dit', mnemonic: '"NO-way"', tip: 'Opposite of A' },
      { char: 'U', code: '..-', sound: 'di-di-dah', mnemonic: '"un-der-WHERE"', tip: 'Opposite of D' },
      { char: 'D', code: '-..', sound: 'dah-di-dit', mnemonic: '"DANG-er-ous"', tip: 'Opposite of U' },
      { char: 'V', code: '...-', sound: 'di-di-di-dah', mnemonic: 'Beethoven\'s 5th (V for Victory)', tip: 'Opposite of B' },
      { char: 'B', code: '-...', sound: 'dah-di-di-dit', mnemonic: '"BEAT-it-kid"', tip: 'Opposite of V' },
      { char: 'W', code: '.--', sound: 'di-dah-dah', mnemonic: '"with-HOT-TEA"', tip: 'Opposite of G' },
      { char: 'G', code: '--.', sound: 'dah-dah-dit', mnemonic: '"GOOD-GRA-vy"', tip: 'Opposite of W' },
      { char: 'K', code: '-.-', sound: 'dah-di-dah', mnemonic: '"KANG-a-ROO"', tip: 'Sandwich: Dahs outside' },
      { char: 'R', code: '.-.', sound: 'di-dah-dit', mnemonic: '"re-MEM-ber"', tip: 'Sandwich: Dits outside' }
    ],
    quiz: [
      {
        question: 'If A is ".-", what is its exact reverse opposite letter N?',
        options: ['-.', '-..', '--.', '..-'],
        answer: '-.',
        explanation: 'N is "-.", the exact reverse of A (".-").'
      },
      {
        question: 'Which letter matches Beethoven\'s 5th symphony rhythm (di-di-di-DAH / ...-)?',
        options: ['B', 'V', 'U', 'H'],
        answer: 'V',
        explanation: 'V is "...-" (3 dots, 1 dash), famously used during WWII as the V for Victory rhythm.'
      }
    ]
  },
  {
    id: 'lesson-6',
    number: 6,
    title: 'Word Mnemonics: C, F, J, L, P, Q, X, Y, Z',
    subtitle: 'Unlock the remaining letters with memorable word phrases',
    icon: 'brain',
    summary: 'Mnemonic words match the exact rhythm of the Morse code. Syllables containing "O" or capitalized letters are Dahs; other syllables are Dits!',
    concept: `
      <div class="lesson-concept-box">
        <h3><span class="concept-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-icon"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z"/></svg></span> Phonetic Rhythm Words</h3>
        <p>Say these words aloud to feel the exact Morse timing:</p>
        <ul class="lesson-bullet-list">
          <li><strong>C</strong> (-.-.): <strong>CO-ca-CO-la</strong> (Dah-di-Dah-dit)</li>
          <li><strong>Q</strong> (--.-): <strong>GOD-SAVE-the-QUEEN</strong> (Dah-Dah-di-Dah)</li>
          <li><strong>L</strong> (.-..): <strong>lu-NA-ti-cal</strong> (di-Dah-di-dit)</li>
          <li><strong>F</strong> (..-.): <strong>fetch-a-FIRE-man</strong> (di-di-Dah-dit)</li>
          <li><strong>P</strong> (.--.): <strong>a-PO-STLE-kid</strong> (di-Dah-Dah-dit)</li>
          <li><strong>J</strong> (.---): <strong>in-JAWS-JAWS-JAWS</strong> (di-Dah-Dah-Dah)</li>
          <li><strong>X</strong> (-..-): <strong>X-marks-the-SPOT</strong> (Dah-di-di-Dah)</li>
          <li><strong>Y</strong> (-.--): <strong>YOU-are-A-MAN</strong> (Dah-di-Dah-Dah)</li>
          <li><strong>Z</strong> (--..): <strong>ZINC-ZO-o-logy</strong> (Dah-Dah-di-dit)</li>
        </ul>
      </div>
    `,
    characters: [
      { char: 'C', code: '-.-.', sound: 'dah-di-dah-dit', mnemonic: '"CO-ca-CO-la"', tip: 'Alternating dash-dot-dash-dot' },
      { char: 'F', code: '..-.', sound: 'di-di-dah-dit', mnemonic: '"fetch-a-FIRE-man"', tip: 'Dash in the 3rd spot' },
      { char: 'J', code: '.---', sound: 'di-dah-dah-dah', mnemonic: '"in-JAWS-JAWS-JAWS"', tip: '1 Dit followed by 3 Dahs' },
      { char: 'L', code: '.-..', sound: 'di-dah-di-dit', mnemonic: '"lu-NA-ti-cal"', tip: 'Dash in the 2nd spot' },
      { char: 'P', code: '.--.', sound: 'di-dah-dah-dit', mnemonic: '"a-PO-STLE-kid"', tip: 'Dits hugging two Dahs' },
      { char: 'Q', code: '--.-', sound: 'dah-dah-di-dah', mnemonic: '"GOD-SAVE-the-QUEEN"', tip: 'Two Dahs, 1 Dit, 1 Dah' },
      { char: 'X', code: '-..-', sound: 'dah-di-di-dah', mnemonic: '"X-marks-the-SPOT"', tip: 'Dahs hugging two Dits' },
      { char: 'Y', code: '-.--', sound: 'dah-di-dah-dah', mnemonic: '"YOU-are-A-MAN"', tip: 'Dah-di-Dah-Dah' },
      { char: 'Z', code: '--..', sound: 'dah-dah-di-dit', mnemonic: '"ZINC-ZO-o-logy"', tip: 'Two Dahs, two Dits' }
    ],
    quiz: [
      {
        question: 'Which letter matches the phrase "CO-ca-CO-la" (-.-.)?',
        options: ['K', 'C', 'Q', 'X'],
        answer: 'C',
        explanation: 'C is "-.-.", matching "CO-ca-CO-la".'
      },
      {
        question: 'Which letter has Dits hugging two Dahs (.--.)?',
        options: ['P', 'X', 'R', 'K'],
        answer: 'P',
        explanation: 'P is ".--.", matching "a-PO-STLE-kid".'
      }
    ]
  },
  {
    id: 'lesson-7',
    number: 7,
    title: 'The Number Symphony (0 through 9)',
    subtitle: 'Discover the perfectly predictable 5-element clock pattern',
    icon: 'hash',
    summary: 'Every number in Morse code consists of exactly 5 elements. The dots count up from 1 to 5, then dashes take over from 6 to 0!',
    concept: `
      <div class="lesson-concept-box">
        <h3><span class="concept-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-icon"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg></span> The Symmetrical 5-Element Cycle</h3>
        <p>Watch how the dot travels and fills the 5 slots:</p>
        <div class="numbers-cycle-grid">
          <div class="num-card"><span class="num-char">1</span><span class="num-code">. - - - -</span><span class="num-desc">1 dit + 4 dahs</span></div>
          <div class="num-card"><span class="num-char">2</span><span class="num-code">. . - - -</span><span class="num-desc">2 dits + 3 dahs</span></div>
          <div class="num-card"><span class="num-char">3</span><span class="num-code">. . . - -</span><span class="num-desc">3 dits + 2 dahs</span></div>
          <div class="num-card"><span class="num-char">4</span><span class="num-code">. . . . -</span><span class="num-desc">4 dits + 1 dah</span></div>
          <div class="num-card"><span class="num-char">5</span><span class="num-code">. . . . .</span><span class="num-desc">5 dits + 0 dahs</span></div>
          <div class="num-card"><span class="num-char">6</span><span class="num-code">- . . . .</span><span class="num-desc">1 dah + 4 dits</span></div>
          <div class="num-card"><span class="num-char">7</span><span class="num-code">- - . . .</span><span class="num-desc">2 dahs + 3 dits</span></div>
          <div class="num-card"><span class="num-char">8</span><span class="num-code">- - - . .</span><span class="num-desc">3 dahs + 2 dits</span></div>
          <div class="num-card"><span class="num-char">9</span><span class="num-code">- - - - .</span><span class="num-desc">4 dahs + 1 dit</span></div>
          <div class="num-card"><span class="num-char">0</span><span class="num-code">- - - - -</span><span class="num-desc">5 dahs + 0 dits</span></div>
        </div>
      </div>
    `,
    characters: [
      { char: '1', code: '.----', sound: 'di-dah-dah-dah-dah', mnemonic: 'Starts with 1 dit', tip: '1 Dit, 4 Dahs' },
      { char: '2', code: '..---', sound: 'di-di-dah-dah-dah', mnemonic: 'Starts with 2 dits', tip: '2 Dits, 3 Dahs' },
      { char: '3', code: '...--', sound: 'di-di-di-dah-dah', mnemonic: 'Starts with 3 dits', tip: '3 Dits, 2 Dahs' },
      { char: '4', code: '....-', sound: 'di-di-di-di-dah', mnemonic: 'Starts with 4 dits', tip: '4 Dits, 1 Dah' },
      { char: '5', code: '.....', sound: 'di-di-di-di-dit', mnemonic: 'All 5 dits', tip: '5 Dits' },
      { char: '6', code: '-....', sound: 'dah-di-di-di-dit', mnemonic: 'Starts with 1 dah', tip: '1 Dah, 4 Dits' },
      { char: '7', code: '--...', sound: 'dah-dah-di-di-dit', mnemonic: 'Starts with 2 dahs', tip: '2 Dahs, 3 Dits' },
      { char: '8', code: '---..', sound: 'dah-dah-dah-di-dit', mnemonic: 'Starts with 3 dahs', tip: '3 Dahs, 2 Dits' },
      { char: '9', code: '----.', sound: 'dah-dah-dah-dah-dit', mnemonic: 'Starts with 4 dahs', tip: '4 Dahs, 1 Dit' },
      { char: '0', code: '-----', sound: 'dah-dah-dah-dah-dah', mnemonic: 'All 5 dahs', tip: '5 Dahs' }
    ],
    quiz: [
      {
        question: 'How many total elements (dots + dashes) make up every number in Morse code?',
        options: ['3', '4', '5', '6'],
        answer: '5',
        explanation: 'Every single number from 0 to 9 in Morse code is exactly 5 elements long.'
      },
      {
        question: 'What is the code for the number 7?',
        options: ['--...', '---..', '..---', '-....'],
        answer: '--...',
        explanation: '7 is 2 dahs followed by 3 dits (--...).'
      }
    ]
  },
  {
    id: 'lesson-8',
    number: 8,
    title: 'Emergency Signals & Radio Prosigns',
    subtitle: 'Learn SOS, CQ, and amateur radio telegraph conventions',
    icon: 'alert',
    summary: 'Radio operators worldwide use standardized prosigns and abbreviations for instant, unmistakable communication in any weather or language.',
    concept: `
      <div class="lesson-concept-box">
        <h3><span class="concept-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-icon"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><circle cx="12" cy="12" r="2"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/></svg></span> Essential Radio Signals</h3>
        <p>These historic signals have saved countless lives and are recognized globally:</p>
        <div class="signals-grid">
          <div class="signal-card emergency">
            <div class="signal-badge">DISTRESS</div>
            <div class="signal-name">SOS</div>
            <div class="signal-code">··· ——— ···</div>
            <div class="signal-meaning">International Distress Call (Sent without spaces between S-O-S).</div>
          </div>
          <div class="signal-card">
            <div class="signal-badge">CALLING</div>
            <div class="signal-name">CQ</div>
            <div class="signal-code">-.-.  --.-</div>
            <div class="signal-meaning">"Calling Any Station" — General open broadcast invitation.</div>
          </div>
          <div class="signal-card">
            <div class="signal-badge">OVER</div>
            <div class="signal-name">K</div>
            <div class="signal-code">-.-</div>
            <div class="signal-meaning">"Over to you / Invitation to transmit".</div>
          </div>
          <div class="signal-card">
            <div class="signal-badge">GREETING</div>
            <div class="signal-name">73</div>
            <div class="signal-code">--...  ...--</div>
            <div class="signal-meaning">"Best regards / Warmest wishes" to the receiving operator.</div>
          </div>
        </div>
      </div>
    `,
    characters: [
      { char: 'SOS', code: '... --- ...', sound: 'di-di-dit dah-dah-dah di-di-dit', mnemonic: '3 dots, 3 dashes, 3 dots: Save Our Souls', tip: 'Universal Distress' },
      { char: 'CQ', code: '-.-. --.-', sound: 'dah-di-dah-dit dah-dah-di-dah', mnemonic: 'Calling all stations', tip: 'General Call' },
      { char: '73', code: '--... ...--', sound: 'dah-dah-di-di-dit di-di-dit-dah-dah', mnemonic: 'Best Regards', tip: 'Radio Signoff' }
    ],
    quiz: [
      {
        question: 'What is the Morse sequence for the emergency signal SOS?',
        options: ['... --- ...', '--- ... ---', '... ... ...', '-.-. --.-'],
        answer: '... --- ...',
        explanation: 'SOS is 3 dots, 3 dashes, 3 dots (... --- ...).'
      },
      {
        question: 'What does the prosign "73" mean in amateur radio telegraphy?',
        options: ['Emergency!', 'Best regards / warm wishes', 'Message received', 'Change frequency'],
        answer: 'Best regards / warm wishes',
        explanation: '"73" is the time-honored Morse code farewell meaning "Best regards".'
      }
    ]
  }
];

export const FLASHCARD_ITEMS = [
  { char: 'A', code: '.-', sound: 'di-DAH', mnemonic: 'a-BOUT', category: 'letters' },
  { char: 'B', code: '-...', sound: 'DAH-di-di-dit', mnemonic: 'BEAT-it-kid', category: 'letters' },
  { char: 'C', code: '-.-.', sound: 'DAH-di-DAH-dit', mnemonic: 'CO-ca-CO-la', category: 'letters' },
  { char: 'D', code: '-..', sound: 'DAH-di-dit', mnemonic: 'DANG-er-ous', category: 'letters' },
  { char: 'E', code: '.', sound: 'dit', mnemonic: 'Eh (quick dot)', category: 'letters' },
  { char: 'F', code: '..-.', sound: 'di-di-DAH-dit', mnemonic: 'fetch-a-FIRE-man', category: 'letters' },
  { char: 'G', code: '--.', sound: 'DAH-DAH-dit', mnemonic: 'GOOD-GRA-vy', category: 'letters' },
  { char: 'H', code: '....', sound: 'di-di-di-dit', mnemonic: 'Hip-pi-ty-hop', category: 'letters' },
  { char: 'I', code: '..', sound: 'di-dit', mnemonic: 'In-sect', category: 'letters' },
  { char: 'J', code: '.---', sound: 'di-DAH-DAH-DAH', mnemonic: 'in-JAWS-JAWS-JAWS', category: 'letters' },
  { char: 'K', code: '-.-', sound: 'DAH-di-DAH', mnemonic: 'KANG-a-ROO', category: 'letters' },
  { char: 'L', code: '.-..', sound: 'di-DAH-di-dit', mnemonic: 'lu-NA-ti-cal', category: 'letters' },
  { char: 'M', code: '--', sound: 'DAH-DAH', mnemonic: 'MAIL-MAN', category: 'letters' },
  { char: 'N', code: '-.', sound: 'DAH-dit', mnemonic: 'NO-way', category: 'letters' },
  { char: 'O', code: '---', sound: 'DAH-DAH-DAH', mnemonic: 'OH-MY-GOD', category: 'letters' },
  { char: 'P', code: '.--.', sound: 'di-DAH-DAH-dit', mnemonic: 'a-PO-STLE-kid', category: 'letters' },
  { char: 'Q', code: '--.-', sound: 'DAH-DAH-di-DAH', mnemonic: 'GOD-SAVE-the-QUEEN', category: 'letters' },
  { char: 'R', code: '.-.', sound: 'di-DAH-dit', mnemonic: 're-MEM-ber', category: 'letters' },
  { char: 'S', code: '...', sound: 'di-di-dit', mnemonic: 'S-S-S (triple pulse)', category: 'letters' },
  { char: 'T', code: '-', sound: 'DAH', mnemonic: 'TALL (single dash)', category: 'letters' },
  { char: 'U', code: '..-', sound: 'di-di-DAH', mnemonic: 'un-der-WHERE', category: 'letters' },
  { char: 'V', code: '...-', sound: 'di-di-di-DAH', mnemonic: 'Beethoven\'s 5th', category: 'letters' },
  { char: 'W', code: '.--', sound: 'di-DAH-DAH', mnemonic: 'with-HOT-TEA', category: 'letters' },
  { char: 'X', code: '-..-', sound: 'DAH-di-di-DAH', mnemonic: 'X-marks-the-SPOT', category: 'letters' },
  { char: 'Y', code: '-.--', sound: 'DAH-di-DAH-DAH', mnemonic: 'YOU-are-A-MAN', category: 'letters' },
  { char: 'Z', code: '--..', sound: 'DAH-DAH-di-dit', mnemonic: 'ZINC-ZO-o-logy', category: 'letters' },
  { char: '1', code: '.----', sound: 'di-DAH-DAH-DAH-DAH', mnemonic: '1 dit + 4 dahs', category: 'numbers' },
  { char: '2', code: '..---', sound: 'di-di-DAH-DAH-DAH', mnemonic: '2 dits + 3 dahs', category: 'numbers' },
  { char: '3', code: '...--', sound: 'di-di-di-DAH-DAH', mnemonic: '3 dits + 2 dahs', category: 'numbers' },
  { char: '4', code: '....-', sound: 'di-di-di-di-DAH', mnemonic: '4 dits + 1 dah', category: 'numbers' },
  { char: '5', code: '.....', sound: 'di-di-di-di-dit', mnemonic: '5 fast dits', category: 'numbers' },
  { char: '6', code: '-....', sound: 'DAH-di-di-di-dit', mnemonic: '1 dah + 4 dits', category: 'numbers' },
  { char: '7', code: '--...', sound: 'DAH-DAH-di-di-dit', mnemonic: '2 dahs + 3 dits', category: 'numbers' },
  { char: '8', code: '---..', sound: 'DAH-DAH-DAH-di-dit', mnemonic: '3 dahs + 2 dits', category: 'numbers' },
  { char: '9', code: '----.', sound: 'DAH-DAH-DAH-DAH-dit', mnemonic: '4 dahs + 1 dit', category: 'numbers' },
  { char: '0', code: '-----', sound: 'DAH-DAH-DAH-DAH-DAH', mnemonic: '5 solid dahs', category: 'numbers' },
  { char: 'SOS', code: '... --- ...', sound: 'di-di-dit DAH-DAH-DAH di-di-dit', mnemonic: 'Save Our Souls', category: 'signals' },
  { char: '73', code: '--... ...--', sound: 'DAH-DAH-di-di-dit di-di-dit-DAH-DAH', mnemonic: 'Best Regards', category: 'signals' }
];
