/* ============================================================
   GINO GELATI — Interactions & 3D
   gsap + ScrollTrigger + Lenis + three.js (alle lokal vendored)
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth Scroll (Lenis) ---------- */
  var lenis = null;
  if (!reduceMotion) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- Preloader ---------- */
  var preloader = document.getElementById('preloader');
  var preCount = document.getElementById('preCount');
  var preBar = document.getElementById('preBar');
  var progress = { v: 0 };

  gsap.to(progress, {
    v: 100, duration: reduceMotion ? 0.01 : 1.4, ease: 'power2.inOut',
    onUpdate: function () {
      var p = Math.round(progress.v);
      preCount.textContent = p + '%';
      preBar.style.width = p + '%';
    },
    onComplete: function () {
      preloader.classList.add('done');
      heroIntro();
    }
  });

  /* ---------- Custom Cursor ---------- */
  var cursor = document.getElementById('cursor');
  var dot = document.getElementById('cursorDot');
  if (window.matchMedia('(pointer: fine)').matches) {
    var cx = -100, cy = -100, tx = -100, ty = -100;
    window.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = 'translate(' + (tx - 2.5) + 'px,' + (ty - 2.5) + 'px)';
    });
    gsap.ticker.add(function () {
      cx += (tx - cx) * 0.14; cy += (ty - cy) * 0.14;
      cursor.style.transform = 'translate(' + (cx - 18) + 'px,' + (cy - 18) + 'px)';
    });
    document.querySelectorAll('a, button, [data-hover]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('is-hover'); });
    });
  }

  /* ---------- Scroll Progress + Nav ---------- */
  gsap.to('#progress', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
  });
  ScrollTrigger.create({
    start: 60,
    onEnter: function () { document.getElementById('nav').classList.add('is-scrolled'); },
    onLeaveBack: function () { document.getElementById('nav').classList.remove('is-scrolled'); }
  });

  /* ---------- Hero Intro Timeline ---------- */
  function heroIntro() {
    if (reduceMotion) return;
    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.hero__word', { yPercent: 120, rotate: 4, duration: 1.1, stagger: 0.12 })
      .from('.hero__eyebrow span', { yPercent: 130, duration: 0.8 }, 0.15)
      .from('.hero__sub', { y: 30, autoAlpha: 0, duration: 0.9 }, 0.55)
      .from('.hero__cta', { y: 30, autoAlpha: 0, duration: 0.9 }, 0.7)
      .from('.hero__badge', { scale: 0, rotate: -90, duration: 1, ease: 'back.out(1.6)' }, 0.8)
      .from('.hero__scrollhint', { autoAlpha: 0, duration: 0.8 }, 1);
  }

  /* Hero parallax beim Scrollen */
  if (!reduceMotion) {
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
  (function initGL() {
    var canvas = document.getElementById('gl');
    if (!canvas || !window.THREE) return;
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    } catch (e) { canvas.style.display = 'none'; return; }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 11);

    /* Lichter */
    scene.add(new THREE.AmbientLight(0xfff4e0, 0.65));
    var key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(4, 6, 6);
    scene.add(key);
    var rim = new THREE.PointLight(0xa9c25e, 1.4, 30);
    rim.position.set(-6, -2, 4);
    scene.add(rim);
    var warm = new THREE.PointLight(0xe8889a, 1.0, 30);
    warm.position.set(6, 3, 2);
    scene.add(warm);

    /* Gelato-Gruppe: Waffel + 3 Kugeln */
    var gelato = new THREE.Group();

    var coneMat = new THREE.MeshStandardMaterial({ color: 0xd9a85a, roughness: 0.85 });
    var cone = new THREE.Mesh(new THREE.ConeGeometry(1.05, 2.6, 32, 1, true), coneMat);
    cone.rotation.x = Math.PI;
    cone.position.y = -1.85;
    gelato.add(cone);

    function scoopMat(color) {
      return new THREE.MeshStandardMaterial({ color: color, roughness: 0.55, metalness: 0.02 });
    }
    var s1 = new THREE.Mesh(new THREE.SphereGeometry(1.05, 48, 48), scoopMat(0xa9c25e)); // Pistazie
    s1.position.y = -0.35;
    var s2 = new THREE.Mesh(new THREE.SphereGeometry(0.92, 48, 48), scoopMat(0xf3e2c4)); // Vanille
    s2.position.set(0.18, 0.85, 0.1);
    var s3 = new THREE.Mesh(new THREE.SphereGeometry(0.78, 48, 48), scoopMat(0xe8889a)); // Erdbeere
    s3.position.set(-0.14, 1.9, -0.05);
    gelato.add(s1, s2, s3);

    /* Kirsche on top */
    var cherry = new THREE.Mesh(new THREE.SphereGeometry(0.22, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xd92632, roughness: 0.3 }));
    cherry.position.set(0, 2.78, 0);
    gelato.add(cherry);

    gelato.position.set(3.4, -0.4, 0);
    gelato.rotation.z = -0.12;
    scene.add(gelato);

    /* Streusel-Partikel */
    var COLORS = [0xa9c25e, 0xe8889a, 0xd9a85a, 0xf3e2c4, 0xd92632];
    var sprinkles = new THREE.Group();
    var capsGeo = new THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(0.05, 0.18, 3, 8)
                                            : new THREE.SphereGeometry(0.08, 8, 8);
    for (var i = 0; i < 60; i++) {
      var m = new THREE.Mesh(capsGeo, new THREE.MeshStandardMaterial({
        color: COLORS[i % COLORS.length], roughness: 0.5
      }));
      m.position.set((Math.random() - 0.5) * 18, (Math.random() - 0.5) * 10, (Math.random() - 0.7) * 6);
      m.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      m.userData = {
        speed: 0.2 + Math.random() * 0.6,
        amp: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2
      };
      sprinkles.add(m);
    }
    scene.add(sprinkles);

    /* Resize */
    function resize() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    /* Maus-Parallax */
    var mouse = { x: 0, y: 0 };
    window.addEventListener('mousemove', function (e) {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    /* Scroll steuert Rotation/Position des Gelatos */
    var scrollState = { rot: 0, y: 0 };
    if (!reduceMotion) {
      gsap.to(scrollState, {
        rot: Math.PI * 1.5, y: -2.2, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }

    var clock = new THREE.Clock();
    var heroVisible = true;
    ScrollTrigger.create({
      trigger: '.hero', start: 'top bottom', end: 'bottom top',
      onToggle: function (self) { heroVisible = self.isActive; }
    });

    renderer.setAnimationLoop(function () {
      if (!heroVisible) return;
      var t = clock.getElapsedTime();
      gelato.rotation.y = t * 0.25 + scrollState.rot;
      gelato.position.y = -0.4 + Math.sin(t * 0.8) * 0.18 + scrollState.y;
      gelato.rotation.x = mouse.y * 0.12;
      gelato.rotation.z = -0.12 + mouse.x * 0.08;
      camera.position.x = mouse.x * 0.4;
      camera.position.y = -mouse.y * 0.3;
      camera.lookAt(1.6, 0, 0);

      sprinkles.children.forEach(function (s) {
        var u = s.userData;
        s.position.y += Math.sin(t * u.speed + u.phase) * 0.004 * u.amp * 10;
        s.rotation.x += 0.004 * u.speed;
        s.rotation.y += 0.003 * u.speed;
      });
      renderer.render(scene, camera);
    });
  })();

  /* ---------- Horizontaler Bestseller-Scroll ---------- */
  var htrack = document.getElementById('htrack');
  if (htrack && !reduceMotion) {
    var getScroll = function () { return htrack.scrollWidth - window.innerWidth; };
    gsap.to(htrack, {
      x: function () { return -getScroll(); },
      ease: 'none',
      scrollTrigger: {
        trigger: '#bestseller',
        start: 'top top',
        end: function () { return '+=' + getScroll(); },
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1
      }
    });
    /* Karten leicht versetzt einfliegen */
    gsap.utils.toArray('.hcard').forEach(function (card, i) {
      gsap.from(card, {
        y: 80, autoAlpha: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '#bestseller', start: 'top 70%' },
        delay: i * 0.08
      });
    });
  }

  /* ---------- Counter ---------- */
  gsap.utils.toArray('.stat__num').forEach(function (el) {
    var target = parseFloat(el.dataset.count);
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    var suffix = el.dataset.suffix || '';
    var plain = 'plain' in el.dataset;
    var obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: function () {
        gsap.to(obj, {
          v: target, duration: reduceMotion ? 0.01 : 2, ease: 'power3.out',
          onUpdate: function () {
            var val = decimals ? obj.v.toFixed(decimals)
                               : plain ? String(Math.round(obj.v))
                                       : Math.round(obj.v).toLocaleString('de-DE');
            el.textContent = val + suffix;
          }
        });
      }
    });
  });

  /* ---------- Story Parallax + Wort-Reveals ---------- */
  if (!reduceMotion) {
    gsap.to('#storyMedia', {
      yPercent: -14, ease: 'none',
      scrollTrigger: { trigger: '.story', start: 'top bottom', end: 'bottom top', scrub: true }
    });
    gsap.utils.toArray('.reveal-word').forEach(function (w, i) {
      gsap.from(w, {
        y: 60, autoAlpha: 0, rotate: 3, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: w, start: 'top 88%' },
        delay: (i % 4) * 0.07
      });
    });
    gsap.utils.toArray('.reveal-fade').forEach(function (el) {
      gsap.from(el, {
        y: 40, autoAlpha: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' }
      });
    });
    gsap.utils.toArray('.bcard, .cta__card, .stat').forEach(function (el, i) {
      gsap.from(el, {
        y: 60, autoAlpha: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%' },
        delay: (i % 3) * 0.08
      });
    });
  }

  /* ---------- 3D-Tilt Karten ---------- */
  if (window.matchMedia('(pointer: fine)').matches && !reduceMotion) {
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      var bounds;
      card.addEventListener('mouseenter', function () { bounds = card.getBoundingClientRect(); });
      card.addEventListener('mousemove', function (e) {
        if (!bounds) bounds = card.getBoundingClientRect();
        var px = (e.clientX - bounds.left) / bounds.width - 0.5;
        var py = (e.clientY - bounds.top) / bounds.height - 0.5;
        gsap.to(card, {
          rotateY: px * 10, rotateX: -py * 10,
          transformPerspective: 700, duration: 0.4, ease: 'power2.out'
        });
        card.style.setProperty('--gx', ((px + 0.5) * 100) + '%');
        card.style.setProperty('--gy', ((py + 0.5) * 100) + '%');
      });
      card.addEventListener('mouseleave', function () {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
      });
    });
  }

  /* ---------- Magnetic Buttons ---------- */
  if (window.matchMedia('(pointer: fine)').matches && !reduceMotion) {
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var b = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - b.left - b.width / 2) * 0.3,
          y: (e.clientY - b.top - b.height / 2) * 0.3,
          duration: 0.4, ease: 'power2.out'
        });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  /* ---------- Warenkorb ---------- */
  var badge = document.getElementById('cartBadge');
  var count = 0;
  document.querySelectorAll('[data-add]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      count++;
      badge.textContent = count;
      gsap.fromTo(badge, { scale: 1.8 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' });
      btn.textContent = '✓';
      setTimeout(function () { btn.textContent = '+'; }, 800);
    });
  });

  /* ---------- Live-Ticker ---------- */
  var ticker = document.getElementById('liveTicker');
  if (ticker) {
    var feed = [
      'Pistazie Premium — vor 2 Min.',
      'Stracciatella — vor 3 Min.',
      'Schokolade Pur — gerade eben',
      'Mango Sorbet — vor 1 Min.',
      'Haselnuss Krokant — vor 4 Min.'
    ];
    var fi = 0;
    setInterval(function () {
      fi = (fi + 1) % feed.length;
      gsap.to(ticker, {
        autoAlpha: 0, y: -8, duration: 0.3, onComplete: function () {
          ticker.textContent = feed[fi];
          gsap.fromTo(ticker, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3 });
        }
      });
    }, 3500);
  }

  /* ---------- Newsletter ---------- */
  var form = document.getElementById('nlForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input');
      input.value = '';
      input.placeholder = 'Grazie! Du bist dabei ✓';
      gsap.fromTo(form, { scale: 0.97 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' });
    });
  }

  /* ---------- Anchor-Links über Lenis ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target && lenis) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -70 });
      }
    });
  });

})();
