(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  $('[data-theme-toggle]').addEventListener('click', function () {
    var root = document.documentElement;
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('rt-theme', root.dataset.theme); } catch (e) {}
  });

  var bar = $('[data-bar]');
  var onScroll = function () { bar.classList.toggle('scrolled', window.scrollY > 30); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var band = $('[data-band]'); if (band) band.innerHTML += band.innerHTML;

  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var sib = Array.prototype.slice.call(en.target.parentNode.children);
        en.target.style.transitionDelay = (sib.indexOf(en.target) % 5) * 80 + 'ms';
        en.target.classList.add('in'); io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Instagram embeds: load Instagram's script only when the reels come into view
  var reels = $('[data-reels]');
  if (reels) {
    var loadIg = function () {
      if (window.instgrm) { window.instgrm.Embeds.process(); return; }
      var sc = document.createElement('script');
      sc.async = true; sc.src = 'https://www.instagram.com/embed.js';
      document.body.appendChild(sc);
    };
    if ('IntersectionObserver' in window) {
      var rio = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { loadIg(); rio.disconnect(); }
      }, { rootMargin: '400px 0px' });
      rio.observe(reels);
    } else loadIg();
  }

  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
