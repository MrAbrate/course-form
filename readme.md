# Village Elective Signup Form

## Setup

If you want to help me develop this project, you will need follow this setup procedure.

### Create a project using Firebase

1. Navigate to the [Service Accounts](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk) tab in your project's settings page.
2. Select your Firebase project. If you don't already have one, click the Create New Project button. If you already have an existing Google project associated with your app, click Import Google Project instead.
3. Click the Generate New Private Key button at the bottom of the Firebase Admin SDK section of the Service Accounts tab.

This should download a .json file with your account credentials. Add this file to the root of your project folder and rename it serviceAccountKey.json.

1. Go to your Firebase [console](https://console.firebase.google.com/) click on your new project, then click on "database" on the left. 
2. Find your database's URL
3. Locate the file `app.js` in the project folder and replace the databaseURL with your database's URL

```Javascript
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://<Your Project ID>.firebaseio.com/'
});
```

## Project Layout
* This project uses [express.js](https://expressjs.com/). 
* I'm using a templating language called [Pug](https://pugjs.org/api/getting-started.html) to create generate HTML. The `.pug` files are located in the `views` folder.
* Javascript and CSS files are located in the `public` folder.


## Run the Code
To run this project in c9.io, first open the terminal and enter `npm install`.

Make sure you have nodemon installed. In the terminal, run `npm install nodemon -g`.

Once you have nodemon installed, run `cd <Whatever folder name>`. Then run `nodemon app.js`. This will start the sever and give you a link to view the project. To stop the server, enter `crtl-c` in the terminal.

To test that everything is working, fill out the form, then look at your Firebase database. You should see the new information added to the database.