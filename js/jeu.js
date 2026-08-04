// ===== HARISS - Logique du jeu (Mode Standard) =====

document.addEventListener('DOMContentLoaded', () => {

    const textDisplay = document.getElementById('text-display');
    const input = document.getElementById('typing-input');
    const statWpm = document.getElementById('stat-wpm');
    const statAccuracy = document.getElementById('stat-accuracy');
    const statTime = document.getElementById('stat-time');
    const statErrors = document.getElementById('stat-errors');
    const btnRestart = document.getElementById('btn-restart');
    const btnAgain = document.getElementById('btn-again');
    const resultBox = document.getElementById('result-box');
    const resultWpm = document.getElementById('result-wpm');
    const resultAccuracy = document.getElementById('result-accuracy');
  
    // Si on n'est pas sur la page jeu, on arrête ici
    if (!textDisplay || !input) return;
  
    const TIME_LIMIT = 60;
  
    let currentText = '';
    let charIndex = 0;
    let errors = 0;
    let totalTyped = 0;
    let timer = null;
    let timeLeft = TIME_LIMIT;
    let startTime = null;
    let gameOver = false;
    let sampleTexts = ["Chargement du texte..."]; // valeur temporaire le temps du chargement
  
    function pickText() {
      return sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    }
  
    function loadTextsAndStart() {
      fetch('assets/data/textes.json')
        .then(res => res.json())
        .then(data => {
          sampleTexts = data.fr;
          resetGame();
        })
        .catch(() => {
          sampleTexts = ["Impossible de charger les textes. Vérifie ta connexion ou réessaie."];
          resetGame();
        });
    }
  
    function renderText() {
      textDisplay.innerHTML = '';
      currentText.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.className = i === 0 ? 'char-current' : 'char-pending';
        textDisplay.appendChild(span);
      });
    }
  
    function updateDisplay() {
      const spans = textDisplay.querySelectorAll('span');
      spans.forEach((span, i) => {
        span.className = 'char-pending';
        if (i < charIndex) {
          span.className = span.dataset.wrong === 'true' ? 'char-incorrect' : 'char-correct';
        } else if (i === charIndex) {
          span.className = 'char-current';
        }
      });
    }
  
    function calcWpm() {
      if (!startTime) return 0;
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      if (elapsedMinutes <= 0) return 0;
      const wordsTyped = charIndex / 5;
      return Math.round(wordsTyped / elapsedMinutes);
    }
  
    function calcAccuracy() {
      if (totalTyped === 0) return 100;
      return Math.max(0, Math.round(((totalTyped - errors) / totalTyped) * 100));
    }
  
    function startTimer() {
      if (timer) return;
      timer = setInterval(() => {
        timeLeft--;
        statTime.textContent = timeLeft;
        statWpm.textContent = calcWpm();
        if (timeLeft <= 0) {
          endGame();
        }
      }, 1000);
    }
  
    function endGame() {
      gameOver = true;
      clearInterval(timer);
      timer = null;
      input.disabled = true;
  
      const finalWpm = calcWpm();
      const finalAccuracy = calcAccuracy();
  
      resultWpm.textContent = finalWpm;
      resultAccuracy.textContent = finalAccuracy;
      resultBox.classList.add('show');
  
      saveScore(finalWpm, finalAccuracy);
      checkAchievements(finalWpm, finalAccuracy);
    }
  
    function saveScore(wpm, accuracy) {
      const scores = JSON.parse(localStorage.getItem('hariss-scores') || '[]');
      scores.push({ name: 'Invité', wpm, accuracy, date: Date.now() });
      localStorage.setItem('hariss-scores', JSON.stringify(scores));
    }
  
    function checkAchievements(wpm, accuracy) {
      const scores = JSON.parse(localStorage.getItem('hariss-scores') || '[]');
      const unlocked = new Set(JSON.parse(localStorage.getItem('hariss-achievements') || '[]'));
  
      unlocked.add('first-game');
      if (wpm >= 40) unlocked.add('speed-40');
      if (wpm >= 60) unlocked.add('speed-60');
      if (accuracy === 100) unlocked.add('perfect');
      if (scores.length >= 5) unlocked.add('five-games');
  
      localStorage.setItem('hariss-achievements', JSON.stringify([...unlocked]));
    }
  
    function resetGame() {
      clearInterval(timer);
      timer = null;
      currentText = pickText();
      charIndex = 0;
      errors = 0;
      totalTyped = 0;
      timeLeft = TIME_LIMIT;
      startTime = null;
      gameOver = false;
  
      statWpm.textContent = '0';
      statAccuracy.textContent = '100%';
      statTime.textContent = TIME_LIMIT;
      statErrors.textContent = '0';
  
      resultBox.classList.remove('show');
      input.disabled = false;
      input.value = '';
      renderText();
      input.focus();
    }
  
    input.addEventListener('input', (e) => {
      if (gameOver) return;
  
      if (!startTime) {
        startTime = Date.now();
        startTimer();
      }
  
      const typedValue = e.target.value;
      const lastChar = typedValue[typedValue.length - 1];
  
      if (typedValue.length < charIndex) {
        charIndex = typedValue.length;
        updateDisplay();
        return;
      }
  
      const expectedChar = currentText[charIndex];
      const spans = textDisplay.querySelectorAll('span');
  
      if (lastChar === expectedChar) {
        spans[charIndex].dataset.wrong = 'false';
      } else {
        spans[charIndex].dataset.wrong = 'true';
        errors++;
        statErrors.textContent = errors;
      }
  
      totalTyped++;
      charIndex++;
      statAccuracy.textContent = calcAccuracy() + '%';
  
      updateDisplay();
  
      if (charIndex >= currentText.length) {
        endGame();
      }
    });
  
    btnRestart.addEventListener('click', resetGame);
    btnAgain.addEventListener('click', resetGame);
  
    // Démarrage initial
    loadTextsAndStart();
  });