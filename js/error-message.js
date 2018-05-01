'use strict';

(function () {
  var SHOW_ERROR_TIMEOUT = 6000;

  var errorDataElement = document.createElement('div');

  errorDataElement.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
  errorDataElement.style.color = '#000000';
  errorDataElement.style.textAlign = 'center';
  errorDataElement.style.margin = '0 auto';
  errorDataElement.style.position = 'fixed';
  errorDataElement.style.left = 0;
  errorDataElement.style.right = 0;
  errorDataElement.style.fontSize = '30px';
  errorDataElement.style.zIndex = '100';

  document.body.insertAdjacentElement('afterbegin', errorDataElement);

  window.errorMessage = {
    show: function (errorMessage) {
      if (errorDataElement.classList.contains('hidden')) {
        errorDataElement.classList.remove('hidden');
      }

      errorDataElement.textContent = errorMessage;

      setTimeout(function () {
        errorDataElement.classList.add('hidden');
      }, SHOW_ERROR_TIMEOUT);
    }
  };
})();
