'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  var lastTimeout;

  window.debounce = function (action) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(action, DEBOUNCE_INTERVAL);
  };
})();
