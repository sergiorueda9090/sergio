/* ================================================================
   SERGIO RUEDA — PORTFOLIO  |  scripts.js
   Vanilla JS — no external dependencies
   ================================================================ */

'use strict';

/* ----------------------------------------------------------------
   1. NAVBAR — scroll effect + active link highlight
   ---------------------------------------------------------------- */
(function initNavbar() {
  const nav      = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('#navMenu .nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll effect — add .scrolled class
  function onScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Active link based on scroll position
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load

  // Smooth scroll + close mobile menu on nav link click.
  // IMPORTANT: only call preventDefault() when we actually find a target
  // section to scroll to. Otherwise (e.g. clicking "Home" while on a
  // sub-page where #home doesn't exist) the click would be silently
  // swallowed and the browser would not navigate anywhere.
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = nav.offsetHeight;
          const top    = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
        // If no target was found, fall through and let the browser
        // navigate normally (the link is probably "/#section" rendered
        // by the section_link template tag from a sub-page).
      }
      // Close Bootstrap mobile collapse on any nav-link click
      const collapse = document.getElementById('navMenu');
      if (collapse && collapse.classList.contains('show') && window.bootstrap) {
        const bsCollapse = bootstrap.Collapse.getInstance(collapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });
})();

/* ----------------------------------------------------------------
   2. SCROLL REVEAL — Intersection Observer
   ---------------------------------------------------------------- */
(function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => el.classList.add('revealed'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
})();

/* ----------------------------------------------------------------
   3. ANIMATED COUNTERS
   ---------------------------------------------------------------- */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const dur    = 1600; // ms
      const step   = Math.ceil(dur / target);
      let current  = 0;

      const timer = setInterval(() => {
        current += 1;
        el.textContent = current;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        }
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ----------------------------------------------------------------
   4. SKILL BARS ANIMATION
   ---------------------------------------------------------------- */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill[data-width]');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      // Small delay so CSS transition is visible
      setTimeout(() => {
        el.style.width = el.dataset.width + '%';
      }, 200);
      observer.unobserve(el);
    });
  }, { threshold: 0.3 });

  fills.forEach(el => observer.observe(el));
})();

/* ----------------------------------------------------------------
   5. PORTFOLIO CAROUSEL
   ---------------------------------------------------------------- */
(function initPortfolioCarousel() {
  const track     = document.getElementById('portfolioTrack');
  const prevBtn   = document.getElementById('portfolioPrev');
  const nextBtn   = document.getElementById('portfolioNext');
  const dotsWrap  = document.getElementById('portfolioDots');

  if (!track || !prevBtn || !nextBtn || !dotsWrap) return;

  const cards       = Array.from(track.children);
  const total       = cards.length;
  let current       = 0;

  // Determine cards visible based on viewport
  function getVisible() {
    if (window.innerWidth >= 992) return 3;
    if (window.innerWidth >= 576) return 2;
    return 1;
  }

  function maxIndex() {
    return Math.max(0, total - getVisible());
  }

  function getCardWidth() {
    return cards[0].getBoundingClientRect().width;
  }

  function getGap() {
    const style = window.getComputedStyle(track);
    return parseFloat(style.gap) || 24;
  }

  function goTo(index) {
    const mx = maxIndex();
    current  = Math.max(0, Math.min(index, mx));
    const offset = current * (getCardWidth() + getGap());
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
    updateArrows();
  }

  function updateArrows() {
    prevBtn.disabled = current === 0;
    prevBtn.style.opacity = current === 0 ? '.4' : '1';
    nextBtn.disabled = current >= maxIndex();
    nextBtn.style.opacity = current >= maxIndex() ? '.4' : '1';
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    const pages = maxIndex() + 1;
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = dotsWrap.querySelectorAll('.carousel-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Rebuild on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      current = Math.min(current, maxIndex());
      buildDots();
      goTo(current);
    }, 150);
  });

  // Touch / swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  });

  buildDots();
  goTo(0);
})();

/* ----------------------------------------------------------------
   6. TESTIMONIALS CAROUSEL (autoplay + dots)
   ---------------------------------------------------------------- */
(function initTestimonialsCarousel() {
  const track    = document.getElementById('testimonialsTrack');
  const prevBtn  = document.getElementById('testPrev');
  const nextBtn  = document.getElementById('testNext');
  const dotsWrap = document.getElementById('testDots');

  if (!track || !prevBtn || !nextBtn || !dotsWrap) return;

  const slides  = Array.from(track.children);
  const total   = slides.length;
  let current   = 0;
  let autoTimer = null;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Testimonial ' + (i + 1));
      dot.addEventListener('click', () => { goTo(i); resetAuto(); });
      dotsWrap.appendChild(dot);
    });
  }

  function updateDots() {
    dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  // Pause on hover
  const wrapper = track.closest('.testimonials-slider-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => clearInterval(autoTimer));
    wrapper.addEventListener('mouseleave', startAuto);
  }

  // Touch swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
  });

  buildDots();
  goTo(0);
  startAuto();
})();

/* ----------------------------------------------------------------
   7. BACK TO TOP BUTTON
   ---------------------------------------------------------------- */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ----------------------------------------------------------------
   8. LEAD CAPTURE FORM — sends to WhatsApp
   ---------------------------------------------------------------- */
(function initLeadForm() {
  const form = document.getElementById('leadForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name     = document.getElementById('leadName').value.trim();
    const business = document.getElementById('leadBusiness').value.trim();
    const phone    = document.getElementById('leadPhone').value.trim();
    const service  = document.getElementById('leadService').value;

    if (!name || !business || !phone || !service) return;

    const message =
      `Hi Sergio & Eder! I'm interested in your services.\n\n` +
      `*Name:* ${name}\n` +
      `*Business:* ${business}\n` +
      `*WhatsApp:* ${phone}\n` +
      `*Service:* ${service}\n\n` +
      `I'd like to schedule a free 15-minute consultation.`;

    const waURL = 'https://wa.me/573177742241?text=' + encodeURIComponent(message);
    window.open(waURL, '_blank');

    // Visual feedback
    const btn = form.querySelector('.lead-submit-btn');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="bi bi-check-lg me-2"></i>Sent!';
    btn.style.background = '#16a34a';

    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
})();

/* ----------------------------------------------------------------
   9. SMOOTH SCROLL for in-page anchor links (hero scroll hint etc.)
   ---------------------------------------------------------------- */
(function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href   = this.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const nav    = document.getElementById('mainNav');
      const offset = nav ? nav.offsetHeight : 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
