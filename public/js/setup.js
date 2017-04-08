var email2Checked = false,
    tryingToSubmit = false;

/*********************************************************
 * Setup
 *
 ********************************************************/
var SORTABLE_LISTS = ['#elect-5th', '#elect-6th', '#elect-7th', '#elect-8th', '#team-time'];
SORTABLE_LISTS.forEach(function (selector) {
    $(selector).sortable();
    $(selector).disableSelection();
});

$cache = (function () {
  var cachedItems = {};
  
  return function (selector) {
      if (!cachedItems[selector]) {
          cachedItems[selector] = $(selector);
      } 
      return cachedItems[selector];
  };
})();