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

function csvify() {
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
      
      fs.writeFile('preferences2.csv', csv, function(err) {
        if (err) throw err;
        console.log('preferences.csv saved');
      });
  });
}

function importStudentData() {
  var studentRef = db.ref("students");
  
  studentRef.once('value').then(function (snapshot) {
    var data = snapshot.val();
    console.log(data);
    
  });
}

function buildStudents() {
  const csv=require('csvtojson');
  const csvFilePath='skyward-report.csv';
  
  csv()
  .fromFile(csvFilePath)
  .on('json',(jsonObj)=>{
      // combine csv header row and csv line to a json object 
      console.log(jsonObj);
  })
  .on('done',(error)=>{
    console.log('end')
  });
}


if (process.argv.indexOf('-export-student-data') !== -1) {
   // TODO
   // Upload the latest student data
}
if (process.argv.indexOf('-import-student-data') !== -1) {
  importStudentData();
}
if (process.argv.indexOf('-csv') !== -1) {
  csvify(); 
}
