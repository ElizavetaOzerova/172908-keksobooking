'use strict';

(function () {
  var successElement = document.querySelector('.success');
  var formElement = document.querySelector('.ad-form');
  var typeField = formElement.querySelector('#type');
  var priceField = formElement.querySelector('#price');
  var timeInField = formElement.querySelector('#timein');
  var timeOutField = formElement.querySelector('#timeout');
  var roomNumberField = formElement.querySelector('#room_number');
  var roomCapacityField = formElement.querySelector('#capacity');
  var formResetBtn = formElement.querySelector('.ad-form__reset');


  typeField.addEventListener('change', function (evt) {
    switch (evt.currentTarget.value) {
      case 'bungalo':
        priceField.min = 0;
        priceField.placeholder = '0';
        break;
      case 'flat':
        priceField.min = 1000;
        priceField.placeholder = '1000';
        break;
      case 'house':
        priceField.min = 5000;
        priceField.placeholder = '5000';
        break;
      case 'palace':
        priceField.min = 10000;
        priceField.placeholder = '10000';
        break;
    }
  });


  var roomChangeHandler = function () {
    var validationRoomToCapacityMap = {
      1: ['1'],
      2: ['2', '1'],
      3: ['3', '2', '1'],
      100: ['0']
    };

    var selectedRoomNumber = roomNumberField.options[roomNumberField.selectedIndex].value;
    var selectedRoomCapacity = roomCapacityField.options[roomCapacityField.selectedIndex].value;

    var isCapacityWrong = validationRoomToCapacityMap[selectedRoomNumber].indexOf(selectedRoomCapacity) === -1;

    if (isCapacityWrong) {
      roomCapacityField.setCustomValidity('Выбранное количество гостей не подходит под количество комнат');
    } else {
      roomCapacityField.setCustomValidity('');
    }
  };

  timeInField.addEventListener('change', function () {
    timeOutField.selectedIndex = timeInField.selectedIndex;
  });
  timeOutField.addEventListener('change', function () {
    timeInField.selectedIndex = timeOutField.selectedIndex;
  });

  roomNumberField.addEventListener('change', roomChangeHandler);
  roomCapacityField.addEventListener('change', roomChangeHandler);


  var successSendFormDataHandler = function () {
    successElement.classList.remove('hidden');

    setTimeout(function () {
      successElement.classList.add('hidden');
    }, 3000);

    formElement.reset();
    window.inactivatePageHandler();
  };


  formResetBtn.addEventListener('click', function () {
    formElement.reset();
    window.inactivatePageHandler();
  });


  formElement.addEventListener('submit', function (evt) {
    window.backend.sendFormData(new FormData(formElement), successSendFormDataHandler, window.errorMessage.show);

    evt.preventDefault();
  });
})();
