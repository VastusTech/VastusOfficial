import React, {useState, useEffect} from 'react'
import {Button, Card, Modal, Dimmer, Loader, List, Icon, Label, Divider, Image, Grid} from 'semantic-ui-react'
import { Storage } from 'aws-amplify';
import S3 from "../../vastuscomponents/api/S3Storage";
import _ from 'lodash'
import ChallengeList from "../../vastuscomponents/components/lists/ChallengeList";
import {fetchUserAttributes, forceFetchUserAttributes} from "../../redux_helpers/actions/userActions";
import { connect } from "react-redux";
import {logOut} from "../../redux_helpers/actions/authActions";
import ClientFunctions from "../../vastuscomponents/database_functions/ClientFunctions";
import ReactSwipe from "react-swipe";
import { parseISOString } from "../../vastuscomponents/logic/TimeHelper";
import ClientList from "../../vastuscomponents/components/lists/ClientList";
import DatabaseObjectList from "../../vastuscomponents/components/lists/DatabaseObjectList";
import UploadImage from "../../vastuscomponents/components/manager/UploadImage";
import {log} from "../../Constants";
import ProfileImageGallery from "./ProfileImageGallery";
import ProfileImage from "./ProfileImage";
import LogOutButton from "./LogOutButton";
import Spinner from "../../vastuscomponents/components/props/Spinner";

type Props = {
    user: any
};

/**
* ProfileTab
*
* This is the profile page which displays information about the current user.
 */
const ProfileTab = (props: Props) => {
    // ComponentWillReceiveProps
    useEffect(() => {
        log&&console.log("component will receive props equivalent");
        // update();
    }, [props]);
    //
    // function numChallengesWon(challengesWon) {
    //     return challengesWon ? challengesWon.length : 0;
    // }
    //This displays some basic user information, a profile picture, buttons to modify some user related attributes,
    return(
        <Card fluid raised className="u-margin-top--2">
            <Card.Content textAlign="center">
                <ProfileImage userID={props.user.id} profileImage={props.user.profileImage}/>
                <Card.Header as="h2" style={{"margin": "12px 0 0"}}>{props.user.name}</Card.Header>
                <Card.Meta>Event Wins: {props.user.challengesWon ? props.user.challengesWon.length : 0}</Card.Meta>
                <List id = "profile buttons">
                    <List.Item>
                        <Modal closeIcon trigger={<Button primary fluid size="large"><Icon name="picture" /> Photo Gallery</Button>} >
                            <ProfileImageGallery />
                        </Modal>
                    </List.Item>
                    <List.Item>
                        <Modal basic size='mini' closeIcon
                            trigger={<Button primary fluid size="large"><Icon name="users" /> Buddy List</Button>}>
                            <Modal.Content image>
                                <DatabaseObjectList
                                    ids={props.user.friends}
                                    noObjectsMessage={"No friends yet!"}
                                    acceptedItemTypes={["Client", "Trainer"]}
                                />
                            </Modal.Content>
                        </Modal>
                    </List.Item>
                    <Divider />
                    <List.Item>
                        <Modal basic size='mini' closeIcon
                            trigger={<Button primary fluid size="large"><Icon name="trophy" /> Created Challenges</Button>}>
                            <Modal.Content>
                                <ChallengeList challengeIDs={props.user.ownedChallenges} noChallengesMessage={"No Owned Challenges Yet!"}/>
                            </Modal.Content>
                        </Modal>
                    </List.Item>
                    <List.Item>
                        <Modal basic size='mini' closeIcon
                            trigger={<Button primary fluid size="large"><Icon name="checked calendar" /> Scheduled Challenges</Button>}>
                            <Modal.Content>
                                <ChallengeList challengeIDs={props.user.challenges} noChallengesMessage={"No Scheduled Challenges Yet!"}/>
                            </Modal.Content>
                        </Modal>
                    </List.Item>
                    <List.Item>
                        <Modal basic size='mini' closeIcon
                            trigger={<Button fluid size="large"><Icon name="bookmark outline" />Completed Challenges</Button>}>
                            <Modal.Content>
                                <ChallengeList challengeIDs={props.user.completedChallenges} noChallengesMessage={"No completed challenges yet!"}/>
                            </Modal.Content>
                        </Modal>
                    </List.Item>
                    <Divider />
                    <List.Item>
                        <LogOutButton/>
                    </List.Item>
                </List>
            </Card.Content>
        </Card>
    );
};

export default ProfileTab;