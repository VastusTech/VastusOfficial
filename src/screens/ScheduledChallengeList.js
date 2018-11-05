import React, { Component } from 'react'
import _ from 'lodash';
import {Grid, Button, Message} from 'semantic-ui-react';
import { Storage } from 'aws-amplify';
import EventCard from "./EventCard";
import QL from '../GraphQL';
import Lambda from "../Lambda";

class ScheduledChallengesList extends Component {
    state = {
        isLoading: true,
        checked: false,
        username: null,
        userID: null,
        challenges: [],
        error: null
    };

    toggle = () => this.setState({ checked: !this.state.checked });

    constructor(props) {
        super(props);
        // alert("Got into Scheduled Challenges constructor");
        this.state.username = this.props.username;
        this.update();
    }

    update() {
        // TODO Change this if we want to actually be able to do something while it's loading
        // if (!this.state.isLoading) {
        //     return;
        // }
        // alert(JSON.stringify(this.props));
        if (!this.props.username) {
            return;
        }
        // This can only run if we're already done loading
        // alert("Starting to get user attributes for Profile.js in GraphQL");
        QL.getClientByUsername(this.state.username, ["id", "scheduledChallenges"], (data) => {
            console.log("Successfully grabbed client by username for Profile.js");
            // alert("User came back with: " + JSON.stringify(data));
            this.setState({userID: data.id});
            for (let i = 0; i < data.scheduledChallenges.length; i++) {
                this.addChallengeFromGraphQL(data.scheduledChallenges[i]);
            }
        }, (error) => {
            console.log("Getting client by username failed for ScheduledChallengeList.js");
            if (error.message) {
                error = error.message;
            }
            this.setState({error: error});
        });
    }

    addChallengeFromGraphQL(challengeID) {
        QL.getChallenge(challengeID, ["id", "time", "title", "goal", "owner"], (data) => {
            console.log("successfully got a challenge");
            this.setState({challenges: [...this.state.challenges, data], isLoading: false});
        }, (error) => {
            console.log("Failed to get a challenge");
            if (error.message) {
                error = error.message
            }
            console.log(error);
            this.setState({error: error});
        });
    }

    componentWillReceiveProps(newProps) {
        // this.props = newProps;
        this.update();
    }

    handleLeaveButton(challenge) {
        Lambda.leaveChallenge(this.state.userInfo.id, this.state.userInfo.id,
            challenge, (data) => {
                alert(JSON.stringify(data));
            }, (error) => {
                alert(JSON.stringify(error));
            });
    }

    render() {
        function rows(userID, challenges) {
            return _.times(challenges.length, i => (
                <Grid.Row key={i} className="ui one column stackable center aligned page grid">
                    <EventCard userID={userID} challenge={challenges[i]}/>
                </Grid.Row>
            ));
        }
        if (this.state.isLoading) {
            return(
                <Message>Loading...</Message>
            )
        }
        return(
            <Grid>{rows(this.state.userID, this.state.challenges)}</Grid>
        );
    }
}

export default ScheduledChallengesList;