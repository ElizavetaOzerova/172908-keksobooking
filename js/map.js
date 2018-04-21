'use strict';

(function () {
  var MAIN_PIN_SIZE = 62;
  var MAIN_PIN_LEG_SIZE = 22;

  var pinsFragment = document.createDocumentFragment();
  var cardsData = window.generateCardsData();

  var mapElement = document.querySelector('.map');
  var pinsContainerElement = document.querySelector('.map__pins');
  var fieldsetElementList = document.querySelectorAll('fieldset');
  var inputAddressElement = document.querySelector('#address');
  var adFormElement = document.querySelector('.ad-form');
  var mainPinElement = document.querySelector('.map__pin--main');
  var mainPinElementX = Math.floor(mainPinElement.offsetLeft + MAIN_PIN_SIZE / 2);
  var mainPinElementY = Math.floor(mainPinElement.offsetTop + MAIN_PIN_SIZE / 2);


  var mouseDownActivatePageHandler = function () {
    mapElement.classList.remove('map--faded');
    adFormElement.classList.remove('ad-form--disabled');
    pinsContainerElement.appendChild(pinsFragment);

    for (i = 0; i < fieldsetElementList.length; i++) {
      fieldsetElementList[i].disabled = false;
    }

    inputAddressElement.value = Math.floor(mainPinElement.offsetLeft + MAIN_PIN_SIZE / 2) + ', ' + (mainPinElement.offsetLeft + MAIN_PIN_SIZE + MAIN_PIN_LEG_SIZE);
  };

  for (var i = 0; i < cardsData.length; i++) {
    pinsFragment.appendChild(
        window.createPinElement(cardsData[i])
    );
  }


  for (i = 0; i < fieldsetElementList.length; i++) {
    fieldsetElementList[i].disabled = true;
  }

  inputAddressElement.value = mainPinElementX + ', ' + mainPinElementY;

  mapElement.insertBefore(window.cardElement, pinsContainerElement);


  mainPinElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var finishCoords = {
        top: mainPinElement.offsetTop - shift.y,
        left: mainPinElement.offsetLeft - shift.x
      };


      if (finishCoords.top < 0) {
        finishCoords.top = 0;
      }
      if (finishCoords.left < 0) {
        finishCoords.left = 0;
      }
      if (finishCoords.left + MAIN_PIN_SIZE > pinsContainerElement.clientWidth) {
        finishCoords.left = pinsContainerElement.clientWidth - MAIN_PIN_SIZE;
      }
      if (finishCoords.top + MAIN_PIN_SIZE + MAIN_PIN_LEG_SIZE > pinsContainerElement.clientHeight) {
        finishCoords.top = pinsContainerElement.clientHeight - MAIN_PIN_SIZE - MAIN_PIN_LEG_SIZE;
      }

      mainPinElement.style.top = finishCoords.top + 'px';
      mainPinElement.style.left = finishCoords.left + 'px';
    };


    var mouseUpHandler = function () {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });


  document.addEventListener('mouseup', mouseDownActivatePageHandler);
})();
