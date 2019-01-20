import * as AWS from "aws-sdk";
/// Configure AWS SDK for JavaScript
AWS.config.update({region: 'REGION'});
AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: 'IDENTITY_POOL_ID'});

// Prepare to call Lambda function
// var lambda = new AWS.Lambda({region: 'REGION', apiVersion: '2015-03-31'});