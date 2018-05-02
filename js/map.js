'use strict';

(function () {
  var MAIN_PIN_SIZE = 62;
  var MAIN_PIN_LEG_SIZE = 22;
  var PINS_LIMIT = 5;

  var mapElement = document.querySelector('.map');
  var pinsContainerElement = document.querySelector('.map__pins');
  var fieldsetElementList = document.querySelectorAll('fieldset');
  var inputAddressElement = document.querySelector('#address');
  var formElement = document.querySelector('.ad-form');
  var mainPinElement = document.querySelector('.map__pin--main');
  var mainPinElementX = Math.floor(mainPinElement.offsetLeft + MAIN_PIN_SIZE / 2);
  var mainPinElementY = Math.floor(mainPinElement.offsetTop + MAIN_PIN_SIZE / 2);
  var filtersFormElement = document.querySelector('.map__filters');
  var cachedData;

  var clearMap = function () {
    if (window.cardElement) {
      window.cardElement.classList.add('hidden');
    }

    var pinsList = pinsContainerElement.querySelectorAll('.map__pin');
    if (pinsList) {
      pinsList.forEach(function (item) {
        if (!item.classList.contains('map__pin--main')) {
          item.remove();
        }
      });
    }
  };

  var setFormDefaultState = function () {
    for (var i = 0; i < fieldsetElementList.length; i++) {
      fieldsetElementList[i].disabled = true;
    }

    inputAddressElement.value = mainPinElementX + ', ' + mainPinElementY;
  };

  var successGetDataHandler = function (data) {
    cachedData = data.slice();
    renderPins(data);
  };


  var renderPins = function (data) {
    var visibleDataArr = data.slice(0, PINS_LIMIT);
    var pinsFragment = document.createDocumentFragment();

    clearMap();

    for (var i = 0; i < visibleDataArr.length; i++) {
      pinsFragment.appendChild(
          window.createPinElement(visibleDataArr[i])
      );
    }

    pinsContainerElement.appendChild(pinsFragment);
  };


  window.mouseDownActivatePageHandler = function () {
    window.backend.loadCardsData(successGetDataHandler, window.errorMessage.show);

    mapElement.classList.remove('map--faded');
    formElement.classList.remove('ad-form--disabled');

    for (var i = 0; i < fieldsetElementList.length; i++) {
      fieldsetElementList[i].disabled = false;
    }

    inputAddressElement.value = Math.floor(mainPinElement.offsetLeft + MAIN_PIN_SIZE / 2) + ', ' + (mainPinElement.offsetTop + MAIN_PIN_SIZE + MAIN_PIN_LEG_SIZE);
  };


  window.inactivatePageHandler = function () {
    mapElement.classList.add('map--faded');
    formElement.classList.add('ad-form--disabled');

    mainPinElement.style.top = (mapElement.offsetHeight / 2) + 'px';
    mainPinElement.style.left = (mapElement.offsetWidth / 2 - MAIN_PIN_SIZE / 2) + 'px';

    clearMap();
    setFormDefaultState();
    window.mapFilter.reset();
  };


  setFormDefaultState();
  mapElement.insertBefore(window.cardElement, pinsContainerElement);


  filtersFormElement.addEventListener('change', function () {
    var updatePins = function () {
      renderPins(window.mapFilter.filterData(cachedData));
    };

    window.debounce(updatePins);
  });
})();
