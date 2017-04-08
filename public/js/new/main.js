var SORTABLE_LISTS = ['.elective-picker'];
SORTABLE_LISTS.forEach(function (selector) {
    $(selector).sortable();
    $(selector).disableSelection();
});

var $cache = (function () {
  var cachedItems = {};
  
  return function (selector) {
      if (!cachedItems[selector]) {
          cachedItems[selector] = $(selector);
      } 
      return cachedItems[selector];
  };
})();

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

// Takes an id selector or a radio input name
// Returns the value of that form input
function getVal(str) {
  var firstChar = str.slice(0, 1);
  var $element;

  if (firstChar === '#') {
      $element = $cache(str);
  } else {
      // Don't use cache here since selected input may change
      $element = $('input[name=' + str + ']:radio:checked');
  }

  return $element.val();
}

function switchDot(stepIndex) {
    $cache('.modal-header').children('.active').removeClass('active');
    $cache('.modal-header').children('span').eq(stepIndex).addClass('active');
}

function nextBox() {
    var $this = state.currentBox;
    switchBoxes($this, $this.next());
    state.currentStep += 1;
    state.currentBox = $this.next();
    switchDot(state.currentStep);    
}

var state = {};
/* TODO */
// function storageAvailable(type) {
// 	try {
// 		var storage = window[type],
// 			x = '__storage_test__';
// 		storage.setItem(x, x);
// 		storage.removeItem(x);
// 		return true;
// 	}
// 	catch(e) {
// 		return false;
// 	}
// }



// if (storageAvailable('localStorage') && localStorage.state) {
//     state = JSON.parse(localStorage.state);
// }

state.currentStep = 0;
state.currentBox = $cache('#student-info-modal');

var electiveData = {
    5: {
        "courseNames": ["Newspaper", "Speech", "Robotics", "Art", "Drama"],
        "descriptionLink": "https://drive.google.com/open?id=0B4D5CPihMMwibkRybGh1ZDNPRnc"
    },
    6: {
        "courseNames": ["Speech/Debate", "Robotics", "Art", "Drama", "Contest Math"],
        "descriptionLink": "https://drive.google.com/open?id=0B4D5CPihMMwiXzVnMWRtR1R6ak0"
    },
    7: {
        "courseNames": ["Speech/Debate", "Robotics", "Art", "Drama", "Contest Math", "Quiz Bowl", "A Study of Star Wars", "Computer Programming", "World Geography"],
        "descriptionLink": "https://drive.google.com/open?id=0B4D5CPihMMwiT25iYVZDR0NraEk"
    },
    8: {
        "courseNames": ["Speech/Debate", "Robotics", "Art", "Drama", "Contest Math", "Quiz Bowl", "A Study of Star Wars", "Computer Programming", "Yearbook", "World Geography"],
        "descriptionLink": "https://drive.google.com/open?id=0B4D5CPihMMwiODZsNnZyT29JYVk"
    }
}

var teamTimeData = {
    "6": {
        "courseNames":  [
            "Chess Club", 
            "B.E.A.T.S. (cool educational videos)",
            "Drama",
            "Edible Math",
            "Contest Math",
            "Quiz Bowl",
            "Robotics",
            "Speech/Debate",
            "Model UN",
            "Art",
            "Journalism",
            "Greenhouse",
            "Village Youtube Club"
        ],
        "descriptionLink": "#"
    }
}
teamTimeData[7] = teamTimeData[6];
teamTimeData[8] = teamTimeData[6];

/******************************************************
*  Global Error Handling
*
*******************************************************/

//text and email inputs are required by default
var nonrequiredInputs = ['english-name'];
function checkTextEmpty() {
    var $this = $(this);
    if ($this.val() === '' && nonrequiredInputs.indexOf($this.attr('id')) === -1) {
        $this.addClass('error');
    } else {
        $this.removeClass('error');
    }
}
$('input[type="text"], input[type="email"]').on('focusout', checkTextEmpty);
$('input[name="grade"]').click(function () {
    $cache('#grade-picker').removeClass('error');
});

$('input[name="foreign-lang"]').click(function () {
    $cache('#lang-picker').removeClass('error');
});

$('.back-button').click(function () {
    /* TODO: Skip team time for 5th */
    var $this = state.currentBox;
    switchBoxes($this, $this.prev());
    state.currentBox = $this.prev();
    state.currentStep -= 1;
    switchDot(state.currentStep);
});


function submitStudentInfo() {
    // Get the values from inputs that apply to all grades
    state.grade = getVal('grade');
    state.first = getVal('#first-name');
    state.last = getVal('#last-name');
    state.englishName = getVal('#english-name');
    state.house = getVal('#house');
    state.tshirt = getVal('#tshirt');
    state.language = getVal('foreign-lang');
    
     $cache('#first-name').focusout();
     $cache('#last-name').focusout();
       
    
    if (state.grade === undefined) {
        $cache('#grade-picker').addClass('error');
    } else {
        $cache('#grade-picker').removeClass('error');
    }
    
    if (state.language === undefined) {
        $cache('#lang-picker').addClass('error');
    } else {
        $cache('#lang-picker').removeClass('error');
    }
    
    if (!state.grade || !state.first || !state.last || !state.language) {
        return;   
    }
    
    // Info has been verfied by this point
    if (state.grade === '5') {
        $cache('label[for="no-music"').hide();
        $('#no-music').prop('checked', false);
    } else {
        $cache('label[for="no-music"').show();   
    }
    
    
    nextBox();
}


function submitMusic() {
    state.music = getVal('music');
    
    if (state.music === undefined) {
        $cache('#music-picker').addClass('error');
        return;
    } else {
        $cache('#music-picker').removeClass('error');
    }
    
    if (!state.electiveData || state.electiveData !== electiveData[state.grade]) {
        state.electiveData = electiveData[state.grade];
    
        var description =  'Drag and drop the tiles below to sort them from 1 to ';
        description += state.electiveData.courseNames.length;
        description += ' (most interesting to least interesting).<br>';
        description += 'Read about our ' + state.grade + 'th grade elective offerings, ';
        description += '<a target="_blank" href="' + state.electiveData.descriptionLink +'">here</a>.';
        
        $cache('#elect-modal').find('.description').html(description);
        
        var $nums = $cache('#elect-modal').find('.number');
        var $names = $cache('#elect-modal').find('.elective-picker');
        
        $nums.empty();
        $names.empty();
        
        state.electiveData.courseNames.forEach(function (courseName, i) {
            $nums.append('<li>' + i + '</li>');
            $names.append('<li>' + courseName + '</li>');
        });
    }
    
    nextBox(); 
}

function submitElective() {
    var $electives = $cache('#elect-modal').find('.elective-picker');
    state.electives = [];
    $electives.children('li').each(function () {
        state.electives.push($(this).text());
    });
    console.log(state.electives);
    
    
    if (state.grade === '5') {
        var $this = state.currentBox;
        switchBoxes($this, $this.next().next());
        state.currentStep += 2;
        state.currentBox = $this.next().next();
        switchDot(state.currentStep);
        return;
    }
    
    if (!state.teamTimeData || state.teamTimeData !== teamTimeData[state.grade]) {
    
        state.teamTimeData = teamTimeData[state.grade];
        
        var description =  'Drag and drop the tiles below to sort them from 1 to ';
            description += state.teamTimeData.courseNames.length;
            description += ' (most interesting to least interesting).<br>';
            description += 'Read about our ' + state.grade + 'th grade team time offerings, ';
            description += '<a target="_blank" href="' + state.teamTimeData.descriptionLink +'">here</a>.';
            
        $cache('#team-time-modal').find('.description').html(description);
        
        var $nums = $cache('#team-time-modal').find('.number');
        var $names = $cache('#team-time-modal').find('.elective-picker');
        
        $nums.empty();
        $names.empty();
        
        state.teamTimeData.courseNames.forEach(function (courseName, i) {
            $nums.append('<li>' + i + '</li>');
            $names.append('<li>' + courseName + '</li>');
        });
    }
    
    nextBox();
}

function submitTeamTime() {
    var $tt = $cache('#team-time-modal').find('.elective-picker');
    state.teamTime = [];
    $tt.children('li').each(function () {
        state.teamTime.push($(this).text());
    });
    console.log(state.teamTime);
    
    
    nextBox();
}

function submitForm() {
    state.pFirst = getVal('#parent-first-name');
    state.pLast = getVal('#parent-last-name');
    state.email = getVal('#email');
    state.email2 = getVal('#email2');
    state.comments = getVal('#comments');
    
    $cache('#parent-first-name').focusout();
    $cache('#parent-last-name').focusout();
    $cache('#email').focusout();
    $cache('#email2').focusout();
    $cache('#comments').focusout();
    
    if (!state.pFirst || !state.pLast ||
            !state.email || state.email !== state.email2) {
        return;            
    }
    
    var formData = Object.assign({}, state);
    
    delete formData.currentStep;
    delete formData.currentBox;
    delete formData.electiveData;
    delete formData.teamTimeData;
    
    console.log(formData);
    
    $.ajax({
        type: "POST",
        url: '/form',
        data: formData,
        success: function (data) {
            console.log(data);
        },
        traditional: true
    });
}