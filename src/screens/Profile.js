import React, { Component } from 'react'
import {Item, Button, Card, Modal, Checkbox, Message} from 'semantic-ui-react'
import proPic from './BlakeProfilePic.jpg';
import Amplify, { Storage, API, Auth, graphqlOperation} from 'aws-amplify';
import setupAWS from './appConfig';
import BuddyListProp from "./buddyList";
import TrophyCaseProp from "./trophyCase";
import QL from '../GraphQL';

// AWS.config.update({region: 'us-east-1'});
// AWS.config.credentials = new AWS.CognitoIdentityCredentials(
//     {IdentityPoolId: 'us-east-1:d9a16b98-4393-4ff6-9e4b-5e738fef1222'});

// setupAWS();

var curUserName = "Blake";
var curName = "Bah Lah Kay";
var curChalWins = 1;

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

class Profile extends Component {

    state = {
        isLoading: true,
        username: null,
        userInfo: {
            name: null,
            birthday: null,
            profileImagePath: null,
            profilePicture: null,
            challengesWon: null,
        },
        error: null
    };

    constructor(props) {
        super(props);
        // TODO Change this if we want to actually be able to do something while it's loading
        if (!this.props.username) {
            return;
        }
        // This can only run if we're already done loading
        this.state.username = this.props.username;
        // TODO Start loading the profile picture
        QL.getClientByUsername(this.state.username, ["name", "birthday", "profileImagePath", "challengesWon"], (data) => {
            console.log("Successfully grabbed client by username for Profile.js");
            alert("User came back with: " + JSON.stringify(data));
            this.setState(this.createUserInfo(data));
            // Now grab the profile picture
            Storage.get(data.profileImagePath).then((data) => {
                this.setState({profilePicture: data, isLoading: false});
            }).catch((error) => {
                this.setState({error: error});
            });
        }, (error) => {
            console.log("Getting client by username failed for Profile.js");
            if (error.message) {
                error = error.message;
            }
            this.setState({error: error});
        });
    }

    createUserInfo(client) {
        return {
            name: client.name,
            birthday: client.birthday,
            profileImagePath: client.profileImagePath,
            challengesWon: client.challengesWon
        };
    }


    render() {
        // TODO Unecessary?
        // if (this.state.username && this.state.profilePicture) {
        //     this.state.isLoading = false;
        // }

        function errorMessage(error) {
            if (error) {
                return (
                    <Message color='red'>
                        <h1>Error!</h1>
                        <p>{error}</p>
                    </Message>
                );
            }
        }

        function profilePicture() {
            if (this.state.profilePicture) {
                return(
                    <Item.Image size='medium' src={this.state.profilePicture} circular/>
                );
            }
            else {
                return(
                    <p>Loading...</p>
                );
            }
        }

        if (this.state.isLoading) {
            return(
                <Message>Loading...</Message>
            )
        }
        return(
            <Card>
                {errorMessage(this.state.error)}
                <Card.Content>
                    <Card.Header textAlign={'center'}>{this.state.userClient.name}</Card.Header>
                </Card.Content>
                <Item>
                    {this.profilePicture()}
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
    }
}

export default Profile;