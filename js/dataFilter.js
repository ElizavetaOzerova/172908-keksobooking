'use strict';

window.dataFilter = (function () {
  var FILTER_FIELDS_ID_PREFIX_LENGTH = 8;

  var filtersFormElement = document.querySelector('.map__filters');
  var filtersSelectList = filtersFormElement.querySelectorAll('select');
  var filtersfeaturesContanerElement = filtersFormElement.querySelector('#housing-features');
  var filtersFeaturesInputList = filtersfeaturesContanerElement.querySelectorAll('input');
  var filterValuesObj = {};


  var setPriceCategoryName = function (price) {
    var priceCategoryName;
    if (price >= 10000 && price <= 50000) {
      priceCategoryName = 'middle';
    } else if (price < 10000) {
      priceCategoryName = 'low';
    } else if (price > 50000) {
      priceCategoryName = 'high';
    }
    return priceCategoryName;
  };

  var isArrContainsOtherArrItems = function (where, what) {
    for (var i = 0; i < what.length; i++) {
      if (where.indexOf(what[i]) === -1) {
        return false;
      }
    }
    return true;
  };

  return {
    resetFormFieldValues: function () {
      for (var i = 0; i < filtersSelectList.length; i++) {
        filtersSelectList[i].options[0].selected = true;
      }
      for (i = 0; i < filtersFeaturesInputList.length; i++) {
        filtersFeaturesInputList[i].checked = false;
      }
    },

    fillFilterValuesObj: function () {
      for (var i = 0; i < filtersSelectList.length; i++) {
        filterValuesObj[filtersSelectList[i].id.slice(FILTER_FIELDS_ID_PREFIX_LENGTH)] = filtersSelectList[i].value;
      }

      filterValuesObj.features = [];
      for (i = 0; i < filtersFeaturesInputList.length; i++) {
        if (filtersFeaturesInputList[i].checked) {
          filterValuesObj.features.push(filtersFeaturesInputList[i].value);
        }
      }
    },

    filterData: function (data) {
      var filteredData = data
          .filter(function (item) {
            if (filterValuesObj.type === 'any') {
              return true;
            }
            return item.offer.type === filterValuesObj.type;
          })
          .filter(function (item) {
            if (filterValuesObj.rooms === 'any') {
              return true;
            }
            return item.offer.rooms === parseInt(filterValuesObj.rooms, 10);
          })
          .filter(function (item) {
            if (filterValuesObj.guests === 'any') {
              return true;
            }
            return item.offer.guests === parseInt(filterValuesObj.guests, 10);
          })
          .filter(function (item) {
            if (filterValuesObj.price === 'any') {
              return true;
            } else {
              var value = setPriceCategoryName(item.offer.price);
              return value === filterValuesObj.price;
            }
          })
          .filter(function (item) {
            if (!filterValuesObj.features.length) {
              return true;
            } else {
              return isArrContainsOtherArrItems(item.offer.features, filterValuesObj.features);
            }
          });

      return filteredData;
    }
  };

})();
