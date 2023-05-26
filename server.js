// server.js
// where your node app starts

// init project
const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');


app.use(bodyParser());
app.use(morgan());
app.use(axios());
// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});






// adding endpoint for recieving santa form submit
app.post('/submit', (request, response) => {
  const inputText = request.body.inputText;
  const userProfiles = "";
  const users = "";
  
    // Make a GET request to retrieve the userProfiles.json data
  axios.get('https://raw.githubusercontent.com/alj-devops/santa-data/master/userProfiles.json')
    .then(response => {
      userProfiles = response.data;
      console.log(userProfiles);
    })
    .catch(error => {
      console.error('Error retrieving userProfiles.json:', error);
    });

  // Make a GET request to retrieve the users.json data
  axios.get('https://raw.githubusercontent.com/alj-devops/santa-data/master/users.json')
    .then(response => {
      users = response.data;
      console.log(users);
    })
    .catch(error => {
      console.error('Error retrieving users.json:', error);
    });
  
  

  response.sendStatus(200);
});


// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
