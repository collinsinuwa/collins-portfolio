/* Projects page: filter cards by technology */
const btns = document.querySelectorAll('.filters button'), cards = document.querySelectorAll('[data-cat]');
btns.forEach(b => b.addEventListener('click', () => {
  btns.forEach(x => x.classList.toggle('on', x === b));
  cards.forEach(c => { c.hidden = !(b.dataset.f === 'all' || c.dataset.cat.includes(b.dataset.f)); });
}));
