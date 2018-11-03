import React, {Component} from 'react'
import _ from 'lodash'
import {Grid, Image, Modal, Button, Header, Card, Label, Item} from 'semantic-ui-react'
import addToFeed from './addToFeed'
import Amplify, { API, Auth, graphqlOperation } from "aws-amplify";
import setupAWS from './appConfig';
import proPic from "./BlakeProfilePic.jpg";
import Lambda from "../Lambda";
import Ql from "../GraphQL";

setupAWS();

//username of the current user
var curUserName;

//name of the current user
var curName;

//ID of the current user
var curID;

var curFriendRequests = [];

var friendRequestNames = [];

var friendRequestIDs = [];

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

function getUser(n, query, callback) {
    asyncCall(query, function (data) {
        callback(data.data.getClient);
    });
}

callBetterCurUser(function(data) {
    curUserName = data;
    //alert(getClient(curUserName));
    callQueryBetter(getClientByUsername(curUserName), function(data) {
        curName = data.name;
        curID = data.id;
        //alert("Current user's ID: " + curID);
        if(data.friendRequests != null) {
            for(var i = 0; i < data.friendRequests.length; i++) {
                curFriendRequests[i] = data.friendRequests[i];
                try{throw i}
                catch(ii) {
                    getUser(ii, getClientByID(curFriendRequests[ii]), function (data) {
                        console.log(ii);
                        friendRequestNames[ii] = data.name;
                        friendRequestIDs[ii] = data.id;
                    });
                }
            }
        }
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
        //alert(allChallengesJSON);
        let user = JSON.parse(userJSON);
        callback(user.data.getClientByUsername);
    });
    /*
    let allChallengesJSON = JSON.stringify(asyncCall(query));//.data.queryChallenges.items);
    alert(allChallengesJSON);
    let allChallenges = JSON.parse(allChallengesJSON);
    callback(allChallenges);*/
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

function denyFriendRequest(userID, requestID) {
    Lambda.declineFriendRequest(userID, userID, requestID, handleBudRequestSuccess, handleBudRequestFailure)
}

function acceptFriendRequest(userID, requestID) {
    Lambda.acceptFriendRequest(userID, userID, requestID, handleBudRequestSuccess, handleBudRequestFailure)
}

function handleBudRequestSuccess(success) {
    alert(JSON.stringify(success));
}

function handleBudRequestFailure(failure) {
    alert(failure);
}

export default class ChallengeFeedProp extends Component {

    render() {
        function rows()
        {
            return _.times(curFriendRequests.length, i => (
                <Grid.Row key={i} className="ui one column stackable center aligned page grid">
                    <Modal trigger={<Button basic color='purple'>{friendRequestNames[i]}</Button>}>
                        <Modal.Header>Select a Photo</Modal.Header>
                        <Modal.Content image>
                            <Item>
                                <Item.Image size='medium' src={proPic} circular/>
                                <Item.Content>
                                    <Item.Header as='a'><div>{friendRequestNames[i]}</div></Item.Header>
                                    <Item.Extra>Friends: <div>{}</div></Item.Extra>
                                    <Item.Extra>Event Wins: <div>{}</div></Item.Extra>
                                </Item.Content>
                            </Item>
                        </Modal.Content>
                    </Modal>
                    <div> has sent you a friend request</div>
                    <Button basic color='purple' onClick={() =>
                    {acceptFriendRequest(curID, friendRequestIDs[i])}}>Accept</Button>
                    <Button basic onClick={() =>
                    {denyFriendRequest(curID, friendRequestIDs[i])}}>Deny</Button>
                </Grid.Row>
            ));
        }

        return (
            <Grid>{rows()}</Grid>
        );
    }
}