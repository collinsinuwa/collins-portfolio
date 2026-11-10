/* Academic Planner: add, complete, delete, filter, priority, overdue alerts; saved in localStorage */
const KEY = 'planner-tasks', list = document.getElementById('tasks'), form = document.getElementById('taskForm');
const NAMES = { 1: 'High', 2: 'Medium', 3: 'Low' }, today = new Date().toISOString().slice(0, 10);
let tasks = [], view = 'all';
try { tasks = JSON.parse(localStorage.getItem(KEY)) || []; } catch { tasks = []; }
const save = () => localStorage.setItem(KEY, JSON.stringify(tasks));
const late = t => !t.done && t.due && t.due < today;
/* open tasks first, then by priority, then by nearest due date */
const order = (a, b) => a.done - b.done || (a.pri || 2) - (b.pri || 2) || (a.due || '9').localeCompare(b.due || '9');

function render() {
  const shown = tasks.filter(t => view === 'all' || (view === 'done') === t.done).sort(order);
  list.replaceChildren(...shown.map(t => {
    const li = document.createElement('li'), box = document.createElement('input'), txt = document.createElement('span'),
      chip = document.createElement('em'), del = document.createElement('button');
    li.classList.toggle('done', t.done); li.classList.toggle('late', !!late(t));
    box.type = 'checkbox'; box.checked = t.done; box.setAttribute('aria-label', 'Mark complete');
    box.addEventListener('change', () => { t.done = box.checked; save(); render(); });
    txt.textContent = t.text; txt.title = 'Double-click to edit';
    txt.addEventListener('dblclick', () => { const v = prompt('Edit task', t.text); if (v && v.trim()) { t.text = v.trim(); save(); render(); } });
    if (t.due) { const s = document.createElement('small'); s.textContent = (late(t) ? 'Overdue: due ' : 'Due ') + t.due; txt.append(s); }
    chip.className = 'p p' + (t.pri || 2); chip.textContent = NAMES[t.pri || 2];
    del.textContent = '\u2715'; del.setAttribute('aria-label', 'Delete task');
    del.addEventListener('click', () => { tasks = tasks.filter(x => x !== t); save(); render(); });
    li.append(box, txt, chip, del); return li;
  }));
  const done = tasks.filter(t => t.done).length, over = tasks.filter(late).length;
  document.getElementById('empty').hidden = shown.length > 0;
  document.getElementById('bar').value = tasks.length ? Math.round(done / tasks.length * 100) : 0;
  document.getElementById('count').textContent = `${done} of ${tasks.length} tasks completed` + (over ? ` \u00b7 ${over} overdue` : '');
}
form.addEventListener('submit', e => {
  e.preventDefault();
  const text = form.text.value.trim();
  if (!text) { form.text.classList.add('bad'); form.text.focus(); return; }
  form.text.classList.remove('bad');
  tasks.unshift({ text, due: form.due.value, pri: Number(form.pri.value), done: false }); save(); form.reset(); render();
});
document.querySelectorAll('.filters button').forEach(b => b.addEventListener('click', () => {
  view = b.dataset.f; document.querySelectorAll('.filters button').forEach(x => x.classList.toggle('on', x === b)); render();
}));
document.getElementById('clearDone').addEventListener('click', () => { tasks = tasks.filter(t => !t.done); save(); render(); });
render();
document.getElementById('exportBtn').addEventListener('click', () => {
  const lines = tasks.sort(order).map(t => `[${t.done ? 'x' : ' '}] ${t.text} (${NAMES[t.pri || 2]}${t.due ? ', due ' + t.due : ''})`);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([lines.join('\n') || 'No tasks yet.'], { type: 'text/plain' })); a.download = 'my-tasks.txt'; a.click(); URL.revokeObjectURL(a.href);
});
