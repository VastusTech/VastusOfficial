import React from 'react'
import { Item } from 'semantic-ui-react'
import proPic from './BlakeProfilePic.jpg';
import Amplify, { API, Auth } from 'aws-amplify';
import {withAuthenticator } from 'aws-amplify-react';
import * as AWS from "aws-sdk";
import aws_exports from "../aws-exports";
//import '/Users/blakehatch/WebstormProjects/vastuswebapp/src/AWSLambdaSetup.js'

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


const ProfileProp = () => (
    <Item>
    <Item.Image size='medium' src={proPic} circular/>

    <Item.Content>
    <Item.Header as='a'><div>{}</div></Item.Header>
    <Item.Meta>Bio: </Item.Meta>
    <Item.Description>
        <div>{}</div>
        </Item.Description>
    <Item.Extra>Friends: <div>{}</div></Item.Extra>
        <Item.Extra>Event Wins: <div>{}</div></Item.Extra>
    </Item.Content>
    </Item>
);

export default ProfileProp