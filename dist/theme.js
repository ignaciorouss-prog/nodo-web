(() => {
  const root = document.documentElement;
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  let chosen = null;
  try { chosen = localStorage.getItem('nodo-theme'); } catch (_) {}
  const apply = (dark) => {
    root.dataset.theme = dark ? 'dark' : 'light';
    const button = document.getElementById('theme-toggle');
    if (!button) return;
    const label = dark ? 'Activar modo día' : 'Activar modo noche';
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', label);
    button.title = label;
    const logo = document.querySelector('.brand img');
    if (logo) logo.src = dark ? 'assets/logo-light.svg' : 'assets/logo.svg';
  };
  apply(chosen === 'dark' || (chosen !== 'light' && preference.matches));
  document.addEventListener('DOMContentLoaded', () => {
    apply(root.dataset.theme === 'dark');
    document.getElementById('theme-toggle').addEventListener('click', () => {
      chosen = root.dataset.theme === 'dark' ? 'light' : 'dark';
      apply(chosen === 'dark');
      try { localStorage.setItem('nodo-theme', chosen); } catch (_) {}
    });
  });
  preference.addEventListener('change', e => { if (!chosen) apply(e.matches); });
})();
