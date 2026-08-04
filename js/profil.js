// ===== HARISS - Profil =====

document.addEventListener('DOMContentLoaded', () => {

    const bestWpmEl = document.getElementById('profile-best-wpm');
    if (!bestWpmEl) return;
  
    function getScores() {
      const raw = localStorage.getItem('hariss-scores');
      return raw ? JSON.parse(raw) : [];
    }
  
    function getUnlockedAchievements() {
      const raw = localStorage.getItem('hariss-achievements');
      return raw ? JSON.parse(raw) : [];
    }
  
    function renderProfile() {
      const scores = getScores();
  
      const bestWpm = scores.length ? Math.max(...scores.map(s => s.wpm)) : 0;
      const avgAccuracy = scores.length
        ? Math.round(scores.reduce((sum, s) => sum + s.accuracy, 0) / scores.length)
        : 0;
  
      document.getElementById('profile-best-wpm').textContent = bestWpm;
      document.getElementById('profile-avg-accuracy').textContent = avgAccuracy + '%';
      document.getElementById('profile-games').textContent = scores.length;
  
      const unlocked = getUnlockedAchievements();
      document.querySelectorAll('.achievement').forEach(el => {
        if (unlocked.includes(el.dataset.id)) {
          el.classList.add('unlocked');
        }
      });
    }
  
    renderProfile();
  });