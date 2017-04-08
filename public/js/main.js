/*********************************************************
 * Global Event Handlers
 *
 ********************************************************/
$('.button').click(function (e) {
    e.preventDefault();
    steps.next();
});

$('.back-button').click(function (e) {
    e.preventDefault();
    steps.prev();
});


/******************************************************
*  Global Error Handling
*
*******************************************************/

//text and email inputs are required by default
var nonrequiredInputs = ['english-name'];
$('input[type="text"], input[type="email"]').on('focusout', function () {
    var $this = $(this);
    if ($this.val() === '' && nonrequiredInputs.indexOf($this.attr('id')) === -1) {
        $this.addClass('error');
    } else {
        $this.removeClass('error');
    }
});