// ===== HARISS - Classement =====

document.addEventListener('DOMContentLoaded', () => {

    const tbody = document.getElementById('leaderboard-body');
    if (!tbody) return;
  
    function getScores() {
      const raw = localStorage.getItem('hariss-scores');
      return raw ? JSON.parse(raw) : [];
    }
  
    function renderLeaderboard() {
      const scores = getScores()
        .sort((a, b) => b.wpm - a.wpm)
        .slice(0, 10);
  
      if (scores.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="4" style="padding:24px; text-align:center; color:var(--text-secondary);">
              Aucun score enregistré pour le moment. Sois le premier !
            </td>
          </tr>`;
        return;
      }
  
      tbody.innerHTML = scores.map((s, i) => `
        <tr style="border-bottom:1px solid var(--border);">
          <td style="padding:12px;">#${i + 1}</td>
          <td style="padding:12px;">${s.name || 'Invité'}</td>
          <td style="padding:12px;">${s.wpm}</td>
          <td style="padding:12px;">${s.accuracy}%</td>
        </tr>
      `).join('');
    }
  
    renderLeaderboard();
  });