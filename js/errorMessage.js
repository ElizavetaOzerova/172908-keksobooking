'use strict';

window.errorMessage = (function () {
  return {
    show: function (errorMessage) {
      var errorDataElement = document.createElement('div');
      errorDataElement.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: rgba(255, 0, 0, 0.8); color: #000000;';
      errorDataElement.style.position = 'fixed';
      errorDataElement.style.left = 0;
      errorDataElement.style.right = 0;
      errorDataElement.style.fontSize = '30px';

      errorDataElement.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', errorDataElement);

      setTimeout(function () {
        errorDataElement.classList.add('hidden');
      }, 6000);
    }
  };
})();
