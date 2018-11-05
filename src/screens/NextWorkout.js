import React from 'react'
import { Grid, Image } from 'semantic-ui-react'
import proPic from '../img/BlakeProfilePic.jpg';
import Amplify, { API, Auth, graphqlOperation} from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import * as AWS from "aws-sdk";
import setupAWS from "./AppConfig";

AWS.config.update({region: 'us-east-1'});
AWS.config.credentials = new AWS.CognitoIdentityCredentials(
    {IdentityPoolId: 'us-east-1:d9a16b98-4393-4ff6-9e4b-5e738fef1222'});

setupAWS();

//username of the current user
var curUserName;

//name of the current user
var curName;

//Number of challenge wins for the current user
var curChalWins;

var challengeScheduleLen;

var nextChal;

async function asyncCallCurUser(callback) {
    console.log('calling');
    var result = await Auth.currentAuthenticatedUser()
        .then(user => user.username)
        .catch(err => console.log(err));
    console.log(result);
    callback(result);
    // expected output: 'resolved'
}

function callBetterCurUser(callback) {
    asyncCallCurUser(function(data) {
        /*
        let usernameJSON = JSON.stringify(data);
        alert(usernameJSON);
        let username = JSON.parse(usernameJSON);
        */
        //alert(data);
        callback(data);
    });
}

callBetterCurUser(function(data) {
    curUserName = data;
    //alert(getClient(curUserName));
    callQueryBetter(getClient(curUserName), function(data) {
        curName = data.name;
        curChalWins = data.challengesWon;
        if (data.scheduledChallenges != null) {
            challengeScheduleLen = data.scheduledChallenges.length - 1;
            nextChal = data.scheduledChallenges[challengeScheduleLen];
        }
        else {
            challengeScheduleLen = 0;
            nextChal = "You have no upcoming challenges"
        }
        //alert(challengeScheduleLen);
        //alert(data.scheduledChallenges);
    });
});

async function asyncCall(query, callback) {
    console.log('calling');
    var result = await API.graphql(graphqlOperation(query));
    console.log(result);
    callback(result);
    // expected output: 'resolved'
}

function callQueryBetter(query, callback) {
    asyncCall(query, function(data) {
        let userJSON = JSON.stringify(data);
        //alert(userJSON);
        let user = JSON.parse(userJSON);
        callback(user.data.getClientByUsername);
    });
    /*
    let allChallengesJSON = JSON.stringify(asyncCall(query));//.data.queryChallenges.items);
    alert(allChallengesJSON);
    let allChallenges = JSON.parse(allChallengesJSON);
    callback(allChallenges);*/
}

function getClient(userName) {
    const userQuery = `query getUser {
        getClientByUsername(username: "` + userName + `") {
            id
            name
            username
            challengesWon
            scheduledChallenges
            friends
            friendRequests
            }
        }`;
    return userQuery;
}

const NextWorkoutProp = () => (
    <Grid>
        <Grid.Column width={4}>
            <Image src={proPic} circular/>
        </Grid.Column>
        <Grid.Column width={9}>
            Next Challenge: {nextChal}
        </Grid.Column>
    </Grid>
);

export default NextWorkoutProp