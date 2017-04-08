/*********************************************************
 * Step object definition
 *
 ********************************************************/
var steps = (function () {
    var steps = [];
    var currentStep = 0;
    var exports = {};
    
    
    // Step Switching Functions
    function switchBoxes($old, $new) {
        var duration = 1200;
        var from = $old.index();
        var to = $new.index();
        
        if (from < to) {
          exchange('animate-to-left', 'animate-from-right');
        } else {
          exchange('animate-to-right', 'animate-from-left');
        }
        
        function exchange(outClass, inCLass) {
          $old.addClass(outClass);
          
          setTimeout(function () {
              $new.addClass(inCLass + ' show');
          }, duration / 4);
          
          setTimeout(function () {
              $old.removeClass(outClass + ' show');
          }, duration / 2);
          
            
          setTimeout(function () {
              $new.removeClass(inCLass);
          }, duration);
        }
    }
    
    function switchDot(stepIndex) {
        $cache('.modal-header').children('.active').removeClass('active');
        $cache('.modal-header').children('span').eq(stepIndex).addClass('active');
    }
    
    function go(direction) {
        
        // Check that the current step meets all expectations, else abort
        if (direction === 1 && steps[currentStep].check && !steps[currentStep].check()) {
          return;
        }
        
        // If it exists, use the step's skip function to test if the next step should be skipped
        var nextStep = currentStep + direction;
        var skipFunc = steps[nextStep].skip;
        
        if (skipFunc && skipFunc()) {
            nextStep += direction;
        }
        
        // Update the DOM
        var $current = steps[currentStep].getModal();
        var $next = steps[nextStep].getModal();
        switchBoxes($current, $next);
        switchDot(nextStep);
        
        currentStep = nextStep;
    }
    
    /**
     * Adds a step to the collection and runs the step's init script if present
     * @param {object} step - represents a step in the form
     */
    exports.push = function (step) {
        steps.push(step);
        if (step.init) {
            step.init();
        }
    };
    
    exports.next = function () {
        go(1);
    };
    
    exports.prev = function () {
        go(-1);
    }
    
    return exports;
})();







// Student Info
steps.push({
    check: function () {
        if (!getVal('#first-name') || !getVal('#last-name') || !getVal('grade')) {
            return false;
        }
        return true;
    },
    getModal: function () {
        return $cache('#student-info-modal');
    },
    init: function () {
        $cache('#student-info-modal').find('.button').click(function () {
            $cache('#first-name').focusout();
            $cache('#last-name').focusout();
        
            if (getVal('grade') === undefined) {
                $cache('#grade-picker').addClass('error');
            } else {
                $cache('#grade-picker').removeClass('error');
            }
        });
        
        $('input[name="grade"]').click(function () {
            $cache('#grade-picker').removeClass('error');
        });
    }
});

// Foreign Language
steps.push({
    check: function () {
        if (!getVal('foreign-lang')) {
            return false;
        }
        return true;
    },
    getModal: function () {
        return $cache('#foreign-language-modal');
    }
});

// Music
steps.push({
    check: function () {
        var grade = getVal('grade');
        if (grade === '5' && !getVal('music-5')) {
            return false;
        } else if (grade !== '5' && !getVal('music-678')) {
            return false;
        }
        return true;
    },
    getModal: function () {
        var grade = getVal('grade');
        if (grade === '5') {
            return $cache('#music-5-modal');
        } else {
            return $cache('#music-678-modal');
        }
    }
 });
 
// Electives 
steps.push({
     getModal: function () {
         return $cache('#elect-' + getVal('grade') + '-modal');
     }
});

// Team Time
steps.push({
    skip: function () {
        if (getVal('grade') === '5') return true;
        return false;
    },
    getModal: function () {
        return $cache('#team-time-modal');
    }
});

// Parent Info
steps.push({
    getModal: function () {
        return $cache('#parent-info-modal');
    },
    init: function () {
        $cache('#email, #email2').on('keyup', function () {
            validateEmail();
        });
        
        $cache('#email, #email2').on('focusout', function () {
            if ($(this).is('#email2')) { 
                email2Checked = true;
            }
            validateEmail();
        });
        
        $("form").submit(function(e){
            e.preventDefault();
        });
        
        $('.submit-button').click(function () {
            if (tryingToSubmit === true) return false;
            tryingToSubmit = true;
            
            var data = getFormValues();
            
            if (!validateForm(data)) {
              return;
            }
            
            submitForm(data, steps)
        });
    }
});

// Confirmation
steps.push({
    getModal: function () {
        return $cache('#confirmation');
    }
});