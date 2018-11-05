import React, { Component } from 'react'
import _ from 'lodash';
import {Grid, Button, Message} from 'semantic-ui-react';
import { Storage } from 'aws-amplify';
import EventCard from "./EventCard";
import QL from '../GraphQL';
import Lambda from "../Lambda";

// TODO: Not currently able to be styled as the graphql is broken inside of this modal.
class OwnedChallengesProp extends Component {
    state = {
        isLoading: true,
        checked: false,
        username: null,
        userInfo: {
            id: null,
            name: null,
            birthday: null,
            profileImagePath: null,
            profilePicture: null,
            challengesWon: null,
            scheduledChallenges:[],
            ownedChallenges: [],
            access: 'private'
        },
        error: null
    };

    toggle = () => this.setState({ checked: !this.state.checked });


    constructor(props) {
        super(props);
        alert("Got into Owned Challenges constructor");
        this.update();
    }

    update() {
        // TODO Change this if we want to actually be able to do something while it's loading
        if (!this.state.isLoading) {
            return;
        }
        alert(JSON.stringify(this.props));
        if (!this.props.username) {
            return;
        }
        // This can only run if we're already done loading
        this.state.username = this.props.username;
        // TODO Start loading the profile picture
        alert("Starting to get user attributes for Profile.js in GraphQL");
        QL.getClientByUsername(this.state.username, ["name", "birthday", "profileImagePath", "challengesWon", "scheduledChallenges"], (data) => {
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
            challengesWon: client.challengesWon,
            scheduledChallenges: client.scheduledChallenges
        };
    }

    componentWillReceiveProps(newProps) {
        this.props = newProps;
        this.update();
    }

    handleAccessSwitch = () => {
        if(this.state.userInfo.access == 'public') {
            //this.setState({userInfo.access: 'private'});
            this.state.userInfo.access = 'private';
            //alert(this.challengeState.access);
        }
        else if (this.state.userInfo.access == 'private') {
            //this.setState.userInfo({access: 'public'});
            this.state.userInfo.access = 'public';
            //alert(this.challengeState.access);
        }
        else {
            alert("Challenge access should be public or private");
        }

    };

    render() {
        function handleDeleteChallengeSuccess(success) {
            alert(success);
        }

        function handleDeleteChallengeFailure(failure) {
            alert(failure);
        }

        function rows(challenges) {
            return _.times(challenges.length, i => (
                <Grid.Row key={i} className="ui one column stackable center aligned page grid">
                    <EventCard challenge={challenges[i]}/>
                    <Button baisc color='purple'>Edit Challenge</Button>
                    <Button basic color='purple'
                            onClick={Lambda.deleteChallenge(this.state.userInfo.id, this.state.userInfo.id,
                                challenges[i], handleDeleteChallengeSuccess, handleDeleteChallengeFailure)}
                    >Leave Challenge</Button>
                </Grid.Row>
            ));
        }

        if (this.state.isLoading) {
            return(
                <Message>Loading...</Message>
            )
        }
        return(
            <Grid>{rows(this.state.userInfo.ownedChallenges)}</Grid>
        );
    }
}

export default OwnedChallengesProp;