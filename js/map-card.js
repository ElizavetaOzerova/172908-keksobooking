'use strict';

(function () {
  var PHOTO_WIDTH = 45;
  var PHOTO_HEIGHT = 40;
  var ENTER_KEYCODE = 13;
  var PHOTO_ELEMENT_ALT = 'Фотография жилья';

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

  var createPhotoElement = function (photoData) {
    var photoElement = document.createElement('img');

    photoElement.classList.add('popup__photo');
    photoElement.width = PHOTO_WIDTH;
    photoElement.height = PHOTO_HEIGHT;
    photoElement.alt = PHOTO_ELEMENT_ALT;
    photoElement.src = photoData;

    return photoElement;
  };


  window.mapCard = {
    createElement: function (cardTemplate) {
      var cardItemElement = cardTemplate.cloneNode(true);
      var btnCloseItemElement = cardItemElement.querySelector('.popup__close');

      cardItemElement.classList.add('hidden');

      btnCloseItemElement.addEventListener('keydown', function (evt) {
        if (evt.keyCode === ENTER_KEYCODE) {
          cardItemElement.classList.add('hidden');
        }
      });
      btnCloseItemElement.addEventListener('click', function () {
        cardItemElement.classList.add('hidden');
      });

      return cardItemElement;
    },

    renderElement: function (cardElement, data) {
      var offer = data.offer;

      var photosElement = cardElement.querySelector('.popup__photos');
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
        photosElement.appendChild(createPhotoElement(offer.photos[i]));
      }

      cardElement.classList.remove('hidden');
    }
  };
})();
