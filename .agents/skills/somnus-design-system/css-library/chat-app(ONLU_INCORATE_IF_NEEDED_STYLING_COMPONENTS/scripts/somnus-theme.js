// Somnus theme helpers (optional)
// Usage: SomnusTheme.set('light'|'dark'|'auto')
// Adds data-theme on <html> and respects OS when set to 'auto'.

(function (global) {
  const KEY = 'somnus-theme';

  function apply(theme) {
    const root = document.documentElement;
    if (theme === 'auto') {
      root.removeAttribute('data-theme');
      root.dataset.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      root.dataset.theme = theme;
    }
  }

  function set(theme) {
    localStorage.setItem(KEY, theme);
    apply(theme);
  }

  function init() {
    const saved = localStorage.getItem(KEY) || 'dark';
    apply(saved);
  }

  const SomnusTheme = { set, init };
  global.SomnusTheme = SomnusTheme;
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})(window);

