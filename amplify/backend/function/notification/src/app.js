/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var express = require("express");
var bodyParser = require("body-parser");
var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
var axios = require("axios");

// EMAIL
var aws = require("aws-sdk");
var ses = new aws.SES({ region: "us-east-1" });

// declare a new express app
var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

/**********************
 * Example get method *
 **********************/

app.get("/notification", function (req, res) {
  // Add your code here
  res.json({ success: "get call succeed!", url: req.url });
});

app.get("/notification/*", function (req, res) {
  // Add your code here
  res.json({ success: "get call succeed!", url: req.url });
});

/****************************
 * Example post method *
 ****************************/

app.post("/notification", function (req, res) {
  // Add your code here
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

// MESSAGE
app.post("/notification/message", async function (req, res) {
  // Add your code here
  console.log("Message in req", req.body.message);
  console.log("Phone in req", req.body.phones);

  let api_endpoint = "https://sendpk.com/api/sms.php";
  let api_key = "923319065280-7c56c36f-952c-4828-87a2-a67f59eb6c9e";

  // brand name
  // let sender = req.query.sender;
  let sender = "EzzyApp";

  // message
  let message = req.body.message;
  // mobile array
  let phones = req.body.phones;

  let done = false;

  phones.forEach(async (phone) => {
    let url = `${api_endpoint}?api_key=${api_key}&sender=${sender}&mobile=${phone}&message=${message}`;
    await axios
      .get(url)
      .then((response) => {
        console.log("Succes making request");
        done = true;
        // let data = response.data;
        // callback(null, data);
      })
      .catch((err) => {
        // callback(null, err);
        res.json({
          error: err,
        });
      });
  });

  if (done) {
    res.json({
      data: "Messages have been sent!",
      status: "200",
    });
  }

  // let url = "https://jsonplaceholder.typicode.com/photos";

  // res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

// EMAIL
app.post("/notification/email", async function (req, res) {
  // Add your code here
  // message
  let emails = req.body.emails;
  // mobile array
  let subject = req.body.subject;
  // mobile array
  let body = req.body.body;

  for (const email of emails) {
    var params = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Text: { Data: body },
        },

        Subject: { Data: subject },
      },
      Source: "SourceEmailAddress",
    };

    ses.sendEmail(params).promise();
  }

  res.json({ success: "email call succeed!" });
});

app.post("/notification/*", function (req, res) {
  // Add your code here
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example put method *
 ****************************/

app.put("/notification", function (req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

app.put("/notification/*", function (req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example delete method *
 ****************************/

app.delete("/notification", function (req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.delete("/notification/*", function (req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

let PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
