import React, { Component } from 'react'
import {Item, Button, Card, Modal, Checkbox, Dimmer, Loader, Image, List, Icon } from 'semantic-ui-react'
import { Storage } from 'aws-amplify';
import BuddyListProp from "./BuddyList";
import TrophyCaseProp from "./TrophyCase";
// import { S3Image } from 'aws-amplify-react';
import ChallengeManagerProp from "./ManageChallenges";
// import QL from '../GraphQL';
import Lambda from '../Lambda';
import proPic from '../img/roundProfile.png';
import ScheduledChallengesList from "./ScheduledEventList";
import OwnedChallengesList from "./OwnedEventList";
import { fetchUserAttributes } from "../redux_helpers/actions/userActions";
import { connect } from "react-redux";
import AWSSetup from "../AppConfig";

AWSSetup();

Storage.configure({level: 'public'});

window.LOG_LEVEL='DEBUG';

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
        error: null
    };

    toggle = () => this.setState({ checked: !this.state.checked });

    constructor(props) {
        super(props);
        this.setState({isLoading: true});
        // ("Got into Profile constructor");
        this.setPicture = this.setPicture.bind(this);
        this.update = this.update.bind(this);
        this.profilePicture = this.profilePicture.bind(this);
    }

    componentDidMount() {
        this.update();
    }

    componentWillReceiveProps(newProps) {
        this.props = newProps;
        if (newProps.user.profileImagePath) {
            this.setState({isLoading: true});
        }
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
                if (user.profileImagePath) {
                    Storage.get(user.profileImagePath).then((data) => {
                        // alert("Received properly and setting! Data = " + JSON.stringify(data));
                        this.setState({profilePicture: data, isLoading: false});
                    }).catch((error) => {
                        alert("Received an error, so not setting. Error = " + JSON.stringify(error));
                        this.setState({error: error});
                    });
                }
                else {
                    // Default
                    this.setState({isLoading: false, profilePicture: proPic});
                }
            }
        }
        else if (!this.props.user.info.isLoading) {
            this.props.fetchUserAttributes(user.id, ["name", "username", "birthday", "profileImagePath", "challengesWon"]);
        }
    }

    setPicture(event) {
        //alert(JSON.stringify(this.props));
        if (this.props.user.id) {
            const path = "/ClientFiles/" + this.props.user.id + "/profileImage";
            //alert("Calling storage put");
            //alert("File = " + JSON.stringify(event.target.files[0]));
            Storage.put(path, event.target.files[0], { contentType: "image/*" }).then((result) => {
                // Now we update the database object to reflect this
                //alert(JSON.stringify(result));
                //alert("Successfully put the image, now putting the data into the database!");
                Lambda.editClientAttribute(this.props.user.id, this.props.user.id, "profileImagePath", path,
                    (data) => {
                        //alert("successfully editted client");
                        //alert(JSON.stringify(data));
                        this.props.fetchUserAttributes(this.props.user.id, ["profileImagePath"]);
                        this.setState({isLoading: true});
                    }, (error) => {
                    alert("Failed edit client attribute");
                        alert(JSON.stringify(error));
                    });
                this.setState({isLoading: true});
            }).catch((error) => {
                alert("failed storage put");
                alert(error);
            });
        }
    }

    profilePicture() {
        if (this.state.profilePicture) {
            return(
                <Item.Image size='medium' src={this.state.profilePicture} circular/>
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
            <Card fluid>
                <Card.Content textAlign="center">
                    {this.profilePicture()}
                    <Card.Header as="h2" style={{"margin": "12px 0 0"}}>{this.props.user.name}</Card.Header>
                    <p>Event Wins: {numChallengesWon(this.props.user.challengesWon)}</p>
                    <List>
                        <List.Item>
                            <label htmlFor="proPicUpload" className="ui large fluid primary button">
                                <div>
                                    <i className='ui upload icon'></i>
                                        Upload New Profile Picture
                                </div>
                            </label>
                            <input type="file" accept="image/*" id="proPicUpload" hidden={true} onChange={this.setPicture}/>
                        </List.Item>
                        <List.Item>
                            <Modal size='mini' trigger={<Button primary fluid size="large"><Icon name="users" /> Friend List</Button>}>
                                <Modal.Content image>
                                    <BuddyListProp/>
                                </Modal.Content>
                            </Modal>
                        </List.Item>
                        <List.Item>
                            <Modal size='mini' trigger={<Button primary fluid  size="large"><Icon name="checked calendar" /> Scheduled Challenges</Button>}>
                                <Modal.Content>
                                    <ScheduledChallengesList/>
                                </Modal.Content>
                            </Modal>
                        </List.Item>
                        <List.Item>
                            <Modal size='mini' trigger={<Button primary fluid  size="large"><Icon name="trophy" /> Owned Challenges</Button>}>
                                <Modal.Content>
                                    <OwnedChallengesList/>
                                </Modal.Content>
                            </Modal>
                        </List.Item>
                    </List>
                    <div>
                        <TrophyCaseProp numTrophies={numChallengesWon(this.props.user.challengesWon)}/>
                    </div>
                </Card.Content>
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