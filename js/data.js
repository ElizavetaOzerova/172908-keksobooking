'use strict';

(function () {
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

  window.generateCardsData = function () {
    var cardsDataArr = [];
    for (var i = 0; i < CARD_LIMIT; i++) {
      cardsDataArr.push(createCardData(i));
    }
    return cardsDataArr;
  };
})();
