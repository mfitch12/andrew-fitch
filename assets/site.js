/**
 * Site UI helpers for the static campaign mirror.
 * Replaces former NationBuilder / Van City Studios theme scripts.
 */
(function () {
  'use strict';

  var MQ = {
    sm: window.matchMedia('(min-width: 576px)'),
    md: window.matchMedia('(min-width: 768px)'),
    lg: window.matchMedia('(min-width: 992px)'),
    xl: window.matchMedia('(min-width: 1200px)')
  };

  function currentBreakpoint() {
    if (MQ.xl.matches) return 'xl';
    if (MQ.lg.matches) return 'lg';
    if (MQ.md.matches) return 'md';
    if (MQ.sm.matches) return 'sm';
    return 'xs';
  }

  function isPhoneUa() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(
      navigator.userAgent || ''
    );
  }

  function onResize(fn) {
    var timer = null;
    function run() {
      fn();
    }
    window.addEventListener('resize', function () {
      clearTimeout(timer);
      timer = setTimeout(run, 120);
    });
    window.addEventListener('orientationchange', run);
    run();
  }

  function setupMobileExpandClass(header) {
    if (!isPhoneUa()) return 'md';

    header.classList.remove('navbar-expand-md');
    header.classList.add('navbar-expand-xl');

    var brand = header.querySelector('.navbar-brand-container');
    if (brand) {
      brand.classList.remove('p-md-0', 'px-md-3');
      brand.classList.add('p-xl-0', 'px-xl-3');
    }

    var toolbar = document.getElementById('navbar-toolbar');
    if (toolbar) {
      toolbar.classList.remove('mt-md-0', 'mb-md-0');
      toolbar.classList.add('mt-xl-0', 'mb-xl-0');
      var item = toolbar.querySelector('.navbar-toolbar-item');
      if (item) {
        item.classList.remove('mb-md-0');
        item.classList.add('mb-xl-0');
      }
    }

    return 'xl';
  }

  function setupHeaderLayout(header) {
    var primaryNav = document.getElementById('primaryNav');
    if (!primaryNav) return;

    var expandMatch = header.className.match(/navbar-expand-(\w{2})/);
    var breakpoint = expandMatch ? expandMatch[1] : 'md';
    var order = ['xs', 'sm', 'md', 'lg', 'xl'];

    function placeNav() {
      var fluid = null;
      for (var c = 0; c < header.children.length; c++) {
        if (header.children[c].classList.contains('container-fluid')) {
          fluid = header.children[c];
          break;
        }
      }
      if (!fluid) fluid = header.firstElementChild;
      var bp = currentBreakpoint();
      if (order.indexOf(bp) >= order.indexOf(breakpoint)) {
        if (fluid && primaryNav.parentElement !== fluid) {
          fluid.appendChild(primaryNav);
        }
      } else if (primaryNav.parentElement !== header) {
        header.appendChild(primaryNav);
      }
    }

    onResize(placeNav);
  }

  function setupContentOffset(header) {
    var targets = [
      document.getElementById('hero'),
      document.getElementById('homepage'),
      document.getElementById('content')
    ];

    function apply() {
      var target = null;
      for (var i = 0; i < targets.length; i++) {
        if (targets[i]) {
          target = targets[i];
          break;
        }
      }
      if (!target) return;
      if (!document.body.classList.contains('disable-sticky-nav')) {
        target.style.marginTop = header.offsetHeight + 'px';
      }
    }

    var logo = document.querySelector('.navbar-brand-image');
    if (logo && !logo.complete) {
      logo.addEventListener('load', apply);
    }
    onResize(apply);
  }

  function setupCarouselFeatures() {
    var carousel = document.getElementById('page-features');
    if (!carousel || carousel.classList.contains('hero-slider')) return;

    var captions = Array.prototype.slice.call(
      carousel.querySelectorAll('.carousel-caption')
    );
    if (!captions.length) return;

    function apply() {
      var items = Array.prototype.slice.call(
        carousel.querySelectorAll('.carousel-item')
      );
      var narrow = !MQ.sm.matches;

      captions.forEach(function (caption) {
        var item = caption.closest('.carousel-item');
        if (!item) return;
        if (narrow) {
          item.appendChild(caption);
        } else if (item.firstElementChild) {
          item.firstElementChild.appendChild(caption);
        }
      });

      if (narrow) {
        var maxHeight = 0;
        items.forEach(function (item) {
          item.style.display = 'block';
          maxHeight = Math.max(maxHeight, item.offsetHeight);
          item.style.display = '';
        });
        items.forEach(function (item) {
          item.style.height = maxHeight + 'px';
          if (!item.querySelector('.carousel-caption') && item.firstElementChild) {
            item.firstElementChild.style.setProperty('height', '100%', 'important');
          }
        });
      } else {
        items.forEach(function (item) {
          item.style.height = '';
          if (item.firstElementChild) {
            item.firstElementChild.style.height = '';
          }
        });
      }
    }

    onResize(apply);
  }

  function setupNavAccessibility() {
    var nav = document.getElementById('primaryNav');
    var toggler = document.querySelector('.navbar-toggler');
    if (!nav || !toggler) return;

    nav.addEventListener('click', function (event) {
      var link = event.target.closest('a');
      if (!link || window.getComputedStyle(toggler).display === 'none') return;
      if (typeof window.jQuery === 'function') {
        window.jQuery(nav).collapse('hide');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var header = document.getElementById('header');
    if (!header) return;

    setupMobileExpandClass(header);
    setupHeaderLayout(header);
    setupContentOffset(header);
    setupCarouselFeatures();
    setupNavAccessibility();
  });
})();
