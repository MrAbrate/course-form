/*********************************************************
 * Getter Functions
 *
 ********************************************************/

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


function getFormValues() {
    var data = {};

    // Get the values from inputs that apply to all grades
    data.grade = getVal('grade');
    data.first = getVal('#first-name');
    data.last = getVal('#last-name');
    data.englishName = getVal('#english-name');
    data.house = getVal('#house');
    data.tshirt = getVal('#tshirt');
    data.language = getVal('foreign-lang');
    
    // Get music choice depending on grade
    data.music = (data.grade === '5') ? getVal('music-5') : getVal('music-678');

   
    var $electives = $('#elect-' + data.grade + 'th');
    data.electives = [];
    $electives.children('li').each(function () {
        data.electives.push($(this).text());
    });

    
    var $tt;
    data.teamTimes = [];
    if (data.grade !== '5') {
        $tt = $('#team-time');
        $tt.children('li').each(function () {
            data.teamTimes.push($(this).text());
        });
    }

    data.parentFirst = getVal('#parent-first-name');
    data.parentLast = getVal('#parent-last-name');
    data.email = getVal('#email');
    data.email2 = getVal('#email2');
    data.comments = getVal('#comments');

    return data;
}


/*********************************************************
 * Form Validation Functions
 *
 ********************************************************/
function validateEmail() {
    // Don't show errors until user engages with email2 input
    if (!email2Checked) return;
    
    if (getVal('#email') === '' || getVal('#email') !== getVal('#email2')) {
        $cache('#email').addClass('error');
        $cache('#email2').addClass('error');
    } else {
        $cache('#email').removeClass('error');
        $cache('#email2').removeClass('error');
    }
}

function validateForm(data) {
    $cache('#parent-first-name').focusout();
    $cache('#parent-last-name').focusout();
   
    $cache('#email').focusout();
    email2Checked = true;
    
    var requirements = [
        data.parentFirst !== '',
        data.parentLast !== '',
        data.email !== '',
        data.email2 !== '',
        data.email === data.email2
    ];
    
    if (requirements.indexOf(false) !== -1) {
        tryingToSubmit = false;
        console.log('Requirement Missing');
        return false;
    }
    return true;
}


function showConfirmation(data, steps) {
    var name, pName, listHTML;

    function addRow(header, value) {
        if (!value) {
          return;
        }
        value = value[0].toUpperCase() + value.slice(1);
        $cache('.confirmation-details')
            .append('<div class="row"><span class="header">' + header + ':</span><span class="detail">' + value + '</span></div>');
    }

    function getOLHTML(arr) {
        return arr.reduce(function (str, choice) {
            return str + '<li>' + choice + '</li>';
        }, '<ol>') + '</ol>';
    }

    name = data.first + ' ';
    name += data.englishName + ' ' || '';
    name += data.last;

    pName = data.parentFirst + ' ' + data.parentLast;
    
    addRow('Student Name', name);
    addRow('Grade', data.grade + 'th');
    addRow('House', data.house);
    addRow('T-shirt Size', data.tshirt);
    addRow('Foreign Language', data.language);
    addRow('Music Ensemble', data.music);

    addRow('Elective Preferences', getOLHTML(data.electives));
    addRow('Team Time Preferences', getOLHTML(data.teamTimes));

    addRow('Parent Name', pName);
    addRow('Parent E-mail', data.email);
    addRow('Comments', data.comments);


    steps.next();

    setTimeout(function () {
        $cache('.modal-header').addClass('hide');
    }, 250);
}


function submitForm(data, steps) {
    if (google) {
        console.log('Submitting')
        google.script.run
              .withSuccessHandler(function () {
                  showConfirmation(data, steps);
              })
              .withFailureHandler(function (data) { 
                  tryingToSubmit = false;
                  console.log('failed to submit');
                  console.log(data);
              })
              .processFormSubmit(data);
    } else {
        showConfirmation(data, steps);
    }
}

