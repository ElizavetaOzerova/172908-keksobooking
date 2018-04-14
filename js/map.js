'use strict';

var CARD_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var CARD_TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo'
];
var CARD_CHECK_HOURS = [
  '12:00',
  '13:00',
  '14:00'
];
var CARD_FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var CARD_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var CARD_LIMIT = 8;
var PIN_SIZE = 40;
var MAIN_PIN_SIZE = 65;
var MAIN_PIN_LEG_SIZE = 22;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;


var generateRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var createRandomUniqueArr = function (originalArr, size) {
  var copyArr = originalArr.slice();
  var counter = originalArr.length < size ? originalArr.length : size;
  var resultArr = [];
  var randomIndex;
  var randomElement;

  while (counter !== 0) {
    randomIndex = generateRandomInt(0, copyArr.length - 1);
    randomElement = copyArr[randomIndex];
    resultArr.push(randomElement);

    copyArr.splice(randomIndex, 1);
    counter--;
  }

  return resultArr;
};


var getRandomArrElement = function (arr) {
  return arr[generateRandomInt(0, arr.length - 1)];
};

var createCardData = function (index) {
  var x = generateRandomInt(300, 900);
  var y = generateRandomInt(150, 500);

  return {
    author: {
      avatar: 'img/avatars/user0' + (index + 1) + '.png',
    },
    offer: {
      title: CARD_TITLES[index],
      address: x + ', ' + y,
      price: generateRandomInt(1000, 1000000),
      type: getRandomArrElement(CARD_TYPES),
      rooms: generateRandomInt(1, 5),
      guests: generateRandomInt(1, 6),
      checkin: getRandomArrElement(CARD_CHECK_HOURS),
      checkout: getRandomArrElement(CARD_CHECK_HOURS),
      features: createRandomUniqueArr(CARD_FEATURES, generateRandomInt(1, CARD_FEATURES.length - 1)),
      description: '',
      photos: createRandomUniqueArr(CARD_PHOTOS, CARD_PHOTOS.length)
    },

    location: {
      x: x,
      y: y
    }
  };
};

var createPinElement = function (data) {
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
  buttonElement.addEventListener('click', function () {
    fillCardElement(data);
  });

  buttonElement.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      fillCardElement(data);
    }
  });

  return buttonElement;
};

var tranformOfferType = function (offerType) {
  switch (offerType) {
    case 'palace':
      return 'Дворец';
    case 'flat':
      return 'Квартира';
    case 'house':
      return 'Дом';
    case 'bungalo':
      return 'Бунгало';
  }

  return offerType;
};

var createFeatureElement = function (featureData) {
  var featureElement = document.createElement('li');

  featureElement.classList.add('popup__feature', 'popup__feature--' + featureData);
  featureElement.textContent = featureData;

  return featureElement;
};

var createPhotoElement = function (photoData, photoTemplate) {
  var photoElement = photoTemplate.cloneNode();

  photoElement.src = photoData;

  return photoElement;
};

var createCardElement = function (cardTemplate) {
  var cardElement = cardTemplate.cloneNode(true);
  var btnClose = cardElement.querySelector('.popup__close');

  cardElement.classList.add('hidden');

  btnClose.addEventListener('click', function () {
    cardElement.classList.add('hidden');
  });

  btnClose.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      cardElement.classList.add('hidden');
    }
  });

  return cardElement;
};

var fillCardElement = function (data) {
  var offer = data.offer;

  var photosElement = cardElement.querySelector('.popup__photos');
  var photosTemplate = cardElement.querySelector('.popup__photo').cloneNode(true);
  var featuresListElement = cardElement.querySelector('.popup__features');

  cardElement.querySelector('.popup__avatar').src = data.author.avatar;

  var textContentCard = {
    '.popup__title': offer.title,
    '.popup__text--address': offer.address,
    '.popup__text--price ': offer.price + '₽/ночь',
    '.popup__type': tranformOfferType(offer.type),
    '.popup__text--capacity': offer.rooms + ' комнат(ы) для ' + offer.guests + ' гостей(я)',
    '.popup__text--time': 'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout,
    '.popup__description': offer.description
  };

  for (var selector in textContentCard) {
    if (textContentCard.hasOwnProperty(selector)) {
      cardElement.querySelector(selector).textContent = textContentCard[selector];
    }
  }

  featuresListElement.innerHTML = '';
  for (var i = 0; i < offer.features.length; i++) {
    featuresListElement.appendChild(createFeatureElement(offer.features[i]));
  }

  photosElement.innerHTML = '';
  for (i = 0; i < offer.photos.length; i++) {
    photosElement.appendChild(createPhotoElement(offer.photos[i], photosTemplate));
  }

  cardElement.classList.remove('hidden');
};

var activatePage = function () {
  mapElement.classList.remove('map--faded');
  adFormElement.classList.remove('ad-form--disabled');
  pinsElement.appendChild(pinsFragment);

  for (i = 0; i < fieldsetElementList.length; i++) {
    fieldsetElementList[i].disabled = false;
  }

  inputAddressElement.value = mainPinElementX + ', ' + (mainPinElementY + MAIN_PIN_LEG_SIZE);
};

var pinsFragment = document.createDocumentFragment();
var cardsData = [];
var cardData;

for (var i = 0; i < CARD_LIMIT; i++) {
  cardData = createCardData(i);
  cardsData.push(cardData);

  pinsFragment.appendChild(
      createPinElement(cardData)
  );
}

var mapElement = document.querySelector('.map');
var pinsElement = document.querySelector('.map__pins');
var cardTemplate = document.querySelector('template').content.querySelector('.map__card');

var cardElement = createCardElement(cardTemplate);
var fieldsetElementList = document.querySelectorAll('fieldset');
var inputAddressElement = document.querySelector('#address');
var adFormElement = document.querySelector('.ad-form');
var mainPinElement = document.querySelector('.map__pin--main');
var mainPinElementX = Math.floor(parseInt(mainPinElement.style.left, 10) + MAIN_PIN_SIZE / 2);
var mainPinElementY = Math.floor(parseInt(mainPinElement.style.top, 10) + MAIN_PIN_SIZE / 2);

for (i = 0; i < fieldsetElementList.length; i++) {
  fieldsetElementList[i].disabled = true;
}

inputAddressElement.value = mainPinElementX + ', ' + mainPinElementY;

mapElement.insertBefore(cardElement, pinsElement);

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    cardElement.classList.add('hidden');
  }
});

mainPinElement.addEventListener('mouseup', function () {
  activatePage();
});


// Валидация 2.3, 2.5, 2.6
var accommodationType = document.querySelector('#type');
var accommodationPrice = document.querySelector('#price');

var accommodationTimeIn = document.querySelector('#timein');
var accommodationTimeOut = document.querySelector('#timeout');

var accommodationRoomNumber = document.querySelector('#room_number');
var accommodationRoomCapacity = document.querySelector('#capacity');

// Синхронизация полей «Тип жилья» и «Цена за ночь»
accommodationType.addEventListener('change', function () {
  switch (accommodationType.options[accommodationType.selectedIndex].value) {
    case 'bungalo':
      accommodationPrice.min = 0;
      accommodationPrice.placeholder = '0';
      break;
    case 'flat':
      accommodationPrice.min = 1000;
      accommodationPrice.placeholder = '1000';
      break;
    case 'house':
      accommodationPrice.min = 5000;
      accommodationPrice.placeholder = '5000';
      break;
    case 'palace':
      accommodationPrice.min = 10000;
      accommodationPrice.placeholder = '10000';
      break;
  }
});


// Синхронизация полей «Время заезда» и «Время выезда»
accommodationTimeIn.addEventListener('change', function () {
  accommodationTimeOut.selectedIndex = accommodationTimeIn.selectedIndex;
});
accommodationTimeOut.addEventListener('change', function () {
  accommodationTimeIn.selectedIndex = accommodationTimeOut.selectedIndex;
});


// Синхронизация полей «Количество комнат» и «Количество мест»
var roomChangeHandler = function () {
  var selectedRoomNumber = Number(accommodationRoomNumber.options[accommodationRoomNumber.selectedIndex].value);
  var selectedRoomCapacity = Number(accommodationRoomCapacity.options[accommodationRoomCapacity.selectedIndex].value);

  if (((selectedRoomNumber >= selectedRoomCapacity) && (selectedRoomCapacity !== 0 && selectedRoomNumber !== 0))
  || (selectedRoomCapacity === 0 && selectedRoomNumber === 0)) {
    accommodationRoomCapacity.setCustomValidity('');
  } else {
    accommodationRoomCapacity.setCustomValidity('Выбранное значение количества гостей не подходит под количество комнат');
  }
};

accommodationRoomNumber.addEventListener('change', roomChangeHandler);
accommodationRoomCapacity.addEventListener('change', roomChangeHandler);
