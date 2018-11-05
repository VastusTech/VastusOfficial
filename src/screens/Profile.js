import React, { Component } from 'react'
import {Item, Button, Card, Modal, Checkbox, Message, Grid, Row} from 'semantic-ui-react'
import _ from 'lodash'
import proPic from './BlakeProfilePic.jpg';
import Amplify, { Storage, API, Auth, graphqlOperation} from 'aws-amplify';
import setupAWS from './appConfig';
import BuddyListProp from "./buddyList";
import TrophyCaseProp from "./TrophyCase";
import ChallengeManagerProp from "./ManageChallenges";
import QL from '../GraphQL';
import EventCard from "./EventCard";
import Lambda from "../Lambda";

class Profile extends Component {
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
            access: 'private'
        },
        error: null
    };

    toggle = () => this.setState({ checked: !this.state.checked });


    constructor(props) {
        super(props);
        alert("Got into Profile constructor");
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
        // Update every time setState is called
        // this.update();
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

        function profilePicture(profilePicture) {
            if (profilePicture) {
                return(
                    <Item.Image size='medium' src={profilePicture} circular/>
                );
            }
            else {
                return(
                    <p>Loading...</p>
                );
            }
        }

        function numChallengesWon(challengesWon) {
            if (challengesWon && challengesWon.size()) {
                return challengesWon.size();
            }
            return 0;
        }

        function handleRemoveChallengeSuccess(success) {
            alert(success);
        }

        function handleRemoveChallengeFailure(failure) {
            alert(failure);
        }

        function rows(challenges, curID) {
            return _.times(challenges.length, i => (
                <Grid.Row key={i} className="ui one column stackable center aligned page grid">
                    <EventCard challenge={challenges[i]}/>
                    <div>
                        <Button basic color='purple'
                                onClick={() =>
                                {Lambda.deleteChallenge(curID, challenges[i], handleRemoveChallengeSuccess, handleRemoveChallengeFailure)}}>
                            Remove Challenge</Button>
                    </div>
                </Grid.Row>
            ));
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
                    <Card.Header textAlign={'center'}>{this.state.userInfo.name}</Card.Header>
                </Card.Content>
                <Item>
                    {profilePicture(this.state.userInfo.profilePicture)}
                    <Item.Content>
                        <Item.Extra>
                            <label htmlFor="proPicUpload" className="ui basic purple floated button">
                                <i className='ui upload icon'></i>
                                Upload New Profile Picture
                            </label>
                            <input type="file" accept="image/*" id="proPicUpload" hidden='true'/>
                        </Item.Extra>
                        <Item.Extra>
                            <Modal size='mini' trigger={<Button basic color='purple'>Friend List</Button>}>
                                <Modal.Content image>
                                    <BuddyListProp/>
                                </Modal.Content>
                            </Modal>
                        </Item.Extra>
                        <Item.Extra>
                            <Modal size='mini' trigger={<Button basic color='purple'>Manage Challenges</Button>}>
                                <Modal.Content image>
                                    <ChallengeManagerProp/>
                                </Modal.Content>
                            </Modal>
                        </Item.Extra>
                        <Item.Extra>Event Wins: <div>{numChallengesWon(this.state.userInfo.challengesWon)}</div></Item.Extra>
                    </Item.Content>
                </Item>
                <div className="Privacy Switch">
                    <Checkbox toggle onClick={this.handleAccessSwitch} onChange={this.toggle} checked={this.state.checked}/>
                    <div>{this.state.userInfo.access}</div>
                </div>
                <div className="ui one column stackable center aligned page grid">
                    <TrophyCaseProp numTrophies={numChallengesWon(this.state.userInfo.challengesWon)}/>
                </div>
            </Card>
        );
    }
}

export default Profile;