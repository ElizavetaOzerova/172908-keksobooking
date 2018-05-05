'use strict';

(function () {
  var MAIN_PIN_SIZE = 62;
  var MAIN_PIN_LEG_SIZE = 22;
  var MAIN_PIN_TOP_RESTRICTION = 150;
  var MAIN_PIN_BOTTOM_RESTRICTION = 500;

  var pinsContainerElement = document.querySelector('.map__pins');
  var mainPinElement = document.querySelector('.map__pin--main');


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


      var rightMovementRestriction = finishCoords.left + MAIN_PIN_SIZE;
      var bottomMovementRestriction = finishCoords.top + MAIN_PIN_SIZE + MAIN_PIN_LEG_SIZE;

      if (finishCoords.top < MAIN_PIN_TOP_RESTRICTION) {
        finishCoords.top = MAIN_PIN_TOP_RESTRICTION;
      }
      if (finishCoords.left < 0) {
        finishCoords.left = 0;
      }
      if (rightMovementRestriction > pinsContainerElement.clientWidth) {
        finishCoords.left = pinsContainerElement.clientWidth - MAIN_PIN_SIZE;
      }
      if (bottomMovementRestriction > MAIN_PIN_BOTTOM_RESTRICTION) {
        finishCoords.top = MAIN_PIN_BOTTOM_RESTRICTION - MAIN_PIN_SIZE - MAIN_PIN_LEG_SIZE;
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

    mainPinElement.addEventListener('mouseup', window.map.activate);
  });
})();
