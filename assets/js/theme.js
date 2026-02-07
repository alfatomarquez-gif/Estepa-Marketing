/* ===================================
   THEME.JS - Light/Dark Mode Toggle
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
  initTheme();
});

/* ===================================
   THEME INITIALIZATION
   =================================== */
function initTheme() {
  const themeToggle = document.querySelector('.theme-toggle');
  
  if (themeToggle) {
    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      
      // Optional: Show toast notification
      if (window.showToast) {
        showToast(`Tema ${newTheme === 'light' ? 'claro' : 'oscuro'} activado`, 'success', 2000);
      }
    });
    
    // Update icon
    updateThemeIcon(savedTheme);
  }
}

/* ===================================
   SET THEME
   =================================== */
function setTheme(theme) {
  // Set theme attribute
  document.documentElement.setAttribute('data-theme', theme);
  
  // Save to localStorage
  localStorage.setItem('theme', theme);
  
  // Update icon
  updateThemeIcon(theme);
  
  // Smooth transition
  document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  setTimeout(() => {
    document.documentElement.style.transition = '';
  }, 300);
}

/* ===================================
   UPDATE THEME ICON
   =================================== */
function updateThemeIcon(theme) {
  const themeToggle = document.querySelector('.theme-toggle');
  
  if (themeToggle) {
    // Update button icon/content
    if (theme === 'dark') {
      themeToggle.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
      themeToggle.setAttribute('aria-label', 'Cambiar a tema claro');
    } else {
      themeToggle.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
      themeToggle.setAttribute('aria-label', 'Cambiar a tema oscuro');
    }
  }
}

/* ===================================
   GET CURRENT THEME
   =================================== */
function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light';
}

// Export functions
window.setTheme = setTheme;
window.getCurrentTheme = getCurrentTheme;
