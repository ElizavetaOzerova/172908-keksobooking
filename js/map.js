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
var PIN_SIZE = 40;
var CARD_LIMIT = 8;


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
      title: CARD_TITLES[generateRandomInt(0, CARD_TITLES.length - 1)],
      address: x + ', ' + y,
      price: generateRandomInt(1000, 1000000),
      type: getRandomArrElement(CARD_TYPES),
      rooms: generateRandomInt(1, 5),
      guests: generateRandomInt(1, 6),
      checkin: getRandomArrElement(CARD_CHECK_HOURS),
      checkout: getRandomArrElement(CARD_CHECK_HOURS),
      features: createRandomUniqueArr(CARD_FEATURES, generateRandomInt(0, CARD_FEATURES.length - 1)),
      description: '',
      photos: createRandomUniqueArr(CARD_PHOTOS, CARD_PHOTOS.length)
    },

    location: {
      x: x,
      y: y
    }
  };
};

var createPinElement = function (cardData) {
  var buttonElement = document.createElement('button');
  var imageElement = document.createElement('img');

  buttonElement.classList.add('map__pin');
  buttonElement.style.left = cardData.location.x + PIN_SIZE / 2 + 'px';
  buttonElement.style.top = cardData.location.y + PIN_SIZE + 'px';

  imageElement.src = cardData.author.avatar;
  imageElement.alt = cardData.offer.title;
  imageElement.style.width = PIN_SIZE + 'px';
  imageElement.style.height = PIN_SIZE + 'px';

  buttonElement.appendChild(imageElement);

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

var createCardElement = function (cardData, cardTemplate) {
  var offer = cardData.offer;

  var cardElement = cardTemplate.cloneNode(true);
  var photoTemplate = cardElement.querySelector('.popup__photo').cloneNode(true);
  var photosElement = cardElement.querySelector('.popup__photos');
  var photoElement;

  photosElement.innerHTML = '';

  var textContentCard = {
    '.popup__title': offer.title,
    '.popup__text--address': offer.address,
    '.popup__text--price ': offer.price + '₽/ночь',
    '.popup__type': tranformOfferType(offer.type),
    '.popup__text--capacity': offer.rooms + ' комнат(ы) для ' + offer.guests + ' гостей(я)',
    '.popup__text--time': 'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout,
    '.popup__features': offer.features.join(', '),
    '.popup__description': offer.description
  };

  for (var selector in textContentCard) {
    if (textContentCard.hasOwnProperty(selector)) {
      cardElement.querySelector(selector).textContent = textContentCard[selector];
    }
  }

  cardElement.querySelector('.popup__avatar').src = cardData.author.avatar;

  for (var i = 0; i < offer.photos.length; i++) {
    photoElement = photoTemplate.cloneNode();
    photoElement.src = offer.photos[i];
    photosElement.appendChild(photoElement);
  }

  return cardElement;
};


var mapElement = document.querySelector('.map');
var pinsElement = document.querySelector('.map__pins');
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');

var pinsFragment = document.createDocumentFragment();
var cardsFragment = document.createDocumentFragment();

var cardsData = [];
var cardData;

for (var i = 0; i < CARD_LIMIT; i++) {
  cardData = createCardData(i);
  cardsData.push(cardData);
  pinsFragment.appendChild(
      createPinElement(cardData)
  );
  cardsFragment.appendChild(
      createCardElement(cardData, mapCardTemplate)
  );
}

pinsElement.appendChild(pinsFragment);
mapElement.insertBefore(cardsFragment, pinsElement);
mapElement.classList.remove('map--faded');
