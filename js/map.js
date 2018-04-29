'use strict';

(function () {
  var MAIN_PIN_SIZE = 62;
  var MAIN_PIN_LEG_SIZE = 22;

  var mapElement = document.querySelector('.map');
  var pinsContainerElement = document.querySelector('.map__pins');
  var fieldsetElementList = document.querySelectorAll('fieldset');
  var inputAddressElement = document.querySelector('#address');
  var adFormElement = document.querySelector('.ad-form');
  var mainPinElement = document.querySelector('.map__pin--main');
  var mainPinElementX = Math.floor(mainPinElement.offsetLeft + MAIN_PIN_SIZE / 2);
  var mainPinElementY = Math.floor(mainPinElement.offsetTop + MAIN_PIN_SIZE / 2);


  var successGetDataHandler = function (data) {
    var pinsFragment = document.createDocumentFragment();

    for (var i = 0; i < data.length; i++) {
      pinsFragment.appendChild(
          window.createPinElement(data[i])
      );
    }

    pinsContainerElement.appendChild(pinsFragment);
  };

  var errorGetDataHandler = function (errorMessage) {
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
  };


  var mouseDownActivatePageHandler = function () {
    window.backend.loadCardsData(successGetDataHandler, errorGetDataHandler);

    mapElement.classList.remove('map--faded');
    adFormElement.classList.remove('ad-form--disabled');

    for (i = 0; i < fieldsetElementList.length; i++) {
      fieldsetElementList[i].disabled = false;
    }

    inputAddressElement.value = Math.floor(mainPinElement.offsetLeft + MAIN_PIN_SIZE / 2) + ', ' + (mainPinElement.offsetTop + MAIN_PIN_SIZE + MAIN_PIN_LEG_SIZE);
  };


  window.inactivatePageHandler = function () {
    mapElement.classList.add('map--faded');
    adFormElement.classList.add('ad-form--disabled');

    // выствляем главной метке изначальные координаты
    mainPinElement.style.top = (mapElement.offsetHeight / 2) + 'px';
    mainPinElement.style.left = (mapElement.offsetWidth / 2 - MAIN_PIN_SIZE / 2) + 'px';

    // удаляем пины
    var pinsList = pinsContainerElement.querySelectorAll('.map__pin');
    pinsList.forEach(function (item) {
      if (!item.classList.contains('map__pin--main')) {
        item.remove();
      }
    });

    // прячем карточку
    if (window.cardElement) {
      window.cardElement.classList.add('hidden');
    }

    for (i = 0; i < fieldsetElementList.length; i++) {
      fieldsetElementList[i].disabled = true;
    }

    inputAddressElement.value = mainPinElementX + ', ' + mainPinElementY;
  };


  for (var i = 0; i < fieldsetElementList.length; i++) {
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

    mainPinElement.addEventListener('mouseup', mouseDownActivatePageHandler);
  });

})();
