// ===== HARISS - Script commun (navigation, menu, thème) =====

document.addEventListener('DOMContentLoaded', () => {

    // ----- Menu mobile (hamburger) -----
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
  
    if (menuToggle && mainNav) {
      menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('open');
      });
    }
  
    // ----- Marquer le lien actif dans la navigation -----
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav a').forEach(link => {
      const linkPage = link.getAttribute('href');
      if (linkPage === currentPage) {
        link.classList.add('active');
      }
    });
  
    // ----- Thème sombre / clair -----
    const themeToggle = document.querySelector('.theme-toggle');
    const savedTheme = localStorage.getItem('hariss-theme') || 'dark';
  
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
    }
  
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('hariss-theme', isLight ? 'light' : 'dark');
      });
    }
  
  });