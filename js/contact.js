/* Contact form: validation, then delivery to Collins's inbox.
   - With EmailJS keys filled in below, messages are sent straight to his inbox from the page.
   - Until then, the form opens the visitor's email app with the message ready to send. */
const TO = 'c.inuwa3241@miva.edu.ng';
const EMAILJS = { service: 'YOUR_SERVICE_ID', template: 'YOUR_TEMPLATE_ID', key: 'YOUR_PUBLIC_KEY' };
const emailReady = !Object.values(EMAILJS).some(v => v.startsWith('YOUR_'));

const f = document.getElementById('contactForm'), status = document.getElementById('status'), sendBtn = document.getElementById('sendBtn');
const rules = {
  name: v => v.trim() !== '' || 'Name is required.',
  email: v => v.trim() === '' ? 'Email address is required.' : (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Enter a valid email, e.g. name@example.com.'),
  phone: v => v.trim() === '' ? 'Phone number is required.' : (/^\d+$/.test(v.trim()) || 'Phone number must contain digits only.'),
  message: v => v.trim() !== '' || 'Message is required.'
};
function check(field) {
  const res = rules[field.name](field.value), ok = res === true;
  field.classList.toggle('bad', !ok); field.setAttribute('aria-invalid', String(!ok));
  document.getElementById(field.name + 'Err').textContent = ok ? '' : res; return ok;
}
function say(text, fail) { status.textContent = text; status.classList.toggle('fail', !!fail); }
function mailtoLink(d) {
  const body = encodeURIComponent(`${d.message}\n\nFrom: ${d.name}\nPhone: ${d.phone}\nEmail: ${d.email}`);
  return `mailto:${TO}?subject=${encodeURIComponent('Portfolio message from ' + d.name)}&body=${body}`;
}
Object.keys(rules).forEach(n => f[n].addEventListener('blur', () => check(f[n])));

f.addEventListener('submit', async e => {
  e.preventDefault();
  const ok = Object.keys(rules).map(n => check(f[n])).every(Boolean);
  if (!ok) { say(''); f.querySelector('.bad').focus(); return; }
  if (f._honey.value) return; /* spam bots fill the hidden field */
  const d = { name: f.name.value.trim(), email: f.email.value.trim(), phone: f.phone.value.trim(), message: f.message.value.trim() };

  if (!emailReady) { /* simple mode: hand the message to the visitor's email app */
    say(`Thank you, ${d.name}! Your email app is opening with the message ready. Press Send to deliver it.`);
    location.href = mailtoLink(d); return;
  }
  sendBtn.disabled = true; sendBtn.textContent = 'Sending...'; say('');
  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service_id: EMAILJS.service, template_id: EMAILJS.template, user_id: EMAILJS.key,
        template_params: { from_name: d.name, reply_to: d.email, phone: d.phone, message: d.message } })
    });
    if (!res.ok) throw new Error(await res.text());
    say(`Thank you, ${d.name}! Your message was sent. I will reply to ${d.email}.`); f.reset();
  } catch (err) {
    const a = document.createElement('a'); a.href = mailtoLink(d); a.textContent = 'send it from your email app';
    say('Sorry, the message could not be sent right now. You can ', true); status.append(a, '.');
  } finally { sendBtn.disabled = false; sendBtn.textContent = 'Send message'; }
});

document.getElementById('copyBtn').addEventListener('click', async e => {
  try { await navigator.clipboard.writeText(TO); e.target.textContent = 'Copied!'; } catch { e.target.textContent = 'Press Ctrl+C'; }
  setTimeout(() => { e.target.textContent = 'Copy'; }, 1800);
});
const counter = document.getElementById('counter'), updateCount = () => { counter.textContent = `${f.message.value.length} / 500`; };
f.message.addEventListener('input', updateCount); f.addEventListener('reset', () => setTimeout(updateCount));
