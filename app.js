//---------------------------------------------------------------------------------------------------------------------------------------------------------Tema: stare inițială (salvată sau preferința sistemului)
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');
const systemLight = matchMedia('(prefers-color-scheme: light)').matches;
applyTheme(savedTheme || (systemLight ? 'light' : 'dark'));

function applyTheme(theme){
  root.dataset.theme = theme;                // --------------------------------------------------------------------------------------------------------------------------------------html[data-theme="light|dark"]
  localStorage.setItem('theme', theme);
  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------marchează opțiunea curentă în dropdown
  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.classList.toggle('active', item.dataset.theme === theme);
  });
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------iconiță pe buton
  const tBtn = document.getElementById('themeMenuBtn');
  if (tBtn) tBtn.textContent = (theme === 'light' ? '🌞' : '🌙') + ' ▾';
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------Dropdown: deschidere/închidere și selectare
const themeMenuBtn = document.getElementById('themeMenuBtn');
const themeDropdown = document.getElementById('themeDropdown');

function openMenu(open){
  themeDropdown.classList.toggle('open', open);
  themeMenuBtn.setAttribute('aria-expanded', String(open));
}

themeMenuBtn.addEventListener('click', (e)=>{
  e.stopPropagation();
  openMenu(!themeDropdown.classList.contains('open'));
});

themeDropdown.addEventListener('click', (e)=>{
  const target = e.target.closest('.dropdown-item');
  if (!target) return;
  applyTheme(target.dataset.theme);
  openMenu(false);
});

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------închide când dai click pe-afară sau Escape
document.addEventListener('click', (e)=>{
  if (!themeDropdown.contains(e.target) && e.target !== themeMenuBtn) openMenu(false);
});
document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') openMenu(false); });

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------Tabs: Proiecte
(function () {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');
  const tablist = document.querySelector('.tabs');

  if (!tabs.length || !panels.length || !tablist) return;

  function activateTab(tab) {
    tabs.forEach(t => {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });
    panels.forEach(p => {
      p.hidden = true;
      p.classList.remove('is-active');
    });

    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');
    tab.removeAttribute('tabindex');

    const id = tab.getAttribute('aria-controls');
    const panel = document.getElementById(id);
    if (panel) {
      panel.hidden = false;
      panel.classList.add('is-active');
    }
  }

  //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------click
  tabs.forEach(tab => tab.addEventListener('click', () => activateTab(tab)));

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------taste stânga/dreapta
  tablist.addEventListener('keydown', e => {
    const idx = Array.from(tabs).findIndex(t => t.classList.contains('is-active'));
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = tabs[(idx + 1) % tabs.length];
      next.focus(); activateTab(next);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
      prev.focus(); activateTab(prev);
    }
  });

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------inițial
  activateTab(document.querySelector('.tab.is-active') || tabs[0]);
})();

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------Quote Generator pentru Proiectul 2
const quotes = [
  "Promit că mai scriu doar o linie… și apoi vin încă 20.",
  "Când totul merge perfect, probabil am uitat să salvez fișierul.",
  "Bug-urile sunt ca pisicile: apar de nicăieri și refuză să plece.",
  "Ctrl+Z este modul meu preferat de a-mi cere scuze codului.",
  "Scriu comentarii ca să înțeleg ce-am făcut, nu ca să ajut pe altcineva.",
  "Debugger-ul e prietenul care îți spune sincer că tu ești problema.",
  "Uneori cred că editorul meu mă judecă în tăcere pentru ce scriu.",
  "Dacă merge, nu atinge. Dacă nu merge, nici atunci nu atinge… încă.",
];

const quoteBtn = document.getElementById('quoteBtn');
const quoteText = document.getElementById('quoteText');

if (quoteBtn && quoteText) {
  quoteBtn.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteText.textContent = quotes[randomIndex];
  });
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------Cronometru (Proiect 3)
(() => {
  const display = document.getElementById('tDisplay');
  const minutesInput = document.getElementById('tMinutes');
  const btnStart = document.getElementById('tStart');
  const btnPause = document.getElementById('tPause');
  const btnReset = document.getElementById('tReset');
  const presetsWrap = document.querySelector('.timer-presets');
  const msg = document.getElementById('tMsg');

  if (!display || !minutesInput || !btnStart || !btnPause || !btnReset) return;

  let timerId = null;
  let remaining = (+minutesInput.value || 25) * 60;
  let running = false;
  let savedTitle = document.title;

  function format(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
  function render() {
    display.textContent = format(remaining);
    if (running) document.title = `⏱ ${format(remaining)} | ${savedTitle}`;
  }
  function tick() {
    remaining--;
    if (remaining <= 0) {
      stopTimer();
      remaining = 0;
      render();
      msg.textContent = "Timpul a expirat. Pauză scurtă, apoi iar la luptă.";
      try { new AudioContext().resume(); } catch {}
    } else {
      render();
    }
  }
  function startTimer() {
    if (running) return;
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------setează din input la fiecare start
    remaining = Math.max(1, Math.min(180, +minutesInput.value || 25)) * 60;
    running = true;
    msg.textContent = "Cronometru pornit.";
    savedTitle = savedTitle || document.title;
    document.title = `⏱ ${format(remaining)} | ${savedTitle}`;
    timerId = setInterval(tick, 1000);
  }
  function pauseTimer() {
    if (!running) return;
    running = false;
    clearInterval(timerId);
    msg.textContent = "Pauză. Respiră. Sau fă că lucrezi.";
    document.title = savedTitle;
  }
  function stopTimer() {
    running = false;
    clearInterval(timerId);
    document.title = savedTitle;
  }
  function resetTimer() {
    stopTimer();
    remaining = Math.max(1, Math.min(180, +minutesInput.value || 25)) * 60;
    render();
    msg.textContent = "Reset complet.";
  }

  btnStart.addEventListener('click', startTimer);
  btnPause.addEventListener('click', pauseTimer);
  btnReset.addEventListener('click', resetTimer);

  presetsWrap?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-min]');
    if (!btn) return;
    minutesInput.value = btn.dataset.min;
    resetTimer();
  });

  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------inițial
  render();
})();
