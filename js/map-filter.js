'use strict';

(function () {
  var AVERAGE_PRICE_UPPER_LIMIT = 50000;
  var AVERAGE_PRICE_LOWER_LIMIT = 10000;
  var HIGH_PRICE_CATEGORY = 'high';
  var MIDDLE_PRICE_CATEGORY = 'middle';
  var LOW_PRICE_CATEGORY = 'low';

  var filtersFormElement = document.querySelector('.map__filters');
  var filterSelectElements = filtersFormElement.querySelectorAll('select');
  var filterFeatureElements = filtersFormElement.querySelectorAll('input');

  var extractCategoryFromPrice = function (price) {
    if (price > AVERAGE_PRICE_UPPER_LIMIT) {
      return HIGH_PRICE_CATEGORY;
    }
    if (price >= AVERAGE_PRICE_LOWER_LIMIT) {
      return MIDDLE_PRICE_CATEGORY;
    }

    return LOW_PRICE_CATEGORY;
  };

  var сheckExistenceInArr = function (сheckArr, containItems) {
    for (var i = 0; i < containItems.length; i++) {
      if (сheckArr.indexOf(containItems[i]) === -1) {
        return false;
      }
    }
    return true;
  };

  var createFilters = function () {
    var filters = {};

    filterSelectElements.forEach(function (selectElement) {
      var filterName = selectElement.id.split('-')[1];
      var filterValue = selectElement.value;
      filters[filterName] = filterValue;
    });

    if (filters['rooms'] !== 'any') {
      filters['rooms'] = Number(filters['rooms']);
    }
    if (filters['guests'] !== 'any') {
      filters['guests'] = Number(filters['guests']);
    }

    filters['features'] = [];
    filterFeatureElements.forEach(function (featureElement) {
      if (featureElement.checked) {
        filters['features'].push(featureElement.value);
      }
    });

    return filters;
  };

  var createItemFilter = function (fieldName, filterCollector, fieldProcessor) {
    return function (item) {
      if (filterCollector[fieldName] === 'any') {
        return true;
      }
      var fieldValue = fieldProcessor ? fieldProcessor(item.offer[fieldName]) : item.offer[fieldName];

      return fieldValue === filterCollector[fieldName];
    };
  };

  var createFeaturesFilter = function (filterCollector) {
    return function (item) {
      if (!filterCollector.features.length) {
        return true;
      } else {
        return сheckExistenceInArr(item.offer.features, filterCollector.features);
      }
    };
  };


  window.mapFilter = {
    reset: function () {
      filterSelectElements.forEach(function (selectElement) {
        selectElement.options[0].selected = true;
      });
      filterFeatureElements.forEach(function (featureElement) {
        featureElement.checked = false;
      });
    },

    filterData: function (items) {
      var filters = createFilters();

      return items
          .filter(createItemFilter('type', filters))
          .filter(createItemFilter('rooms', filters))
          .filter(createItemFilter('guests', filters))
          .filter(createItemFilter('price', filters, extractCategoryFromPrice))
          .filter(createFeaturesFilter(filters));
    }
  };
})();
