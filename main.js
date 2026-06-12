/* ============================================================
   GINO GELATI — Interactions & 3D
   Defensiv aufgebaut: fehlt eine Lib (gsap/three/lenis), bleibt die
   Seite voll sichtbar & nutzbar – nur ohne die jeweiligen Effekte.
   ============================================================ */
(function () {
  'use strict';

  var hasGSAP  = typeof window.gsap !== 'undefined';
  var hasST    = hasGSAP && typeof window.ScrollTrigger !== 'undefined';
  var hasThree = typeof window.THREE !== 'undefined';
  var hasLenis = typeof window.Lenis !== 'undefined';
  var reduce   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePtr  = window.matchMedia('(pointer: fine)').matches;
  var animate  = hasGSAP && hasST && !reduce;

  /* ---------- Preloader (funktioniert auch ohne gsap) ---------- */
  var preloader = document.getElementById('preloader');
  function liftPreloader() { if (preloader) preloader.classList.add('done'); }

  if (hasGSAP && hasST) { gsap.registerPlugin(ScrollTrigger); }

  /* ---------- Smooth Scroll (Lenis) ---------- */
  var lenis = null;
  if (hasLenis && hasGSAP && !reduce) {
    try {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      if (hasST) lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } catch (e) { lenis = null; }
  }

  /* ---------- Preloader-Animation / Hero-Intro ---------- */
  function heroIntro() {
    if (!animate) return;
    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.hero__word', { yPercent: 120, rotate: 4, duration: 1.1, stagger: 0.12 })
      .from('.hero__eyebrow span', { yPercent: 130, duration: 0.8 }, 0.15)
      .from('.hero__sub', { y: 30, autoAlpha: 0, duration: 0.9 }, 0.55)
      .from('.hero__cta', { y: 30, autoAlpha: 0, duration: 0.9 }, 0.7)
      .from('.hero__badge', { scale: 0.85, autoAlpha: 0, rotate: -90, duration: 1, ease: 'back.out(1.6)' }, 0.8)
      .from('.hero__scrollhint', { autoAlpha: 0, duration: 0.8 }, 1);
  }

  if (hasGSAP) {
    var prog = { v: 0 };
    var preCount = document.getElementById('preCount');
    var preBar = document.getElementById('preBar');
    gsap.to(prog, {
      v: 100, duration: reduce ? 0.01 : 1.3, ease: 'power2.inOut',
      onUpdate: function () {
        var p = Math.round(prog.v);
        if (preCount) preCount.textContent = p + '%';
        if (preBar) preBar.style.width = p + '%';
      },
      onComplete: function () { liftPreloader(); heroIntro(); }
    });
  } else {
    // Ohne gsap: Preloader nach kurzem Moment entfernen
    window.addEventListener('load', function () { setTimeout(liftPreloader, 400); });
    setTimeout(liftPreloader, 1200);
  }

  /* ---------- Custom Cursor ---------- */
  var cursor = document.getElementById('cursor');
  var dot = document.getElementById('cursorDot');
  if (finePtr && cursor && dot) {
    var cx = -100, cy = -100, tx = -100, ty = -100;
    window.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = 'translate(' + (tx - 2.5) + 'px,' + (ty - 2.5) + 'px)';
    });
    var raf = function () {
      cx += (tx - cx) * 0.14; cy += (ty - cy) * 0.14;
      cursor.style.transform = 'translate(' + (cx - 18) + 'px,' + (cy - 18) + 'px)';
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    document.querySelectorAll('a, button, [data-hover]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('is-hover'); });
    });
  } else {
    // Kein Feinzeiger / Touch: Standardcursor wiederherstellen
    document.body.style.cursor = 'auto';
  }

  /* ---------- Scroll Progress + Nav ---------- */
  if (animate) {
    gsap.to('#progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
    ScrollTrigger.create({
      start: 60,
      onEnter: function () { document.getElementById('nav').classList.add('is-scrolled'); },
      onLeaveBack: function () { document.getElementById('nav').classList.remove('is-scrolled'); }
    });
  } else {
    // Vanilla-Fallback für die Nav-Verglasung
    window.addEventListener('scroll', function () {
      document.getElementById('nav').classList.toggle('is-scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ---------- Hero Parallax ---------- */
  if (animate) {
    gsap.to('.hero__content', {
      yPercent: -28, autoAlpha: 0.15, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.hero__bg-word', {
      yPercent: 30, xPercent: -8, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* ---------- THREE.JS — schwebendes 3D-Gelato ---------- */
  if (hasThree) initGL();
  function initGL() {
    var canvas = document.getElementById('gl');
    if (!canvas) return;
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    } catch (e) { canvas.style.display = 'none'; return; }
    if (!renderer.getContext()) { canvas.style.display = 'none'; return; }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 11);

    scene.add(new THREE.AmbientLight(0xfff4e0, 0.65));
    var key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(4, 6, 6); scene.add(key);
    var rim = new THREE.PointLight(0xa9c25e, 1.4, 30); rim.position.set(-6, -2, 4); scene.add(rim);
    var warm = new THREE.PointLight(0xe8889a, 1.0, 30); warm.position.set(6, 3, 2); scene.add(warm);

    var gelato = new THREE.Group();
    var cone = new THREE.Mesh(new THREE.ConeGeometry(1.05, 2.6, 32, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xd9a85a, roughness: 0.85 }));
    cone.rotation.x = Math.PI; cone.position.y = -1.85; gelato.add(cone);

    function scoopMat(c) { return new THREE.MeshStandardMaterial({ color: c, roughness: 0.55, metalness: 0.02 }); }
    var s1 = new THREE.Mesh(new THREE.SphereGeometry(1.05, 48, 48), scoopMat(0xa9c25e)); s1.position.y = -0.35;
    var s2 = new THREE.Mesh(new THREE.SphereGeometry(0.92, 48, 48), scoopMat(0xf3e2c4)); s2.position.set(0.18, 0.85, 0.1);
    var s3 = new THREE.Mesh(new THREE.SphereGeometry(0.78, 48, 48), scoopMat(0xe8889a)); s3.position.set(-0.14, 1.9, -0.05);
    gelato.add(s1, s2, s3);
    var cherry = new THREE.Mesh(new THREE.SphereGeometry(0.22, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xd92632, roughness: 0.3 }));
    cherry.position.set(0, 2.78, 0); gelato.add(cherry);
    gelato.position.set(3.4, -0.4, 0); gelato.rotation.z = -0.12; scene.add(gelato);

    var COLORS = [0xa9c25e, 0xe8889a, 0xd9a85a, 0xf3e2c4, 0xd92632];
    var sprinkles = new THREE.Group();
    var sgeo = THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(0.05, 0.18, 3, 8)
                                     : new THREE.SphereGeometry(0.08, 8, 8);
    for (var i = 0; i < 60; i++) {
      var m = new THREE.Mesh(sgeo, new THREE.MeshStandardMaterial({ color: COLORS[i % COLORS.length], roughness: 0.5 }));
      m.position.set((Math.random() - 0.5) * 18, (Math.random() - 0.5) * 10, (Math.random() - 0.7) * 6);
      m.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      m.userData = { speed: 0.2 + Math.random() * 0.6, phase: Math.random() * Math.PI * 2 };
      sprinkles.add(m);
    }
    scene.add(sprinkles);

    function resize() {
      var w = canvas.clientWidth || window.innerWidth, h = canvas.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize); resize();

    var mouse = { x: 0, y: 0 };
    window.addEventListener('mousemove', function (e) {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    var scrollState = { rot: 0, y: 0 };
    if (animate) {
      gsap.to(scrollState, {
        rot: Math.PI * 1.5, y: -2.2, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }

    var heroVisible = true;
    if (hasST) {
      ScrollTrigger.create({
        trigger: '.hero', start: 'top bottom', end: 'bottom top',
        onToggle: function (self) { heroVisible = self.isActive; }
      });
    }

    var t0 = performance.now();
    var sm = { x: 0, y: 0 }; // gefederte Maus – fühlt sich natürlicher an als direkte Zuordnung
    function loop(now) {
      requestAnimationFrame(loop);
      if (!heroVisible) return;
      var t = (now - t0) / 1000;
      // sanfte Annäherung (Federung) statt mechanischer 1:1-Kopplung
      sm.x += (mouse.x - sm.x) * 0.06;
      sm.y += (mouse.y - sm.y) * 0.06;
      gelato.rotation.y = t * 0.25 + scrollState.rot;
      gelato.position.y = -0.4 + Math.sin(t * 0.8) * 0.18 + scrollState.y;
      gelato.rotation.x = sm.y * 0.12;
      gelato.rotation.z = -0.12 + sm.x * 0.08;
      camera.position.x = sm.x * 0.4; camera.position.y = -sm.y * 0.3;
      camera.lookAt(1.6, 0, 0);
      for (var j = 0; j < sprinkles.children.length; j++) {
        var s = sprinkles.children[j];
        s.rotation.x += 0.004 * s.userData.speed;
        s.rotation.y += 0.003 * s.userData.speed;
        s.position.y += Math.sin(t * s.userData.speed + s.userData.phase) * 0.01;
      }
      renderer.render(scene, camera);
    }
    requestAnimationFrame(loop);
  }

  /* ---------- Horizontaler Bestseller-Scroll ---------- */
  var htrack = document.getElementById('htrack');
  if (htrack && animate) {
    var getScroll = function () { return Math.max(0, htrack.scrollWidth - window.innerWidth); };
    gsap.to(htrack, {
      x: function () { return -getScroll(); }, ease: 'none',
      scrollTrigger: {
        trigger: '#bestseller', start: 'top top',
        end: function () { return '+=' + getScroll(); },
        pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1
      }
    });
    gsap.utils.toArray('.hcard').forEach(function (card, i) {
      gsap.from(card, {
        y: 80, autoAlpha: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '#bestseller', start: 'top 70%' }, delay: i * 0.08
      });
    });
  }

  /* ---------- Counter ---------- */
  document.querySelectorAll('.stat__num').forEach(function (el) {
    var target = parseFloat(el.dataset.count);
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    var suffix = el.dataset.suffix || '';
    var plain = 'plain' in el.dataset;
    function fmt(v) {
      return (decimals ? v.toFixed(decimals)
            : plain ? String(Math.round(v))
            : Math.round(v).toLocaleString('de-DE')) + suffix;
    }
    if (!animate) { el.textContent = fmt(target); return; }
    var obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: function () {
        gsap.to(obj, { v: target, duration: 2, ease: 'power3.out',
          onUpdate: function () { el.textContent = fmt(obj.v); } });
      }
    });
  });

  /* ---------- Story Parallax + Reveals ---------- */
  if (animate) {
    gsap.to('#storyMedia', {
      yPercent: -14, ease: 'none',
      scrollTrigger: { trigger: '.story', start: 'top bottom', end: 'bottom top', scrub: true }
    });
    gsap.utils.toArray('.reveal-word').forEach(function (w, i) {
      gsap.from(w, { y: 60, autoAlpha: 0, rotate: 3, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: w, start: 'top 88%' }, delay: (i % 4) * 0.07 });
    });
    gsap.utils.toArray('.reveal-fade').forEach(function (el) {
      gsap.from(el, { y: 40, autoAlpha: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' } });
    });
    gsap.utils.toArray('.bcard, .cta__card, .stat').forEach(function (el, i) {
      gsap.from(el, { y: 60, autoAlpha: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%' }, delay: (i % 3) * 0.08 });
    });
  }

  /* ---------- 3D-Tilt-Karten ---------- */
  if (finePtr && animate) {
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      var bounds;
      card.addEventListener('mouseenter', function () { bounds = card.getBoundingClientRect(); });
      card.addEventListener('mousemove', function (e) {
        if (!bounds) bounds = card.getBoundingClientRect();
        var px = (e.clientX - bounds.left) / bounds.width - 0.5;
        var py = (e.clientY - bounds.top) / bounds.height - 0.5;
        gsap.to(card, { rotateY: px * 10, rotateX: -py * 10, transformPerspective: 700, duration: 0.4, ease: 'power2.out' });
        card.style.setProperty('--gx', ((px + 0.5) * 100) + '%');
        card.style.setProperty('--gy', ((py + 0.5) * 100) + '%');
      });
      card.addEventListener('mouseleave', function () {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
      });
    });
  }

  /* ---------- Magnetic Buttons + Press-Feedback ---------- */
  if (finePtr && animate) {
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var b = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - b.left - b.width / 2) * 0.3, y: (e.clientY - b.top - b.height / 2) * 0.3, duration: 0.4, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(el, { x: 0, y: 0, scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      });
      // Press-Feedback: scale(0.97) – Magnetic-Buttons setzen transform via gsap,
      // daher hier statt per CSS :active
      el.addEventListener('pointerdown', function () {
        gsap.to(el, { scale: 0.96, duration: 0.14, ease: 'power2.out' });
      });
      el.addEventListener('pointerup', function () {
        gsap.to(el, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
      });
    });
  }

  /* ---------- Warenkorb (vanilla, immer aktiv) ---------- */
  var badge = document.getElementById('cartBadge');
  var count = 0;
  document.querySelectorAll('[data-add]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      count++;
      if (badge) badge.textContent = count;
      if (hasGSAP && badge) gsap.fromTo(badge, { scale: 1.8 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' });
      btn.textContent = '✓';
      setTimeout(function () { btn.textContent = '+'; }, 800);
    });
  });

  /* ---------- Live-Ticker (vanilla) ---------- */
  var ticker = document.getElementById('liveTicker');
  if (ticker) {
    var feed = ['Pistazie Premium — vor 2 Min.', 'Stracciatella — vor 3 Min.',
      'Schokolade Pur — gerade eben', 'Mango Sorbet — vor 1 Min.', 'Haselnuss Krokant — vor 4 Min.'];
    var fi = 0;
    setInterval(function () {
      fi = (fi + 1) % feed.length;
      if (hasGSAP) {
        gsap.to(ticker, { autoAlpha: 0, y: -8, duration: 0.3, onComplete: function () {
          ticker.textContent = feed[fi];
          gsap.fromTo(ticker, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3 });
        } });
      } else { ticker.textContent = feed[fi]; }
    }, 3500);
  }

  /* ---------- Newsletter (vanilla) ---------- */
  var form = document.getElementById('nlForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input');
      input.value = ''; input.placeholder = 'Grazie! Du bist dabei ✓';
      if (hasGSAP) gsap.fromTo(form, { scale: 0.97 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' });
    });
  }

  /* ---------- Anchor-Links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -70 });
      else target.scrollIntoView({ behavior: 'smooth' });
    });
  });

})();
