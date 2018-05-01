'use strict';

window.backend = (function () {
  var GET_CARDS_DATA_URL = 'https://js.dump.academy/keksobooking/data';
  var SEND_FORM_DATA_URL = 'https://js.dump.academy/keksobooking';
  var TIMEOUT = 10000;

  var loadData = function (method, url, onLoad, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    xhr.open(method, url);
    xhr.send(data);

  };

  return {
    loadCardsData: function (onLoad, onError) {
      loadData('GET', GET_CARDS_DATA_URL, onLoad, onError);
    },
    sendFormData: function (data, onLoad, onError) {
      loadData('POST', SEND_FORM_DATA_URL, onLoad, onError, data);
    }
  };

})();
