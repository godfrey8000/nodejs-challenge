// server.js
// where your node app starts

// init project
const express = require("express");
const morgan = require("morgan");
const app = express();
const bodyParser = require("body-parser");
const axios = require("axios");
const url = require("url");
const redis = require("ioredis-mock");
const { promisify } = require("util");
const emailSender = require("./emailSender");
const uuid = require('uuid');

const client = new redis();
const interval = setInterval(scheduledFunction, 15000); // 15 seconds in milliseconds

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("combined"));
// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

//create error handle page with ejs
app.get("/error", (request, response) => {
  const statusCode = request.query.statusCode;
  const errorMessage = request.query.errorMessage;

  response.render("error", {
    statusCode: statusCode,
    errorMessage: errorMessage,
  });
});

app.get("/success", (request, response) => {
  const userName = request.query.userName;
  const message = request.query.message;

  response.render("success", {
    userName: userName,
    message: message,
  });
});

// adding endpoint for recieving santa form submit
app.post("/submit", async (request, response) => {
  const inputText = request.body.inputText;
  const userName = request.body.userid;

  if (!(inputText && userName)) {
    const errorMessage = "Invalid input of inputText and userName!!!";
    const statusCode = 400;
    redirectToError(response, statusCode, errorMessage);

    return;
  }
  console.log(`Recieving inputText: ${inputText} and userName: ${userName}`);
  console.log("Retriving userProfiles and users");

  // wail
  const userProfiles = await getUserProfiles();
  const users = await getUsers();

  // Check if userProfiles and users are empty or not
  if (userProfiles && users) {
    console.log("userProfiles:", JSON.stringify(userProfiles));
    console.log("users:", JSON.stringify(users));
  } else {
    const errorMessage = "Failed to retrieve userProfiles or users data.";
    const statusCode = 500;

    redirectToError(response, statusCode, errorMessage);
    return;
  }

  try {
    const user = findUserIdByName(users, userName);

    if (user) {
      const { uid } = user;

      // Find user by uid
      const userDetail = findUserDetailByUid(userProfiles, uid);

      if (userDetail) {
        const { birthdate } = userDetail;

        // Calculate is children or not based on the birthdate
        const isChild = calculateIsChild(birthdate);

        console.log(`User with username '${userName}' exists.`);
        console.log(`isChild: ${isChild}`);
        if (isChild) {
          const record = {
            userName: userName,
            address: userDetail.address,
            message: inputText,
          };
          saveRecordInCache(record);

          redirectToSuccess(response, userName, inputText);
        } else {
          const errorMessage = `User with username '${userName}' is not a Child!`;
          const statusCode = 200;

          redirectToError(response, statusCode, errorMessage);
          console.log(errorMessage);
        }
      } else {
        const errorMessage = `User with username '${userName}' does not exist in the 'users' array.`;
        const statusCode = 500;

        redirectToError(response, statusCode, errorMessage);
        console.log(errorMessage);
        return;
      }
    } else {
      const errorMessage = `User with username '${userName}' does not exist in the 'usersProfiles' array.`;
      const statusCode = 500;

      redirectToError(response, statusCode, errorMessage);
      console.log(errorMessage);
      return;
    }
  } catch (error) {
    const errorMessage = `error on processing user : ${error}`;
    const statusCode = 500;

    redirectToError(response, statusCode, errorMessage);
    console.log(errorMessage);
    return;
  }

  return;
});

//schedule to fetch data and send email
async function scheduledFunction() {
  // Code to be executed on each scheduled interval

  console.log("Scheduled function executed at:", new Date());
  const records = await getAllrecordFromCache();
  if (Object.keys(records).length !== 0) {
    console.log("process sendning record to email");
    const success = await emailSender.sendEmail(records);
    if (success) {
      // flush all record if email is sent
      client
        .flushall()
        .then((result) => {
          console.log("Redis cache cleared successfully");
        })
        .catch((error) => {
          console.error("Error clearing Redis cache:", error);
        });
    }
  }
}

//record will be override with same record
async function saveRecordInCache(record) {
   const key = uuid.v4();
  const value = JSON.stringify(record);

  client.set(key, value);
}

//fetching all record from redis
async function getAllrecordFromCache() {
  try {
    const scanResult = await client.scan("0", "MATCH", "*", "COUNT", "100");
    const keys = scanResult[1];

    const mgetAsync = promisify(client.mget).bind(client);
    const values = await mgetAsync(keys);

    const keyValuePairs = keys.reduce((acc, key, index) => {
      acc[key] = values[index];
      return acc;
    }, {});

    console.log("Key-Value pairs from Redis:", keyValuePairs);

    const valueArray = values.map(value => JSON.parse(value));
    return valueArray;
  } catch (error) {
    console.error("Error retrieving keys/values from Redis:", error);
  }
}

function findUserIdByName(users, username) {
  return users.find((user) => user.username === username);
}

function findUserDetailByUid(usersProfiles, uid) {
  return usersProfiles.find((user) => user.userUid === uid);
}

function calculateIsChild(birthdate) {
  const today = new Date();
  // by formating YYYY/DD/MM to date
  const [year, day, month] = birthdate.split("/");
  const formattedDate = `${month}/${day}/${year}`;
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  console.log(`age : ${age}`);
  if (age < 10) {
    return true;
  } else {
    return false;
  }
}

// Function to retrieve userProfiles.json
async function getUserProfiles() {
  try {
    const response = await axios.get(
      "https://raw.githubusercontent.com/alj-devops/santa-data/master/userProfiles.json"
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving userProfiles.json:", error);
  }
}

// Function to retrieve users.json
async function getUsers() {
  try {
    const response = await axios.get(
      "https://raw.githubusercontent.com/alj-devops/santa-data/master/users.json"
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving users.json:", error);
  }
}

//redirect to success page
async function redirectToSuccess(response, userName, message) {
  response.redirect(
    url.format({
      pathname: `/success`,
      query: {
        userName: userName,
        message: message,
      },
    })
  );
}

//redirect to error page
async function redirectToError(response, statusCode, errorMessage) {
  response.redirect(
    url.format({
      pathname: `/error`,
      query: {
        statusCode: statusCode,
        errorMessage: errorMessage,
      },
    })
  );
  return;
}

// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

//custom error handler
app.use((error, request, response, next) => {
  console.error(error); // Log the error for debugging purposes

  // Set the HTTP status code for the error response
  const statusCode = error.statusCode || 500;

  // Set the error message
  const errorMessage = error.message || "Internal Server Error";

  // Render and send the error.html file
  redirectToError(response, statusCode, errorMessage);
});
