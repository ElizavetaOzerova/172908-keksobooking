'use strict';

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

var createMapCardData = function (id) {
  var mapCardData = {
    'author': {
      'avatar': shuffledAvatars[id]
    },

    'offer': {
      'title': shuffledTitles[id],
      'address': getRandomInt(300, 900) + ', ' + getRandomInt(150, 500),
      'price': getRandomInt(1000, 1000000),
      'type': getRandomArrElement(MAP_CARD_TYPES),
      'rooms': getRandomInt(1, 5),
      'guests': getRandomInt(1, 6),
      'checkin': getRandomArrElement(MAP_CARD_CHECK_HOURS),
      'checkout': getRandomArrElement(MAP_CARD_CHECK_HOURS),
      'features': getRandomArr(MAP_CARD_FEATURES),
      'description': '',
      'photos': shuffleArrElements(MAP_CARD_PHOTOS)
    },

    'location': {
      'x': getRandomInt(300, 900),
      'y': getRandomInt(150, 500)
    }
  };

  return mapCardData;
};

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomArrElement = function (arr) {
  var offerType = arr[getRandomInt(0, arr.length - 1)];
  return offerType;
};

var getRandomArr = function (arr) {
  var newArr = [];
  while (newArr.length <= getRandomInt(1, arr.length)) {
    var newArrElement = arr[getRandomInt(0, arr.length - 1)];

    if (newArr.indexOf(newArrElement) === -1) {
      newArr.push(' ' + newArrElement);
    }
  }

  return newArr;
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

var mapCardsData = [];
var shuffledTitles = shuffleArrElements(MAP_CARD_TITLES);
var shuffledAvatars = shuffleArrElements(MAP_CARD_AVATARS);

var getMapCardsData = function () {
  for (var i = 0; i < 8; i++) {
    var mapCardElementData = createMapCardData(i);
    mapCardsData.push(mapCardElementData);
  }
};

getMapCardsData();


var map = document.querySelector('.map');
map.classList.remove('map--faded');

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

var mapPins = document.querySelector('.map__pins');
var fragment = document.createDocumentFragment();

for (var h = 0; h < mapCardsData.length; h++) {
  var pin = createPin(mapCardsData[h]);
  fragment.appendChild(pin);
}
mapPins.appendChild(fragment);


// Разметка объявлений на карте
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');

var renderMapCard = function (mapCard) {
  var mapCardElement = mapCardTemplate.cloneNode(true);

  mapCardElement.querySelector('.popup__title').textContent = mapCard.offer.title;
  mapCardElement.querySelector('.popup__text--address').textContent = mapCard.offer.address;
  mapCardElement.querySelector('.popup__text--price ').textContent = mapCard.offer.price + '₽/ночь';

  switch (mapCard.offer.type) {
    case 'palace':
      mapCard.offer.type = 'Дворец';
      break;
    case 'flat':
      mapCard.offer.type = 'Квартира';
      break;
    case 'house':
      mapCard.offer.type = 'Дом';
      break;
    case 'bungalo':
      mapCard.offer.type = 'Бунгало';
      break;
    default:
      mapCard.offer.type = 'Квартира';
  }

  mapCardElement.querySelector('.popup__type').textContent = mapCard.offer.type;

  var getRoomString = function (rooms) {
    var roomString = ' комнаты для ';
    if (rooms === 1) {
      roomString = ' комната для ';
    } else if (rooms >= 5) {
      roomString = ' комнат для ';
    }

    return roomString;
  };
  var getGuestsString = function (guests) {
    var guestsString = ' гостей ';
    if (String(guests).slice(-1) === '1' && guests !== 11) {
      guestsString = ' гостя ';
    }
    return guestsString;
  };

  mapCardElement.querySelector('.popup__text--capacity').textContent = mapCard.offer.rooms + getRoomString(mapCard.offer.rooms) + mapCard.offer.guests + getGuestsString(mapCard.offer.guests);

  mapCardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + mapCard.offer.checkin + ', выезд до ' + mapCard.offer.checkout;
  mapCardElement.querySelector('.popup__features').textContent = mapCard.offer.features;
  mapCardElement.querySelector('.popup__description').textContent = mapCard.offer.description;

  var img1 = mapCardElement.querySelector('.popup__photo').cloneNode();
  mapCardElement.querySelector('.popup__photos').appendChild(img1);
  var img2 = mapCardElement.querySelector('.popup__photo').cloneNode();
  mapCardElement.querySelector('.popup__photos').appendChild(img2);

  var imgList = mapCardElement.querySelectorAll('.popup__photo');
  for (var k = 0; k < imgList.length; k++) {
    imgList[k].src = mapCard.offer.photos[k];
  }

  mapCardElement.querySelector('.popup__avatar').src = mapCard.author.avatar;

  return mapCardElement;
};

fragment = document.createDocumentFragment();
for (var j = 0; j < mapCardsData.length; j++) {
  fragment.appendChild(renderMapCard(mapCardsData[j]));
}
map.insertBefore(fragment, mapPins);
