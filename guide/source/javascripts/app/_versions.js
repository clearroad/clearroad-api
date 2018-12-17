//= require ../lib/_jquery
;(function () {
  'use strict';

  var toggleClass = 'toggle-version';
  var show = 'Show';
  var hide = 'Hide';

  function waitForLoaded(callback) {
    if ($('.content .' + toggleClass).length) {
      callback();
    }
    else {
      setTimeout(function() {
        waitForLoaded(callback);
      }, 100);
    }
  }

  function toggleContent($content, $next) {
    var $toggle = $content.find('.' + toggleClass);
    if ($next.hasClass('hidden')) {
      $toggle.text(hide);
      $next.removeClass('hidden');
    }
    else {
      $toggle.text(show);
      $next.addClass('hidden');
    }
  }

  function clickOnToggleVersion(id) {
    var $toc = $('#toc [href="#' + id + '"]');
    toggleContent($toc, $toc.next());
    var $content = $('.content #' + id);
    toggleContent($content, $content.next().next());
  }

  function bindToggleVersion() {
    $('#toc .' + toggleClass).each(function(_i, el) {
      var $ul = $(el).parent().next();
      $ul.addClass('hidden');
      var id = $(el).parent().attr('href').substring(1);

      $(el).click(function() {
        clickOnToggleVersion(id);
      });
    });

    $('.content .' + toggleClass).click(function() {
      var id = $(this).parent().attr('id');
      clickOnToggleVersion(id);
    });
  }

  waitForLoaded(function() {
    bindToggleVersion();
  });
})();

