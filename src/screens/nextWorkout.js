import React from 'react'
import { Item } from 'semantic-ui-react'
import proPic from './BlakeProfilePic.jpg';
import {withAuthenticator } from 'aws-amplify-react';
import {Grid, Image} from "semantic-ui-react";
import * as AWS from "aws-sdk";

AWS.config.update({region: 'us-east-1'});
AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: 'us-east-1:d9a16b98-4393-4ff6-9e4b-5e738fef1222'});

var lambda = new AWS.Lambda({region: 'us-east-1', apiVersion: '2015-03-31'});

var createClientJSON = {
    fromID: "admin",
    action: "READ",
    itemType: "Client",
    identifiers: "C002824814",
};

var pullParams = {
    FunctionName : 'VastusDatabaseLambdaFunction',
    Payload : JSON.stringify(createClientJSON)
};

var pullResults;
var client1;

// lambda.invoke(pullParams, function(error, data) {
//     if (error) {
//         prompt(error);
//     } else {
//         pullResults = JSON.parse(data.Payload);
//         client1 = pullResults.data[0];
//         prompt("Name: " + client1.name);
//     }
// });

const NextWorkoutProp = () => (
    <Grid>
        <Grid.Column width={4}>
            <Image src={proPic} circular/>
        </Grid.Column>
        <Grid.Column width={9}>
            Next Workout: Tomorrow with Trainer Blake Hatch
        </Grid.Column>
    </Grid>
);

export default NextWorkoutProp