import React, {Component} from 'react'
import {Image, Button, Card, Feed, Divider} from 'semantic-ui-react'
import ClientModal from "../modals/ClientModal";
import TrainerModal from "../modals/TrainerModal";
import EventDescriptionModal from "../modals/EventDescriptionModal";
import ChallengeDescriptionModal from "../modals/ChallengeDescriptionModal";
import { connect } from "react-redux";
import UserFunctions from "../../database_functions/UserFunctions";
import InviteFunctions from "../../database_functions/InviteFunctions";
import EventFunctions from "../../database_functions/EventFunctions";
import ChallengeFunctions from "../../database_functions/ChallengeFunctions";
import {getItemTypeFromID, switchReturnItemType} from "../../logic/ItemType";

type Props = {
    inviteID: string
};
class NotificationCard extends Component<Props> {
    state = {
        error: null,
        isLoading: false,
        inviteID: null,
        sentRequest: false,
        clientModalOpen: false,
        eventModalOpen: false,
        trainerModalOpen: false,
        challengeModalOpen: false,
        isAcceptInviteLoading: false,
        isDenyInviteLoading: false,
        fromItemType: null,
        toItemType: null,
        aboutItemType: null,
    };
    constructor(props) {
        super(props);
        // this.update = this.update.bind(this);
        // this.update();
    }

    componentDidMount() {
        // this.update(this.props);
    }

    componentWillReceiveProps(newProps, nextContext) {
        // this.update(newProps);
        this.setState({inviteID: newProps.inviteID});
    }

    handleClientOrTrainerModalOpen() {
        if(this.getAboutAttribute("id")) {
            if (this.getAboutAttribute("id").substr(0, 2) === "CL") {
                this.setState({clientModalOpen: true});
            }
            else if (this.getAboutAttribute("id").substr(0, 2) === "TR") {
                this.setState({trainerModalOpen: true});
            }
        }
    };
    handleClientModalClose() { this.setState({clientModalOpen: false})};
    handleTrainerModalClose() { this.setState({trainerModalOpen: false})};
    handleEventModalOpen() { this.setState({eventModalOpen: true})};
    handleEventModalClose() { this.setState({eventModalOpen: false})};
    handleChallengeModalOpen() { this.setState({challengeModalOpen: true})};
    handleChallengeModalClose() { this.setState({challengeModalOpen: false})};
    handleAcceptFriendRequest() {
        const userID = this.props.user.id;
        const friendRequestID = this.state.inviteID;
        // console.log("Accepting friend request id = " + friendRequestID);
        if(userID && friendRequestID) {
            const friendID = this.getAboutAttribute("id");
            // console.log("User ID: " + userID + " Friend ID: " + friendID);
            UserFunctions.addFriend(userID, userID, friendID,
                (data) => {
                    this.setState({isAcceptInviteLoading: false});
                    // console.log("Successfully added " + friendID + " as a friend!");
                    this.props.feedUpdate();
                }, (error) => {
                    console.log(JSON.stringify(error));
                    this.setState({error: error});
                    this.setState({isAcceptInviteLoading: false});
                });
        }
        else {
            console.log("user id or invite id not set yet");
            this.setState({isAcceptInviteLoading: false});
        }
    }
    handleAcceptFriendRequestButton() {
        this.setState({isAcceptInviteLoading: true});
        this.handleAcceptFriendRequest();
    }
    handleAcceptEventInviteButton() {
        this.setState({isAcceptInviteLoading: true});
        const userID = this.props.user.id;
        const inviteID = this.state.inviteID;
        // console.log("Accepting event invite " + inviteID);
        if(userID && inviteID) {
            const eventID = this.getAboutAttribute("id");
            // console.log("User ID: " + userID + " event ID: " + eventID);
            UserFunctions.addEvent(userID, userID, eventID,
                (data) => {
                    // console.log("Successfully added " + eventID + " to the schedule!");
                    this.props.feedUpdate();
                    this.setState({isAcceptInviteLoading: false});
                }, (error) => {
                    console.log(JSON.stringify(error));
                    this.setState({error: error});
                    this.setState({isAcceptInviteLoading: false});
                });
        }
        else {
            console.error("user id or invite id not set yet");
        }
    }
    handleAcceptChallengeRequestButton() {
        this.setState({isAcceptInviteLoading: true});
        const userID = this.props.user.id;
        const inviteID = this.state.inviteID;
        // console.log("Accepting event invite " + inviteID);
        if(userID && inviteID) {
            const challengeID = this.getAboutAttribute("id");
            // console.log("User ID: " + userID + " event ID: " + eventID);
            UserFunctions.addChallenge(userID, userID, challengeID,
                (data) => {
                    // console.log("Successfully added " + challengeID + " to the schedule!");
                    this.props.feedUpdate();
                    this.setState({isAcceptInviteLoading: false});
                }, (error) => {
                    console.log(JSON.stringify(error));
                    this.setState({error: error});
                    this.setState({isAcceptInviteLoading: false});
                });
        }
        else {
            console.error("user id or invite id not set yet");
        }
    }
    handleDeclineFriendRequest() {
        const userID = this.props.user.id;
        const inviteID = this.state.inviteID;
        // console.log("DECLINING " + "User ID: " + userID + " Friend Request ID: " + inviteID);
        if(userID && inviteID) {
            InviteFunctions.delete(userID, inviteID,
                (data) => {
                    // console.log("Successfully declined " + inviteID + " friend request!");
                    this.props.feedUpdate();
                    this.setState({isDenyInviteLoading: false});
                }, (error) => {
                    console.log(JSON.stringify(error));
                    this.setState({error: error});
                    this.setState({isDenyInviteLoading: false});
                });
        }
        else {
            console.log("user id or invite id not set");
            this.setState({isDenyInviteLoading: false});
        }
    }
    handleDeclineFriendRequestButton() {
        this.setState({isDenyInviteLoading: true});
        this.handleDeclineFriendRequest();
    }
    handleDeclineEventInviteButton() {
        this.setState({isDenyInviteLoading: true});
        const userID = this.props.user.id;
        const inviteID = this.state.inviteID;
        // console.log("DECLINING " + "User ID: " + userID + " Invite ID: " + inviteID);
        if(userID && inviteID) {
            InviteFunctions.delete(userID, inviteID,
                (data) => {
                    this.setState({isDenyInviteLoading: false});
                    // console.log("Successfully declined " + inviteID + " event invite!");
                    this.props.feedUpdate();
                }, (error) => {
                    this.setState({isDenyInviteLoading: false});
                    console.log(JSON.stringify(error));
                    this.setState({error: error});
                });
        }
        else {
            console.log("user id or invite id not set");
            this.setState({isDenyInviteLoading: false});
        }
    }
    handleDeclineChallengeRequestButton() {
        this.setState({isDenyInviteLoading: true});
        const userID = this.props.user.id;
        const inviteID = this.state.inviteID;
        // console.log("DECLINING " + "User ID: " + userID + " Invite ID: " + inviteID);
        if(userID && inviteID) {
            InviteFunctions.delete(userID, inviteID,
                (data) => {
                    this.setState({isDenyInviteLoading: false});
                    // console.log("Successfully declined " + inviteID + " event invite!");
                    this.props.feedUpdate();
                }, (error) => {
                    this.setState({isDenyInviteLoading: false});
                    console.error(JSON.stringify(error));
                    this.setState({error: error});
                });
        }
        else {
            console.error("user id or invite id not set");
            this.setState({isDenyInviteLoading: false});
        }
    }
    handleAcceptChallengeInvite() {
        UserFunctions.addChallenge(this.state.user.id, this.state.user.id, this.getInviteAttribute("about"), () => {
            // TODO
        }, (error) => {
            // TODO
        });
    }
    handleDeclineChallengeInvite() {
        InviteFunctions.delete(this.state.user.id, this.state.inviteID, () => {
            // TODO
        }, (error) => {
            // TODO
        });
    }
    handleAcceptEventRequest() {
        EventFunctions.addMember(this.state.user.id, this.getInviteAttribute("to"), this.getInviteAttribute("about"), () => {
            // TODO
        }, (error) => {
            // TODO
        });
    }
    handleDeclineEventRequest() {
        InviteFunctions.delete(this.state.user.id, this.state.inviteID, () => {
            // TODO
        }, (error) => {
            // TODO
        });
    }
    handleAcceptChallengeRequest() {
        ChallengeFunctions.addMember(this.props.user.id, this.getInviteAttribute("to"), this.getInviteAttribute("about"), () => {
            // TODO
        }, (error) => {
            // TODO
        });
    }
    handleDeclineChallengeRequest() {
        InviteFunctions.delete(this.props.user.id, this.state.inviteID, () => {
            // TODO
        }, (error) => {
            // TODO
        });
    }
    handleAcceptGroupRequest() {
        ChallengeFunctions.addMember(this.state.user.id, this.getInviteAttribute("to"), this.getInviteAttribute("about"), () => {
            // TODO
        }, (error) => {
            // TODO
        });
    }
    handleDeclineGroupRequest() {
        InviteFunctions.delete(this.state.user.id, this.state.inviteID, () => {
            // TODO
        }, (error) => {
            // TODO
        });
    }
    getInviteAttribute(attribute) {
        const invite = this.props.cache.invites[this.props.inviteID];
        if (invite) {
            return invite[attribute];
        }
        return null;
    }
    getFromAttribute(attribute) {
        const invite = this.props.cache.invites[this.props.inviteID];
        if (invite && invite.from) {
            const fromItemType = getItemTypeFromID(invite.from);
            if (fromItemType === "Client") {
                const from = this.props.cache.clients[invite.from];
                if (from) {
                    return from[attribute];
                }
            }
            else if (fromItemType === "Trainer") {
                const from = this.props.cache.trainers[invite.from];
                if (from) {
                    return from[attribute];
                }
            }
            else if (fromItemType === "Gym") {
                const from = this.props.cache.gyms[invite.from];
                if (from) {
                    return from[attribute];
                }
            }
        }
        return null;
    }
    getToAttribute(attribute) {
        const invite = this.props.cache.invites[this.props.inviteID];
        if (invite && invite.to) {
            const toItemType = this.getToItemType();
            if (toItemType === "Client") {
                const to = this.props.cache.clients[invite.to];
                if (to) {
                    return to[attribute];
                }
            }
            else if (toItemType === "Trainer") {
                const to = this.props.cache.trainers[invite.to];
                if (to) {
                    return to[attribute];
                }
            }
            else if (toItemType === "Event") {
                const to = this.props.cache.events[invite.to];
                if (to) {
                    return to[attribute];
                }
            }
            else if (toItemType === "Challenge") {
                const to = this.props.cache.challenges[invite.to];
                if (to) {
                    return to[attribute];
                }
            }
            else if (toItemType === "Group") {
                const to = this.props.cache.groups[invite.to];
                if (to) {
                    return to[attribute];
                }
            }
        }
        return null;
    }
    getAboutAttribute(attribute) {
        const invite = this.props.cache.invites[this.props.inviteID];
        if (invite && invite.about) {
            const aboutItemType = this.getAboutItemType();
            if (aboutItemType === "Client") {
                const about = this.props.cache.clients[invite.about];
                if (about) {
                    return about[attribute];
                }
            }
            else if (aboutItemType === "Trainer") {
                const about = this.props.cache.trainers[invite.about];
                if (about) {
                    return about[attribute];
                }
            }
            else if (aboutItemType === "Event") {
                const about = this.props.cache.events[invite.about];
                if (about) {
                    return about[attribute];
                }
            }
            else if (aboutItemType === "Challenge") {
                const about = this.props.cache.challenges[invite.about];
                if (about) {
                    return about[attribute];
                }
            }
            else if (aboutItemType === "Group") {
                const about = this.props.cache.groups[invite.about];
                if (about) {
                    return about[attribute];
                }
            }
        }
        return null;
    }
    getToItemType() {
        if (!this.state.toItemType) {
            const to = this.getInviteAttribute("to");
            if (to) {
                this.state.toItemType = getItemTypeFromID(to);
            }
        }
        return this.state.toItemType;
    }
    getAboutItemType() {
        if (!this.state.aboutItemType) {
            const about = this.getInviteAttribute("about");
            if (about) {
                this.state.aboutItemType = getItemTypeFromID(about);
            }
        }
        return this.state.aboutItemType;
    }
    getTimeSinceInvite() {
        let today = new Date();
        let time = today.getHours();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let inviteTime = this.getInviteAttribute("time");
        if(time > 24) {
            return date;
        }
        else {
            return inviteTime;
        }
    }
    getProperModal(id) {
        if (id) {
            const itemType = getItemTypeFromID(id);
            switchReturnItemType(itemType,
                <ClientModal open={this.state.clientModalOpen} onClose={this.handleClientModalClose} clientID={id}/>,
                <TrainerModal trainerID={id} open={this.state.trainerModalOpen}
                              onClose={this.handleTrainerModalClose}/>,
                null,
                null,
                null,
                <EventDescriptionModal open={this.state.eventModalOpen} onClose={this.handleEventModalClose}
                                       eventID={id}/>,
                <ChallengeDescriptionModal open={this.state.challengeModalOpen} onClose={this.handleChallengeModalClose}
                                           challengeID={id}/>,
                null,
                null,
                null, // TODO Implement this in the future!
                null,
                null,
                null,
                "Get proper modal not implemented for this type!");
        }
    }
    render() {
        /*if (!this.getInviteAttribute("id") || !this.getAboutAttribute("id")) {
            return(
                <Grid.Row className="ui one column stackable center aligned page grid">
                    <Dimmer>
                        <Loader />
                    </Dimmer>
                </Grid.Row>
            );
        }
        else {*/
        if (this.getInviteAttribute("inviteType") === "friendRequest") {
            //console.log(this.getInviteAttribute("inviteType"));
            return (
                <Card fluid raised centered>
                    <div className="u-container">
                        <div className="u-avatar u-avatar--large u-margin-bottom--neg2 u-margin-x--auto" style={{backgroundImage: `url(${this.getFromAttribute("profilePicture")})`}}></div>
                    </div>
                    <Card.Content textAlign='center'>
                        <Card.Header onClick={this.handleClientOrTrainerModalOpen.bind(this)}>
                            {this.getFromAttribute("name")}
                        </Card.Header>
                        <Card.Description>
                            has sent you a buddy request {/*Insert Invite Sent Time Here*/}
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra textAlign='center'>
                        <Button.Group fluid>
                            <Button onClick={this.handleDeclineFriendRequestButton.bind(this)}>Deny</Button>
                            <Button primary onClick={this.handleAcceptFriendRequestButton.bind(this)}>Accept</Button>
                        </Button.Group>
                    </Card.Content>
                    {this.getProperModal(this.getAboutAttribute("id"))}
                </Card>
            );
        }
        else if (this.getInviteAttribute("inviteType") === "eventInvite") {
            //console.log(this.getInviteAttribute("inviteType"));
            return (
                <Card fluid raised>
                    <Card.Content>
                        <Feed>
                            <Feed.Event>
                                <Feed.Label>
                                    <Image src={this.getFromAttribute("profilePicture")} circular size="large"/>
                                </Feed.Label>
                                <Feed.Content>
                                    <Feed.Summary>
                                        You were invited to{' '}
                                        <Feed.User onClick={this.handleEventModalOpen.bind(this)}>
                                            {this.getAboutAttribute("title")}
                                        </Feed.User>
                                        <EventDescriptionModal
                                            open={this.state.eventModalOpen}
                                            onClose={this.handleEventModalClose.bind(this)}
                                            eventID={this.getAboutAttribute("id")}
                                        />
                                        {' '}by{' '}
                                        <Feed.User onClick={this.handleClientOrTrainerModalOpen.bind(this)}>
                                            {this.getFromAttribute("name")}
                                        </Feed.User>
                                        {this.getProperModal(this.getFromAttribute("id"))}
                                        <Feed.Date>{/*Insert Invite Sent Time Here*/}</Feed.Date>
                                    </Feed.Summary>
                                    <Divider/>
                                    <Feed.Extra>
                                        <Button inverted loading={this.state.isDenyInviteLoading} disabled={this.state.isDenyInviteLoading} floated="right" size="small" onClick={this.handleDeclineEventInviteButton.bind(this)}>Deny</Button>
                                        <Button primary loading={this.state.isAcceptInviteLoading} disabled={this.state.isAcceptInviteLoading} floated="right" size="small" onClick={this.handleAcceptEventInviteButton.bind(this)}>Accept</Button>
                                    </Feed.Extra>
                                </Feed.Content>
                            </Feed.Event>
                        </Feed>
                    </Card.Content>
                </Card>
            );
        }
        else if (this.getInviteAttribute("inviteType") === "challengeInvite") {
            //console.log("hey yah");
            //console.log(this.getInviteAttribute("title"));
            return (
                <Card fluid raised centered>
                    <div className="u-container">
                        <div className="u-avatar u-avatar--large u-margin-bottom--neg2 u-margin-x--auto" style={{backgroundImage: `url(${this.getFromAttribute("profilePicture")})`}}></div>
                    </div>

                    <Card.Content textAlign='center'>
                        <Card.Header onClick={this.handleClientOrTrainerModalOpen.bind(this)}>
                            {this.getFromAttribute("name")}
                        </Card.Header>
                        <Card.Description>
                            has invited you to {/*Insert Invite Sent Time Here*/}
                            <Feed.User onClick={this.handleChallengeModalOpen.bind(this)}>
                                {this.getAboutAttribute("title")}
                            </Feed.User>
                            <ChallengeDescriptionModal
                                open={this.state.challengeModalOpen}
                                onClose={this.handleChallengeModalClose.bind(this)}
                                challengeID={this.getAboutAttribute("id")}
                            />
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra textAlign='center'>
                        <Button.Group fluid>
                            <Button onClick={this.handleDeclineChallengeRequestButton.bind(this)}>Deny</Button>
                            <Button primary onClick={this.handleAcceptChallengeRequestButton.bind(this)}>Accept</Button>
                        </Button.Group>
                    </Card.Content>
                    {this.getProperModal(this.getFromAttribute("id"))}
                </Card>
            );
        }
        else if (this.getInviteAttribute("inviteType") === "challengeRequest") {
            //console.log("hey yah");
            //console.log(this.getInviteAttribute("title"));
            return (
                <Card fluid raised centered>
                    <div className="u-container">
                        <div className="u-avatar u-avatar--large u-margin-bottom--neg2 u-margin-x--auto" style={{backgroundImage: `url(${this.getFromAttribute("profilePicture")})`}}></div>
                    </div>

                    <Card.Content textAlign='center'>
                        <Card.Header onClick={this.handleClientOrTrainerModalOpen.bind(this)}>
                            {this.getFromAttribute("name")}
                        </Card.Header>
                        <Card.Description>
                            has invited you to {/*Insert Invite Sent Time Here*/}
                            <Feed.User onClick={this.handleChallengeModalOpen.bind(this)}>
                                {this.getToAttribute("title")}
                            </Feed.User>
                            <ChallengeDescriptionModal
                                open={this.state.challengeModalOpen}
                                onClose={this.handleChallengeModalClose.bind(this)}
                                challengeID={this.getAboutAttribute("id")}
                            />
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra textAlign='center'>
                        <Button.Group fluid>
                            <Button onClick={this.handleDeclineChallengeRequest.bind(this)}>Deny</Button>
                            <Button primary onClick={this.handleAcceptChallengeRequest.bind(this)}>Accept</Button>
                        </Button.Group>
                    </Card.Content>
                    {this.getProperModal(this.getAboutAttribute("id"))}
                </Card>
            );
        }
        else if (this.getInviteAttribute("inviteType") === "eventRequest") {
            //console.log("hey yah");
            //TODO: Update this when events are supported
            return (
                <Card fluid raised>
                    <Card.Content>
                        <Feed>
                            <Feed.Event>
                                <Feed.Label>
                                    <Image src={this.getFromAttribute("profilePicture")} circular size="large"/>
                                </Feed.Label>
                                <Feed.Content>
                                    <Feed.Summary>
                                        <Feed.User onClick={this.handleClientOrTrainerModalOpen.bind(this)}>
                                            {this.getFromAttribute("name")}
                                        </Feed.User>
                                        Would like to join {' '}
                                        <Feed.User onClick={this.handleChallengeModalOpen.bind(this)}>
                                            {this.getToAttribute("title")}
                                        </Feed.User>
                                        <ChallengeDescriptionModal
                                            open={this.state.challengeModalOpen}
                                            onClose={this.handleChallengeModalClose.bind(this)}
                                            challengeID={this.getToAttribute("id")}
                                        />
                                        {this.getProperModal(this.getAboutAttribute("id"))}
                                        <Feed.Date>{/*Insert Invite Sent Time Here*/}</Feed.Date>
                                    </Feed.Summary>
                                    <Divider/>
                                    <Feed.Extra>
                                        <Button inverted loading={this.state.isDenyInviteLoading} disabled={this.state.isDenyInviteLoading} floated="right" size="small" onClick={this.handleDeclineChallengeRequestButton.bind(this)}>Deny</Button>
                                        <Button primary loading={this.state.isAcceptInviteLoading} disabled={this.state.isAcceptInviteLoading} floated="right" size="small" onClick={this.handleAcceptChallengeRequestButton.bind(this)}>Accept</Button>
                                    </Feed.Extra>
                                </Feed.Content>
                            </Feed.Event>
                        </Feed>
                    </Card.Content>
                </Card>
            );
        }
        else if (this.getInviteAttribute("inviteType") === "groupRequest") {
            //console.log("hey yah");
            //TODO: Update this when groups are supported
            return (
                <Card fluid raised>
                    <Card.Content>
                        <Feed>
                            <Feed.Event>
                                <Feed.Label>
                                    <Image src={this.getFromAttribute("profilePicture")} circular size="large"/>
                                </Feed.Label>
                                <Feed.Content>
                                    <Feed.Summary>
                                        <Feed.User onClick={this.handleClientOrTrainerModalOpen.bind(this)}>
                                            {this.getFromAttribute("name")}
                                        </Feed.User>
                                        Would like to join {' '}
                                        <Feed.User onClick={this.handleChallengeModalOpen.bind(this)}>
                                            {this.getAboutAttribute("title")}
                                        </Feed.User>
                                        <ChallengeDescriptionModal
                                            open={this.state.challengeModalOpen}
                                            onClose={this.handleChallengeModalClose.bind(this)}
                                            challengeID={this.getAboutAttribute("id")}
                                        />
                                        {this.getProperModal(this.getAboutAttribute("id"))}
                                        <Feed.Date>{/*Insert Invite Sent Time Here*/}</Feed.Date>
                                    </Feed.Summary>
                                    <Divider/>
                                    <Feed.Extra>
                                        <Button inverted loading={this.state.isDenyInviteLoading} disabled={this.state.isDenyInviteLoading} floated="right" size="small" onClick={this.handleDeclineChallengeRequestButton.bind(this)}>Deny</Button>
                                        <Button primary loading={this.state.isAcceptInviteLoading} disabled={this.state.isAcceptInviteLoading} floated="right" size="small" onClick={this.handleAcceptChallengeRequestButton.bind(this)}>Accept</Button>
                                    </Feed.Extra>
                                </Feed.Content>
                            </Feed.Event>
                        </Feed>
                    </Card.Content>
                </Card>
            );
        }
        else {
            return null;
        }
    }
    //}
}
const mapStateToProps = (state) => ({
    user: state.user,
    cache: state.cache,
    info: state.info
});
const mapDispatchToProps = (dispatch) => {
    return {
        // fetchClient: (id, variablesList, dataHandler) => {
        //     dispatch(fetchClient(id, variablesList, dataHandler));
        // },
        // fetchTrainer: (id, variablesList, dataHandler) => {
        //     dispatch(fetchTrainer(id, variablesList, dataHandler))
        // },
        // fetchEvent: (id, variablesList, dataHandler) => {
        //     dispatch(fetchEvent(id, variablesList, dataHandler));
        // },
        // fetchChallenge: (id, variablesList, dataHandler) => {
        //     dispatch(fetchChallenge(id, variablesList, dataHandler));
        // },
        // fetchInvite: (id, variablesList, dataHandler) => {
        //     dispatch(fetchInvite(id, variablesList, dataHandler));
        // }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(NotificationCard);

