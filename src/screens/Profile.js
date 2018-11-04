import React, { Component } from 'react'
import {Item, Button, Card, Modal, Checkbox, Message} from 'semantic-ui-react'
import proPic from './BlakeProfilePic.jpg';
import Amplify, { Storage, API, Auth, graphqlOperation} from 'aws-amplify';
import setupAWS from './appConfig';
import BuddyListProp from "./buddyList";
import TrophyCaseProp from "./TrophyCase";
import QL from '../GraphQL';

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

    componentWillReceiveProps(newProps) {
        this.props = newProps;
        this.update();
    }

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
                        <Item.Extra>Event Wins: <div>{numChallengesWon(this.state.userInfo.challengesWon)}</div></Item.Extra>
                    </Item.Content>
                </Item>
                <div> <Checkbox toggle labelPosition='right' />Set Profile to Private</div>
                <div className="ui one column stackable center aligned page grid">
                    <TrophyCaseProp numTrophies={numChallengesWon(this.state.userInfo.challengesWon)}/>
                </div>
            </Card>
        );
    }
}

export default Profile;