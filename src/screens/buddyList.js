import React, {Component} from 'react'
import _ from 'lodash'
import {Grid, Image, Modal, Button, Header, Card, Label, Item} from 'semantic-ui-react'
import addToFeed from './addToFeed'
import Amplify, { Auth, API, graphqlOperation } from "aws-amplify";
import setupAWS from './appConfig';
import proPic from "./BlakeProfilePic.jpg";

setupAWS();

//username of the current user
var curUserName;

//name of the current user
var curName;

//Friend requests for the current user
var curFriends = [];

var friendNames = [];

var friendIDs = [];

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
        if (data.friends != null) {
            for (var i = 0; i < data.friends.length; i++) {
                curFriends[i] = data.friends[i];
                try{throw i}
                catch(ii) {
                    getUser(ii, getClientByID(curFriends[ii]), function (data) {
                        console.log(ii);
                        friendNames[ii] = data.name;
                        friendIDs[ii] = data.id;
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

export default class BuddyListProp extends Component {
    render() {
        function rows()
        {
            return _.times(curFriends.length, i => (
                <Grid.Row key={i} className="ui one column stackable center aligned page grid">
                    <Modal size='mini' trigger ={<div><Image src={proPic} circular avatar/> <span>{friendNames[i]}</span></div>}>
                        <Modal.Content image>
                            <Item>
                                <Item.Image size='medium' src={proPic} circular/>
                                <Item.Content>
                                    <Item.Header as='a'><div>{friendNames[i]}</div></Item.Header>
                                    <Item.Description>
                                        <div>{}</div>
                                    </Item.Description>
                                    <Item.Extra>Friends: <div>{}</div></Item.Extra>
                                    <Item.Extra>Event Wins: <div>{}</div></Item.Extra>
                                </Item.Content>
                            </Item>
                        </Modal.Content>
                    </Modal>
                </Grid.Row>
            ));
        }

        return (
            <Grid>{rows()}</Grid>
        );
    }
}
