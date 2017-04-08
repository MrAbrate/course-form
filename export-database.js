const admin = require('firebase-admin');
const electiveData = require('./electives.json');
const json2csv = require('json2csv');
const serviceAccount = require('./serviceAccountKey.json');
const fs = require('fs');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://electives-3b8b7.firebaseio.com/'
});

var db = admin.database();
var ref = db.ref("form");
var formResRef = ref.child("responses");

console.log("Export has begun.");
formResRef.once('value').then(function (snapshot) {
    var data = snapshot.val();
    var responses = Object.keys(data).reduce((prev, id) => {
        var response = Object.assign({}, data[id]);
        response.electives = response.electives.join(', ');
        response.teamTime = response.teamTime.join(', ');
        prev.push(response);
        return prev;
    }, []);
    
    
    var fields = ['first', 'last', 'grade', 'language', 'electives', 'teamTime', 'comments'];
    var infoFields = ['first', 'last', 'grade'];
    
    console.log(responses);
    var csv = json2csv({ data: responses, fields: fields});
    console.log(csv);
    
    fs.writeFile('preferences.csv', csv, function(err) {
      if (err) throw err;
      console.log('preferences.csv saved');
    });
});

