/* =========================================================
   Arham & Shabih — Walima | Interactions
   ========================================================= */
(() => {
  const EVENT = {
    title: 'Walima Ceremony — Arham Adil Rizvi & Shabih Zehra',
    location: 'Akacia Banquet, Main Shahrah-e-Faisal, beside Embassy Inn (SMCHS), Karachi',
    // 16 Jan 2027, 12:00 PM Pakistan Time (UTC+5) = 07:00 UTC
    start: new Date('2027-01-16T12:00:00+05:00'),
    end:   new Date('2027-01-16T16:00:00+05:00'),
  };

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Split names into letters ---------- */
  $$('.split').forEach((el, i) => {
    const txt = el.textContent;
    el.textContent = '';
    [...txt].forEach((c, j) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = c;
      s.style.animationDelay = `${1 + i * 0.5 + j * 0.08}s`;
      el.appendChild(s);
    });
  });

  /* ---------- Intro doors ---------- */
  const intro = $('#intro');
  $('#openBtn').addEventListener('click', () => {
    intro.classList.add('open');
    setTimeout(() => {
      document.body.classList.remove('locked');
      document.body.classList.add('ready');
      $('#nav').classList.add('show');
    }, 700);
    setTimeout(() => intro.classList.add('gone'), 2000);
  });

  /* ---------- Particles (white dust) ---------- */
  const cvs = $('#particles');
  const ctx = cvs.getContext('2d');
  let W, H, parts = [];
  const resize = () => {
    W = cvs.width = innerWidth * devicePixelRatio;
    H = cvs.height = innerHeight * devicePixelRatio;
    cvs.style.width = innerWidth + 'px';
    cvs.style.height = innerHeight + 'px';
    const n = Math.min(90, Math.floor(innerWidth / 14));
    parts = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: (Math.random() * 1.6 + .3) * devicePixelRatio,
      vx: (Math.random() - .5) * .25, vy: -(Math.random() * .35 + .08),
      a: Math.random() * .6 + .15, t: Math.random() * Math.PI * 2,
    }));
  };
  resize();
  addEventListener('resize', resize);
  (function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy; p.t += .02;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.a * (.6 + .4 * Math.sin(p.t))})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  })();

  /* ---------- Custom cursor ---------- */
  const dot = $('.cursor-dot'), ring = $('.cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;
  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`; });
  (function follow() {
    rx += (mx - rx) * .15; ry += (my - ry) * .15;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(follow);
  })();
  $$('a, button, .person-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });

  /* ---------- Scroll: progress, nav, to-top ---------- */
  const nav = $('#nav'), prog = $('#progress'), toTop = $('#toTop');
  addEventListener('scroll', () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (y / max) * 100 + '%';
    nav.classList.toggle('scrolled', y > 60);
    toTop.classList.toggle('show', y > 600);
  }, { passive: true });
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: .18, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.12}s`;
    io.observe(el);
  });

  /* ---------- 3D tilt cards ---------- */
  $$('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transition = 'transform .1s';
      card.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform .8s cubic-bezier(.22,1,.36,1)';
      card.style.transform = '';
    });
  });

  /* ---------- Countdown ---------- */
  const els = { d: $('#d'), h: $('#h'), m: $('#m'), s: $('#s') };
  const pad = n => String(n).padStart(2, '0');
  const set = (el, v) => { if (el.textContent !== v) { el.textContent = v; el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick'); } };
  function tick() {
    let diff = EVENT.start - new Date();
    if (diff <= 0) {
      Object.values(els).forEach(e => e.textContent = '00');
      $('#timerNote').textContent = diff > -(4 * 3600e3)
        ? 'The celebration is happening now — Alhamdulillah!'
        : 'Alhamdulillah — thank you for celebrating with us.';
      return;
    }
    const d = Math.floor(diff / 864e5); diff %= 864e5;
    const h = Math.floor(diff / 36e5);  diff %= 36e5;
    const m = Math.floor(diff / 6e4);   diff %= 6e4;
    const s = Math.floor(diff / 1e3);
    set(els.d, pad(d)); set(els.h, pad(h)); set(els.m, pad(m)); set(els.s, pad(s));
  }
  tick(); setInterval(tick, 1000);

  /* ---------- Toast ---------- */
  const toast = msg => {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2600);
  };

  /* ---------- Add to calendar (.ics) ---------- */
  const fmt = d => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  $('#calBtn').addEventListener('click', () => {
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ArhamShabih//Walima//EN', 'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:walima-arham-shabih-20270116@invite`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(EVENT.start)}`,
      `DTEND:${fmt(EVENT.end)}`,
      `SUMMARY:${EVENT.title}`,
      `LOCATION:${EVENT.location.replace(/,/g, '\\,')}`,
      'DESCRIPTION:You are cordially invited to the Walima ceremony of Arham Adil Rizvi & Shabih Zehra.',
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:Walima tomorrow', 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: 'Walima-Arham-Shabih.ics' });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Calendar event downloaded');
  });

  /* ---------- Share ---------- */
  $('#shareBtn').addEventListener('click', async () => {
    const data = {
      title: 'Walima — Arham & Shabih',
      text: 'You are invited to the Walima ceremony of Arham Adil Rizvi & Shabih Zehra — Saturday, 16 January 2027, 12 Noon at Akacia Banquet, Karachi.',
      url: location.href,
    };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(`${data.text}\n${data.url}`); toast('Link copied'); }
    } catch (_) { /* cancelled */ }
  });
})();
