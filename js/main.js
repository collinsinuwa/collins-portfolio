/* Shared behaviour: theme toggle, mobile menu, scroll reveal, photo fallback */
(() => {
  const root = document.documentElement, themeBtn = document.getElementById('themeBtn');
  const paint = () => { themeBtn.textContent = root.dataset.theme === 'dark' ? '☀' : '☾'; };
  paint();
  themeBtn.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', root.dataset.theme); paint();
  });
  const menuBtn = document.getElementById('menuBtn'), nav = document.querySelector('nav');
  menuBtn.addEventListener('click', () => menuBtn.setAttribute('aria-expanded', nav.classList.toggle('open')));
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), { threshold: .12 });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));
  document.querySelectorAll('img[data-fallback]').forEach(img => {
    const hide = () => { img.hidden = true; };
    img.addEventListener('error', hide);
    if (img.complete && !img.naturalWidth) hide();
  });

  /* Header shadow and back-to-top button */
  const header = document.querySelector('.site-header'), top = document.createElement('button');
  top.className = 'top'; top.textContent = '\u2191'; top.setAttribute('aria-label', 'Back to top');
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' })); document.body.append(top);
  addEventListener('scroll', () => { header.classList.toggle('scrolled', scrollY > 10); top.classList.toggle('show', scrollY > 500); }, { passive: true });

  /* Home page: rotating role line */
  const role = document.getElementById('role');
  if (role) {
    const roles = role.dataset.roles.split('|'); let n = 0;
    setInterval(() => { role.classList.add('out'); setTimeout(() => { role.textContent = roles[++n % roles.length]; role.classList.remove('out'); }, 350); }, 2800);
  }

  /* Home page: count-up stats */
  const counter = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; counter.unobserve(e.target);
    const end = parseFloat(e.target.textContent), dec = (e.target.textContent.split('.')[1] || '').length, t0 = performance.now();
    const tick = t => { const p = Math.min((t - t0) / 1100, 1); e.target.textContent = (end * p).toFixed(dec); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }));
  document.querySelectorAll('.stats strong').forEach(el => counter.observe(el));

  /* Reading-progress bar and print buttons */
  const bar = document.createElement('div'); bar.className = 'readbar'; document.body.prepend(bar);
  addEventListener('scroll', () => { bar.style.width = (scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) * 100) + '%'; }, { passive: true });
  document.querySelectorAll('[data-print]').forEach(b => b.addEventListener('click', () => print()));
})();
