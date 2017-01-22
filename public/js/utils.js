/*
*   Utils JS
*/

var Utils = (function () {

  /*
  * Private Methods
  */
  var replaceAll = function (str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  };

  /*
  * Public Methods
  */
  return {
      normalise: function (string) {
        var normalised = encodeURIComponent(string);
        return normalised;
      }
    };

})();


