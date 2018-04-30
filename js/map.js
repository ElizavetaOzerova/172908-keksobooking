'use strict';

(function () {
  var MAIN_PIN_SIZE = 62;
  var MAIN_PIN_LEG_SIZE = 22;
  var PINS_LIMIT = 5;
  var FILTER_FIELDS_ID_PREFIX_LENGTH = 8;

  var mapElement = document.querySelector('.map');
  var pinsContainerElement = document.querySelector('.map__pins');
  var fieldsetElementList = document.querySelectorAll('fieldset');
  var inputAddressElement = document.querySelector('#address');
  var formElement = document.querySelector('.ad-form');
  var mainPinElement = document.querySelector('.map__pin--main');
  var mainPinElementX = Math.floor(mainPinElement.offsetLeft + MAIN_PIN_SIZE / 2);
  var mainPinElementY = Math.floor(mainPinElement.offsetTop + MAIN_PIN_SIZE / 2);
  var filtersFormElement = document.querySelector('.map__filters');
  var filtersSelectList = filtersFormElement.querySelectorAll('select');
  var filtersfeaturesContanerElement = filtersFormElement.querySelector('#housing-features');
  var filtersFeaturesInputList = filtersfeaturesContanerElement.querySelectorAll('input');
  var filterValuesObj = {};


  var setPriceCategoryName = function (price) {
    var priceCategoryName;
    if (price >= 10000 && price <= 50000) {
      priceCategoryName = 'middle';
    } else if (price < 10000) {
      priceCategoryName = 'low';
    } else if (price > 50000) {
      priceCategoryName = 'high';
    }
    return priceCategoryName;
  };

  var isArrContainsOtherArrItems = function (where, what) {
    for (var i = 0; i < what.length; i++) {
      if (where.indexOf(what[i]) === -1) {
        return false;
      }
    }
    return true;
  };

  var cancelPinsAndCard = function () {
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

  var fillFilterValuesObj = function () {
    for (var i = 0; i < filtersSelectList.length; i++) {
      filterValuesObj[filtersSelectList[i].id.slice(FILTER_FIELDS_ID_PREFIX_LENGTH)] = filtersSelectList[i].value;
    }

    filterValuesObj.features = [];
    for (i = 0; i < filtersFeaturesInputList.length; i++) {
      if (filtersFeaturesInputList[i].checked) {
        filterValuesObj.features.push(filtersFeaturesInputList[i].value);
      }
    }
  };

  var filterData = function (data) {
    var filteredData = data
        .filter(function (item) {
          if (filterValuesObj.type === 'any') {
            return true;
          }
          return item.offer.type === filterValuesObj.type;
        })
        .filter(function (item) {
          if (filterValuesObj.rooms === 'any') {
            return true;
          }
          return item.offer.rooms === parseInt(filterValuesObj.rooms, 10);
        })
        .filter(function (item) {
          if (filterValuesObj.guests === 'any') {
            return true;
          }
          return item.offer.guests === parseInt(filterValuesObj.guests, 10);
        })
        .filter(function (item) {
          if (filterValuesObj.price === 'any') {
            return true;
          } else {
            var value = setPriceCategoryName(item.offer.price);
            return value === filterValuesObj.price;
          }
        })
        .filter(function (item) {
          if (!filterValuesObj.features.length) {
            return true;
          } else {
            return isArrContainsOtherArrItems(item.offer.features, filterValuesObj.features);
          }
        });

    return filteredData;
  };


  filtersFormElement.addEventListener('change', function () {
    var cachedData = window.backend.getСachedData();
    fillFilterValuesObj();

    var updatePins = function () {
      successGetDataHandler(filterData(cachedData));
    };

    window.debounce(updatePins);
  });


  var successGetDataHandler = function (data) {
    var visibleDataArr = data.slice(0, PINS_LIMIT);
    var pinsFragment = document.createDocumentFragment();

    cancelPinsAndCard();

    for (var i = 0; i < visibleDataArr.length; i++) {
      pinsFragment.appendChild(
          window.createPinElement(visibleDataArr[i])
      );
    }

    pinsContainerElement.appendChild(pinsFragment);
  };


  var mouseDownActivatePageHandler = function () {
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

    cancelPinsAndCard();

    for (var i = 0; i < fieldsetElementList.length; i++) {
      fieldsetElementList[i].disabled = true;
    }

    inputAddressElement.value = mainPinElementX + ', ' + mainPinElementY;

    for (i = 0; i < filtersSelectList.length; i++) {
      filtersSelectList[i].options[0].selected = true;
    }
    for (i = 0; i < filtersFeaturesInputList.length; i++) {
      filtersFeaturesInputList[i].checked = false;
    }
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
