// Loaded in each page's <head> so the saved theme is applied before the page paints (no flash of Classic).
// The picker is added to the header from here, so the 7 copies of the header markup stay untouched.
(() => {
  const THEMES = { classic: 'Classic', midnight: 'Midnight', bubblegum: 'Bubblegum' };
  const STORAGE_KEY = 'theme';
  const root = document.documentElement;

  // localStorage throws in some private-browsing modes; the site then just stays on Classic
  const load = () => { try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } };
  const save = (name) => { try { localStorage.setItem(STORAGE_KEY, name); } catch {} };

  const apply = (name) => {
    if (name in THEMES && name !== 'classic') root.dataset.theme = name;
    else delete root.dataset.theme;
  };

  apply(load());

  document.addEventListener('DOMContentLoaded', () => {
    const slot = document.querySelector('.topnav.signup');
    if (!slot) throw new Error('theme.js: no .topnav.signup in the header to put the theme picker in');

    const select = document.createElement('select');
    for (const [value, label] of Object.entries(THEMES)) select.add(new Option(label, value));
    select.value = root.dataset.theme || 'classic';
    select.addEventListener('change', () => { apply(select.value); save(select.value); });

    const label = document.createElement('label');
    label.className = 'theme-picker';
    label.append('Theme ', select);
    const item = document.createElement('li');
    item.append(label);
    slot.append(item);
  });
})();
