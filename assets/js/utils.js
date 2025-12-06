// Theme persistence & ARIA helpers
(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
})();

export function toggleTheme(button) {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  button.querySelector('img').src = next === 'dark' ? 'assets/icons/moon.png' : 'assets/icons/sun.png';
}

export function formatCurrency(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);
}

export function setStatus(el, text) {
  el.textContent = text;
  el.setAttribute('aria-live', 'polite');
}

export async function withRetry(fn, retries = 2, delayMs = 600) {
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try { return await fn(); }
    catch (err) { lastErr = err; await new Promise(r => setTimeout(r, delayMs)); }
  }
  throw lastErr;
}

// Simple tilt effect on cards
export function initTilt() {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -6;
      const ry = ((x / rect.width) - 0.5) * 6;
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });
}
