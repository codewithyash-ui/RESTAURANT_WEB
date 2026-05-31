// frontend/js/theme.js - Theme switching functionality
const themes = {
  warm: {
    primary: '#ea580c',
    primaryDark: '#c2410c',
    primaryLight: '#fed7aa',
    secondary: '#d97706',
    bgLight: '#fef3c7',
    bgDark: '#78350f',
    textPrimary: '#ea580c'
  },
  green: {
    primary: '#16a34a',
    primaryDark: '#15803d',
    primaryLight: '#bbf7d0',
    secondary: '#65a30d',
    bgLight: '#dcfce7',
    bgDark: '#14532d',
    textPrimary: '#16a34a'
  },
  purple: {
    primary: '#9333ea',
    primaryDark: '#7e22ce',
    primaryLight: '#e9d5ff',
    secondary: '#db2777',
    bgLight: '#f3e8ff',
    bgDark: '#4c1d95',
    textPrimary: '#9333ea'
  },
  red: {
    primary: '#dc2626',
    primaryDark: '#b91c1c',
    primaryLight: '#fecaca',
    secondary: '#ea580c',
    bgLight: '#fee2e2',
    bgDark: '#7f1d1d',
    textPrimary: '#dc2626'
  }
};

// Apply theme to the page
function applyTheme(themeName) {
  const theme = themes[themeName];
  if (!theme) return;
  
  // Save theme preference
  localStorage.setItem('bakeryTheme', themeName);
  
  // Update CSS variables on body
  document.body.style.setProperty('--primary', theme.primary);
  document.body.style.setProperty('--primary-dark', theme.primaryDark);
  document.body.style.setProperty('--primary-light', theme.primaryLight);
  document.body.style.setProperty('--secondary', theme.secondary);
  document.body.style.setProperty('--bg-light', theme.bgLight);
  document.body.style.setProperty('--bg-dark', theme.bgDark);
  document.body.style.setProperty('--text-primary', theme.textPrimary);
  
  // Remove old theme classes and add new one
  const themeClasses = ['theme-warm', 'theme-green', 'theme-purple', 'theme-red'];
  themeClasses.forEach(cls => document.body.classList.remove(cls));
  document.body.classList.add(`theme-${themeName}`);
  
  // Update nav-link underline color
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.style.setProperty('--primary', theme.primary);
  });
}

// Initialize theme on page load
function initTheme() {
  const savedTheme = localStorage.getItem('bakeryTheme') || 'warm';
  applyTheme(savedTheme);
  
  // Setup theme toggle button
  const toggleBtn = document.getElementById('theme-toggle');
  const themeMenu = document.getElementById('theme-menu');
  
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (themeMenu) themeMenu.classList.toggle('hidden');
    });
  }
  
  // Setup theme options
  const themeOptions = document.querySelectorAll('.theme-option');
  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      const theme = option.dataset.theme;
      if (theme) {
        applyTheme(theme);
        if (themeMenu) themeMenu.classList.add('hidden');
        
        // Show notification
        const notif = document.createElement('div');
        notif.className = 'fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-500';
        notif.innerHTML = `<i class="fas fa-check-circle mr-2"></i>Theme changed to ${option.querySelector('span').textContent}!`;
        document.body.appendChild(notif);
        setTimeout(() => {
          notif.style.opacity = '0';
          setTimeout(() => notif.remove(), 500);
        }, 2000);
      }
    });
  });
  
  // Close theme menu when clicking outside
  document.addEventListener('click', (e) => {
    if (themeMenu && toggleBtn && !themeMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      themeMenu.classList.add('hidden');
    }
  });
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', initTheme);