import React, { Component } from 'react'
import {Item, Button, Card, Modal, Checkbox, Message } from 'semantic-ui-react'
import { Storage } from 'aws-amplify';
import BuddyListProp from "./BuddyList";
import TrophyCaseProp from "./TrophyCase";
import ChallengeManagerProp from "./ManageChallenges";
import QL from '../GraphQL';
import proPic from '../img/roundProfile.png';

/**
* Profile
*
* This is the profile page which displays information about the current user.
 */
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
        //("Got into Profile constructor");
        this.update();
    }

    update() {
        // TODO Change this if we want to actually be able to do something while it's loading
        if (!this.state.isLoading) {
            return;
        }
        //alert(JSON.stringify(this.props));
        if (!this.props.username) {
            return;
        }
        // This can only run if we're already done loading
        this.state.username = this.props.username;
        // TODO Start loading the profile picture
        //alert("Starting to get user attributes for Profile.js in GraphQL");
        QL.getClientByUsername(this.state.username, ["name", "birthday", "profileImagePath", "challengesWon", "scheduledChallenges"], (data) => {
            console.log("Successfully grabbed client by username for Profile.js");
            // alert("User came back with: " + JSON.stringify(data));
            this.setState({userInfo: this.createUserInfo(data)});
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
            this.state.userInfo.access = 'private';
        }
        else if (this.state.userInfo.access == 'private') {
            this.state.userInfo.access = 'public';
        }
        else {
            alert("Challenge access should be public or private");
        }

    };

    render() {
        /**
         * This creates an error message from the given error string
         * @param error A string containing the error message that was invoked
         * @returns {*} Returns a Semantic-ui script for displaying the error
         */
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

        /**
         *
         * @param profilePicture Displays the
         * @returns {*}
         */
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

        //This displays some basic user information, a profile picture, buttons to modify some user related attributes,
        //and a switch to set the privacy for the user.
        return(
            <Card>
                {errorMessage(this.state.error)}
                <Card.Content>
                    <Card.Header textAlign={'center'}>{this.state.userInfo.name}</Card.Header>
                </Card.Content>
                <Item>
                    <Item.Image size='medium' src={proPic} circular/>
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
                                    <ChallengeManagerProp username={this.props.username}/>
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