import React, { Component } from 'react'
import {Item, Button, Card, Modal, Checkbox, Message, Dimmer, Loader } from 'semantic-ui-react'
import { Storage } from 'aws-amplify';
import BuddyListProp from "./BuddyList";
import TrophyCaseProp from "./TrophyCase";
import { S3Image } from 'aws-amplify-react';
import ChallengeManagerProp from "./ManageChallenges";
// import QL from '../GraphQL';
import proPic from '../img/roundProfile.png';
import ScheduledChallengesList from "./ScheduledChallengeList";
import OwnedChallengesList from "./OwnedChallengesList";
import { fetchUserAttributes } from "../redux_helpers/actions/userActions";
import { connect } from "react-redux";

/**
* Profile
*
* This is the profile page which displays information about the current user.
 */
class Profile extends Component {
    state = {
        isLoading: true,
        checked: false,
        profilePicture: null,
        ifS3: false,
        error: null
    };

    toggle = () => this.setState({ checked: !this.state.checked });

    constructor(props) {
        super(props);
        this.setState({isLoading: true});
        // ("Got into Profile constructor");
        this.update();
    }

    update() {
        const user = this.props.user;
        // alert("Updating. User = " + JSON.stringify(user) + ". State = " + JSON.stringify(this.state));
        if (!user.id) {
            alert("ID is not set inside profile... This means a problem has occurred");
        }

        if (user.id && user.name && user.username && user.birthday) {
            if (this.state.isLoading) {
                // And start to get the profile image from S3
                // alert("Starting to get profile image");
                // Storage.get(user.profileImagePath).then((data) => {
                //     if (data) {
                //         alert("Received properly and setting! Data = " + JSON.stringify(data));
                //         this.setState({profilePicture: data, isLoading: false, ifS3: true});
                //     }
                //     else {
                //         // TODO Check if this is what happens when it doesn't exist
                //         alert("Received null and setting to default!");
                //         this.setState({profilePicture: proPic, isLoading: false, ifS3: false});
                //     }
                // }).catch((error) => {
                //     alert("Received an error, so not setting. Error = " + JSON.stringify(error));
                //     this.setState({error: error});
                // });
                this.setState({isLoading: false, profilePicture: proPic, ifS3: false});
            }
        }
        else if (!this.props.user.info.isLoading) {
            this.props.fetchUserAttributes(user.id, ["name", "username", "birthday", "profileImagePath", "challengesWon"]);
        }
    }

    componentDidMount() {
        this.update();
    }

    componentWillReceiveProps(newProps) {
        this.props = newProps;
        this.update();
    }

    render() {
        //alert(JSON.stringify(this.state));
        /**
         * This creates an error message from the given error string
         * @param error A string containing the error message that was invoked
         * @returns {*} Returns a Semantic-ui script for displaying the error
         */
        // function errorMessage(error) {
        //     if (error) {
        //         return (
        //             <Message color='red'>
        //                 <h1>Error!</h1>
        //                 <p>{error}</p>
        //             </Message>
        //         );
        //     }
        // }

        /**
         *
         * @param profilePicture Displays the
         * @returns {*}
         */
        function profilePicture(profilePicture, ifS3) {
            if (profilePicture) {
                if (ifS3) {
                    return(
                        <S3Image imgKey={profilePicture}/>
                    );
                }
                return(
                    <Item.Image size='medium' src={profilePicture} circular/>
                );
            }
            else {
                return(
                    <Dimmer>
                        <Loader/>
                    </Dimmer>
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
                <Dimmer>
                    <Loader/>
                </Dimmer>
            )
        }

        //This displays some basic user information, a profile picture, buttons to modify some user related attributes,
        //and a switch to set the privacy for the user.
        return(
            <Card>
                <Card.Content>
                    <Card.Header textAlign={'center'}>{this.props.user.name}</Card.Header>
                </Card.Content>
                <Item>
                    {profilePicture(this.state.profilePicture, this.state.ifS3)}
                    <Item.Content>
                        <Item.Extra>
                            <label htmlFor="proPicUpload" className="ui basic purple floated button">
                                <div>
                                    <i className='ui upload icon'></i>
                                        Upload New Profile Picture
                                </div>
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
                            <Modal size='mini' trigger={<Button basic color='purple'>Scheduled Challenges</Button>}>
                                <Modal.Content>
                                    <ScheduledChallengesList/>
                                </Modal.Content>
                            </Modal>
                        </Item.Extra>
                        <Item.Extra>
                            <Modal size='mini' trigger={<Button basic color='purple'>Owned Challenges</Button>}>
                                <Modal.Content>
                                    <OwnedChallengesList/>
                                </Modal.Content>
                            </Modal>
                        </Item.Extra>
                        <Item.Extra>Event Wins: <div>{numChallengesWon(this.props.user.challengesWon)}</div></Item.Extra>
                    </Item.Content>
                </Item>
                <div className="ui one column stackable center aligned page grid">
                    <TrophyCaseProp numTrophies={numChallengesWon(this.props.user.challengesWon)}/>
                </div>
            </Card>
        );
    }
}

// {/*<div className="Privacy Switch">*/}
//     {/*<Checkbox toggle onClick={this.handleAccessSwitch} onChange={this.toggle} checked={this.state.checked}/>*/}
//     {/*<div>{this.state.userInfo.access}</div>*/}
// {/*</div>*/}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (id, attributesList) => {
            dispatch(fetchUserAttributes(id, attributesList));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);