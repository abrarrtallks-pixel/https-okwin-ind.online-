/* ===================================================
   OkWin India – script.js  (shared across all pages)
   =================================================== */
'use strict';

/* ── Page load fade ── */
document.body.style.opacity='0';
document.body.style.transition='opacity .4s ease';
window.addEventListener('load',()=>{document.body.style.opacity='1'});

/* ── Navbar scroll + active link ── */
(function(){
  const nb=document.querySelector('.navbar');
  const links=document.querySelectorAll('.nav-a');
  const secs=document.querySelectorAll('section[id]');
  function onScroll(){
    nb&&(window.scrollY>50?nb.classList.add('scrolled'):nb.classList.remove('scrolled'));
    let cur='';
    secs.forEach(s=>{if(window.scrollY>=s.offsetTop-90)cur=s.id});
    links.forEach(l=>{
      l.classList.remove('active');
      if(l.getAttribute('href').includes(cur)&&cur)l.classList.add('active');
    });
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();
})();

/* ── Mobile nav ── */
(function(){
  const tog=document.getElementById('navTog');
  const menu=document.getElementById('navMenu');
  if(!tog||!menu)return;
  tog.addEventListener('click',()=>{
    const o=menu.classList.toggle('open');
    tog.classList.toggle('open',o);
    tog.setAttribute('aria-expanded',o);
    document.body.style.overflow=o?'hidden':'';
  });
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    menu.classList.remove('open');tog.classList.remove('open');
    tog.setAttribute('aria-expanded','false');document.body.style.overflow='';
  }));
})();

/* ── Smooth scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',function(e){
    const t=document.querySelector(this.getAttribute('href'));
    if(t){e.preventDefault();window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-68,behavior:'smooth'});}
  });
});

/* ── Counter animation ── */
(function(){
  const ctrs=document.querySelectorAll('[data-count]');
  if(!ctrs.length)return;
  let done=false;
  function ease(t){return 1-Math.pow(1-t,3)}
  function run(){
    if(done)return;done=true;
    ctrs.forEach(c=>{
      const tgt=parseInt(c.dataset.count,10);
      const dur=2000;const t0=performance.now();
      function tick(now){
        const p=Math.min((now-t0)/dur,1);
        const v=Math.floor(ease(p)*tgt);
        c.textContent=tgt>=1000?Math.floor(v/1000)+'K':v;
        if(p<1)requestAnimationFrame(tick);
        else c.textContent=tgt>=1000?Math.floor(tgt/1000)+'K':tgt;
      }
      requestAnimationFrame(tick);
    });
  }
  const hero=document.querySelector('.hero,.page-hero');
  if(hero){
    new IntersectionObserver(es=>{if(es[0].isIntersecting){run();}},{threshold:.3}).observe(hero);
  }else run();
})();

/* ── Scroll reveal ── */
(function(){
  document.querySelectorAll('.card,.step,.gift-card,.faq-item,.ci,.sec-hdr,.login-step,.rev-item')
    .forEach((el,i)=>{
      el.classList.add('rev');
      el.style.transitionDelay=(i%6)*60+'ms';
    });
  new IntersectionObserver(es=>{
    es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');}});
  },{threshold:.1,rootMargin:'0px 0px -40px 0px'})
  .observe(document.body);
  // re-check all
  function check(){
    document.querySelectorAll('.rev').forEach(el=>{
      const r=el.getBoundingClientRect();
      if(r.top<window.innerHeight-40)el.classList.add('vis');
    });
  }
  window.addEventListener('scroll',check,{passive:true});
  check();
})();

/* ── FAQ accordion ── */
(function(){
  document.querySelectorAll('.faq-q').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const open=btn.getAttribute('aria-expanded')==='true';
      document.querySelectorAll('.faq-q').forEach(b=>{
        b.setAttribute('aria-expanded','false');
        b.nextElementSibling.classList.remove('open');
      });
      if(!open){btn.setAttribute('aria-expanded','true');btn.nextElementSibling.classList.add('open');}
    });
  });
  const first=document.querySelector('.faq-q');
  if(first){first.setAttribute('aria-expanded','true');first.nextElementSibling.classList.add('open');}
})();

/* ── Copy invitation code ── */
(function(){
  document.querySelectorAll('.copy-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const code='6682815057352';
      const orig=btn.textContent;
      function success(){
        btn.classList.add('copied');btn.textContent='✅ Copied: '+code;
        setTimeout(()=>{btn.classList.remove('copied');btn.textContent=orig;},2500);
      }
      if(navigator.clipboard){navigator.clipboard.writeText(code).then(success).catch(()=>fbCopy(code,success));}
      else fbCopy(code,success);
    });
  });
  function fbCopy(t,cb){
    const ta=document.createElement('textarea');ta.value=t;
    ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);
    ta.select();try{document.execCommand('copy');cb();}catch(e){}
    document.body.removeChild(ta);
  }
})();

/* ── Contact form ── */
(function(){
  const form=document.getElementById('contactForm');
  if(!form)return;
  const nm=document.getElementById('cName'),em=document.getElementById('cEmail'),
        ms=document.getElementById('cMsg'),sb=document.getElementById('cSubmit'),
        ok=document.getElementById('cOk');
  function setErr(id,msg){const el=document.getElementById(id);if(el)el.textContent=msg;}
  function validate(){
    let v=true;
    setErr('eN','');setErr('eE','');setErr('eM','');
    if(!nm.value.trim()||nm.value.trim().length<2){setErr('eN','Please enter your name.');v=false;}
    const ev=em.value.trim();
    if(!ev||(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ev))&&!(/^[0-9]{10}$/.test(ev)))){
      setErr('eE','Enter valid email or 10-digit mobile.');v=false;}
    if(!ms.value.trim()||ms.value.trim().length<10){setErr('eM','Message too short.');v=false;}
    return v;
  }
  form.addEventListener('submit',e=>{
    e.preventDefault();if(!validate())return;
    sb.disabled=true;sb.textContent='Sending… ⏳';
    setTimeout(()=>{
      form.reset();sb.disabled=false;sb.textContent='Send Message ✈️';
      ok.classList.add('show');ok.textContent='✅ Message sent! We will reply within 24 hours.';
      setTimeout(()=>ok.classList.remove('show'),6000);
    },1600);
  });
  [nm,em,ms].forEach(i=>i.addEventListener('blur',validate));
})();

/* ── Floating CTA ── */
(function(){
  const fc=document.getElementById('floatCta');
  if(!fc)return;
  window.addEventListener('scroll',()=>{
    const h=document.querySelector('.hero,.page-hero');
    const hh=h?h.offsetHeight:500;
    const dh=document.documentElement.scrollHeight-window.innerHeight;
    (window.scrollY>hh*.6&&window.scrollY<dh-350)?fc.classList.add('show'):fc.classList.remove('show');
  },{passive:true});
})();

/* ── Legal modals ── */
(function(){
  const ov=document.getElementById('modalOv');
  if(!ov)return;
  const title=document.getElementById('mTitle'),body=document.getElementById('mBody'),mx=document.getElementById('mX');
  const DATA={
    privacy:{title:'Privacy Policy',html:`<p>This website is an independent affiliate promotional site. We respect your privacy.</p>
      <h3>Data Collected</h3><p>Name, email, mobile number via contact form only. No payment data collected.</p>
      <h3>Usage</h3><p>Contact data used solely to respond to enquiries. Never sold to third parties.</p>
      <h3>Third-Party Links</h3><p>We link to 77okwin.com. We are not responsible for their privacy practices.</p>
      <h3>Contact</h3><p>Email: sreenchees@gmail.com | Telegram: @Willian2500</p>`},
    terms:{title:'Terms of Use',html:`<p>By using this site you agree to these terms.</p>
      <h3>Affiliate Disclosure</h3><p>This is an independent affiliate site. We earn commission on referrals.</p>
      <h3>Age Restriction</h3><p>You must be 18+ to use OkWin or visit this site.</p>
      <h3>Accuracy</h3><p>Bonus amounts may change on the OkWin platform. Verify at 77okwin.com.</p>
      <h3>Responsible Gaming</h3><p>Never gamble more than you can afford. Seek help if needed.</p>`},
    disclaimer:{title:'Disclaimer',html:`<p><strong>Affiliate / Referral Promotion Website</strong></p>
      <p>This site is NOT the official OkWin platform. We are an independent affiliate.</p>
      <h3>Financial Risk</h3><p>Gaming involves real financial risk. You may lose money.</p>
      <h3>No Guarantees</h3><p>We do not guarantee winnings. Bonuses subject to OkWin's T&Cs.</p>
      <h3>18+ Only</h3><p>Strictly for adults aged 18 and above.</p>`}
  };
  function open(k){
    if(!DATA[k])return;
    title.textContent=DATA[k].title;body.innerHTML=DATA[k].html;
    ov.classList.add('open');ov.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
  }
  function close(){ov.classList.remove('open');ov.setAttribute('aria-hidden','true');document.body.style.overflow='';}
  document.querySelectorAll('[data-modal]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();open(a.dataset.modal);}));
  mx&&mx.addEventListener('click',close);
  ov.addEventListener('click',e=>{if(e.target===ov)close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
})();

/* ── UTM tagging on referral links ── */
document.querySelectorAll('a[href*="77okwin.com"]').forEach(a=>{
  try{const u=new URL(a.href);
    if(!u.searchParams.has('utm_source')){
      u.searchParams.set('utm_source','okwin-india');
      u.searchParams.set('utm_medium','affiliate');
      a.href=u.toString();
    }
  }catch(e){}
});

/* ── Responsive bonus flow arrows ── */
function fixArrows(){
  document.querySelectorAll('.barr').forEach(el=>{
    el.style.transform=window.innerWidth>=640?'none':'rotate(90deg)';
  });
}
fixArrows();
window.addEventListener('resize',fixArrows);
