/* ============================================
   OS Compare — Kioshi Iquegami Neto · SI 1ºB
   ============================================ */

/* ---------- SCROLL PROGRESS ---------- */
const scrollProgress = document.getElementById("scrollProgress");
window.addEventListener("scroll", () => {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  if (scrollProgress) scrollProgress.style.width = pct + "%";
});

/* ---------- THEME TOGGLE ---------- */
const themeBtn = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme") || "dark";
if (savedTheme === "light") document.documentElement.setAttribute("data-theme", "light");
if (themeBtn) {
  themeBtn.textContent = savedTheme === "light" ? "☀️" : "🌙";
  themeBtn.addEventListener("click", () => {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    if (isLight) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "dark");
      themeBtn.textContent = "🌙";
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      themeBtn.textContent = "☀️";
    }
  });
}

/* ---------- MENU MOBILE ---------- */
const menuBtn = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");
if (menuBtn) menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
document.querySelectorAll(".nav-links a").forEach(a =>
  a.addEventListener("click", () => navLinks && navLinks.classList.remove("open"))
);

/* ---------- REVEAL ON SCROLL ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("is-visible");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/* ============================================
   SIMULADOR
   ============================================ */
const simQuestions = [
  { q: "Você joga muito no computador?", opts: [
    { t: "Sim, jogo bastante", s: { Windows: 3, Linux: 0, macOS: 0 } },
    { t: "Às vezes, jogos leves", s: { Windows: 2, Linux: 1, macOS: 1 } },
    { t: "Não, não jogo", s: { Windows: 0, Linux: 2, macOS: 2 } },
  ]},
  { q: "Você programa ou estuda tecnologia?", opts: [
    { t: "Sim, todo dia", s: { Linux: 3, macOS: 2, Windows: 1 } },
    { t: "Sim, mas pouco", s: { Linux: 2, macOS: 2, Windows: 2 } },
    { t: "Não", s: { Windows: 2, macOS: 2, Linux: 0 } },
  ]},
  { q: "O que você prefere?", opts: [
    { t: "Facilidade de uso", s: { Windows: 3, macOS: 3, Linux: 0 } },
    { t: "Personalização total", s: { Linux: 3, Windows: 0, macOS: 0 } },
    { t: "Os dois meio a meio", s: { Linux: 1, Windows: 2, macOS: 2 } },
  ]},
  { q: "Seu computador é antigo?", opts: [
    { t: "Sim, bem antigo", s: { Linux: 3, Windows: 0, macOS: 0 } },
    { t: "Médio", s: { Linux: 2, Windows: 2, macOS: 0 } },
    { t: "Novo / potente", s: { Windows: 2, macOS: 3, Linux: 2 } },
  ]},
  { q: "Você usa em ambiente empresarial?", opts: [
    { t: "Sim", s: { Windows: 3, macOS: 2, Linux: 1 } },
    { t: "Não, uso pessoal", s: { Linux: 2, Windows: 1, macOS: 2 } },
  ]},
  { q: "Curte mexer e modificar o sistema?", opts: [
    { t: "Adoro, é diversão", s: { Linux: 3, Windows: 0, macOS: 0 } },
    { t: "Um pouco", s: { Linux: 2, Windows: 1, macOS: 1 } },
    { t: "Não, prefiro pronto", s: { Windows: 2, macOS: 3, Linux: 0 } },
  ]},
  { q: "O que é prioridade pra você?", opts: [
    { t: "Desempenho e leveza", s: { Linux: 3, macOS: 1, Windows: 1 } },
    { t: "Compatibilidade", s: { Windows: 3, macOS: 1, Linux: 1 } },
    { t: "Segurança", s: { Linux: 2, macOS: 3, Windows: 1 } },
  ]},
];

const simInfo = {
  Linux: {
    title: "Linux (Ubuntu / Fedora / Mint)",
    desc: "Você combina com Linux! Sistema gratuito, leve, seguro e altamente personalizável.",
    pros: "Gratuito · Open source · Leve · Ótimo pra programação · Roda em PC antigo",
    cons: "Menos jogos nativos · Pode exigir aprendizado",
    perfil: "Curioso, fuçador, dev em formação ou alguém que valoriza liberdade.",
    color: "linear-gradient(135deg,#10b981,#22d3ee)"
  },
  Windows: {
    title: "Microsoft Windows",
    desc: "Você combina com Windows! Líder em compatibilidade, jogos e uso geral.",
    pros: "Compatível com tudo · Excelente pra jogos · Fácil de usar · Mercado corporativo",
    cons: "Pago · Pesado · Atualizações forçadas",
    perfil: "Gamer, usuário corporativo ou quem quer praticidade.",
    color: "linear-gradient(135deg,#0078D4,#60a5fa)"
  },
  macOS: {
    title: "Apple macOS",
    desc: "Você combina com macOS! UNIX-like, polido e perfeito para criativos.",
    pros: "Design refinado · Estável · Ótimo pra dev · Apple Silicon poderoso",
    cons: "Exclusivo Apple · Caro · Pouca customização",
    perfil: "Criativo, designer, dev que valoriza estética e fluidez.",
    color: "linear-gradient(135deg,#a78bfa,#f472b6)"
  }
};

let simIdx = 0;
const simAnswers = new Array(simQuestions.length).fill(null);
const simStepEl = document.getElementById("simStep");
const simProgEl = document.getElementById("simProgress");
const simCountEl = document.getElementById("simCount");
const simPrev = document.getElementById("simPrev");
const simNext = document.getElementById("simNext");
const simResultEl = document.getElementById("simResult");

function renderSim() {
  if (!simStepEl) return;
  const q = simQuestions[simIdx];
  simStepEl.innerHTML = `<h3>${q.q}</h3>
    <div class="sim-options">
      ${q.opts.map((o, i) => `<button class="sim-option ${simAnswers[simIdx] === i ? "selected" : ""}" data-i="${i}">${o.t}</button>`).join("")}
    </div>`;
  simStepEl.querySelectorAll(".sim-option").forEach(b => {
    b.addEventListener("click", () => {
      simAnswers[simIdx] = +b.dataset.i;
      renderSim();
    });
  });
  simProgEl.style.width = (((simIdx + 1) / simQuestions.length) * 100) + "%";
  simCountEl.textContent = `${simIdx + 1} / ${simQuestions.length}`;
  simNext.textContent = simIdx === simQuestions.length - 1 ? "Ver resultado ✨" : "Próxima →";
  simPrev.disabled = simIdx === 0;
  simPrev.style.opacity = simIdx === 0 ? .5 : 1;
}

function computeSim() {
  const scores = { Linux: 0, Windows: 0, macOS: 0 };
  simQuestions.forEach((q, i) => {
    const a = simAnswers[i];
    if (a == null) return;
    Object.entries(q.opts[a].s).forEach(([k, v]) => (scores[k] += v));
  });
  const total = Object.values(scores).reduce((s, v) => s + v, 0) || 1;
  const winner = Object.keys(scores).reduce((a, b) => (scores[a] >= scores[b] ? a : b));
  const info = simInfo[winner];
  simResultEl.innerHTML = `
    <h3>${info.title}</h3>
    <p>${info.desc}</p>
    <h4>Vantagens</h4><p>${info.pros}</p>
    <h4>Desvantagens</h4><p>${info.cons}</p>
    <h4>Perfil ideal</h4><p>${info.perfil}</p>
    <div class="affinity">
      <h4>Afinidade</h4>
      ${["Linux", "Windows", "macOS"].map(k => `
        <div class="bar">
          <span>${k}</span>
          <div class="track"><div class="fill" style="width:${Math.round((scores[k] / total) * 100)}%"></div></div>
          <b>${Math.round((scores[k] / total) * 100)}%</b>
        </div>`).join("")}
    </div>
    <div style="margin-top:1.2rem;text-align:center">
      <button class="btn btn-ghost" id="simRestart">Refazer o teste</button>
    </div>`;
  simResultEl.classList.remove("hidden");
  simStepEl.style.display = "none";
  document.querySelector(".sim-actions").style.display = "none";
  document.getElementById("simRestart").addEventListener("click", () => {
    simIdx = 0;
    simAnswers.fill(null);
    simResultEl.classList.add("hidden");
    simStepEl.style.display = "";
    document.querySelector(".sim-actions").style.display = "";
    renderSim();
  });
}

if (simStepEl) {
  simPrev.addEventListener("click", () => { if (simIdx > 0) { simIdx--; renderSim(); } });
  simNext.addEventListener("click", () => {
    if (simAnswers[simIdx] == null) { alert("Escolha uma opção pra continuar!"); return; }
    if (simIdx < simQuestions.length - 1) { simIdx++; renderSim(); }
    else computeSim();
  });
  renderSim();
}

/* ============================================
   COMPARADOR
   ============================================ */
const cmpData = {
  Linux:   { seguranca: 9, ram: 9, cpu: 9, compat: 7, facil: 6, person: 10, cor: "linear-gradient(135deg,#10b981,#0d9488)", tag: "Open Source" },
  Ubuntu:  { seguranca: 8, ram: 8, cpu: 8, compat: 7, facil: 8, person:  9, cor: "linear-gradient(135deg,#E95420,#f97316)", tag: "Distro Linux" },
  Windows: { seguranca: 7, ram: 5, cpu: 6, compat:10, facil: 9, person:  5, cor: "linear-gradient(135deg,#0078D4,#1d4ed8)", tag: "Proprietário" },
  macOS:   { seguranca: 9, ram: 6, cpu: 7, compat: 7, facil: 9, person:  4, cor: "linear-gradient(135deg,#52525b,#18181b)", tag: "Proprietário" },
  Fedora:  { seguranca: 9, ram: 7, cpu: 8, compat: 7, facil: 7, person:  9, cor: "linear-gradient(135deg,#294172,#3b82f6)", tag: "Distro Linux" },
};
const cmpLabels = [
  { k: "seguranca", l: "Segurança" },
  { k: "ram", l: "Eficiência RAM" },
  { k: "cpu", l: "Eficiência CPU" },
  { k: "compat", l: "Compatibilidade" },
  { k: "facil", l: "Facilidade" },
  { k: "person", l: "Personalização" },
];
const cmpA = document.getElementById("cmpA");
const cmpB = document.getElementById("cmpB");
const cmpCards = document.getElementById("cmpCards");

function fillSelect(sel, sel2) {
  if (!sel) return;
  Object.keys(cmpData).forEach(k => {
    sel.insertAdjacentHTML("beforeend", `<option ${k === sel2 ? "selected" : ""}>${k}</option>`);
  });
}
function renderCmp() {
  if (!cmpCards) return;
  const a = cmpA.value, b = cmpB.value;
  cmpCards.innerHTML = [a, b].map(name => {
    const d = cmpData[name];
    return `<div class="cmp-card">
      <div class="cmp-head" style="background:${d.cor}">
        <span>${d.tag}</span><b>${name}</b>
      </div>
      <div class="cmp-body">
        ${cmpLabels.map(l => `
          <div class="bar">
            <span>${l.l}</span>
            <div class="track"><div class="fill" style="width:0;background:${d.cor}" data-w="${d[l.k] * 10}"></div></div>
            <b>${d[l.k]}/10</b>
          </div>`).join("")}
      </div></div>`;
  }).join("");
  requestAnimationFrame(() => {
    cmpCards.querySelectorAll(".fill").forEach(f => f.style.width = f.dataset.w + "%");
  });
}
if (cmpA) {
  fillSelect(cmpA, "Linux");
  fillSelect(cmpB, "Windows");
  cmpA.addEventListener("change", renderCmp);
  cmpB.addEventListener("change", renderCmp);
  document.querySelectorAll(".cmp-presets .chip").forEach(c => {
    c.addEventListener("click", () => {
      cmpA.value = c.dataset.a;
      cmpB.value = c.dataset.b;
      renderCmp();
    });
  });
  renderCmp();
}

/* ============================================
   QUIZ
   ============================================ */
const quizQuestions = [
  { q: "Quem criou o kernel Linux em 1991?", o: ["Bill Gates", "Linus Torvalds", "Steve Jobs", "Richard Stallman"], c: 1 },
  { q: "Qual destes é um sistema operacional livre?", o: ["Windows 11", "macOS Sonoma", "Ubuntu", "Windows Server"], c: 2 },
  { q: "O macOS é baseado em qual sistema?", o: ["DOS", "UNIX", "Linux", "Plan 9"], c: 1 },
  { q: "Qual SO domina os servidores web do mundo?", o: ["Windows Server", "macOS Server", "Linux", "FreeDOS"], c: 2 },
  { q: "O que significa código-fonte aberto?", o: ["Software pago", "Software com código visível e modificável", "Software sem suporte", "Software só para empresas"], c: 1 },
  { q: "Qual destas é uma distribuição Linux para iniciantes?", o: ["Arch Linux", "Gentoo", "Linux Mint", "Kali Linux"], c: 2 },
  { q: "Qual empresa mantém o RHEL?", o: ["Canonical", "Red Hat", "SUSE", "Oracle"], c: 1 },
  { q: "100% dos supercomputadores do TOP500 rodam:", o: ["Windows", "macOS", "Linux", "BSD"], c: 2 },
];

let quizIdx = 0, quizScore = 0;
const quizStep = document.getElementById("quizStep");
const quizProgress = document.getElementById("quizProgress");
const quizScoreEl = document.getElementById("quizScore");

function renderQuiz() {
  if (!quizStep) return;
  if (quizIdx >= quizQuestions.length) {
    quizStep.innerHTML = `
      <h3 class="q-question">🎉 Você fez ${quizScore}/${quizQuestions.length}</h3>
      <p style="text-align:center;color:var(--muted);margin-bottom:1.5rem">
        ${quizScore === quizQuestions.length ? "Mandou bem demais! 🏆" : quizScore >= 5 ? "Boa! Você manja do assunto." : "Vale revisar os conteúdos do site. 😉"}
      </p>
      <div style="text-align:center"><button class="btn btn-primary" id="quizRestart">Refazer quiz</button></div>`;
    document.getElementById("quizRestart").addEventListener("click", () => {
      quizIdx = 0; quizScore = 0;
      quizScoreEl.textContent = "Pontuação: 0";
      renderQuiz();
    });
    quizProgress.style.width = "100%";
    return;
  }
  const q = quizQuestions[quizIdx];
  quizStep.innerHTML = `
    <div class="q-question">${quizIdx + 1}. ${q.q}</div>
    <div class="q-options">
      ${q.o.map((o, i) => `<button class="q-option" data-i="${i}">${o}</button>`).join("")}
    </div>`;
  quizProgress.style.width = ((quizIdx / quizQuestions.length) * 100) + "%";
  quizStep.querySelectorAll(".q-option").forEach(btn => {
    btn.addEventListener("click", () => {
      const chosen = +btn.dataset.i;
      const correct = q.c;
      quizStep.querySelectorAll(".q-option").forEach((b, i) => {
        b.disabled = true;
        if (i === correct) b.classList.add("correct");
        if (i === chosen && chosen !== correct) b.classList.add("wrong");
      });
      if (chosen === correct) quizScore++;
      quizScoreEl.textContent = `Pontuação: ${quizScore}`;
      setTimeout(() => { quizIdx++; renderQuiz(); }, 1100);
    });
  });
}
renderQuiz();

/* ============================================
   RADAR CHART (canvas puro)
   ============================================ */
const radar = document.getElementById("radar");
if (radar) {
  const ctx = radar.getContext("2d");
  const W = radar.width, H = radar.height;
  const cx = W / 2, cy = H / 2 + 10, R = 170;
  const axes = ["Leveza", "Segurança", "Compatibilidade", "Personalização", "Jogos", "Facilidade"];
  const data = {
    Linux:   { v: [9, 9, 7, 10, 5, 6], c: "#10b981" },
    Windows: { v: [5, 7,10,  5, 10, 9], c: "#0078D4" },
    macOS:   { v: [6, 9, 7,  4,  6, 9], c: "#a78bfa" },
  };
  function angle(i, n) { return (Math.PI * 2 * i) / n - Math.PI / 2; }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const n = axes.length;
    // grid
    ctx.strokeStyle = "rgba(255,255,255,.1)";
    ctx.lineWidth = 1;
    for (let level = 1; level <= 5; level++) {
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const a = angle(i, n);
        const r = (R * level) / 5;
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.stroke();
    }
    // axes lines + labels
    ctx.fillStyle = "#9aa3b8";
    ctx.font = "600 12px Inter, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (let i = 0; i < n; i++) {
      const a = angle(i, n);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      ctx.stroke();
      const lx = cx + Math.cos(a) * (R + 24);
      const ly = cy + Math.sin(a) * (R + 24);
      ctx.fillText(axes[i], lx, ly);
    }
    // datasets
    Object.values(data).forEach(d => {
      ctx.beginPath();
      d.v.forEach((v, i) => {
        const a = angle(i, n);
        const r = (R * v) / 10;
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = d.c + "33";
      ctx.fill();
      ctx.strokeStyle = d.c;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      d.v.forEach((v, i) => {
        const a = angle(i, n);
        const r = (R * v) / 10;
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = d.c;
        ctx.fill();
      });
    });
  }
  draw();
}

/* ============================================
   TERMINAL SIMULADO
   ============================================ */
const termOut = document.getElementById("termOut");
if (termOut) {
  const seq = [
    { cmd: "whoami", res: "kioshi" },
    { cmd: "uname -a", res: "Linux uni 6.5.0 #1 SMP x86_64 GNU/Linux" },
    { cmd: "lsb_release -d", res: "Description: Ubuntu 24.04 LTS" },
    { cmd: "free -h", res: "Mem total: 8Gi   used: 1.2Gi   free: 6.1Gi" },
    { cmd: "uptime", res: " 14:22:01 up 3 days,  4:12,  load average: 0.04, 0.06, 0.02" },
    { cmd: "ls /home/kioshi", res: "trabalho_so/  documentos/  scripts/" },
    { cmd: "cat trabalho_so/info.txt", res: "Kioshi Iquegami Neto · 1ºB · SI" },
    { cmd: "echo \"Liberdade > Tudo\"", res: "Liberdade > Tudo" },
  ];
  let i = 0;
  async function typeLine(text, cls) {
    return new Promise(res => {
      let k = 0;
      const span = document.createElement("span");
      span.className = cls;
      termOut.appendChild(span);
      const tick = setInterval(() => {
        span.textContent += text[k++] || "";
        if (k >= text.length) { clearInterval(tick); termOut.appendChild(document.createTextNode("\n")); res(); }
      }, 18);
    });
  }
  async function runSeq() {
    while (i < seq.length) {
      const s = seq[i++];
      await typeLine("kioshi@uni:~$ " + s.cmd, "cmd");
      await new Promise(r => setTimeout(r, 200));
      await typeLine(s.res, "res");
      await new Promise(r => setTimeout(r, 500));
    }
    termOut.innerHTML += `<span class="cmd">kioshi@uni:~$ </span><span style="animation:blink 1s infinite">▊</span>`;
  }
  // Inicia quando entrar na viewport
  const tIo = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { runSeq(); tIo.disconnect(); } });
  });
  tIo.observe(termOut);
}
