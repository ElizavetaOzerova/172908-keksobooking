'use strict';

var CARD_AVATARS = [
  'img/avatars/user01.png',
  'img/avatars/user02.png',
  'img/avatars/user03.png',
  'img/avatars/user04.png',
  'img/avatars/user05.png',
  'img/avatars/user06.png',
  'img/avatars/user07.png',
  'img/avatars/user08.png'
];
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
var CARD_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CARD_CHECK_HOURS = ['12:00', '13:00', '14:00'];
var CARD_FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var CARD_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
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

var createCardData = function () {
  var x = generateRandomInt(300, 900);
  var y = generateRandomInt(150, 500);

  return {
    author: {
      avatar: CARD_AVATARS[generateRandomInt(1, CARD_AVATARS.length)]
    },
    offer: {
      title: CARD_TITLES[generateRandomInt(1, CARD_TITLES.length)],
      address: x + ', ' + y,
      price: generateRandomInt(1000, 1000000),
      type: getRandomArrElement(CARD_TYPES),
      rooms: generateRandomInt(1, 5),
      guests: generateRandomInt(1, 6),
      checkin: getRandomArrElement(CARD_CHECK_HOURS),
      checkout: getRandomArrElement(CARD_CHECK_HOURS),
      features: createRandomUniqueArr(CARD_FEATURES, generateRandomInt(1, CARD_FEATURES.length)),
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

var renderCard = function (mapCard) {
  var mapCardElement = mapCardTemplate.cloneNode(true);
  var offer = mapCard.offer;

  mapCardElement.querySelector('.popup__title').textContent = offer.title;
  mapCardElement.querySelector('.popup__text--address').textContent = offer.address;
  mapCardElement.querySelector('.popup__text--price ').textContent = offer.price + '₽/ночь';
  mapCardElement.querySelector('.popup__type').textContent = tranformOfferType(offer.type);
  mapCardElement.querySelector('.popup__text--capacity').textContent = offer.rooms + ' комнат(ы) для ' + offer.guests + ' гостей(я) ';

  mapCardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout;
  mapCardElement.querySelector('.popup__features').textContent = offer.features.join(', ');
  mapCardElement.querySelector('.popup__description').textContent = offer.description;

  var img1 = mapCardElement.querySelector('.popup__photo').cloneNode();
  var img2 = mapCardElement.querySelector('.popup__photo').cloneNode();

  mapCardElement.querySelector('.popup__photos').appendChild(img1);
  mapCardElement.querySelector('.popup__photos').appendChild(img2);
  var imgList = mapCardElement.querySelectorAll('.popup__photo');

  for (var i = 0; i < imgList.length; i++) {
    imgList[i].src = offer.photos[i];
  }

  mapCardElement.querySelector('.popup__avatar').src = mapCard.author.avatar;

  return mapCardElement;
};

// main code

var i;
var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');

var fragment1 = document.createDocumentFragment();
var fragment2 = document.createDocumentFragment();

var mapCardsData = [];

for (i = 0; i < CARD_LIMIT; i++) {
  mapCardsData.push(
      createCardData(i)
  );
  fragment1.appendChild(
      createPinElement(mapCardsData[i])
  );
  fragment2.appendChild(
      renderCard(mapCardsData[i])
  );
}

mapPins.appendChild(fragment1);

map.classList.remove('map--faded');

map.insertBefore(fragment2, mapPins);
