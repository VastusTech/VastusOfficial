import React, {Component} from 'react'
import _ from 'lodash'
import {Grid, Image, Modal, Button, Header, Card, Label, Item} from 'semantic-ui-react'
import addToFeed from './addToFeed'
import Amplify, { API, Auth, graphqlOperation } from "aws-amplify";
import setupAWS from './appConfig';
import proPic from "./BlakeProfilePic.jpg";

//var i;
const MAX_FEED_ITEMS = 10;

setupAWS();

//username of the current user
var curUserName;

//name of the current user
var curName;

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

export default class ChallengeFeedProp extends Component {

    render() {
        function rows(curName)
        {
            return _.times(MAX_FEED_ITEMS, i => (
                <Grid.Row key={i} className="ui one column stackable center aligned page grid">
                    <Modal trigger={<Button basic color='purple'>{curName}</Button>}>
                        <Modal.Header>Select a Photo</Modal.Header>
                        <Modal.Content image>
                            <Item>
                                <Item.Image size='medium' src={proPic} circular/>
                                <Item.Content>
                                    <Item.Header as='a'><div>{}</div></Item.Header>
                                    <Item.Extra>Friends: <div>{}</div></Item.Extra>
                                    <Item.Extra>Event Wins: <div>{}</div></Item.Extra>
                                </Item.Content>
                            </Item>
                        </Modal.Content>
                    </Modal>
                    <div> has sent you a friend request</div>
                    <Button basic color='purple'>Accept</Button>
                    <Button basic>Deny</Button>
                </Grid.Row>
            ));
        }

        return (
            <Grid>{rows(curName)}</Grid>
        );
    }
}