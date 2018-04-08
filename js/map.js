'use strict';

// constants

var MAP_CARD_AVATARS = [
  'img/avatars/user01.png',
  'img/avatars/user02.png',
  'img/avatars/user03.png',
  'img/avatars/user04.png',
  'img/avatars/user05.png',
  'img/avatars/user06.png',
  'img/avatars/user07.png',
  'img/avatars/user08.png'
];
var MAP_CARD_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var MAP_CARD_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MAP_CARD_CHECK_HOURS = ['12:00', '13:00', '14:00'];
var MAP_CARD_FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var MAP_CARD_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PIN_SIZE = 40;
var MAP_CARD_LIMIT = 8;

// functions

var generateRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// var generateRandomArr = function (originalArr) {
//   var newArr = [];
//   var length = generateRandomInt(1, originalArr.length);
//   while (newArr.length <= length) {
//     var newArrElement = originalArr[generateRandomInt(0, originalArr.length - 1)];
//
//     if (newArr.indexOf(newArrElement) === -1) {
//       newArr.push(newArrElement);
//     }
//   }
//
//   return newArr;
// };

var getRandomArrElement = function (arr) {
  return arr[generateRandomInt(0, arr.length - 1)];
};

var createMapCardData = function (id) {
  var x = generateRandomInt(300, 900);
  var y = generateRandomInt(150, 500);

  return {
    author: {
      avatar: shuffledAvatars[id]
    },
    offer: {
      title: shuffledTitles[id],
      address: x + ', ' + y,
      price: generateRandomInt(1000, 1000000),
      type: getRandomArrElement(MAP_CARD_TYPES),
      rooms: generateRandomInt(1, 5),
      guests: generateRandomInt(1, 6),
      checkin: getRandomArrElement(MAP_CARD_CHECK_HOURS),
      checkout: getRandomArrElement(MAP_CARD_CHECK_HOURS),
      features: generateRandomArr(MAP_CARD_FEATURES),
      description: '',
      photos: shuffleArrElements(MAP_CARD_PHOTOS)
    },

    location: {
      x: x,
      y: y
    }
  };
};

var shuffleArrElements = function (arr) {
  var shuffleArr = arr.slice();

  var currentIndex = shuffleArr.length;
  var temporaryValue;
  var randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = shuffleArr[currentIndex];
    shuffleArr[currentIndex] = shuffleArr[randomIndex];
    shuffleArr[randomIndex] = temporaryValue;
  }

  return shuffleArr;
};

var createMapCardsData = function () {
  var mapCardsData = [];
  for (var i = 0; i < MAP_CARD_LIMIT; i++) {
    mapCardsData.push(
      createMapCardData(i)
    );
  }

  return mapCardsData;
};

// @TODO: remove
var makeElement = function (tagName, className) {
  var element = document.createElement(tagName);

  if (className) {
    element.classList.add(className);
  }

  return element;
};


// Разметка меток на карте
var createPin = function (adsData) {
  var pinElement = makeElement('button', 'map__pin');
  pinElement.style.left = adsData.location.x + PIN_SIZE / 2 + 'px';
  pinElement.style.top = adsData.location.y + PIN_SIZE + 'px';

  var image = makeElement('img');
  image.src = adsData.author.avatar;
  image.alt = adsData.offer.title;
  image.style.width = PIN_SIZE + 'px';
  image.style.height = PIN_SIZE + 'px';
  pinElement.appendChild(image);

  return pinElement;
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

// @TODO: переименовать в единственное; комнат(ы) для
var getRoomString = function (rooms) {
  if (rooms === 1) {
    return ' комната для ';
  } else if (rooms >= 5) {
    return ' комнат для ';
  }

  return ' комнаты для ';
};

// @TODO: переименовать в единственное; гостя(ей)
var getGuestsString = function (guests) {
  var guestsString = ' гостей ';
  if (String(guests).slice(-1) === '1' && guests !== 11) {
    guestsString = ' гостя ';
  }
  return guestsString;
};

var renderMapCard = function (mapCard) {
  var mapCardElement = mapCardTemplate.cloneNode(true);
  var offer = mapCard.offer;

  mapCardElement.querySelector('.popup__title').textContent = offer.title;
  mapCardElement.querySelector('.popup__text--address').textContent = offer.address;
  mapCardElement.querySelector('.popup__text--price ').textContent = offer.price + '₽/ночь';
  mapCardElement.querySelector('.popup__type').textContent = tranformOfferType(offer.type);
  mapCardElement.querySelector('.popup__text--capacity').textContent = offer.rooms + getRoomString(offer.rooms) + offer.guests + getGuestsString(offer.guests);

  mapCardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout;
  mapCardElement.querySelector('.popup__features').textContent = offer.features;
  mapCardElement.querySelector('.popup__description').textContent = offer.description;

  var img1 = mapCardElement.querySelector('.popup__photo').cloneNode();
  var img2 = mapCardElement.querySelector('.popup__photo').cloneNode();
  var imgList = mapCardElement.querySelectorAll('.popup__photo');

  mapCardElement.querySelector('.popup__photos').appendChild(img1);
  mapCardElement.querySelector('.popup__photos').appendChild(img2);

  for (var k = 0; k < imgList.length; k++) {
    imgList[k].src = offer.photos[k];
  }

  mapCardElement.querySelector('.popup__avatar').src = mapCard.author.avatar;

  return mapCardElement;
};

// main code

var shuffledTitles = shuffleArrElements(MAP_CARD_TITLES);
var shuffledAvatars = shuffleArrElements(MAP_CARD_AVATARS);

var i;
var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
var fragment = document.createDocumentFragment();

var mapCardsData = createMapCardsData();

map.classList.remove('map--faded');

for (i = 0; i < mapCardsData.length; i++) {
  fragment.appendChild(
    createPin(mapCardsData[i])
  );
}

mapPins.appendChild(fragment);

fragment = document.createDocumentFragment();

for (i = 0; i < mapCardsData.length; i++) {
  fragment.appendChild(renderMapCard(mapCardsData[i]));
}

map.insertBefore(fragment, mapPins);
