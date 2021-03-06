import React, {useState} from 'react'
import {connect} from "react-redux";
import {Button, Card, Modal, Dimmer, Loader, Input, Icon, Grid, Popup} from 'semantic-ui-react'
import ChallengeList from "../../vastuscomponents/components/lists/ChallengeList";
import DatabaseObjectList from "../../vastuscomponents/components/lists/DatabaseObjectList";
import ProfileImage from "../../vastuscomponents/components/props/ProfileImage";
import LogOutButton from "../../vastuscomponents/components/manager/LogOutButton";

function displayName(isEditing, name) {
    if(!isEditing) {
        return (
            <Card.Header as="h2" style={{"margin": "12px 0 0"}}>{name}</Card.Header>
        );
    }
    else {
        return (
            <Input defaultValue={name}/>
        );
    }
}

function editButton(isEditing, setIsEditing) {
    if(!isEditing) {
        return (
            <Button onClick = { () => setIsEditing(p => !p)} floated='left' circular icon color={'purple'}>
                <Icon name='edit outline'/>
            </Button>
        );
    }
    else {
        return (
            <div>
                <Button onClick = { () => setIsEditing(p => !p)} floated='left' circular icon color={'purple'}>
                    <Icon name='save'/>
                </Button>
                <Button onClick = { () => setIsEditing(p => !p)} floated='left' circular icon>
                    <Icon name='cancel'/>
                </Button>
            </div>
        );
    }
}

/**
* ProfileTab
*
* This is the profile page which displays information about the current user.
 */
const ProfileTab = (props) => {
    const [isEditing, setIsEditing] = useState(false);

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
                {editButton(isEditing, setIsEditing)}
                <Popup
                    trigger={<Button floated='right' circular icon color={'purple'}>
                        <Icon name='cog'/>
                    </Button>}
                    content={<LogOutButton/>}
                    on='click'
                    position='bottom right'
                />
                <ProfileImage userID={props.user.id} profileImage={props.user.profileImage} profileImagePaths={props.user.profileImagePaths} profileImages={props.user.profileImages} editable={isEditing}/>
                {displayName(isEditing, props.user.name)}
                <Card.Header as="h2" style={{"margin": "12px 0 0"}}>{props.user.name}</Card.Header>
                <Card.Meta>Event Wins: {props.user.challengesWon ? props.user.challengesWon.length : 0}</Card.Meta>
                <Grid columns={2} celled>
                    <Grid.Row>
                        <Grid.Column>
                            <Modal fluid size='large' closeIcon
                                   trigger={<Button primary circular icon size="large"><Icon name="users"/></Button>}>
                                <Modal.Header>Buddy List</Modal.Header>
                                <Modal.Content image>
                                    <Modal.Description>
                                        <DatabaseObjectList
                                            ids={props.user.friends}
                                            noObjectsMessage={"No friends yet!"}
                                            acceptedItemTypes={["Client", "Trainer"]}
                                            randomized
                                        />
                                    </Modal.Description>
                                </Modal.Content>
                            </Modal>
                            <div>Buddy List</div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Modal basic size='mini' closeIcon
                                   trigger={<Button primary circular icon size="large"><Icon name="trophy"/></Button>}>
                                <Modal.Content>
                                    <DatabaseObjectList
                                        ids={props.user.ownedChallenges}
                                        noObjectsMessage={"No Owned Challenges yet!"}
                                        acceptedItemTypes={["Challenge"]}
                                        randomized
                                    />
                                </Modal.Content>
                            </Modal>
                            <div>Owned Challenges</div>
                        </Grid.Column>
                        <Grid.Column>
                            <Modal basic size='mini' closeIcon
                                   trigger={<Button circular icon size="large"><Icon name="bookmark outline"/></Button>}>
                                <Modal.Content>
                                    <ChallengeList challengeIDs={props.user.completedChallenges}
                                                   noChallengesMessage={"No completed challenges yet!"}/>
                                </Modal.Content>
                            </Modal>
                            <div>Completed Challenges</div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Card.Content>
        </Card>
    );
};

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(ProfileTab);