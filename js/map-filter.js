'use strict';

(function () {
  var filtersFormElement = document.querySelector('.map__filters');
  var filterSelectElements = filtersFormElement.querySelectorAll('select');
  var filterFeatureElements = filtersFormElement.querySelectorAll('input');

  var extractCategoryFromPrice = function (price) {
    if (price > 50000) {
      return 'high';
    }
    if (price >= 10000) {
      return 'middle';
    }

    return 'low';
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

    filterFeatureElements.forEach(function (element) {
      if (element.checked) {
        filters['features'].push(element.value);
      }
    });

    return filters;
  };

  var createItemFilter = function (fieldName, filters, fieldProcessor) {
    return function (item) {
      if (filters[fieldName] === 'any') {
        return true;
      }
      var fieldValue = fieldProcessor ? fieldProcessor(item.offer[fieldName]) : item.offer[fieldName];

      return fieldValue === filters[fieldName];
    };
  };

  var createFeaturesFilter = function (filters) {
    return function (item) {
      if (!filters.features.length) {
        return true;
      } else {
        return сheckExistenceInArr(item.offer.features, filters.features);
      }
    };
  };


  window.mapFilter = {
    resetFormFieldValues: function () {
      filterSelectElements.forEach(function (selectElement) {
        selectElement.options[0].selected = true;
      });
      filterFeatureElements.forEach(function (element) {
        element.checked = false;
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
