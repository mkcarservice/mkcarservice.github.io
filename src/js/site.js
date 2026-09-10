// Skript von mkcarservice.de. Quelle für den Build (npm run build),
// der daraus assets/site.<hash>.js erzeugt. Enthält nur, was die Seite braucht:
// das Menü auf dem Handy und die Untermenüs.

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
    // Menüpunkte mit Untermenü markieren und einen Pfeil-Button einsetzen.
    // Auf dem Desktop öffnet CSS das Untermenü beim Überfahren oder per
    // Tastaturfokus, auf dem Handy öffnet der Pfeil es per Klick.
    document.querySelectorAll('.wsite-menu-item-wrap, .wsite-menu-subitem-wrap').forEach(function (li, i) {
      var untermenue = li.querySelector(':scope > .wsite-menu-wrap');
      if (!untermenue) return;

      li.classList.add('has-submenu');
      untermenue.id = untermenue.id || 'untermenue-' + i;

      var pfeil = document.createElement('button');
      pfeil.type = 'button';
      pfeil.className = 'icon-caret';
      pfeil.setAttribute('aria-expanded', 'false');
      pfeil.setAttribute('aria-controls', untermenue.id);
      pfeil.setAttribute('aria-label', 'Untermenü öffnen');
      var link = li.querySelector(':scope > a');
      if (link) link.insertAdjacentElement('afterend', pfeil);

      pfeil.addEventListener('click', function () {
        var offen = untermenue.classList.toggle('open');
        pfeil.setAttribute('aria-expanded', String(offen));
        pfeil.setAttribute('aria-label', offen ? 'Untermenü schließen' : 'Untermenü öffnen');
      });
    });

    // Untermenü offen lassen, wenn die aktuelle Seite darin liegt
    document.querySelectorAll('li.wsite-menu-subitem-wrap.wsite-nav-current').forEach(function (li) {
      var wrap = li.closest('.wsite-menu-wrap');
      if (!wrap) return;
      wrap.classList.add('open');
      var pfeil = wrap.parentNode.querySelector(':scope > .icon-caret');
      if (pfeil) pfeil.setAttribute('aria-expanded', 'true');
    });

    // Hamburger
    var hamburger = document.querySelector('.paris-header .hamburger');
    if (!hamburger) return;

    function menue(offen) {
      document.body.classList.toggle('nav-open', offen);
      hamburger.setAttribute('aria-expanded', String(offen));
      hamburger.setAttribute('aria-label', offen ? 'Menü schließen' : 'Menü öffnen');
    }

    hamburger.addEventListener('click', function () {
      menue(!document.body.classList.contains('nav-open'));
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        menue(false);
        hamburger.focus();
      }
    });
  });
})();
