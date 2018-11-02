import React from 'react'
import {Item, Button, Card, Modal, Checkbox} from 'semantic-ui-react'
import proPic from './BlakeProfilePic.jpg';
import Amplify, { API, Auth, graphqlOperation} from 'aws-amplify';
import {withAuthenticator } from 'aws-amplify-react';
import * as AWS from "aws-sdk";
import setupAWS from './appConfig';
import BuddyListProp from "./buddyList";
import TrophyCaseProp from "./trophyCase";

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

const ProfileProp = () => (
    <Card>
        <Card.Content>
            <Card.Header textAlign={'center'}>{curName}</Card.Header>
        </Card.Content>
        <Item>
            <Item.Image size='medium' src={proPic} circular/>

            <Item.Content>
                <Item.Description>
                    <div>{}</div>
                </Item.Description>
                <Item.Extra>
                    <Modal size='mini' trigger={<Button basic color='purple'>Friend List</Button>}>
                        <Modal.Content image>
                            <BuddyListProp/>
                        </Modal.Content>
                    </Modal>
                </Item.Extra>
                <Item.Extra>Event Wins: <div>{curChalWins}</div></Item.Extra>
            </Item.Content>
        </Item>
        <div> <Checkbox toggle labelPosition='right' />Set Profile to Private</div>
        <div className="ui one column stackable center aligned page grid">
            <TrophyCaseProp/>
        </div>
    </Card>
);

export default ProfileProp