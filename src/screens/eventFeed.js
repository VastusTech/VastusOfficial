import React, {Component} from 'react'
import _ from 'lodash'
import {Grid, Image, Modal, Button, Header, Card, Label, Item} from 'semantic-ui-react'
import addToFeed from './addToFeed'
import Amplify, { Auth, API, graphqlOperation } from "aws-amplify";
import setupAWS from './appConfig';
import proPic from "./BlakeProfilePic.jpg";
import Lambda from "/Users/blakehatch/WebstormProjects/vastusofficial/src/Lambda.js";
import * as AWS from "aws-sdk";

AWS.config.update({region: 'REGION'});
AWS.config.credentials = new AWS.CognitoIdentityCredentials(
    {IdentityPoolId: 'us-east-1:d9a16b98-4393-4ff6-9e4b-5e738fef1222'});

//var i;
var MAX_FEED_ITEMS = 0;

//Get the current user information
//username of the current user
var curUserName;

//name of the current user
var curName;

//Number of challenge wins for the current user
var curChalWins;

//ID of the current user
var curID;

//Get all of the owners of the challenges
setupAWS();

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

function callQueryUser(query, callback) {
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

callBetterCurUser(function(data) {
    curUserName = data;
    //alert(getClient(curUserName));
    callQueryUser(getClientByUsername(curUserName), function(data) {
        curID = data.id;
        alert("Current ID: " + curID);
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

function callQueryChallenge(query, callback) {
    asyncCall(query, function (data) {
        let allChallengesJSON = JSON.stringify(data);
        //alert(allChallengesJSON);
        let allChallenges = JSON.parse(allChallengesJSON);
        if (allChallenges.data.queryChallenges != null)
            callback(allChallenges.data.queryChallenges.items);
    });
    /*
    let allChallengesJSON = JSON.stringify(asyncCall(query));//.data.queryChallenges.items);
    alert(allChallengesJSON);
    let allChallenges = JSON.parse(allChallengesJSON);
    callback(allChallenges);*/
}

const curIDs = [];
const curNames = [];
const challengeTimes = [];
const challengeTitles = [];
const challengeGoals = [];
const challengeOwner = [];
//<AddPostButtonTestProp/>

const getChallenges =
    `query TestChallenges{
                      queryChallenges{
                        items {
                          id
                          title
                          goal
                          time
                          owner
                        }
                      }
                    }`;

function getClientByID(userID) {
    const userQuery = `query getUser {
        getClient(id: "` + userID + `") {
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

function getClientByUsername(userName) {
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

function getUser(n, query, callback) {
    asyncCall(query, function (data) {
        callback(data.data.getClient);
    });
}

callQueryChallenge(getChallenges, function (data) {
    if (data != null) {
        MAX_FEED_ITEMS = data.length;
        //alert(MAX_FEED_ITEMS);
    }

    for (var i = 0; i < MAX_FEED_ITEMS; i++) {
        /*
        const newPost = addToFeed(data[i].time, null, data[i].goal, data[i].title, null);//getChallenges.items[i], null, null);
        events.unshift(newPost);
        */
        challengeTimes[i] = data[i].time;
        challengeTitles[i] = data[i].title;
        challengeGoals[i] = data[i].goal;
        challengeOwner[i] = data[i].owner;
        console.log(challengeTitles[i]);
        console.log(challengeTimes[i]);
        console.log(challengeGoals[i]);
        console.log("Owner" + i + " " + challengeOwner[i]);

        try{throw i}
        catch(ii) {
            getUser(ii, getClientByID(challengeOwner[ii]), function (data) {
                console.log(ii);
                curNames[ii] = data.name;
                curIDs[ii] = data.id;
            });
        }
    }
});

function handleBudRequestSuccess(success) {
    alert(success);
}

function handleBudRequestFailure(failure) {
    alert(failure);
}

export default class ChallengeFeedProp extends Component {

    render() {
        function rows(challengeTitles, challengeTimes, challengeGoals, challengeOwner)
        {
            return _.times(MAX_FEED_ITEMS, i => (
                <Grid.Row key={i} className="ui one column stackable center aligned page grid">
                    <Modal trigger={<Card>
                        <Card.Content>
                            <Card.Header>{challengeTitles[i]}</Card.Header>
                            <Card.Meta>{challengeTimes[i]}</Card.Meta>
                            <Card.Description>
                                {challengeGoals[i]}
                            </Card.Description>
                        </Card.Content>
                    </Card>}>
                        <Modal.Header>{challengeTitles[i]}</Modal.Header>
                        <Modal.Content image>
                            <div>


                                <Modal trigger={<Button basic color='purple'>{curNames[i]}</Button>}>
                                    <Modal.Header>Select a Photo</Modal.Header>
                                    <Modal.Content image>
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
                                                <Item.Extra>
                                                    <Button basic color='purple' type='button' onClick={() =>
                                                    {Lambda.sendFriendRequest(curID, curID, challengeOwner[i],
                                                        handleBudRequestSuccess, handleBudRequestFailure)}}>
                                                        Add Buddy</Button>
                                                </Item.Extra>
                                            </Item.Content>
                                        </Item>
                                    </Modal.Content>
                                </Modal>


                            </div>
                            <Modal.Description>
                                <Header>Info: </Header>
                                <p>{challengeTimes[i]}</p>
                                <p>{challengeGoals[i]}</p>
                            </Modal.Description>
                            <div className='join button'>
                                <Button basic color='purple'>
                                    Join
                                </Button>
                            </div>
                        </Modal.Content>
                    </Modal>
                </Grid.Row>
            ));
        }

        return (
            <Grid>{rows(challengeTitles, challengeTimes, challengeGoals, challengeOwner)}</Grid>
        );
    }
}
