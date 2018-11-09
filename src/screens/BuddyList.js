/*import React, {Component} from 'react'
import _ from 'lodash'
import {Grid, Image, Modal, Button, Item} from 'semantic-ui-react'
import { Auth, API, graphqlOperation } from "aws-amplify";
import setupAWS from './AppConfig';
import proPic from "../img/BlakeProfilePic.jpg";
import Lambda from '../Lambda';

setupAWS();

//username of the current user
var curUserName;

//name of the current user
var curName;

//ID of the current user
var curID;

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
        if (data.friends != null) {
            curName = data.name;
            curID = data.id;
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
}

function getClientByUsername(userName) {
    const userQuery = `query getUser {
        getClientByUsername(username: "` + userName + `") {
            id
            name
            username
            eventsWon
            scheduledEvents
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
            eventsWon
            scheduledEvents
            friends
            friendRequests
            }
        }`;
    return userQuery;
}

function handleRemoveBuddySuccess(success) {
    alert(success);
}

function handleRemoveBuddyFailure(failure) {
    alert(failure);
}

/*
* Buddy List Prop
*
* This is essentially a friends list which consists of a button which allows you to un-friend someone.
* To the left of the button is an image with the buddy's name displayed next to it, this is a modal that opens
* a generic profile view.
 */
/*
export default class BuddyListProp extends Component {

    //This render is a loop which goes through the user's current friends and displays each one with the
    //Button and modal with generic profile view.
    render() {
        function rows()
        {
            return _.times(curFriends.length, i => (
                <Grid.Row key={i} className="ui one column stackable center aligned page grid">
                    <Modal size='mini' trigger ={<div><Image src={proPic} circular avatar/>
                        <span>{friendNames[i]}</span></div>}>
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
                    <Button basic color='purple'
                            onClick={() =>
                            {Lambda.removeFriend(curID, curID, friendIDs[i], handleRemoveBuddySuccess, handleRemoveBuddyFailure)}}>
                        Remove Buddy</Button>
                </Grid.Row>
            ));
        }

        return (
            <Grid>{rows()}</Grid>
        );
    }
}
*/

import React, { Component } from 'react'
import {Grid, Message} from 'semantic-ui-react';
import ClientModal from "./ClientModal";
import QL from "../GraphQL";
import { connect } from "react-redux";
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";
import { inspect } from 'util';

class BuddyListProp extends Component {
    state = {
        isLoading: true,
        friends: {},
        sentRequest: false,
        error: null
    };

    constructor(props) {
        super(props);
        this.update();
    }

    update() {
        // TODO Change this if we want to actually be able to do something while it's loading
        const user = this.props.user;
        if (!user.id) {
            alert("Pretty bad error");
            this.setState({isLoading: true});
        }

        if (user.hasOwnProperty("friends")) {
            if(user.friends != null) {
                for (let i = 0; i < user.friends.length; i++) {
                    if (!(user.friends[i] in this.state.friends)) {
                        this.addFriendFromGraphQL(user.friends[i]);
                    }
                }
            }
            else {
                alert("You got no friends you loser");
            }
        }
        else if (!this.props.user.info.isLoading) {
            if (!this.state.sentRequest && !this.props.user.info.error) {
                this.props.fetchUserAttributes(user.id, ["friends"]);
                this.setState({sentRequest: true});
            }
        }
    }

    addFriendFromGraphQL(friendID) {
        QL.getClient(friendID, ["id"], (data) => {
            console.log("successfully got a friend");
            this.setState({events: {...this.state.events, [data.id]: data}, isLoading: false});
        }, (error) => {
            console.log("Failed to get a vent");
            console.log(JSON.stringify(error));
            this.setState({error: error});
        });
    }

    componentWillReceiveProps(newProps) {
        this.props = newProps;
        this.update();
    }

    render() {
        function rows(friends) {
            const rowProps = [];
            for (const key in friends) {
                if (friends.hasOwnProperty(key)) {
                    rowProps.push(
                        <Grid.Row className="ui one column stackable center aligned page grid">
                            <ClientModal clientID={friends[key]}/>
                        </Grid.Row>
                    );
                }
            }
            return rowProps;
        }
        if (this.state.isLoading) {
            return(
                <Message>Loading...</Message>
            )
        }
        return(
            <Grid>{rows(this.state.friends)}</Grid>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (id, attributeList) => {
            dispatch(fetchUserAttributes(id, attributeList));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BuddyListProp);