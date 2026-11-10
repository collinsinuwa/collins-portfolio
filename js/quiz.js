/* Quiz app: an array of question objects, functions, DOM updates, running score */
const questions = [
  { q: 'Which HTML element wraps the main navigation links?', o: ['<nav>', '<aside>', '<footer>', '<article>'], a: 0 },
  { q: 'Which CSS feature builds two-dimensional page layouts?', o: ['Float', 'Grid', 'Position', 'Table-layout'], a: 1 },
  { q: 'Which method attaches an event handler in JavaScript?', o: ['onlyListen()', 'attachClick()', 'addEventListener()', 'handleEvent()'], a: 2 },
  { q: 'What does DOM stand for?', o: ['Data Object Model', 'Document Object Model', 'Display Order Map', 'Document Order Method'], a: 1 },
  { q: 'Which CSS rule applies styles at specific screen widths?', o: ['@keyframes', '@import', '@font-face', '@media'], a: 3 }
];
let index = 0, score = 0;
const $ = id => document.getElementById(id);
function show() {
  const item = questions[index];
  $('qNum').textContent = `Question ${index + 1} of ${questions.length}`;
  $('qText').textContent = item.q; $('result').textContent = ''; $('again').hidden = true;
  $('opts').replaceChildren(...item.o.map((text, n) => {
    const b = document.createElement('button'); b.className = 'btn alt'; b.textContent = text;
    b.addEventListener('click', () => pick(n)); return b;
  }));
}
function pick(n) {
  if (n === questions[index].a) score++;
  index++;
  index < questions.length ? show() : finish();
}
function finish() {
  $('qNum').textContent = 'Quiz complete'; $('qText').textContent = `You scored ${score} out of ${questions.length}`;
  $('opts').replaceChildren(); $('result').textContent = score >= 4 ? 'Excellent work!' : 'Good effort. Try again!'; $('again').hidden = false;
}
$('again').addEventListener('click', () => { index = 0; score = 0; show(); });
show();
