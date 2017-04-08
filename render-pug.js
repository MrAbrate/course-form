const fs = require('fs');
const pug = require('pug');


var form = pug.renderFile('views/form.pug', {});

fs.writeFile("html/form.html", form, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("Form was saved!");
}); 