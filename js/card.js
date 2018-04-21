'use strict';

(function () {
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
    var cardItemElement = cardTemplate.cloneNode(true);
    var btnCloseItemElement = cardItemElement.querySelector('.popup__close');

    var hideCardItemElement = function () {
      cardItemElement.classList.add('hidden');
    };

    hideCardItemElement();

    document.addEventListener('keydown', function (evt) {
      window.util.isEscEvent(evt, hideCardItemElement);
    });
    btnCloseItemElement.addEventListener('keydown', function (evt) {
      window.util.isEnterEvent(evt, hideCardItemElement);
    });

    btnCloseItemElement.addEventListener('click', hideCardItemElement);


    return cardItemElement;
  };

  window.fillCardElement = function (data) {
    var offer = data.offer;

    var photosElement = window.cardElement.querySelector('.popup__photos');
    var photosTemplate = window.cardElement.querySelector('.popup__photo').cloneNode(true);
    var featuresListElement = window.cardElement.querySelector('.popup__features');

    window.cardElement.querySelector('.popup__avatar').src = data.author.avatar;

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
        window.cardElement.querySelector(selector).textContent = textContentCard[selector];
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

    window.cardElement.classList.remove('hidden');
  };

  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
  window.cardElement = createCardElement(cardTemplate);
})();
