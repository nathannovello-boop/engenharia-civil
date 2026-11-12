/* ==========================================================================
   ENGENHARIA CIVIL — Feira de Profissões
   JavaScript puro, sem bibliotecas.

   Índice
   1. Utilidades
   2. Menu móvel
   3. Seção ativa no menu
   4. Animações de entrada (e gráficos)
   5. Linha do tempo (abas acessíveis)
   6. Cartões de áreas de atuação
   7. Botão "voltar ao topo"
   8. Fotografia opcional do hero
   9. Galeria: janela de ampliação (lightbox)
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- 1. UTILIDADES ---------- */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var desktopQuery = window.matchMedia('(min-width: 961px)');

  /* ---------- 2. MENU MÓVEL ---------- */
  function initMobileMenu() {
    var header = $('.site-header');
    var toggle = $('.nav-toggle');
    var nav = $('#menu');
    if (!header || !toggle || !nav) { return; }

    function setOpen(open, returnFocus) {
      header.classList.toggle('is-open', open);
      document.documentElement.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.nav-toggle__label').textContent = open ? 'Fechar' : 'Menu';
      if (!open && returnFocus) { toggle.focus(); }
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Fecha ao escolher um item do menu
    $$('a', nav).forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });

    // Fecha com Esc
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && header.classList.contains('is-open')) {
        setOpen(false, true);
      }
    });

    // Ao voltar para telas largas, garante estado limpo
    var onChange = function () { if (desktopQuery.matches) { setOpen(false); } };
    if (desktopQuery.addEventListener) { desktopQuery.addEventListener('change', onChange); }
    else if (desktopQuery.addListener) { desktopQuery.addListener(onChange); }
  }

  /* ---------- 3. SEÇÃO ATIVA NO MENU ---------- */
  function initActiveSection() {
    var links = $$('.site-nav a[href^="#"]');
    var items = links.map(function (link) {
      var target = document.getElementById(link.getAttribute('href').slice(1));
      return target ? { link: link, target: target } : null;
    }).filter(Boolean);
    if (!items.length) { return; }

    var ticking = false;

    function update() {
      ticking = false;
      var headerH = ($('.site-header') || { offsetHeight: 0 }).offsetHeight;
      var line = headerH + window.innerHeight * 0.3; // "linha de leitura" da tela
      var current = null;

      items.forEach(function (item) {
        if (item.target.getBoundingClientRect().top <= line) { current = item; }
      });

      // No fim da página, o último item (créditos) deve ficar ativo
      var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) { current = items[items.length - 1]; }

      items.forEach(function (item) {
        if (item === current) { item.link.setAttribute('aria-current', 'location'); }
        else { item.link.removeAttribute('aria-current'); }
      });
    }

    function onScroll() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ---------- 4. ANIMAÇÕES DE ENTRADA (e gráficos) ---------- */
  function initReveal() {
    var targets = $$('.reveal');
    if (!targets.length) { return; }

    if (!('IntersectionObserver' in window) || prefersReducedMotion.matches) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- 5. LINHA DO TEMPO ---------- */
  function initTimeline() {
    var root = $('[data-timeline]');
    if (!root) { return; }

    var tabs = $$('[role="tab"]', root);
    var panels = tabs.map(function (tab) { return document.getElementById(tab.getAttribute('aria-controls')); });
    var prev = $('[data-tl-prev]', root);
    var next = $('[data-tl-next]', root);
    var counter = $('[data-tl-current]', root);
    var index = 0;

    function select(newIndex, focusTab) {
      index = Math.max(0, Math.min(tabs.length - 1, newIndex));

      tabs.forEach(function (tab, i) {
        var active = i === index;
        tab.setAttribute('aria-selected', String(active));
        tab.setAttribute('tabindex', active ? '0' : '-1');
        tab.classList.toggle('is-passed', i < index);
        panels[i].hidden = !active;
      });

      if (counter) { counter.textContent = String(index + 1); }
      if (prev) { prev.disabled = index === 0; }
      if (next) { next.disabled = index === tabs.length - 1; }
      if (focusTab) { tabs[index].focus(); }
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(i); });
      tab.addEventListener('keydown', function (event) {
        var map = { ArrowRight: index + 1, ArrowDown: index + 1, ArrowLeft: index - 1, ArrowUp: index - 1, Home: 0, End: tabs.length - 1 };
        if (Object.prototype.hasOwnProperty.call(map, event.key)) {
          event.preventDefault();
          select(map[event.key], true);
        }
      });
    });

    if (prev) { prev.addEventListener('click', function () { select(index - 1); }); }
    if (next) { next.addEventListener('click', function () { select(index + 1); }); }

    select(0);
  }

  /* ---------- 6. CARTÕES DE ÁREAS ---------- */
  function initAreas() {
    $$('.area__toggle').forEach(function (button) {
      var panel = document.getElementById(button.getAttribute('aria-controls'));
      if (!panel) { return; }
      button.addEventListener('click', function () {
        var expand = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(expand));
        panel.hidden = !expand;
      });
    });
  }

  /* ---------- 7. VOLTAR AO TOPO ---------- */
  function initBackToTop() {
    var button = $('.to-top');
    if (!button) { return; }
    var shown = false;
    var ticking = false;

    function update() {
      ticking = false;
      var shouldShow = window.scrollY > 700;
      if (shouldShow !== shown) { shown = shouldShow; button.hidden = !shown; }
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });

    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
      var hero = document.getElementById('inicio');
      if (hero) { hero.setAttribute('tabindex', '-1'); hero.focus({ preventScroll: true }); }
    });

    update();
  }

  /* ---------- 8. FOTOGRAFIA OPCIONAL DO HERO ---------- */
  // Se assets/images/hero.jpg existir, ela aparece sobre o desenho técnico.
  // Se não existir (ou falhar ao carregar), o desenho permanece e o layout continua íntegro.
  function initHeroPhoto() {
    var hero = $('.hero');
    var photo = $('.hero__photo');
    if (!hero || !photo) { return; }

    var captionDrawing = $('.hero__caption-drawing');
    var captionPhoto = $('.hero__caption-photo');

    function showPhoto() {
      hero.classList.add('has-photo');
      if (captionDrawing) { captionDrawing.hidden = true; }
      if (captionPhoto) { captionPhoto.hidden = false; }
    }
    function hidePhoto() {
      hero.classList.remove('has-photo');
      photo.removeAttribute('src');
    }

    if (photo.complete) {
      if (photo.naturalWidth > 0) { showPhoto(); } else { hidePhoto(); }
    } else {
      photo.addEventListener('load', showPhoto, { once: true });
      photo.addEventListener('error', hidePhoto, { once: true });
    }
  }

  /* ---------- 9. GALERIA: LIGHTBOX ---------- */
  // Funciona com qualquer botão [data-lightbox-open] que contenha uma <img>.
  // Fecha com Esc (nativo do <dialog>), com o botão × ou clicando fora da imagem.
  function initLightbox() {
    var dialog = $('#lightbox');
    if (!dialog) { return; }

    var img = $('.lightbox__img', dialog);
    var caption = $('.lightbox__caption', dialog);
    var closeButton = $('.lightbox__close', dialog);
    var lastTrigger = null;

    function open(trigger) {
      var source = $('img', trigger);
      if (!source) { return; }
      var figure = trigger.closest('figure');
      var captionEl = figure ? $('figcaption', figure) : null;

      lastTrigger = trigger;
      img.src = source.currentSrc || source.src;
      img.alt = source.alt || '';
      caption.textContent = captionEl ? captionEl.textContent.trim() : source.alt;

      if (typeof dialog.showModal === 'function') { dialog.showModal(); }
      else { dialog.setAttribute('open', ''); }
      closeButton.focus();
    }

    function close() {
      if (typeof dialog.close === 'function') { dialog.close(); }
      else { dialog.removeAttribute('open'); }
    }

    // Delegação: funciona também para fotos adicionadas depois no HTML
    document.addEventListener('click', function (event) {
      var trigger = event.target.closest ? event.target.closest('[data-lightbox-open]') : null;
      if (trigger) { open(trigger); }
    });

    closeButton.addEventListener('click', close);

    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) { close(); } // clique no fundo
    });

    dialog.addEventListener('close', function () {
      img.removeAttribute('src');
      if (lastTrigger) { lastTrigger.focus(); }
    });

    // Fallback para navegadores sem <dialog>
    dialog.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && typeof dialog.showModal !== 'function') { close(); }
    });
  }

  /* ---------- INICIALIZAÇÃO ---------- */
  function init() {
    initMobileMenu();
    initActiveSection();
    initReveal();
    initTimeline();
    initAreas();
    initBackToTop();
    initHeroPhoto();
    initLightbox();
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})();
