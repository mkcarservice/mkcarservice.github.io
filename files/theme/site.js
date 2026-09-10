// Ersetzt custom.js, plugins.js, jQuery und Weeblys main.js.
// Enthaelt nur, was diese Seite wirklich braucht.

(function () {
  'use strict';

  function bereit(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  bereit(function () {
    // Menuepunkte mit Untermenue markieren und einen Pfeil einsetzen.
    // Auf dem Desktop oeffnet CSS das Untermenue beim Ueberfahren,
    // auf dem Handy oeffnet der Pfeil es per Klick.
    document.querySelectorAll('.wsite-menu-item-wrap, .wsite-menu-subitem-wrap').forEach(function (li) {
      var untermenue = li.querySelector(':scope > .wsite-menu-wrap');
      if (!untermenue) return;

      li.classList.add('has-submenu');

      var pfeil = document.createElement('span');
      pfeil.className = 'icon-caret';
      var link = li.querySelector(':scope > a');
      if (link) link.insertAdjacentElement('afterend', pfeil);

      pfeil.addEventListener('click', function () {
        untermenue.classList.toggle('open');
      });
    });

    // Untermenue offen lassen, wenn die aktuelle Seite darin liegt
    document.querySelectorAll('li.wsite-menu-subitem-wrap.wsite-nav-current').forEach(function (li) {
      var wrap = li.closest('.wsite-menu-wrap');
      if (wrap) wrap.classList.add('open');
    });

    // Hamburger
    document.querySelectorAll('label.hamburger').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.body.classList.toggle('nav-open');
      });
    });

    // Pfeil auf der Startseite scrollt zum Inhalt
    var pfeilRunter = document.getElementById('contentArrow');
    if (pfeilRunter) {
      pfeilRunter.addEventListener('click', function () {
        var ziel = document.querySelector('.main-wrap');
        var kopf = document.querySelector('.paris-header');
        if (!ziel) return;
        var y = ziel.getBoundingClientRect().top + window.pageYOffset - (kopf ? kopf.offsetHeight : 0);
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    }
  });
})();
