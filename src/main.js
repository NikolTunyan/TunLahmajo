/**
 * TUN LAHMAJO — main.js
 * Исправлено + улучшено
 *
 * Исправленные баги:
 * 1. initHeatEffect / initGlitchText / initBreakDough теперь вызываются
 * 2. initGlitchText: this.progress() через gsap onUpdate — правильный контекст
 * 3. initBreakDough: clip-path всегда circle() → совместимо с CSS
 * 4. Добавлена полоса прогресса скролла
 * 5. Навбар получает класс .scrolled при скролле
 * 6. tsParticles v3: корректный вызов через объект
 * 7. Все функции вызываются после DOMContentLoaded
 */

/* ============================================================
   РЕГИСТРАЦИЯ ПЛАГИНА
   ============================================================ */
gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   1. КАСТОМНЫЙ КУРСОР
   ============================================================ */
function initCursor() {
  const cursor    = document.querySelector('.cursor');
  const ring      = document.querySelector('.cursor-ring');
  const dot       = document.querySelector('.cursor-dot');
  const cursorTxt = document.querySelector('.cursor-text');

  if (!cursor || !ring || !dot) return;

  // Позиционируем все части курсора от центра
  gsap.set([ring, dot, cursorTxt], { xPercent: -50, yPercent: -50 });

  // Координаты мыши
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;

    // Точка — почти без задержки
    gsap.to(dot, { x: mx, y: my, duration: 0.08, ease: 'power2.out' });

    // Кольцо — с лёгким шлейфом
    gsap.to(ring, { x: mx, y: my, duration: 0.25, ease: 'power3.out' });

    // Текст следует за кольцом
    gsap.to(cursorTxt, { x: mx, y: my, duration: 0.25, ease: 'power3.out' });
  });

  // Hover-состояние
  document.querySelectorAll('.hover-target').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });

  // Скрываем курсор когда мышь уходит за пределы окна
  document.addEventListener('mouseleave', () => {
    gsap.to([dot, ring, cursorTxt], { opacity: 0, duration: 0.3 });
  });

  document.addEventListener('mouseenter', () => {
    gsap.to([dot, ring, cursorTxt], { opacity: 1, duration: 0.3 });
  });
}

/* ============================================================
   2. ПРОГРЕСС СКРОЛЛА + НАВБАР
   ============================================================ */
function initScrollHelpers() {
  // Полоска прогресса
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);

  // Навбар: стекло при скролле
  const nav = document.querySelector('.nav');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (scrolled / total * 100) + '%';

    if (nav) {
      nav.classList.toggle('scrolled', scrolled > 60);
    }
  }, { passive: true });
}

/* ============================================================
   3. ЧАСТИЦЫ СПЕЦИЙ (фон hero)
   ============================================================ */
async function initSpices() {
  if (typeof tsParticles === 'undefined') return;

  // ФИХ: tsParticles v3 принимает объект { id, options }
  await tsParticles.load({
    id: 'particles-spices',
    options: {
      fpsLimit: 60,
      particles: {
        number: { value: 55, density: { enable: true, area: 900 } },
        color: { value: ['#ffffff', '#ff3b1f', '#d4884a', '#c0a060'] },
        shape: { type: 'circle' },
        opacity: {
          value: { min: 0.15, max: 0.55 },
          animation: { enable: true, speed: 0.6, minimumValue: 0.1 }
        },
        size: { value: { min: 1, max: 2.5 } },
        move: {
          enable: true,
          speed: 0.7,
          direction: 'none',
          random: true,
          straight: false,
          outModes: { default: 'out' }
        }
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: 'repulse' }
        },
        modes: {
          repulse: { distance: 120, duration: 0.5 }
        }
      },
      detectRetina: true
    }
  });
}

/* ============================================================
   4. ПАРА НАД ЗАГОЛОВКОМ
   ============================================================ */
async function initSteam() {
  if (typeof tsParticles === 'undefined') return;

  await tsParticles.load({
    id: 'particles-steam',
    options: {
      fpsLimit: 60,
      particles: {
        number: { value: 0 },   // эмиттер сам рожает
        color: { value: '#ffffff' },
        opacity: {
          value: { min: 0.02, max: 0.18 },
          animation: { enable: true, speed: 0.4, startValue: 'max', destroy: 'min' }
        },
        size: {
          value: { min: 25, max: 55 },
          animation: { enable: true, speed: 3, startValue: 'min', destroy: 'none' }
        },
        move: {
          enable: true,
          speed: { min: 0.5, max: 1.2 },
          direction: 'top',
          straight: false,
          outModes: { default: 'destroy', top: 'destroy' },
          wobble: { enable: true, distance: 10, speed: 3 }
        }
      },
      emitters: {
        direction: 'top',
        rate: { quantity: 1, delay: 0.25 },
        size: { width: 80, height: 5 },
        position: { x: 28, y: 98 }
      },
      detectRetina: true
    }
  });
}

/* ============================================================
   5. HEAT DISTORT — тепловое марево на заголовке
   ФИХ: функция теперь вызывается
   ============================================================ */
function initHeatEffect() {
  const turb = document.querySelector('#heatturbulence');
  const h1   = document.querySelector('.left h1');
  if (!turb || !h1) return;

  // Анимируем turbulence для ощущения горячего воздуха
  gsap.to(turb, {
    attr: { baseFrequency: '0.018 0.09', seed: 5 },
    duration: 2.4,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  // Включаем фильтр только в зоне hero (ScrollTrigger)
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    onEnter:      () => h1.classList.add('heat-distort'),
    onLeave:      () => h1.classList.remove('heat-distort'),
    onEnterBack:  () => h1.classList.add('heat-distort'),
    onLeaveBack:  () => h1.classList.remove('heat-distort')
  });
}

/* ============================================================
   6. GLITCH TEXT — переход "ADDICTIVE" ↔ армянский текст
   ФИХ: функция теперь вызывается
   ФИХ: используем явную переменную вместо this.progress() в стрелочной функции
   ============================================================ */
function initGlitchText() {
  const target       = document.querySelector('.left h1 span');
  if (!target) return;

  const armenianText = 'ԱՆՄՈՌԱՆԱԼԻ.';
  const englishText  = 'ADDICTIVE.';
  const arChars      = 'ԱԲԳԴԵԶԷԸԹԺԻLԽԾКHECМНОПРСТ';

  const randomChar = () => arChars[Math.floor(Math.random() * arChars.length)];
  const glitch     = (str) => str.split('').map(() => randomChar()).join('');
  const morph      = (from, to, progress) =>
    to.split('').map((ch, i) => (Math.random() > progress ? randomChar() : (to[i] ?? ch))).join('');

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 4, delay: 3 });

  // Шаг 1: English → глитч-мусор → Armenian
  let step1 = { val: 0 };
  tl.to(step1, {
    val: 1,
    duration: 1.4,
    ease: 'none',
    onUpdate() {
      const p = step1.val;
      if (p < 0.45) {
        target.textContent = glitch(englishText);
      } else {
        target.textContent = morph(englishText, armenianText, (p - 0.45) / 0.55);
      }
    },
    onComplete() {
      target.textContent = armenianText;
    }
  });

  // Пауза
  tl.to({}, { duration: 1.5 });

  // Шаг 2: Armenian → глитч → English
  let step2 = { val: 0 };
  tl.to(step2, {
    val: 1,
    duration: 1.2,
    ease: 'none',
    onUpdate() {
      const p = step2.val;
      if (p < 0.4) {
        target.textContent = glitch(armenianText);
      } else {
        target.textContent = morph(armenianText, englishText, (p - 0.4) / 0.6);
      }
    },
    onComplete() {
      target.textContent = englishText;
    }
  });
}

/* ============================================================
   7. BREAK SECTION — "scratch" reveal рецепта
   ФИХ: функция теперь вызывается
   ФИХ: clip-path всегда в формате circle() — нет рывков при анимации
   ============================================================ */
function initBreakDough() {
  const container   = document.querySelector('#revealContainer');
  const img         = document.querySelector('#revealImage');
  const cursorTxt   = document.querySelector('.cursor-text');
  if (!container || !img) return;

  let isInside = false;

  container.addEventListener('mouseenter', () => {
      isInside = true;
      if (cursorTxt) cursorTxt.textContent = i18n[currentLang]?.cursor_want ?? 'WANT';
    });

    container.addEventListener('mousemove', (e) => {
    if (!isInside) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    img.style.maskImage = `radial-gradient(
      circle 200px at ${x}px ${y}px,
      transparent 0%,
      transparent 65%,
      black 80%
    )`;

    img.style.webkitMaskImage = img.style.maskImage;
  });
  
  
  container.addEventListener('mouseleave', () => {
    isInside = false;
    img.style.maskImage = 'none';
    img.style.webkitMaskImage = 'none';
    if (cursorTxt) cursorTxt.textContent = i18n[currentLang]?.cursor_yummy ?? 'YUMMY';
  });

  // Анимация въезда секции
  gsap.from('.reveal-container', {
    scrollTrigger: {
      trigger: '.break-section',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    },
    y: 60,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out'
  });

  gsap.from('.break-section-label', {
    scrollTrigger: {
      trigger: '.break-section',
      start: 'top 75%'
    },
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
  });
}

/* ============================================================
   8. АНИМАЦИЯ ВЪЕЗДА (GSAP Timeline) — интро + hero
   ============================================================ */
function initIntroAnimation() {
  const tl = gsap.timeline();

  tl.to('.intro-tagline', { opacity: 1, y: 0, duration: 0.4, delay: 0.6 })
    .to('.intro-logo',    { opacity: 0, y: -10, duration: 0.5, delay: 0.8 })
    .to('.intro-tagline', { opacity: 0, duration: 0.3 }, '<')
    .to('.intro-overlay', { yPercent: -100, duration: 1.1, ease: 'power4.inOut' })
    .from('.left h1',     { x: -60, opacity: 0, duration: 1,  ease: 'power3.out' }, '-=0.5')
    .from('.hero-sub',    { x: -40, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.7')
    .from('.buttons',     { y: 20,  opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.6')
    .from('.nav',         { y: -24, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5')
    .from('.hero-badge',  { scale: 0.7, opacity: 0, rotation: -30, duration: 0.9, ease: 'back.out(1.5)' }, '-=0.4')
    .from('.scroll-hint', { opacity: 0, duration: 0.5 }, '-=0.2');
}

/* ============================================================
   9. PARALLAX HERO BG
   ============================================================ */
function initParallax() {
  gsap.to('.hero-bg', {
    yPercent: 22,
    scale: 1.12,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5
    }
  });

  // Текст уходит вверх медленнее
  gsap.to('.hero-content', {
    yPercent: 18,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '60% top',
      scrub: 1
    }
  });
}

/* ============================================================
   10. SCROLL ANIMATIONS — секция меню
   ============================================================ */
function initScrollAnimations() {
  // Анимация "OUR MENU"
  gsap.from('.next-inner', {
    scrollTrigger: {
      trigger: '.next',
      start: 'top 65%',
      toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  });
}

/* ============================================================
   I18N — СИСТЕМА СМЕНЫ ЯЗЫКА
   ============================================================ */
const i18n = {
  en: {
    tagline:      'ARMENIAN FLATBREAD',
    nav_menu:     'MENU',
    nav_about:    'ABOUT',
    nav_gallery:  'GALLERY',
    nav_locations:'LOCATIONS',
    nav_contact:  'CONTACT',
    order_now:    'ORDER NOW →',
    view_menu:    'VIEW MENU',
    hero_h1:      'THIN.<br>HOT.<br><span>ADDICTIVE.</span>',
    hero_sub:     'Traditional Armenian lahmajo.<br>Baked fresh. Served hot.',
    badge_since:  'SINCE',
    badge_city:   'YEREVAN',
    scroll_hint:  'SCROLL ↓',
    menu_tag:     '— WHAT WE OFFER —',
    our_menu:     'OUR MENU',
    menu_sub:     'Crafted with love, tradition & fire',
    reveal_label: '← HOVER TO REVEAL THE SECRET →',
    classified:   'CLASSIFIED',
    secret_recipe:'SECRET<br>RECIPE',
    ingredient_1: 'Premium Beef & Lamb Mix',
    ingredient_2: 'Secret Armenian Spices',
    ingredient_3: 'Hand-stretched Dough',
    ingredient_4: 'Stone Oven · 400°C',
    cursor_yummy: 'YUMMY',
    cursor_want:  'WANT',
  },
  ru: {
    tagline:      'АРМЯНСКИЙ ЛАВАШ',
    nav_menu:     'МЕНЮ',
    nav_about:    'О НАС',
    nav_gallery:  'ГАЛЕРЕЯ',
    nav_locations:'АДРЕСА',
    nav_contact:  'КОНТАКТЫ',
    order_now:    'ЗАКАЗАТЬ →',
    view_menu:    'СМОТРЕТЬ МЕНЮ',
    hero_h1:      'ТОНКИЙ.<br>ГОРЯЧИЙ.<br><span>НЕЗАБЫВАЕМЫЙ.</span>',
    hero_sub:     'Традиционный армянский лахмаджо.<br>Свежий из печи. Горячий на стол.',
    badge_since:  'С ГОДА',
    badge_city:   'ЕРЕВАН',
    scroll_hint:  'ЛИСТАЙ ↓',
    menu_tag:     '— ЧТО МЫ ПРЕДЛАГАЕМ —',
    our_menu:     'НАШЕ МЕНЮ',
    menu_sub:     'С любовью, традицией и огнём',
    reveal_label: '← НАВЕДИ, ЧТОБЫ УЗНАТЬ СЕКРЕТ →',
    classified:   'СЕКРЕТНО',
    secret_recipe:'СЕКРЕТНЫЙ<br>РЕЦЕПТ',
    ingredient_1: 'Смесь говядины и баранины',
    ingredient_2: 'Секретные армянские специи',
    ingredient_3: 'Тесто, растянутое вручную',
    ingredient_4: 'Каменная печь · 400°C',
    cursor_yummy: 'ВКУСНО',
    cursor_want:  'ХОЧУ',
  },
  hy: {
    tagline:      'ՀԱՅԿԱԿԱՆ ԼԱՒԱՇ',
    nav_menu:     'ՄԵՆՅՈՒ',
    nav_about:    'ՄԵՐ ՄԱՍԻՆ',
    nav_gallery:  'ՊԱՏԿԵՐԱՍՐԱՀ',
    nav_locations:'ՀԱՍՑԵՆԵՐ',
    nav_contact:  'ԿԱՊ',
    order_now:    'ՊԱՏՎԻՐԵԼ →',
    view_menu:    'ՄԵՆՅՈՒ',
    hero_h1:      'ԲԱՐԱԿ.<br>ՏԱՔ.<br><span>ԱՆՄՈՌԱՆԱԼԻ.</span>',
    hero_sub:     'Ավանդական հայկական լախմաջո.<br>Թարմ թխած. Տաք մատուցված.',
    badge_since:  'ԻՑ',
    badge_city:   'ԵՐԵՒԱՆ',
    scroll_hint:  'ՈԼՈՐԵԼ ↓',
    menu_tag:     '— ՄԵՐ ԱՌԱՋԱՐԿԸ —',
    our_menu:     'ՄԵՐ ՄԵՆՅՈՒ',
    menu_sub:     'Պատրաստված սիրով, ավանդույթով և կրակով',
    reveal_label: '← ՄԿՆԻԿԸ ԲԵՐԵՔ ԳԱՂՏՆԻՔԸ ԲԱՑԱՀԱՅՏԵԼՈՒ →',
    classified:   'ԳԱՂՏՆԻ',
    secret_recipe:'ԳԱՂՏՆԻ<br>ԲԱՂԱԴՐԱՏՈP',
    ingredient_1: 'Տավարի և գառի խառնուրդ',
    ingredient_2: 'Գաղտնի հայկական համեմունքներ',
    ingredient_3: 'Ձեռքով ձգված խմոր',
    ingredient_4: 'Քարե ջեռոց · 400°C',
    cursor_yummy: 'ՀԱՄՈՎ',
    cursor_want:  'ՈՒԶՈՒՄ ԵՄ',
  }
};

let currentLang = 'en';

function applyLang(lang) {
  const dict = i18n[lang];
  if (!dict) return;
  currentLang = lang;

  // Простая замена textContent
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  // Замена innerHTML (для тегов <br> и <span>)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });

  // Курсорный текст
  const cursorTxt = document.querySelector('.cursor-text');
  if (cursorTxt) cursorTxt.textContent = dict.cursor_yummy;

  // Активная кнопка
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  // Сброс glitch-цели после смены языка
  const glitchTarget = document.querySelector('.left h1 span');
  if (glitchTarget) {
    // GSAP timeline percolates — просто синхронизируем начальное значение
    // (таймлайн сам подхватит через onComplete)
    glitchTarget.textContent = lang === 'hy' ? 'ԱՆՄՈՌԱՆԱԼԻ.' :
                               lang === 'ru' ? 'НЕЗАБЫВАЕМЫЙ.' : 'ADDICTIVE.';
  }
}

function initLangSwitcher() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (lang !== currentLang) applyLang(lang);
    });
  });
}

/* ============================================================
   ТОЧКА ВХОДА — запускаем всё после загрузки DOM
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initScrollHelpers();
  initIntroAnimation();
  initParallax();
  initScrollAnimations();
  initHeatEffect();
  initGlitchText();
  initBreakDough();
  initLangSwitcher();
});

// Частицы инициализируем после полной загрузки страницы
window.addEventListener('load', () => {
  initSpices();
  initSteam();
});



document.querySelectorAll('[data-i18n="nav_menu"], [data-i18n="view_menu"]').forEach(btn => {
  btn.addEventListener("click", function () {
    window.location.href = "menu.html";
  });
});


document.querySelector('[data-i18n="nav_about"]').addEventListener("click", function () {
  window.location.href = "about.html";
});



document.querySelector('[data-i18n="nav_gallery"]').addEventListener("click", function () {
  window.location.href = "gallery.html";
});




document.querySelector('[data-i18n="nav_locations"]').addEventListener("click", function () {
  window.location.href = "locations.html";
});

document.querySelector('[data-i18n="nav_contact"]').addEventListener("click", function () {
  window.location.href = "contacts.html";
});

const form = document.getElementById("contactForm");
const success = document.getElementById("successMsg");

form.addEventListener("submit", function(e){
  e.preventDefault();

  success.style.display = "block";
  success.style.opacity = "0";

  setTimeout(() => {
    success.style.opacity = "1";
  }, 100);

  form.reset();

  setTimeout(() => {
    success.style.display = "none";
  }, 4000);
});

