const LETTERS = [
  { symbol: 'א', name: 'אות א', description: 'הא האות הראשונה. היא מתחילה את המילה אבא ואת המילה אמא.', sample: 'אבא' },
  { symbol: 'ב', name: 'אות ב', description: 'הא ב היא בוקס, בובה ובננה. היא שומעת כמו בּ כאשר יש לה נקודה.', sample: 'בננה' },
  { symbol: 'ג', name: 'אות ג', description: 'הא ג היא גזר וגג. נשמעת כמו ג.', sample: 'גזר' },
  { symbol: 'ד', name: 'אות ד', description: 'הא ד היא דג ודלת. היא נשמעת כמו ד.', sample: 'דלת' },
  { symbol: 'ה', name: 'אות ה', description: 'הא ה היא הר והשמש. היא מופיעה בסוף המילה וגם בתחילה.', sample: 'הדס' },
  { symbol: 'ו', name: 'אות ו', description: 'הא וו שקטה לעיתים או נשמעת כמו ו, כמו בו והים.', sample: 'ים' },
  { symbol: 'ז', name: 'אות ז', description: 'הא ז היא זהב וזחל. היא נשמעת כמו ז.', sample: 'זמר' },
  { symbol: 'ח', name: 'אות ח', description: 'הא ח היא חשמל וחג, והיא נשמעת חחח מתוך הגרון.', sample: 'חג' },
  { symbol: 'ט', name: 'אות ט', description: 'הא ט היא טל וטווס. היא נשמעת כמו ט.', sample: 'טוב' },
  { symbol: 'י', name: 'אות י', description: 'הא י היא ילדה וים. היא יכולה להיות גם אות וגם תנועה קטנה.', sample: 'ילד' },
  { symbol: 'כ', name: 'אות כ', description: 'הא כ היא כרכום וכדור. היא נשמעת כמו כ.', sample: 'כלב' },
  { symbol: 'ל', name: 'אות ל', description: 'הא ל היא לב ולימון. היא נשמעת כמו ל.', sample: 'לילה' },
  { symbol: 'מ', name: 'אות מ', description: 'הא מ היא מים ומילה. היא נשמעת כמו מ.', sample: 'מורה' },
  { symbol: 'נ', name: 'אות נ', description: 'הא נ היא נר ונשים. היא נשמעת כמו נ.', sample: 'נחש' },
  { symbol: 'ס', name: 'אות ס', description: 'הא ס היא סוס וספר. היא נשמעת כמו ס.', sample: 'סוכר' },
  { symbol: 'ע', name: 'אות ע', description: 'הא ע היא עין ועץ. היא נשמעת כמו ע מהגרון.', sample: 'עוגה' },
  { symbol: 'פ', name: 'אות פ', description: 'הא פ היא פרח ופמח. היא נשמעת כמו פ.', sample: 'פרח' },
  { symbol: 'צ', name: 'אות צ', description: 'הא צ היא ציפור וצד. היא נשמעת כמו צ.', sample: 'ציפור' },
  { symbol: 'ק', name: 'אות ק', description: 'הא ק היא קוף וקשת. היא נשמעת כמו ק.', sample: 'קוץ' },
  { symbol: 'ר', name: 'אות ר', description: 'הא ר היא ראש ורוח. היא נשמעת כמו ר.', sample: 'רכבת' },
  { symbol: 'ש', name: 'אות ש', description: 'הא ש יכולה להיות שׁ עם דגש או שׂ בלי דגש. בדרך כלל היא נשמעת ש.', sample: 'שמש' },
  { symbol: 'ת', name: 'אות ת', description: 'הא ת היא תאנה ותפוח. היא נשמעת כמו ת.', sample: 'תפוח' },
];
const STORAGE_LEARNED = 'alefbetLearnedLetters';
const STORAGE_STATS = 'alefbetGameStats';
const STORAGE_REMOTE = 'alefbetRemoteSettings';
const tabButtons = document.querySelectorAll('.tab-button');
const panels = document.querySelectorAll('.tab-panel');
const lettersGrid = document.getElementById('letters-grid');
const gameArea = document.getElementById('game-area');
const statsBoard = document.getElementById('stats-board');
const speechButton = document.getElementById('speech-button');
const resetButton = document.getElementById('reset-progress');
let learnedLetters = {};
let stats = {};
let currentGame = null;
let currentLetter = null;
let speechSupported = 'speechSynthesis' in window;
const gameDefinitions = {
  game1: {
    title: 'מצא את האות לפי שמה',
    description: 'אני אומרת את שם האות, ואת בוחרת את הסמל הנכון.',
  },
  game2: {
    title: 'הקשיבי לאות ובחרי',
    description: 'תשמעי את האות ותבחרי את האות שאת שומעת.',
  },
};

let learnedLetters = {};
let stats = {};
let remoteSettings = { url: '', anonKey: '', active: false };
let supabase = null;
let currentGame = null;
let currentLetter = null;
let speechSupported = 'speechSynthesis' in window;

function initialize() {
  loadData();
  openSupabaseConnection();
  attachHandlers();
  renderLetterCards();
  renderStats();
}

function loadData() {
  learnedLetters = JSON.parse(localStorage.getItem(STORAGE_LEARNED)) || {};
  stats = JSON.parse(localStorage.getItem(STORAGE_STATS)) || {};
  remoteSettings = JSON.parse(localStorage.getItem(STORAGE_REMOTE)) || remoteSettings;
}

function saveData() {
  localStorage.setItem(STORAGE_LEARNED, JSON.stringify(learnedLetters));
  localStorage.setItem(STORAGE_STATS, JSON.stringify(stats));
}

function saveRemoteSettings() {
  localStorage.setItem(STORAGE_REMOTE, JSON.stringify(remoteSettings));
}

function attachHandlers() {
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => switchTab(button.dataset.tab));
  });

  speechButton.addEventListener('click', () => {
    speakText('שלום! בואי נלמד אותיות ביחד. בחרי אות כדי לשמוע אותה.', true);
  });

  document.getElementById('start-game-1').addEventListener('click', () => prepareGame('game1'));
  document.getElementById('start-game-2').addEventListener('click', () => prepareGame('game2'));
  resetButton.addEventListener('click', resetProgress);
}

function switchTab(tabName) {
  tabButtons.forEach((button) => button.classList.toggle('active', button.dataset.tab === tabName));
  panels.forEach((panel) => panel.classList.toggle('active', panel.id === tabName));
}

function renderLetterCards() {
  lettersGrid.innerHTML = '';
  LETTERS.forEach((letter) => {
    const template = document.getElementById('letter-card-template');
    const card = template.content.cloneNode(true);
    const symbolEl = card.querySelector('.letter-symbol');
    const nameEl = card.querySelector('.letter-name');
    const descriptionEl = card.querySelector('.letter-description');
    const speakBtn = card.querySelector('.speak-letter');
    const learnedBtn = card.querySelector('.mark-learned');
    const letterCard = card.querySelector('.letter-card');

    symbolEl.textContent = letter.symbol;
    nameEl.textContent = letter.name;
    descriptionEl.textContent = letter.description;
    speakBtn.addEventListener('click', () => {
      speakText(`${letter.name}. ${letter.description}. דוגמה: ${letter.sample}.`);
    });

    const isLearned = Boolean(learnedLetters[letter.symbol]);
    learnedBtn.textContent = isLearned ? 'סומנה כנקראה' : 'למדתי את האות';
    learnedBtn.addEventListener('click', () => toggleLearned(letter.symbol));

    if (isLearned) {
      letterCard.classList.add('learned');
    }

    lettersGrid.appendChild(card);
  });
}

function toggleLearned(symbol) {
  learnedLetters[symbol] = !learnedLetters[symbol];
  saveData();
  renderLetterCards();
  renderStats();
}

function speakText(text, reset = false) {
  if (!speechSupported) {
    alert('הדפדפן שלך לא תומך בסינטזת דיבור. את יכולה עדיין לשחק וללמוד בלי קול.');
    return;
  }
  if (reset) {
    window.speechSynthesis.cancel();
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'he-IL';
  utterance.rate = 0.9;
  utterance.pitch = 1.05;
  speechSynthesis.speak(utterance);
}

function prepareGame(gameKey) {
  const learned = getLearnedLetters();
  if (learned.length === 0) {
    showGameMessage('בחרי לפחות אות אחת שלימדת כדי לשחק. לחצי על "למדתי את האות" בכרטיסיה של האות.', true);
    return;
  }
  currentGame = gameKey;
  currentLetter = pickRandomLearnedLetter(learned);
  const gameDefinition = gameDefinitions[gameKey];
  const html = `
    <div class="game-stage">
      <h3>${gameDefinition.title}</h3>
      <p>לפני שנשחק, נתחיל בללמוד את האות הזאת שוב.</p>
      <div class="letter-card">
        <div class="letter-symbol">${currentLetter.symbol}</div>
        <div class="letter-info">
          <h3>${currentLetter.name}</h3>
          <p>${currentLetter.description}</p>
          <p>דוגמה: ${currentLetter.sample}</p>
        </div>
      </div>
      <button id="confirm-ready" class="speech-btn">הבנתי את האות. בואי לשחק!</button>
    </div>
  `;
  gameArea.innerHTML = html;
  gameArea.classList.remove('hidden');
  speakText(`האות היא ${currentLetter.name}. ${currentLetter.description}. דוגמה: ${currentLetter.sample}.`);
  document.getElementById('confirm-ready').addEventListener('click', () => startGameRound(gameKey, currentLetter));
}

function getLearnedLetters() {
  return LETTERS.filter((letter) => learnedLetters[letter.symbol]);
}

function pickRandomLearnedLetter(letters = getLearnedLetters()) {
  const index = Math.floor(Math.random() * letters.length);
  return letters[index];
}

function startGameRound(gameKey, letter) {
  const options = createOptions(letter, getLearnedLetters());
  let promptText = '';
  if (gameKey === 'game1') {
    promptText = `איזו אחת מהאפשרויות היא ${letter.name}?`;
    speakText(`מצוינת. חפשי את האות ${letter.name}.`);
  } else {
    promptText = `איזו אחת מהאפשרויות שומעת?`;
    speakText(`הקשיבי. זו האות ${letter.name}.`);
  }

  const choicesHtml = options
    .map(
      (option) => `
      <button class="choice-button" data-letter="${option.symbol}">${option.symbol}</button>
    `
    )
    .join('');

  const html = `
    <div class="game-stage">
      <h3>${gameDefinitions[gameKey].title}</h3>
      <p>${promptText}</p>
      <div class="choices-grid">${choicesHtml}</div>
      <p id="game-feedback"></p>
      <button id="repeat-sound" class="speech-btn">שמעי שוב את האות</button>
    </div>
  `;
  gameArea.innerHTML = html;
  document.querySelectorAll('.choice-button').forEach((button) => {
    button.addEventListener('click', () => onChoiceSelected(button, letter.symbol, gameKey));
  });
  document.getElementById('repeat-sound').addEventListener('click', () => {
    if (gameKey === 'game1') {
      speakText(`${letter.name}.`);
    } else {
      speakText(`${letter.symbol}.`);
    }
  });
}

function createOptions(correctLetter, learned) {
  const available = learned.filter((letter) => letter.symbol !== correctLetter.symbol);
  const choices = [correctLetter];
  while (choices.length < 4 && available.length > 0) {
    const index = Math.floor(Math.random() * available.length);
    const [choice] = available.splice(index, 1);
    choices.push(choice);
  }
  return shuffleArray(choices);
}

function shuffleArray(array) {
  return array.slice().sort(() => Math.random() - 0.5);
}

function onChoiceSelected(button, correctSymbol, gameKey) {
  const selectedSymbol = button.dataset.letter;
  const success = selectedSymbol === correctSymbol;
  button.classList.add(success ? 'correct' : 'wrong');
  document.querySelectorAll('.choice-button').forEach((btn) => (btn.disabled = true));
  const feedback = document.getElementById('game-feedback');
  if (success) {
    feedback.textContent = 'כל הכבוד! זה נכון!';
    speakText('כל הכבוד! הבחירה שלך נכונה.');
  } else {
    feedback.textContent = `זה לא נכון. האות הנכונה היא ${correctSymbol}.`; 
    speakText(`זה לא נכון. האות הנכונה היא ${correctSymbol}.`);
  }
  updateStats(gameKey, success);
  const nextButton = document.createElement('button');
  nextButton.textContent = 'ננסה שוב אות אחרת';
  nextButton.className = 'speech-btn';
  nextButton.addEventListener('click', () => prepareGame(gameKey));
  gameArea.appendChild(nextButton);
}

function updateStats(gameKey, success) {
  const timestamp = new Date();
  const today = timestamp.toISOString().substring(0, 10);
  if (!stats[today]) {
    stats[today] = { game1: { plays: 0, wins: 0 }, game2: { plays: 0, wins: 0 } };
  }
  stats[today][gameKey].plays += 1;
  if (success) stats[today][gameKey].wins += 1;
  saveData();
  if (remoteSettings.active && supabase) {
    syncRemoteStats(today, gameKey, success);
  }
  renderStats();
}

async function syncRemoteStats(today, gameKey, success) {
  if (!supabase) return;
  const { data, error } = await supabase
    .from('alpha_bet_learning')
    .select('plays,wins')
    .eq('date', today)
    .eq('game', gameKey)
    .maybeSingle();

  if (error) {
    console.error('שגיאה בקריאת סטטיסטיקה מ-Supabase:', error.message);
    return;
  }

  if (data) {
    const { error: updateError } = await supabase
      .from('alpha_bet_learning')
      .update({
        plays: data.plays + 1,
        wins: data.wins + (success ? 1 : 0),
      })
      .eq('date', today)
      .eq('game', gameKey);

    if (updateError) {
      console.error('עדכון סטטיסטיקה ב-Supabase נכשל:', updateError.message);
    }
  } else {
    const { error: insertError } = await supabase.from('alpha_bet_learning').insert({
      date: today,
      game: gameKey,
      plays: 1,
      wins: success ? 1 : 0,
    });
    if (insertError) {
      console.error('הוספת סטטיסטיקה ל-Supabase נכשל:', insertError.message);
    }
  }
}

function renderStats() {
  const today = new Date().toISOString().substring(0, 10);
  const todayStats = stats[today] || { game1: { plays: 0, wins: 0 }, game2: { plays: 0, wins: 0 } };
  const learnedCount = getLearnedLetters().length;
  const connectionStatus = remoteSettings.active ? 'מחוברת ל-Supabase' : 'לא מחוברת ל-Supabase';
  statsBoard.innerHTML = `
    <div class="stats-card">
      <h3>התקדמות לימוד אותיות</h3>
      <p>אותיות שלמדת: ${learnedCount}</p>
      <p>הכנסת אותיות שלמדת כאן - כך הן מוכנות למשחקים.</p>
    </div>
    <div class="stats-card">
      <h3>${gameDefinitions.game1.title}</h3>
      <p>ניסיונות היום: ${todayStats.game1.plays}</p>
      <p>הצלחות: ${todayStats.game1.wins}</p>
    </div>
    <div class="stats-card">
      <h3>${gameDefinitions.game2.title}</h3>
      <p>ניסיונות היום: ${todayStats.game2.plays}</p>
      <p>הצלחות: ${todayStats.game2.wins}</p>
    </div>
    <div class="stats-card">
      <h3>חיבור מרחוק</h3>
      <p class="remote-status">${connectionStatus}</p>
      <div class="remote-connection">
        <label>URL של Supabase<input id="supabase-url" type="text" placeholder="https://xyzcompany.supabase.co" value="${remoteSettings.url}" /></label>
        <label>ANON KEY<input id="supabase-key" type="text" placeholder="public-anonymous-key" value="${remoteSettings.anonKey}" /></label>
      </div>
      <div class="stats-actions">
        <button id="connect-remote" class="speech-btn">התחבר ל-Supabase</button>
      </div>
    </div>
    <div class="stats-card">
      <h3>גיבוי ושיתוף</h3>
      <p>את יכולה לשמור את הסטטיסטיקה והאותיות שנלמדו כדי לעבור למכשיר אחר או לשמור בגיט.</p>
      <div class="stats-actions">
        <button id="export-data" class="speech-btn">ייצוא התקדמות</button>
        <label class="import-label">
          <span class="import-text">ייבוא קובץ</span>
          <input id="import-file" type="file" accept="application/json" />
        </label>
      </div>
    </div>
  `;
  document.getElementById('export-data').addEventListener('click', exportProgress);
  document.getElementById('import-file').addEventListener('change', importProgress);
  document.getElementById('connect-remote').addEventListener('click', configureRemoteConnection);
}

function exportProgress() {
  const exportData = {
    learnedLetters,
    stats,
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'alefbet-progress.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function importProgress(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (imported.learnedLetters && imported.stats) {
        learnedLetters = imported.learnedLetters;
        stats = imported.stats;
        saveData();
        renderLetterCards();
        renderStats();
        alert('הנתונים יובאו בהצלחה.');
      } else {
        throw new Error('קובץ לא תקין');
      }
    } catch (error) {
      alert('לא ניתן לייבא את הקובץ. ודאי שהוא קובץ JSON הנכון.');
    }
  };
  reader.readAsText(file, 'UTF-8');
  event.target.value = '';
}

function configureRemoteConnection() {
  const url = document.getElementById('supabase-url').value.trim();
  const key = document.getElementById('supabase-key').value.trim();
  if (!url || !key) {
    alert('נא להזין URL ו-ANON KEY של Supabase.');
    return;
  }
  remoteSettings.url = url;
  remoteSettings.anonKey = key;
  remoteSettings.active = true;
  saveRemoteSettings();
  openSupabaseConnection();
  renderStats();
}

function openSupabaseConnection() {
  if (!remoteSettings.url || !remoteSettings.anonKey) return;
  if (typeof supabase === 'undefined') {
    alert('הספרייה של Supabase לא נטענה. ודאי שהסקריפט של Supabase נמצא ב-index.html.');
    return;
  }
  supabase = supabase.createClient(remoteSettings.url, remoteSettings.anonKey);
}

function showGameMessage(message, highlight = false) {
  gameArea.innerHTML = `
    <div class="game-stage">
      <p>${message}</p>
    </div>
  `;
  gameArea.classList.remove('hidden');
}

function resetProgress() {
  if (!confirm('את רוצה לנקות את כל ההתקדמות והסטטיסטיקה?')) return;
  learnedLetters = {};
  stats = {};
  saveData();
  renderLetterCards();
  renderStats();
  gameArea.innerHTML = '';
  gameArea.classList.add('hidden');
}

initialize();
