const express = require('express');
const admin = require('firebase-admin');
const pug = require('pug');
const electiveData = require('./electives.json');
const bodyParser = require('body-parser');

const app = express()
app.set('view engine', 'pug');


const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://electives-3b8b7.firebaseio.com/'
});

var db = admin.database();
var ref = db.ref("form");
var formResRef = ref.child("responses");



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(express.static(__dirname + "/public"));

app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.get('/form', function (req, res) {
  res.render('form', {electiveData: electiveData});
});

app.post('/form', function (req, res) {
  if (!req.body.grade || !req.body.first || !req.body.last ||
      !req.body.pFirst || !req.body.pLast || !req.body.email ||
      req.body.email !== req.body.email2) {
    return res.status(500).send('error');
  }
  
  formResRef.push(req.body);
  res.send('Hi');
});


app.listen(process.env.PORT, process.env.IP, function () {
  console.log(`Example app listening on port ${ process.env.PORT }!`);
  console.log(`Visit ${  process.env.IP }:${ process.env.PORT }`);
})