/* ===================================================
   OkWin India – script.js
   =================================================== */
'use strict';

/* ── Navbar scroll effect & active link ── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Scrolled class
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 90;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Mobile nav toggle ── */
(function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta');

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();

/* ── Smooth anchor scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Animated counter ── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  let started = false;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounters() {
    if (started) return;
    started = true;
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target, 10);
      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(easeOut(progress) * target);
        counter.textContent = value >= 1000
          ? (value / 1000).toFixed(value >= 100000 ? 0 : 0) + (value >= 100000 ? '' : '')
          : value;
        // Format large numbers
        if (target >= 1000) {
          const formatted = Math.floor(easeOut(progress) * target);
          counter.textContent = formatted >= 1000
            ? Math.floor(formatted / 1000) + 'K'
            : formatted;
        } else {
          counter.textContent = Math.floor(easeOut(progress) * target);
        }
        if (progress < 1) requestAnimationFrame(update);
        else counter.textContent = target >= 1000 ? Math.floor(target / 1000) + 'K' : target;
      }
      requestAnimationFrame(update);
    });
  }

  // Trigger when hero is visible
  const hero = document.querySelector('.hero-section');
  if (hero) {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { animateCounters(); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(hero);
  }
})();

/* ── Scroll reveal ── */
(function initReveal() {
  const targets = document.querySelectorAll(
    '.feature-card, .step-item, .login-step, .gift-card, .faq-item, .contact-item, .section-header'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => obs.observe(el));
})();

/* ── Stagger reveal on feature cards ── */
(function staggerCards() {
  const grids = document.querySelectorAll('.features-grid, .gift-cards-grid');
  grids.forEach(grid => {
    const cards = grid.querySelectorAll('.feature-card, .gift-card');
    cards.forEach((card, i) => {
      card.style.transitionDelay = (i * 80) + 'ms';
    });
  });
})();

/* ── FAQ accordion ── */
(function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      // Close all
      document.querySelectorAll('.faq-question').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });
      // Toggle current
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling.classList.add('open');
      }
    });
  });

  // Open first by default
  const first = document.querySelector('.faq-question');
  if (first) {
    first.setAttribute('aria-expanded', 'true');
    first.nextElementSibling.classList.add('open');
  }
})();

/* ── Copy invitation code ── */
(function initCopyCode() {
  const btn = document.getElementById('copyCode');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const code = '6682815057352';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(() => {
        btn.classList.add('copied');
        btn.textContent = '✅ Copied: ' + code;
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.textContent = '📋 Copy Code: ' + code;
        }, 2500);
      }).catch(() => fallbackCopy(code, btn));
    } else {
      fallbackCopy(code, btn);
    }
  });

  function fallbackCopy(text, btn) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      btn.classList.add('copied');
      btn.textContent = '✅ Copied: ' + text;
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.textContent = '📋 Copy Code: ' + text;
      }, 2500);
    } catch (err) {
      btn.textContent = '⚠️ Copy manually: ' + text;
    }
    document.body.removeChild(ta);
  }
})();

/* ── Contact form ── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const msgInput = document.getElementById('contactMessage');
  const submitBtn = document.getElementById('submitBtn');
  const successDiv = document.getElementById('formSuccess');

  function setError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  }
  function clearErrors() {
    ['nameError', 'emailError', 'msgError'].forEach(id => setError(id, ''));
  }

  function validate() {
    clearErrors();
    let valid = true;

    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      setError('nameError', 'Please enter your name (at least 2 characters).');
      valid = false;
    }

    const emailVal = emailInput.value.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
    const isMobile = /^[0-9]{10}$/.test(emailVal);
    if (!emailVal || (!isEmail && !isMobile)) {
      setError('emailError', 'Please enter a valid email address or 10-digit mobile number.');
      valid = false;
    }

    if (!msgInput.value.trim() || msgInput.value.trim().length < 10) {
      setError('msgError', 'Please enter your message (at least 10 characters).');
      valid = false;
    }

    return valid;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending… ⏳';

    // Simulate form submission (replace with real backend / EmailJS etc.)
    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message ✈️';
      successDiv.classList.add('show');
      successDiv.textContent = '✅ Message sent successfully! We will reply within 24 hours via email or Telegram.';
      setTimeout(() => {
        successDiv.classList.remove('show');
      }, 6000);
    }, 1600);
  });

  // Live validation on blur
  [nameInput, emailInput, msgInput].forEach(input => {
    input.addEventListener('blur', validate);
  });
})();

/* ── Floating CTA ── */
(function initFloatingCta() {
  const cta = document.getElementById('floatingCta');
  if (!cta) return;
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroHeight = document.querySelector('.hero-section')?.offsetHeight || 600;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    const pastHero = scrollY > heroHeight * 0.7;
    const nearBottom = scrollY > docHeight - 400;

    if (pastHero && !nearBottom) {
      cta.classList.add('show');
    } else {
      cta.classList.remove('show');
    }
    lastScroll = scrollY;
  }, { passive: true });
})();

/* ── Legal Modals ── */
(function initModals() {
  const overlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');
  const closeBtn = document.getElementById('modalClose');
  if (!overlay) return;

  const content = {
    privacy: {
      title: 'Privacy Policy',
      html: `
        <p>This website ("OkWin India Affiliate") is an independent affiliate promotional website. We respect your privacy and are committed to protecting your personal data.</p>
        <h3>Information We Collect</h3>
        <p>We may collect your name, email address, and mobile number when you submit our contact form. We do not collect payment information.</p>
        <h3>How We Use Your Information</h3>
        <p>Your contact information is used solely to respond to your enquiries about OkWin registration, login, or bonus queries. We do not sell your data to third parties.</p>
        <h3>Cookies</h3>
        <p>This site may use basic cookies for analytics and performance purposes only. No personal data is stored in cookies.</p>
        <h3>Third-Party Links</h3>
        <p>This site contains affiliate links to the OkWin platform (77okwin.com). We are not responsible for the privacy practices of the OkWin platform. Please review their privacy policy separately.</p>
        <h3>Contact</h3>
        <p>For privacy enquiries, email: sreenchees@gmail.com</p>
      `
    },
    terms: {
      title: 'Terms of Use',
      html: `
        <p>By accessing this website, you agree to the following terms and conditions.</p>
        <h3>Affiliate Disclosure</h3>
        <p>This is an independent affiliate promotional website for Ok Win Game. We earn a commission when new players register using our invitation link. All content is for informational and promotional purposes only.</p>
        <h3>Age Restriction</h3>
        <p>You must be 18 years or older to use OkWin or visit this promotional website. By using this site, you confirm you are of legal age.</p>
        <h3>Accuracy of Information</h3>
        <p>We strive to keep information about OkWin bonuses and registration accurate. However, terms and bonus amounts may change on the OkWin platform. Always verify the latest offers on the official OkWin website.</p>
        <h3>Responsible Gaming</h3>
        <p>Online gaming involves financial risk. Never gamble more than you can afford to lose. If you feel you have a gaming problem, seek professional help.</p>
        <h3>Jurisdiction</h3>
        <p>Online gaming laws vary. It is your responsibility to verify whether online gaming is legal in your state or region within India.</p>
      `
    },
    disclaimer: {
      title: 'Disclaimer',
      html: `
        <p><strong>Affiliate / Referral Promotion Website Disclaimer</strong></p>
        <p>OkWin India (this website) is an independent affiliate website and is NOT the official OkWin platform. We are not affiliated with, endorsed by, or officially connected to OkWin or its operators.</p>
        <h3>Financial Risk Warning</h3>
        <p>Online gaming and color prediction games involve real financial risk. Past results do not guarantee future winnings. You may lose the money you deposit. Only play with money you can afford to lose.</p>
        <h3>No Guarantees</h3>
        <p>We do not guarantee winnings on OkWin. The ₹300 welcome bonus is subject to OkWin's terms and conditions which may change at any time.</p>
        <h3>18+ Only</h3>
        <p>This website and the OkWin platform are strictly for adults aged 18 and above. We do not target minors.</p>
        <h3>Responsible Gaming</h3>
        <p>If you or someone you know has a gambling problem, please seek help from a qualified professional or call the National Problem Gambling Helpline.</p>
      `
    }
  };

  function openModal(type) {
    if (!content[type]) return;
    modalTitle.textContent = content[type].title;
    modalContent.innerHTML = content[type].html;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.getElementById('privacyLink')?.addEventListener('click', e => { e.preventDefault(); openModal('privacy'); });
  document.getElementById('termsLink')?.addEventListener('click', e => { e.preventDefault(); openModal('terms'); });
  document.getElementById('disclaimerLink')?.addEventListener('click', e => { e.preventDefault(); openModal('disclaimer'); });

  closeBtn?.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();

/* ── Lazy load images (if any added later) ── */
(function initLazyImages() {
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        obs.unobserve(img);
      }
    });
  });
  images.forEach(img => obs.observe(img));
})();

/* ── Bonus flow arrow direction (responsive) ── */
(function fixBflowArrows() {
  function update() {
    document.querySelectorAll('.bflow-arrow').forEach(el => {
      el.style.transform = window.innerWidth >= 640 ? 'none' : 'rotate(90deg)';
    });
  }
  update();
  window.addEventListener('resize', update);
})();

/* ── Add UTM params to all referral links (optional tracking) ── */
(function tagLinks() {
  document.querySelectorAll('a[href*="77okwin.com"]').forEach(link => {
    try {
      const url = new URL(link.href);
      if (!url.searchParams.has('utm_source')) {
        url.searchParams.set('utm_source', 'okwin-india-affiliate');
        url.searchParams.set('utm_medium', 'referral');
        link.href = url.toString();
      }
    } catch (e) { /* ignore */ }
  });
})();

/* ── Page load animation ── */
(function initPageLoad() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });
})();
