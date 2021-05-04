/* Amplify Params - DO NOT EDIT
	API_EZZYAPP_COMPANYUSERTABLE_ARN
	API_EZZYAPP_COMPANYUSERTABLE_NAME
	API_EZZYAPP_FINDERUSERTABLE_ARN
	API_EZZYAPP_FINDERUSERTABLE_NAME
	API_EZZYAPP_GRAPHQLAPIIDOUTPUT
	API_EZZYAPP_SPUSERTABLE_ARN
	API_EZZYAPP_SPUSERTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

var aws = require("aws-sdk");
var ddb = new aws.DynamoDB();

exports.handler = async (event, context) => {
  let date = new Date();

  if (event.request.userAttributes.sub) {
    let userType = event.request.userAttributes["custom:user_type"];
    console.log("user type is ", userType);

    if (userType === "company_user") {
      // COMPANY TABLE
      let params = {
        Item: {
          id: { S: event.request.userAttributes.phone_number },
          __typename: { S: "CompanyUser" },
          phone_number: { S: event.request.userAttributes.phone_number },
          createdAt: { S: date.toISOString() },
          updatedAt: { S: date.toISOString() },
        },
        TableName: process.env.API_EZZYAPP_COMPANYUSERTABLE_NAME,
      };

      // Call DynamoDB
      try {
        await ddb.putItem(params).promise();
        console.log("Success");
      } catch (err) {
        console.log("Error", err);
      }

      console.log("Success: Everything executed correctly");
      context.done(null, event);
    } else if (userType === "sp_user") {
      // SP TABLE
      let params = {
        Item: {
          id: { S: event.request.userAttributes.phone_number },
          __typename: { S: "SpUser" },
          phone_number: { S: event.request.userAttributes.phone_number },
          createdAt: { S: date.toISOString() },
          updatedAt: { S: date.toISOString() },
        },
        TableName: process.env.API_EZZYAPP_SPUSERTABLE_NAME,
      };

      // Call DynamoDB
      try {
        await ddb.putItem(params).promise();
        console.log("Success");
      } catch (err) {
        console.log("Error", err);
      }

      console.log("Success: Everything executed correctly");
      context.done(null, event);
    } else if (userType === "finder_user") {
      // FINDER TABLE
      let params = {
        Item: {
          id: { S: event.request.userAttributes.phone_number },
          __typename: { S: "FinderUser" },
          phone_number: { S: event.request.userAttributes.phone_number },
          createdAt: { S: date.toISOString() },
          updatedAt: { S: date.toISOString() },
        },
        TableName: process.env.API_EZZYAPP_FINDERUSERTABLE_NAME,
      };

      // Call DynamoDB
      try {
        await ddb.putItem(params).promise();
        console.log("Success");
      } catch (err) {
        console.log("Error", err);
      }

      console.log("Success: Everything executed correctly");
      context.done(null, event);
    }
  } else {
    // Nothing to do, the user's email ID is unknown
    console.log("Error: Nothing was written to DynamoDB");
    context.done(null, event);
  }
};
