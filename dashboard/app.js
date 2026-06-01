// =============================================
//  CyberThreat AI Dashboard — app.js
// =============================================

// ---- i18n: Translation Dictionaries ----
const TRANSLATIONS = {
  en: {
    'nav.overview': 'Overview',
    'nav.models': 'Models',
    'nav.demo': 'Live Demo',
    'nav.results': 'Results',
    'badge.qlora': 'QLoRA Fine-Tuned',
    'hero.tag': 'BDM Final Project — Melih Can KÖK / 258273001026',
    'hero.title1': 'SLM Fine-Tuning for',
    'hero.title2': 'Cyber Threat Classification',
    'hero.subtitle': 'Comparative analysis of four Small Language Models fine-tuned with QLoRA on the mrmoor/cyber-threat-intelligence dataset. Supervised by Dr. Ali Cetinkaya.',
    'hero.stat.models': 'Models Tested',
    'hero.stat.seeds': 'Seeds per Model',
    'hero.stat.method': 'Fine-Tuning Method',
    'hero.stat.acc': 'Best Accuracy (Gemma-2-2b)',
    'models.title': 'Tested Models',
    'models.subtitle': 'Four SLMs fine-tuned with 4-bit QLoRA across 3 random seeds each',
    'models.best': 'Best Model',
    'metric.acc': 'Accuracy',
    'demo.title': 'Live Classification Demo',
    'demo.subtitle': 'Enter a cyber threat intelligence text and see how the model classifies it',
    'demo.inputLabel': 'Cyber Threat Text',
    'demo.placeholder': 'Enter threat intelligence text here...\ne.g. A new ransomware variant targeting financial institutions has been detected, using AES-256 encryption.',
    'demo.samples': 'Quick samples:',
    'demo.classifyBtn': 'Classify Threat',
    'demo.resultLabel': 'Classification Result',
    'demo.resultPlaceholder': 'Result will appear here',
    'demo.confidence': 'Confidence Distribution',
    'demo.inferring': 'Running inference...',
    'results.title': 'Performance Results',
    'results.subtitle': 'Aggregated metrics across 3 seeds (mean ± std). Load your actual results below.',
    'results.drop': 'Drop your',
    'results.dropOr': 'here or',
    'results.browse': 'browse',
    'results.hint': 'Or use the demo data below',
    'results.loadDemo': 'Load Demo Results',
    'table.model': 'Model',
    'table.params': 'Params',
    'table.method': 'Method',
    'table.acc': 'Accuracy ↑',
    'table.train': 'Train (min) ↓',
    'table.inf': 'Inference (ms) ↓',
    'chart.acc': 'Accuracy Comparison',
    'chart.f1': 'Macro-F1 Comparison',
    'tips.title': 'Accuracy Improvement Strategies',
    'tips.subtitle': 'Evidence-based techniques to push performance higher',
    'tips.prio.high': 'High Impact',
    'tips.prio.medium': 'Medium Impact',
    'tips.prio.low': 'Low-Cost Quick Win',
    'tips.t1.title': 'Increase LoRA Rank',
    'tips.t1.desc': 'Upgrade from <code>r=8</code> to <code>r=16</code> or <code>r=32</code>. Higher rank = more learnable parameters = better task adaptation without much extra VRAM on an A100.',
    'tips.t2.title': 'Increase Epochs',
    'tips.t2.desc': 'Currently 3 epochs. Pushing to <strong>5–6 epochs</strong> with early stopping on <code>macro_f1</code> allows the model to converge more completely, especially for minority classes.',
    'tips.t3.title': 'Weighted Loss for Class Imbalance',
    'tips.t3.desc': 'The dominant-label approach creates class imbalance. A custom <code>Trainer</code> with <code>class_weight=\'balanced\'</code> from sklearn (computed from training labels) can significantly boost minority class F1.',
    'tips.t4.title': 'Extend Max Token Length',
    'tips.t4.desc': 'Current <code>max_len=128</code> may truncate cybersecurity reports. Increasing to <strong>256 or 512</strong> lets the model see full context, especially for long threat descriptions.',
    'tips.t5.title': 'Lower Learning Rate + Cosine Schedule',
    'tips.t5.desc': 'Try <code>lr=1e-4</code> instead of <code>2e-4</code> with a cosine annealing schedule. Prevents overshooting and helps fine models like Gemma-2 and Qwen stabilize.',
    'tips.t6.title': 'Add Secondary Dataset',
    'tips.t6.desc': 'Augment training with <code>AI4Sec/cti-bench</code> or <code>kasai/cti-reports</code> mapped to the same label space. More diverse cyber text improves generalization and cross-lingual transfer.',
    'tips.t7.title': 'Label Smoothing',
    'tips.t7.desc': 'Add <code>label_smoothing_factor=0.1</code> to <code>TrainingArguments</code>. Prevents overconfidence on noisy NER-derived labels at near-zero extra cost.',
    'tips.t8.title': 'Gradient Checkpointing',
    'tips.t8.desc': 'Enable <code>gradient_checkpointing=True</code> to free VRAM and allow larger batches, improving training throughput without hurting accuracy.',
  },
  tr: {
    'nav.overview': 'Genel Bakış',
    'nav.models': 'Modeller',
    'nav.demo': 'Canlı Demo',
    'nav.results': 'Sonuçlar',
    'badge.qlora': 'QLoRA İnce Ayar',
    'hero.tag': 'BDM Bitirme Projesi — Melih Can KÖK / 258273001026',
    'hero.title1': 'Siber Tehdit Sınıflandırması için',
    'hero.title2': 'SLM İnce Ayarı',
    'hero.subtitle': 'QLoRA ile dört Küçük Dil Modeli\'nin mrmoor/cyber-threat-intelligence veri kümesi üzerinde karşılaştırmalı analizi. Danışman: Dr. Ali Çetinkaya.',
    'hero.stat.models': 'Test Edilen Model',
    'hero.stat.seeds': 'Model Başına Tohum',
    'hero.stat.method': 'İnce Ayar Yöntemi',
    'hero.stat.acc': 'En İyi Doğruluk (Gemma-2-2b)',
    'models.title': 'Test Edilen Modeller',
    'models.subtitle': 'Her biri 3 farklı rastgele tohum ile 4-bit QLoRA ile ince ayar yapılan dört SLM',
    'models.best': 'En İyi Model',
    'metric.acc': 'Doğruluk',
    'demo.title': 'Canlı Sınıflandırma Demosu',
    'demo.subtitle': 'Bir siber tehdit metni girin ve modelin nasıl sınıflandırdığını görün',
    'demo.inputLabel': 'Siber Tehdit Metni',
    'demo.placeholder': 'Tehdit istihbarat metnini buraya girin...\nÖrn: Finansal kurumları hedef alan yeni bir fidye yazılımı tespit edildi.',
    'demo.samples': 'Hızlı örnekler:',
    'demo.classifyBtn': 'Tehdidi Sınıflandır',
    'demo.resultLabel': 'Sınıflandırma Sonucu',
    'demo.resultPlaceholder': 'Sonuç burada görünecek',
    'demo.confidence': 'Güven Dağılımı',
    'demo.inferring': 'Çıkarım yapılıyor...',
    'results.title': 'Performans Sonuçları',
    'results.subtitle': '3 tohum üzerinden toplanan metrikler (ortalama ± std). Gerçek sonuçlarınızı aşağıya yükleyin.',
    'results.drop': 'Dosyanızı sürükleyin',
    'results.dropOr': 'veya',
    'results.browse': 'gözat',
    'results.hint': 'Veya demo verisini kullanın',
    'results.loadDemo': 'Demo Sonuçlarını Yükle',
    'table.model': 'Model',
    'table.params': 'Parametre',
    'table.method': 'Yöntem',
    'table.acc': 'Doğruluk ↑',
    'table.train': 'Eğitim (dk) ↓',
    'table.inf': 'Çıkarım (ms) ↓',
    'chart.acc': 'Doğruluk Karşılaştırması',
    'chart.f1': 'Makro-F1 Karşılaştırması',
    'tips.title': 'Doğruluk İyileştirme Stratejileri',
    'tips.subtitle': 'Performansı artırmak için kanıta dayalı teknikler',
    'tips.prio.high': 'Yüksek Etki',
    'tips.prio.medium': 'Orta Etki',
    'tips.prio.low': 'Düşük Maliyetli Hızlı Kazanç',
    'tips.t1.title': 'LoRA Rank Değerini Artır',
    'tips.t1.desc': '<code>r=8</code>\'den <code>r=16</code> veya <code>r=32</code>\'ye yükseltin. Daha yüksek rank = daha fazla öğrenilebilir parametre = A100\'de çok fazla ekstra VRAM kullanmadan görev adaptasyonunu artırır.',
    'tips.t2.title': 'Epok Sayısını Artır',
    'tips.t2.desc': 'Şu anda 3 epok. <code>macro_f1</code> üzerinde erken durdurma (early stopping) ile <strong>5-6 epoka</strong> çıkarmak, özellikle azınlık sınıfları için modelin daha tam yakınsamasını sağlar.',
    'tips.t3.title': 'Sınıf Dengesizliği için Ağırlıklı Kayıp',
    'tips.t3.desc': 'Baskın etiket yaklaşımı sınıf dengesizliği yaratır. Sklearn\'den <code>class_weight=\'balanced\'</code> ile özel bir <code>Trainer</code> kullanmak, azınlık sınıflarının F1 skorunu önemli ölçüde artırabilir.',
    'tips.t4.title': 'Maksimum Token Uzunluğunu Artır',
    'tips.t4.desc': 'Mevcut <code>max_len=128</code> siber güvenlik raporlarını kesebilir. <strong>256 veya 512\'ye</strong> çıkarmak, modelin tam bağlamı görmesini sağlar.',
    'tips.t5.title': 'Düşük Öğrenme Oranı + Cosine Zamanlaması',
    'tips.t5.desc': 'Kosinüs tavlama (cosine annealing) ile <code>2e-4</code> yerine <code>lr=1e-4</code> deneyin. Aşımı (overshooting) önler ve Gemma-2 ile Qwen gibi modellerin dengelenmesine yardımcı olur.',
    'tips.t6.title': 'İkincil Veri Kümesi Ekle',
    'tips.t6.desc': 'Eğitimi <code>AI4Sec/cti-bench</code> veya <code>kasai/cti-reports</code> ile güçlendirin. Daha çeşitli siber metinler genellemeyi ve diller arası transferi geliştirir.',
    'tips.t7.title': 'Etiket Yumuşatma (Label Smoothing)',
    'tips.t7.desc': '<code>TrainingArguments</code> içine <code>label_smoothing_factor=0.1</code> ekleyin. Neredeyse sıfır ekstra maliyetle, gürültülü etiketlerde aşırı güveni (overconfidence) önler.',
    'tips.t8.title': 'Gradyan Kontrol Noktası',
    'tips.t8.desc': 'VRAM\'i boşaltmak ve daha büyük batch boyutlarına izin vermek için <code>gradient_checkpointing=True</code> yapın. Doğruluğu düşürmeden eğitim verimini artırır.',
  }
};

let currentLang = 'en';

function applyLang(lang) {
  currentLang = lang;
  const t = TRANSLATIONS[lang];
  document.documentElement.lang = lang;

  // Update all data-i18n text elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  // Toggle active class on EN/TR labels
  document.getElementById('lang-en').classList.toggle('active-lang', lang === 'en');
  document.getElementById('lang-tr').classList.toggle('active-lang', lang === 'tr');
}

// ---- Smooth language switch with fade transition ----
function switchLang(lang) {
  const main = document.querySelector('main');
  const header = document.querySelector('.header');
  main.classList.add('lang-fade-out');
  header.classList.add('lang-fade-out');
  setTimeout(() => {
    applyLang(lang);
    main.classList.remove('lang-fade-out');
    header.classList.remove('lang-fade-out');
    main.classList.add('lang-fade-in');
    header.classList.add('lang-fade-in');
    setTimeout(() => {
      main.classList.remove('lang-fade-in');
      header.classList.remove('lang-fade-in');
    }, 400);
  }, 250);
}

// ---- Smooth scroll helper ----
function smoothScrollTo(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  const HEADER_H = 72;
  const top = target.getBoundingClientRect().top + window.scrollY - HEADER_H;

  // Animate with requestAnimationFrame for maximum smoothness
  const start     = window.scrollY;
  const distance  = Math.max(0, top) - start;
  const duration  = Math.min(900, Math.max(400, Math.abs(distance) * 0.4)); // scale with distance
  let   startTime = null;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(ts) {
    if (!startTime) startTime = ts;
    const elapsed  = ts - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, start + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// ---- Event delegation: catch ALL anchor #hash clicks in the whole document ----
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  e.preventDefault();
  const targetId = link.getAttribute('href').slice(1); // strip the '#'
  smoothScrollTo(targetId);

  // Update active nav link
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const matchingNav = document.querySelector(`.nav-link[href="#${targetId}"]`);
  if (matchingNav) matchingNav.classList.add('active');
});

// Toggle button + initial lang
document.addEventListener('DOMContentLoaded', () => {
  applyLang('en');

  document.getElementById('lang-toggle').addEventListener('click', () => {
    switchLang(currentLang === 'en' ? 'tr' : 'en');
  });
});

// ---- Background particle canvas (Glowing Dot-Line Network) ----
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function () {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 2 + 1.5;
    
    const colors = [
      '250, 204, 21',  // Yellow
      '59, 130, 246',  // Blue
      '255, 255, 255'  // White
    ];
    const base = colors[Math.floor(Math.random() * colors.length)];
    const alpha = Math.random() * 0.5 + 0.3;
    
    this.color = `rgba(${base}, ${alpha})`;
    this.glowColor = `rgba(${base}, 0.15)`;
  };

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  };

  function init() {
    resize();
    particles = Array.from({ length: 100 }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    
    // Draw lines between close particles
    const lineDist = 150;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < lineDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          // Faint white/blue connection lines
          ctx.strokeStyle = `rgba(147, 197, 253, ${(1 - dist / lineDist) * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    
    // Draw dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      
      // Glow effect around dots
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = p.glowColor;
      ctx.fill();

      p.update();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();

// ---- Interactive Stat Cards ----
(function initInteractiveCards() {
  document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.stat-card').forEach(c => c.classList.remove('active-zoom'));
      card.classList.add('active-zoom');
    });
  });
})();

// ---- Nav active link on scroll ----
(function initNav() {
  const sections = ['overview', 'models', 'demo', 'results'];
  const links = {};
  sections.forEach(id => { links[id] = document.getElementById(`nav-${id}`); });

  window.addEventListener('scroll', () => {
    let current = 'overview';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 120) current = id;
    });
    Object.values(links).forEach(l => l && l.classList.remove('active'));
    if (links[current]) links[current].classList.add('active');
  });
})();

// ---- Real training results from LLM_V5.ipynb ----
const DEMO_RESULTS = [
  {
    model: 'SmolLM2-360M',  params: '205M', method: 'QLoRA',
    acc: '0.4545 ± 0.0295', macro_f1: '0.0601 ± 0.0180', weighted_f1: '0.3494 ± 0.0146',
    train_min: '14.1', inf_ms: '11.7',
    accNum: 0.4545, f1Num: 0.0601
  },
  {
    model: 'TinyLlama-1.1B', params: '551M', method: 'QLoRA',
    acc: '0.6752 ± 0.0079', macro_f1: '0.4381 ± 0.0343', weighted_f1: '0.6645 ± 0.0141',
    train_min: '25.9', inf_ms: '22.6',
    accNum: 0.6752, f1Num: 0.4381
  },
  {
    model: 'Qwen2.5-1.5B',  params: '889M', method: 'QLoRA',
    acc: '0.6866 ± 0.0185', macro_f1: '0.4724 ± 0.0195', weighted_f1: '0.6794 ± 0.0193',
    train_min: '33.2', inf_ms: '28.5',
    accNum: 0.6866, f1Num: 0.4724
  },
  {
    model: 'Gemma-2-2b',    params: '1603M', method: 'QLoRA',
    acc: '0.7012 ± 0.0044', macro_f1: '0.4798 ± 0.0637', weighted_f1: '0.6953 ± 0.0064',
    train_min: '48.4', inf_ms: '41.0',
    accNum: 0.7012, f1Num: 0.4798, best: true
  },
];

// ---- Model card metrics fill ----
function fillModelCards(data) {
  const map = {
    'SmolLM2-360M':  { accId: 'sm-acc', f1Id: 'sm-f1', barId: 'sm-bar' },
    'TinyLlama-1.1B':{ accId: 'tl-acc', f1Id: 'tl-f1', barId: 'tl-bar' },
    'Qwen2.5-1.5B':  { accId: 'qw-acc', f1Id: 'qw-f1', barId: 'qw-bar' },
    'Gemma-2-2b':    { accId: 'gm-acc', f1Id: 'gm-f1', barId: 'gm-bar' },
  };

  data.forEach(row => {
    const ids = map[row.model];
    if (!ids) return;
    const accEl  = document.getElementById(ids.accId);
    const f1El   = document.getElementById(ids.f1Id);
    const barEl  = document.getElementById(ids.barId);
    if (accEl) accEl.textContent = (row.accNum * 100).toFixed(1) + '%';
    if (f1El)  f1El.textContent  = row.f1Num.toFixed(4);
    if (barEl) {
      setTimeout(() => { barEl.style.width = (row.accNum * 100) + '%'; }, 400);
    }
  });
}

// ---- Results table ----
function renderResultsTable(data) {
  const tbody = document.getElementById('results-tbody');
  tbody.innerHTML = '';

  data.forEach(row => {
    const tr = document.createElement('tr');
    if (row.best) tr.className = 'best-row';
    tr.innerHTML = `
      <td>${row.model}${row.best ? ' ⭐' : ''}</td>
      <td>${row.params}</td>
      <td>${row.method}</td>
      <td style="color:${row.best ? '#34d399' : ''}">${row.acc}</td>
      <td>${row.macro_f1}</td>
      <td>${row.weighted_f1}</td>
      <td>${row.train_min}</td>
      <td>${row.inf_ms}</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('results-table-wrap').style.display = 'block';
  document.getElementById('chart-section').style.display = 'grid';
  renderCharts(data);
}

// ---- Charts (pure Canvas) ----
function renderCharts(data) {
  drawBarChart('acc-chart', data.map(d => ({ label: d.model.replace('-1.5B','').replace('-1.1B','').replace('-360M','').replace('-2b-it',''), value: d.accNum })), '#63b3ed', '#a78bfa');
  drawBarChart('f1-chart',  data.map(d => ({ label: d.model.replace('-1.5B','').replace('-1.1B','').replace('-360M','').replace('-2b-it',''), value: d.f1Num  })), '#34d399', '#059669');
}

function drawBarChart(canvasId, items, color1, color2) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 400;
  const H = canvas.offsetHeight || 220;
  canvas.width = W;
  canvas.height = H;

  const pad = { top: 20, right: 20, bottom: 50, left: 45 };
  const bw = (W - pad.left - pad.right) / items.length;
  const bPad = bw * 0.25;
  const maxVal = Math.max(...items.map(d => d.value));
  const chartH = H - pad.top - pad.bottom;

  ctx.clearRect(0, 0, W, H);

  // Y-axis gridlines
  [0.25, 0.5, 0.75, 1.0].forEach(frac => {
    const y = pad.top + chartH * (1 - frac * (maxVal <= 1 ? 1 : 1 / maxVal));
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(W - pad.right, y);
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText((frac * (maxVal <= 1 ? 1 : maxVal)).toFixed(2), pad.left - 6, y + 4);
  });

  items.forEach((item, i) => {
    const x = pad.left + bw * i + bPad;
    const bWidth = bw - bPad * 2;
    const bHeight = (item.value / (maxVal <= 1 ? 1 : maxVal)) * chartH;
    const y = pad.top + chartH - bHeight;

    // Gradient fill
    const grad = ctx.createLinearGradient(x, y, x, y + bHeight);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);

    ctx.beginPath();
    ctx.roundRect(x, y, bWidth, bHeight, 4);
    ctx.fillStyle = grad;
    ctx.fill();

    // Value label
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(item.value.toFixed(4), x + bWidth / 2, y - 6);

    // X label
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '10px Inter, sans-serif';
    ctx.save();
    ctx.translate(x + bWidth / 2, H - pad.bottom + 14);
    ctx.rotate(-0.45);
    ctx.fillText(item.label, 0, 0);
    ctx.restore();
  });
}

// ---- CSV Upload ----
document.getElementById('csv-upload').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (ev) {
    parseAndRenderCSV(ev.target.result);
  };
  reader.readAsText(file);
});

const uploadZone = document.getElementById('upload-zone');
uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('dragover'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = ev => parseAndRenderCSV(ev.target.result);
    reader.readAsText(file);
  }
});

function parseAndRenderCSV(text) {
  const rows = text.trim().split('\n');
  const headers = rows[0].split(',').map(h => h.trim());
  const data = rows.slice(1).map(row => {
    const cols = row.split(',').map(c => c.trim());
    const obj = {};
    headers.forEach((h, i) => obj[h] = cols[i]);
    obj.accNum = parseFloat(obj['Accuracy'] || obj['acc'] || '0');
    obj.f1Num  = parseFloat(obj['Macro-F1'] || obj['macro_f1'] || '0');
    obj.model  = obj['Model'] || obj['model'] || 'Unknown';
    obj.params = obj['Parameters'] || obj['params'] || '—';
    obj.method = obj['Fine-Tuning'] || obj['method'] || 'QLoRA';
    obj.acc    = obj['Accuracy'] || obj['acc'] || '—';
    obj.macro_f1 = obj['Macro-F1'] || obj['macro_f1'] || '—';
    obj.weighted_f1 = obj['Weighted-F1'] || obj['weighted_f1'] || '—';
    obj.train_min = obj['Train Time (min)'] || obj['train_min'] || '—';
    obj.inf_ms = obj['Inference (ms/smp)'] || obj['inf_ms'] || '—';
    return obj;
  });

  // Mark best
  const bestAcc = Math.max(...data.map(d => d.accNum));
  data.forEach(d => { if (d.accNum === bestAcc) d.best = true; });

  fillModelCards(data);
  renderResultsTable(data);
}

// ---- Load demo data ----
document.getElementById('load-demo-data').addEventListener('click', () => {
  fillModelCards(DEMO_RESULTS);
  renderResultsTable(DEMO_RESULTS);
});

// ---- Classification Demo ----
// Simulated label-set from the mrmoor dataset (typical cyber-threat labels)
const CYBER_LABELS = ['Malware', 'Vulnerability', 'Indicator', 'Threat-Actor', 'Campaign', 'Attack-Pattern', 'Tool', 'Course-of-Action'];

const LABEL_ICONS = {
  'Malware': '🦠',
  'Vulnerability': '🔓',
  'Indicator': '🔍',
  'Threat-Actor': '👾',
  'Campaign': '📡',
  'Attack-Pattern': '⚔️',
  'Tool': '🔧',
  'Course-of-Action': '🛡️',
};

// Keyword-based heuristic classifier (simulates fine-tuned model for demo)
function simulateClassify(text, modelKey) {
  const t = text.toLowerCase();
  const scores = {};

  const keywords = {
    'Malware':         ['ransomware', 'malware', 'virus', 'trojan', 'spyware', 'botnet', 'worm', 'fidye', 'yazılım'],
    'Vulnerability':   ['vulnerability', 'exploit', 'cve', 'zero-day', '0-day', 'patch', 'flaw', 'açık', 'zafiyet'],
    'Indicator':       ['indicator', 'ioc', 'hash', 'ip address', 'domain', 'url', 'c2', 'command and control'],
    'Threat-Actor':    ['threat actor', 'apt', 'group', 'nation-state', 'hacker', 'attacker', 'hackerlar', 'saldırgan'],
    'Campaign':        ['campaign', 'operation', 'attack wave', 'hedef aldı', 'targeting', 'phishing'],
    'Attack-Pattern':  ['ddos', 'brute force', 'sql injection', 'xss', 'lateral movement', 'privilege escalation', 'oltalama'],
    'Tool':            ['tool', 'framework', 'cobalt strike', 'mimikatz', 'metasploit', 'powershell', 'script'],
    'Course-of-Action':['mitigation', 'patch', 'update', 'remediation', 'detection', 'block', 'önlem'],
  };

  CYBER_LABELS.forEach(label => {
    let score = Math.random() * 0.1; // base noise
    (keywords[label] || []).forEach(kw => {
      if (t.includes(kw)) score += 0.25 + Math.random() * 0.15;
    });
    scores[label] = score;
  });

  // Model quality modifiers (Gemma is best at 70.1%)
  const qualityMod = { gemma: 1.0, qwen: 0.97, tinyllama: 0.92, smollm2: 0.88 };
  const mod = qualityMod[modelKey] || 0.9;

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const probs = {};
  CYBER_LABELS.forEach(l => probs[l] = (scores[l] / total) * mod + (1 - mod) / CYBER_LABELS.length);

  // Normalize
  const sum2 = Object.values(probs).reduce((a, b) => a + b, 0);
  CYBER_LABELS.forEach(l => probs[l] /= sum2);

  const predictedLabel = CYBER_LABELS.reduce((a, b) => probs[a] > probs[b] ? a : b);
  return { predicted: predictedLabel, probs };
}

const classifyBtn = document.getElementById('classify-btn');
const resultBox = document.getElementById('result-box');
const confSection = document.getElementById('confidence-section');
const confBars = document.getElementById('confidence-bars');

classifyBtn.addEventListener('click', async () => {
  const text = document.getElementById('threat-input').value.trim();
  if (!text) {
    document.getElementById('threat-input').focus();
    return;
  }

  const modelKey = document.getElementById('model-select').value;
  const modelNames = { qwen: 'Qwen2.5-1.5B', gemma: 'Gemma-2-2b', tinyllama: 'TinyLlama-1.1B', smollm2: 'SmolLM2-360M' };

  // Loading state
  classifyBtn.classList.add('loading');
  classifyBtn.innerHTML = '<span class="spinner"></span> Classifying...';
  resultBox.innerHTML = '<div class="result-placeholder"><span class="spinner" style="width:28px;height:28px;border-width:3px;margin:0 auto;display:block;"></span><p style="margin-top:0.75rem;color:#718096;">Running inference...</p></div>';
  confSection.style.display = 'none';

  // Simulated inference delay
  await new Promise(r => setTimeout(r, 900 + Math.random() * 600));

  const result = simulateClassify(text, modelKey);
  const icon = LABEL_ICONS[result.predicted] || '🔍';
  const infMs = (4 + Math.random() * 8).toFixed(1);
  const confidence = (result.probs[result.predicted] * 100).toFixed(1);

  resultBox.innerHTML = `
    <div class="result-content">
      <div class="result-label-badge">
        ${result.predicted}
      </div>
      <div class="result-details">
        <div class="result-detail-item">Confidence: <span>${confidence}%</span></div>
        <div class="result-detail-item">Model: <span>${modelNames[modelKey]}</span></div>
        <div class="result-detail-item">Inference: <span>~${infMs}ms</span></div>
      </div>
    </div>
  `;

  // Confidence bars — top 5 sorted
  confSection.style.display = 'block';
  const sorted = CYBER_LABELS
    .map(l => ({ label: l, prob: result.probs[l] }))
    .sort((a, b) => b.prob - a.prob)
    .slice(0, 5);

  confBars.innerHTML = sorted.map((item, idx) => `
    <div class="conf-row">
      <span class="conf-label">${item.label}</span>
      <div class="conf-bar-wrap">
        <div class="conf-bar-fill ${idx === 0 ? 'top-pred' : ''}" id="cbar-${idx}" style="width:0%"></div>
      </div>
      <span class="conf-pct">${(item.prob * 100).toFixed(1)}%</span>
    </div>
  `).join('');

  // Animate bars
  sorted.forEach((item, idx) => {
    setTimeout(() => {
      const el = document.getElementById(`cbar-${idx}`);
      if (el) el.style.width = (item.prob * 100) + '%';
    }, 50 + idx * 80);
  });

  // Reset button
  classifyBtn.classList.remove('loading');
  classifyBtn.innerHTML = 'Classify Threat';
});

// ---- Quick Sample Buttons ----
document.querySelectorAll('.sample-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('threat-input').value = btn.dataset.text;
  });
});

// ---- Intersection Observer for animations ----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.model-card, .tip-card, .chart-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ---- Auto-load demo on page load ----
window.addEventListener('load', () => {
  fillModelCards(DEMO_RESULTS);
});
