'use strict';

(function () {
  var PIN_SIZE = 40;
  var ENTER_KEYCODE = 13;

  window.createPinElement = function (data) {
    var buttonElement = document.createElement('button');
    var imageElement = document.createElement('img');

    buttonElement.classList.add('map__pin');
    buttonElement.style.left = data.location.x + PIN_SIZE / 2 + 'px';
    buttonElement.style.top = data.location.y + PIN_SIZE + 'px';

    imageElement.src = data.author.avatar;
    imageElement.alt = data.offer.title;
    imageElement.style.width = PIN_SIZE + 'px';
    imageElement.style.height = PIN_SIZE + 'px';

    buttonElement.appendChild(imageElement);

    var fillCard = function () {
      window.fillCardElement(data);
    };

    buttonElement.addEventListener('click', fillCard);

    buttonElement.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        fillCard();
      }
    });

    return buttonElement;
  };
})();
