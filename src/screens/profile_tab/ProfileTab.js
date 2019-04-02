import React, {useState, useEffect} from 'react'
import {connect} from "react-redux";
import {Button, Card, Modal, Dimmer, Loader, List, Icon, Label, Divider, Image, Grid, Visibility} from 'semantic-ui-react'
import ChallengeList from "../../vastuscomponents/components/lists/ChallengeList";
import DatabaseObjectList from "../../vastuscomponents/components/lists/DatabaseObjectList";
import ProfileImage from "../../vastuscomponents/components/props/ProfileImage";
import LogOutButton from "../../vastuscomponents/components/manager/LogOutButton";

/**
* ProfileTab
*
* This is the profile page which displays information about the current user.
 */
const ProfileTab = (props) => {
    if (!props.user) {
        return (
            <Dimmer>
                <Loader/>
            </Dimmer>
        )
    }
    return (
        <Card fluid raised className="u-margin-top--2">
            <Card.Content textAlign="center">
                <ProfileImage userID={props.user.id} profileImage={props.user.profileImage} profileImagePaths={props.user.profileImagePaths} profileImages={props.user.profileImages} editable/>
                <Card.Header as="h2" style={{"margin": "12px 0 0"}}>{props.user.name}</Card.Header>
                <Card.Meta>Event Wins: {props.user.challengesWon ? props.user.challengesWon.length : 0}</Card.Meta>
                <List id = "profile buttons">
                    {/*<List.Item>*/}
                        {/*<Modal closeIcon trigger={<Button primary fluid size="large"><Icon name="picture" /> Photo Gallery</Button>} >*/}
                            {/*<ProfileImageGallery />*/}
                        {/*</Modal>*/}
                    {/*</List.Item>*/}
                    <List.Item>
                        <Modal fluid size='large' closeIcon
                            trigger={<Button primary fluid size="large"><Icon name="users" /> Buddy List</Button>}>
                            <Modal.Header>Buddy List</Modal.Header>
                            <Modal.Content image>
                                <Modal.Description>
                                    <DatabaseObjectList
                                        ids={props.user.friends}
                                        noObjectsMessage={"No friends yet!"}
                                        acceptedItemTypes={["Client", "Trainer"]}
                                        // sortFunction={(a, b) => {
                                        //     const aLen = a.challengesWon ? a.challengesWon.length : 0;
                                        //     const bLen = b.challengesWon ? b.challengesWon.length : 0;
                                        //     return bLen - aLen;
                                        // }}
                                    />
                                </Modal.Description>
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

const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps)(ProfileTab);