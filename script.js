/* =====================================================
   OkWin India — script.js
   Shared across all 5 pages
   ===================================================== */
'use strict';

/* ══════════════════════════════════════════════════
   1. PAGE LOAD FADE
══════════════════════════════════════════════════ */
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.45s ease';
window.addEventListener('load', () => { document.body.style.opacity = '1'; });

/* ══════════════════════════════════════════════════
   2. NAVBAR — scroll effect + active link highlight
══════════════════════════════════════════════════ */
(function initNavbar() {
  const nb    = document.querySelector('.navbar');
  const links = document.querySelectorAll('.nav-a');
  const secs  = document.querySelectorAll('section[id]');

  function onScroll() {
    if (!nb) return;
    nb.classList.toggle('scrolled', window.scrollY > 50);

    let cur = '';
    secs.forEach(s => {
      if (window.scrollY >= s.offsetTop - 90) cur = s.id;
    });
    links.forEach(l => {
      l.classList.remove('active');
      const href = l.getAttribute('href') || '';
      if (cur && href.includes(cur)) l.classList.add('active');
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ══════════════════════════════════════════════════
   3. MOBILE NAV TOGGLE
══════════════════════════════════════════════════ */
(function initMobileNav() {
  const tog  = document.getElementById('navTog');
  const menu = document.getElementById('navMenu');
  if (!tog || !menu) return;

  tog.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    tog.classList.toggle('open', isOpen);
    tog.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      tog.classList.remove('open');
      tog.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();

/* ══════════════════════════════════════════════════
   4. SMOOTH ANCHOR SCROLL
══════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ══════════════════════════════════════════════════
   5. ANIMATED COUNTERS
══════════════════════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  let started = false;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function runCounters() {
    if (started) return;
    started = true;
    counters.forEach(el => {
      const target   = parseInt(el.dataset.count, 10);
      const duration = 2200;
      const t0       = performance.now();

      function tick(now) {
        const progress = Math.min((now - t0) / duration, 1);
        const value    = Math.floor(easeOut(progress) * target);
        el.textContent = target >= 1000 ? Math.floor(value / 1000) + 'K' : value;
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target >= 1000 ? Math.floor(target / 1000) + 'K' : target;
        }
      }
      requestAnimationFrame(tick);
    });
  }

  const trigger = document.querySelector('.hero, .page-hero');
  if (trigger) {
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) runCounters();
    }, { threshold: 0.3 }).observe(trigger);
  } else {
    runCounters();
  }
})();

/* ══════════════════════════════════════════════════
   6. SCROLL REVEAL
══════════════════════════════════════════════════ */
(function initReveal() {
  const els = document.querySelectorAll(
    '.card, .step, .gift-card, .faq-item, .ci, .sec-hdr, .login-step, .tips-panel, .rev-item'
  );

  els.forEach((el, i) => {
    el.classList.add('rev');
    el.style.transitionDelay = (i % 7) * 70 + 'ms';
  });

  function check() {
    document.querySelectorAll('.rev').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 40) el.classList.add('vis');
    });
  }

  new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
  }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' }).observe(document.body);

  window.addEventListener('scroll', check, { passive: true });
  check();
})();

/* ══════════════════════════════════════════════════
   7. FAQ ACCORDION
══════════════════════════════════════════════════ */
(function initFAQ() {
  const questions = document.querySelectorAll('.faq-q');
  if (!questions.length) return;

  questions.forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      // Close all
      questions.forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });
      // Open clicked (if it was closed)
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling.classList.add('open');
      }
    });
  });

  // Open first by default
  if (questions[0]) {
    questions[0].setAttribute('aria-expanded', 'true');
    questions[0].nextElementSibling.classList.add('open');
  }
})();

/* ══════════════════════════════════════════════════
   8. COPY INVITATION CODE
══════════════════════════════════════════════════ */
(function initCopyBtns() {
  const CODE = '6682815057352';

  function copySuccess(btn, original) {
    btn.classList.add('copied');
    btn.textContent = '✅ Copied: ' + CODE;
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.textContent = original;
    }, 2600);
  }

  function fallbackCopy(text, btn, original) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      copySuccess(btn, original);
    } catch (err) {
      btn.textContent = '⚠️ Copy: ' + text;
    }
    document.body.removeChild(ta);
  }

  document.querySelectorAll('.copy-btn').forEach(btn => {
    const original = btn.textContent;
    btn.addEventListener('click', () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(CODE)
          .then(() => copySuccess(btn, original))
          .catch(() => fallbackCopy(CODE, btn, original));
      } else {
        fallbackCopy(CODE, btn, original);
      }
    });
  });
})();

/* ══════════════════════════════════════════════════
   9. CONTACT FORM
══════════════════════════════════════════════════ */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nm = document.getElementById('cName');
  const em = document.getElementById('cEmail');
  const ms = document.getElementById('cMsg');
  const sb = document.getElementById('cSubmit');
  const ok = document.getElementById('cOk');

  function setErr(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  }

  function clearErrors() {
    ['eN', 'eE', 'eM'].forEach(id => setErr(id, ''));
  }

  function validate() {
    clearErrors();
    let valid = true;

    if (!nm || !nm.value.trim() || nm.value.trim().length < 2) {
      setErr('eN', 'Please enter your full name (min 2 characters).');
      valid = false;
    }

    const ev = em ? em.value.trim() : '';
    const isEmail  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ev);
    const isMobile = /^[6-9][0-9]{9}$/.test(ev);
    if (!ev || (!isEmail && !isMobile)) {
      setErr('eE', 'Enter a valid email address or 10-digit Indian mobile number.');
      valid = false;
    }

    if (!ms || !ms.value.trim() || ms.value.trim().length < 10) {
      setErr('eM', 'Please enter a message (min 10 characters).');
      valid = false;
    }

    return valid;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;

    sb.disabled = true;
    sb.textContent = 'Sending… ⏳';

    // Simulate async send — replace with EmailJS / Formspree / backend
    setTimeout(() => {
      form.reset();
      sb.disabled = false;
      sb.textContent = 'Send Message ✈️';
      if (ok) {
        ok.classList.add('show');
        ok.textContent = '✅ Message sent successfully! We will reply within 24 hours via email or Telegram.';
        setTimeout(() => ok.classList.remove('show'), 7000);
      }
    }, 1800);
  });

  [nm, em, ms].forEach(input => {
    if (input) input.addEventListener('blur', validate);
  });
})();

/* ══════════════════════════════════════════════════
   10. FLOATING CTA
══════════════════════════════════════════════════ */
(function initFloatingCTA() {
  const fc = document.getElementById('floatCta');
  if (!fc) return;

  window.addEventListener('scroll', () => {
    const hero   = document.querySelector('.hero, .page-hero');
    const heroH  = hero ? hero.offsetHeight : 500;
    const docH   = document.documentElement.scrollHeight - window.innerHeight;
    const scrollY = window.scrollY;

    if (scrollY > heroH * 0.6 && scrollY < docH - 320) {
      fc.classList.add('show');
    } else {
      fc.classList.remove('show');
    }
  }, { passive: true });
})();

/* ══════════════════════════════════════════════════
   11. RESPONSIVE BONUS FLOW ARROWS
══════════════════════════════════════════════════ */
function fixArrows() {
  document.querySelectorAll('.barr').forEach(el => {
    el.style.transform = window.innerWidth >= 640 ? 'none' : 'rotate(90deg)';
  });
}
fixArrows();
window.addEventListener('resize', fixArrows);

/* ══════════════════════════════════════════════════
   12. UTM TAGGING ON REFERRAL LINKS
══════════════════════════════════════════════════ */
document.querySelectorAll('a[href*="77okwin.com"]').forEach(a => {
  try {
    const u = new URL(a.href);
    if (!u.searchParams.has('utm_source')) {
      u.searchParams.set('utm_source', 'okwin-ind-online');
      u.searchParams.set('utm_medium', 'affiliate');
      u.searchParams.set('utm_campaign', 'referral');
      a.href = u.toString();
    }
  } catch (e) { /* ignore */ }
});

/* ══════════════════════════════════════════════════
   13. LEGAL MODALS
       Privacy Policy · Terms of Use · Disclaimer
══════════════════════════════════════════════════ */
(function initLegalModals() {

  const overlay = document.getElementById('modalOv');
  if (!overlay) return;

  const mTitle  = document.getElementById('mTitle');
  const mBody   = document.getElementById('mBody');
  const mClose  = document.getElementById('mX');

  /* ── LEGAL CONTENT ── */
  const LEGAL = {

    /* ════════════════════════════════════════
       PRIVACY POLICY
    ════════════════════════════════════════ */
    privacy: {
      title: '🔒 Privacy Policy',
      html: `
        <p><strong>Effective Date:</strong> 1 January 2025 &nbsp;|&nbsp; <strong>Last Updated:</strong> 1 January 2025</p>
        <p>This Privacy Policy explains how <strong>OkWin India</strong> ("we", "us", "our") collects, uses, stores, and protects the personal information of visitors to <strong>okwin-ind.online</strong> ("the Website"). By using this Website you agree to the practices described in this policy.</p>

        <h3>1. Who We Are</h3>
        <p>OkWin India is an independent affiliate and referral promotional website. We are NOT the official OkWin / 77okwin.com platform. We promote OkWin Game to new players in India and earn referral commissions when players register using our invitation links.</p>

        <h3>2. Information We Collect</h3>
        <p>We collect only the minimum information necessary to operate this website:</p>
        <p><strong>a) Contact Form Data</strong> — When you submit our contact form, we collect your name, email address or mobile number, and your message. This information is used solely to respond to your query.</p>
        <p><strong>b) Analytics Data</strong> — We may use anonymous analytics tools (such as Google Analytics) to understand how visitors use the Website. This includes pages visited, time on site, and device type. No personally identifiable information is collected via analytics.</p>
        <p><strong>c) Cookies</strong> — The Website may use basic cookies for session management and analytics purposes. We do not use cookies to track personal identity. You can disable cookies in your browser settings without affecting access to this Website.</p>
        <p>We do <strong>NOT</strong> collect: credit card numbers, bank account details, Aadhaar numbers, PAN numbers, OkWin passwords, or any sensitive financial data.</p>

        <h3>3. How We Use Your Information</h3>
        <p>Your contact form information is used only to reply to your specific enquiry about OkWin registration, login, bonuses, or withdrawals. We do not use your information for marketing without consent. We do not sell, rent, or share your personal data with any third party for commercial purposes.</p>

        <h3>4. Data Retention</h3>
        <p>Contact form submissions are retained for a maximum of 90 days to allow follow-up on support queries and are then permanently deleted. Analytics data is retained in anonymised aggregate form only.</p>

        <h3>5. Third-Party Links & Services</h3>
        <p>This Website contains affiliate links to <strong>77okwin.com</strong>. When you click these links and visit OkWin, you are subject to OkWin's own Privacy Policy and Terms of Service. We are not responsible for OkWin's data practices. We recommend reviewing their privacy policy before registering.</p>
        <p>We may also link to Telegram (@Willian2500). Telegram's own privacy policy governs any data you share on their platform.</p>

        <h3>6. Data Security</h3>
        <p>We take reasonable technical and organisational measures to protect any information submitted through our contact form. However, no method of transmission over the internet is 100% secure. We cannot guarantee the absolute security of data transmitted to or from the Website.</p>

        <h3>7. Children's Privacy</h3>
        <p>This Website is strictly for adults aged <strong>18 years and above</strong>. We do not knowingly collect personal information from anyone under 18 years of age. If you believe a minor has submitted data through this Website, please contact us immediately for deletion.</p>

        <h3>8. Your Rights</h3>
        <p>Under applicable Indian data protection laws, you have the right to: request access to personal data we hold about you, request correction of inaccurate data, request deletion of your data, and withdraw consent for data processing at any time. To exercise any of these rights, contact us at <strong>sreenchees@gmail.com</strong>.</p>

        <h3>9. Changes to This Policy</h3>
        <p>We may update this Privacy Policy from time to time. The "Last Updated" date at the top of this page reflects the most recent revision. Continued use of the Website after changes constitutes acceptance of the revised policy.</p>

        <h3>10. Contact</h3>
        <p>For any privacy-related questions or requests, please contact:</p>
        <p>📧 Email: <strong>sreenchees@gmail.com</strong><br/>💬 Telegram: <strong>@Willian2500</strong><br/>🌐 Website: <strong>okwin-ind.online</strong></p>
      `
    },

    /* ════════════════════════════════════════
       TERMS OF USE
    ════════════════════════════════════════ */
    terms: {
      title: '📋 Terms of Use',
      html: `
        <p><strong>Effective Date:</strong> 1 January 2025 &nbsp;|&nbsp; <strong>Last Updated:</strong> 1 January 2025</p>
        <p>Please read these Terms of Use ("Terms") carefully before using the website <strong>okwin-ind.online</strong> operated by <strong>OkWin India</strong> ("we", "us", "our"). By accessing or using this Website, you agree to be bound by these Terms in full.</p>

        <h3>1. Nature of This Website</h3>
        <p>OkWin India is an <strong>independent affiliate and referral promotional website</strong>. We are not affiliated with, endorsed by, or officially connected to OkWin, 77okwin.com, or any of their operators, owners, or parent companies. All content on this Website is created independently for informational and promotional purposes only.</p>
        <p>This Website exists solely to guide new players in India through the OkWin registration and login process and to promote OkWin's welcome bonus offers via our referral/invitation link.</p>

        <h3>2. Affiliate Disclosure</h3>
        <p>We earn a referral commission when new players register on OkWin using our invitation link (Code: 6682815057352). This commission is paid by the OkWin platform and does not increase the cost to you in any way. All opinions and guidance on this Website are our own and are not influenced by commission payments.</p>

        <h3>3. Eligibility & Age Restriction</h3>
        <p>You must be <strong>18 years of age or older</strong> to access this Website or to use the OkWin platform. By accessing this Website, you confirm that you are at least 18 years old. We reserve the right to terminate access for anyone we reasonably believe to be underage.</p>
        <p>It is your responsibility to verify whether online gaming and color prediction activities are legal in your state, district, or region within India. We do not accept responsibility for users accessing OkWin from jurisdictions where such activities are prohibited.</p>

        <h3>4. Accuracy of Information</h3>
        <p>We make every effort to ensure that the information on this Website — including registration steps, login guides, and bonus amounts — is accurate and up to date. However, OkWin's platform terms, bonus amounts, and features may change at any time without notice. We cannot guarantee that all information reflects the current state of the OkWin platform.</p>
        <p>Always verify the latest bonus terms, wagering requirements, and withdrawal conditions directly on the official OkWin website at <strong>77okwin.com</strong>.</p>

        <h3>5. Prohibited Uses</h3>
        <p>You agree NOT to use this Website to: violate any applicable law or regulation; impersonate any person or entity; transmit harmful, offensive, or misleading content; attempt to gain unauthorised access to any systems; scrape or copy content for commercial use without permission; or engage in any activity that disrupts or damages the Website.</p>

        <h3>6. Intellectual Property</h3>
        <p>All original content on this Website — including text, guides, layout, and design — is the intellectual property of OkWin India. You may not reproduce, distribute, or commercially exploit any content without prior written permission. OkWin trademarks, logos, and brand names belong to their respective owners and are referenced here only for informational purposes.</p>

        <h3>7. Responsible Gaming</h3>
        <p>Online gaming and color prediction involve real financial risk. We strongly encourage responsible gaming. <strong>Never gamble more than you can afford to lose.</strong> Set daily, weekly, and monthly deposit limits. If gaming is affecting your financial wellbeing, relationships, or mental health, please seek professional help immediately.</p>
        <p>If you or someone you know has a gambling problem, contact a certified addiction counsellor or helpline in your area.</p>

        <h3>8. Limitation of Liability</h3>
        <p>To the fullest extent permitted by law, OkWin India shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from: your use of this Website; your use of the OkWin platform; financial losses on OkWin; reliance on information provided on this Website; or any technical errors or downtime on this Website.</p>
        <p>This Website is provided on an "as is" and "as available" basis without any warranty of any kind.</p>

        <h3>9. Links to Third-Party Websites</h3>
        <p>This Website contains links to 77okwin.com and other third-party sites. These links are provided for convenience only. We have no control over the content or practices of third-party websites and accept no responsibility for them. Accessing third-party sites is at your own risk.</p>

        <h3>10. Changes to Terms</h3>
        <p>We reserve the right to modify these Terms at any time. Changes will be indicated by an updated "Last Updated" date. Continued use of the Website after changes are posted constitutes your acceptance of the revised Terms.</p>

        <h3>11. Governing Law</h3>
        <p>These Terms are governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the jurisdiction of Indian courts.</p>

        <h3>12. Contact</h3>
        <p>For questions about these Terms, please contact:</p>
        <p>📧 Email: <strong>sreenchees@gmail.com</strong><br/>💬 Telegram: <strong>@Willian2500</strong></p>
      `
    },

    /* ════════════════════════════════════════
       DISCLAIMER
    ════════════════════════════════════════ */
    disclaimer: {
      title: '⚠️ Disclaimer',
      html: `
        <p><strong>Effective Date:</strong> 1 January 2025 &nbsp;|&nbsp; <strong>Last Updated:</strong> 1 January 2025</p>

        <h3>1. Independent Affiliate Website</h3>
        <p><strong>OkWin India (okwin-ind.online) is an independent affiliate and referral promotional website. We are NOT the official OkWin platform, NOT 77okwin.com, and NOT affiliated with or endorsed by OkWin's operators, owners, or partners in any official capacity.</strong></p>
        <p>The OkWin name, logo, and related trademarks are the property of their respective owners. We reference them here solely for informational and promotional purposes as permitted under affiliate marketing practices.</p>

        <h3>2. Financial Risk Warning</h3>
        <p>Online gaming, color prediction, and all related activities featured on the OkWin platform involve <strong>real financial risk</strong>. You may lose part or all of the money you deposit on OkWin. Past performance of color prediction results does not indicate or guarantee future outcomes.</p>
        <p>Do not deposit money on OkWin that you cannot afford to lose. Do not borrow money to fund online gaming. Do not chase losses by making larger bets. Financial decisions made on the OkWin platform are entirely your own responsibility.</p>

        <h3>3. No Guarantee of Winnings</h3>
        <p>Nothing on this Website constitutes a guarantee, promise, or representation that you will win money on OkWin. The ₹300 welcome bonus and all other bonuses described on this Website are promotional offers subject to OkWin's own terms and conditions, which may change at any time. We do not guarantee the availability, value, or terms of any bonus at any given time.</p>

        <h3>4. Information Accuracy</h3>
        <p>While we strive to keep all registration guides, login instructions, and bonus information accurate and up to date, we cannot guarantee that all content reflects the current state of the OkWin platform. OkWin may update their platform, change their registration process, modify bonus amounts, or alter withdrawal rules without notice.</p>
        <p>Always verify critical information directly on <strong>77okwin.com</strong> before making financial decisions.</p>

        <h3>5. Legal Compliance — Your Responsibility</h3>
        <p>Online gaming laws vary significantly across different states and regions in India. It is <strong>entirely your responsibility</strong> to determine whether accessing and using OkWin is legal in your state, district, or region. We do not provide legal advice. We are not responsible for any legal consequences arising from your use of the OkWin platform in jurisdictions where it may be restricted or prohibited.</p>
        <p>States where online gaming of skill and/or chance may be restricted include Andhra Pradesh, Telangana, Odisha, Assam, Nagaland, Sikkim, and others. Please verify local laws before participating.</p>

        <h3>6. Age Disclaimer</h3>
        <p>This Website and the OkWin platform are strictly for individuals <strong>18 years of age and above</strong>. If you are under 18, you must not access this Website or register on OkWin. We do not knowingly promote gambling services to minors.</p>

        <h3>7. Responsible Gaming Statement</h3>
        <p>We are committed to promoting responsible gaming. If you feel that gaming is negatively impacting your life — including your finances, relationships, work, or mental health — please stop playing immediately and seek help.</p>
        <p>Resources for problem gambling support in India include certified addiction counsellors, psychiatric consultation, and iCall (a psychological helpline by TISS): <strong>9152987821</strong>.</p>

        <h3>8. Affiliate Commission Disclosure</h3>
        <p>This Website earns referral commissions from the OkWin platform when new users register using our invitation link or code (<strong>6682815057352</strong>). This affiliate relationship does not influence the accuracy of our guides or the quality of our support. Commission is earned from the platform operator, not from users.</p>

        <h3>9. Technical Disclaimer</h3>
        <p>We are not responsible for any technical issues, downtime, payment failures, account suspensions, or data losses that occur on the OkWin platform. For platform-level technical support, contact OkWin directly through their official channels at 77okwin.com.</p>

        <h3>10. Contact Us</h3>
        <p>If you have any questions about this Disclaimer or wish to report an issue:</p>
        <p>📧 Email: <strong>sreenchees@gmail.com</strong><br/>💬 Telegram: <strong>@Willian2500</strong><br/>🌐 Website: <strong>okwin-ind.online</strong></p>
      `
    }

  }; // end LEGAL

  /* ── Modal open/close functions ── */
  function openModal(key) {
    if (!LEGAL[key] || !mTitle || !mBody) return;
    mTitle.textContent = LEGAL[key].title;
    mBody.innerHTML    = LEGAL[key].html;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Scroll modal content to top
    const box = overlay.querySelector('.modal-box');
    if (box) box.scrollTop = 0;
  }

  function closeModal() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ── Bind triggers ── */
  document.querySelectorAll('[data-modal]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      openModal(el.dataset.modal);
    });
  });

  /* ── Close button ── */
  if (mClose) mClose.addEventListener('click', closeModal);

  /* ── Click outside to close ── */
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });

  /* ── Escape key to close ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });

})(); // end initLegalModals
