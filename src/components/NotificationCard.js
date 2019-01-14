import React, {Component} from 'react'
import {Image, Button, Card, Feed, Divider} from 'semantic-ui-react'
import ClientModal from "./ClientModal";
import TrainerModal from "./TrainerModal";
import EventDescriptionModal from "./EventDescriptionModal";
import ChallengeDescriptionModal from "./ChallengeDescriptionModal";
import { connect } from "react-redux";
import {fetchClient, fetchEvent, fetchChallenge} from "../redux_helpers/actions/cacheActions";
import UserFunctions from "../databaseFunctions/UserFunctions";
import InviteFunctions from "../databaseFunctions/InviteFunctions";
import EventFunctions from "../databaseFunctions/EventFunctions";
import ChallengeFunctions from "../databaseFunctions/ChallengeFunctions";

class NotificationCard extends Component {
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
    };

    constructor(props) {
        super(props);
        // this.update = this.update.bind(this);
        // this.update();
    }

    componentDidMount() {
        this.update(this.props);
    }

    componentWillReceiveProps(newProps, nextContext) {
        this.update(newProps);
    }

    update(props) {
        if (props.inviteID) {
            const invite = props.cache.invites[props.inviteID];
            if (invite) {
                if (invite.from && invite.inviteType && invite.about) {
                    // TODO This sends two requests which is sorta inconsequential but is seriously bugging me :(
                    if (this.state.inviteID !== props.inviteID && !this.state.sentRequest && !this.props.info.isLoading) {
                        this.setState({inviteID: props.inviteID});
                        this.state.sentRequest = true;
                        // console.log("Fetching client = " + invite.from);
                        props.fetchClient(invite.from, ["id", "name", "friends", "challengesWon", "scheduledEvents", "profileImagePath", "profilePicture"]);
                        this.props.fetchTrainer(invite.from, ["id", "name", "gender", "birthday", "profileImagePath", "profilePicture", "profileImagePaths"]);
                        if (invite.inviteType === "eventInvite") {
                            // console.log("Fetching event = " + invite.about);
                            props.fetchEvent(invite.about, ["id", "title", "time", "time_created", "owner", "members", "capacity", "difficulty"]);
                        }
                        else if (invite.inviteType === "challengeInvite") {
                            props.fetchChallenge(invite.about, ["id", "title", "time", "time_created", "owner", "members", "capacity", "difficulty"]);
                        }
                    }
                }
                else {
                    console.log("Invite only partially gotten?");
                    console.log(JSON.stringify(invite));
                }
            }
        }
    }

    // update = () => {
        // if (this.state.friendRequestID) {
        //     QL.getClient(this.state.friendRequestID, ["name"], (data) => {
        //         if (data.name) {
        //             this.setState({isLoading: false, name: data.name});
        //         }
        //         else {
        //             this.setState({isLoading: false});
        //         }
        //     }, (error) => {
        //         console.log("Getting friend request ID failed");
        //         if (error.message) {
        //             error = error.message;
        //         }
        //         console.log(error);
        //         this.setState({error: error, isLoading: false});
        //     });
        // }
        // else {
        //     //console.log("ERID: " + this.props.eventRequestID);
        //     QL.getEvent(this.props.eventRequestID, ["id", "title", "goal", "time", "time_created", "owner", "members"], (data) => {
        //         if (data) {
        //             this.setState({isLoading: false, name: data.title, event: data});
        //         }
        //         else {
        //             this.setState({isLoading: false});
        //         }
        //     }, (error) => {
        //         console.log("Getting friend request ID failed");
        //         if (error.message) {
        //             error = error.message;
        //         }
        //         console.log(error);
        //         this.setState({error: error, isLoading: false});
        //     });
        // }
    // };

    handleClientModalOpen() {
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
        ChallengeFunctions.addMember(this.state.user.id, this.getInviteAttribute("to"), this.getInviteAttribute("about"), () => {
            // TODO
        }, (error) => {
            // TODO
        });
    }

    handleDeclineChallengeRequest() {
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
            // TODO Incorporate itemType into this ASAP
            const from = this.props.cache.clients[invite.from];
            if (from) {
                return from[attribute];
            }
        }
        return null;
    }

    getAboutAttribute(attribute) {
        const invite = this.props.cache.invites[this.props.inviteID];
        if (invite && invite.about) {
            if (invite.inviteType === "friendRequest") {
                // TODO Itemtype
                const about = this.props.cache.clients[invite.about];
                if (about) {
                    return about[attribute];
                }
            }
            else if (invite.inviteType === "eventInvite") {
                const about = this.props.cache.events[invite.about];
                if (about) {
                    return about[attribute];
                }
            }
            else if (invite.inviteType === "challengeInvite") {
                const about = this.props.cache.challenges[invite.about];
                if (about) {
                    return about[attribute];
                }
            }
        }
        return null;
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
                //alert(this.getInviteAttribute("inviteType"));
                return (
                    <Card fluid raised centered>
                        <div className="u-container">
                        <div className="u-avatar u-avatar--large u-margin-bottom--neg2 u-margin-x--auto" style={{backgroundImage: `url(${this.getFromAttribute("profilePicture")})`}}></div>
                        </div>

                        <Card.Content textAlign='center'>
                            <Card.Header onClick={this.handleClientModalOpen.bind(this)}>
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
                        <ClientModal
                            clientID={this.getAboutAttribute("id")}
                            open={this.state.clientModalOpen}
                            onOpen={this.handleClientModalOpen.bind(this)}
                            onClose={this.handleClientModalClose.bind(this)}
                        />
                        <TrainerModal
                            trainertID={this.getAboutAttribute("id")}
                            open={this.state.clientModalOpen}
                            onOpen={this.handleClientModalOpen.bind(this)}
                            onClose={this.handleClientModalClose.bind(this)}
                        />
                    </Card>
                );
            }
            else if (this.getInviteAttribute("inviteType") === "eventInvite") {
                //alert(this.getInviteAttribute("inviteType"));
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
                                            <Feed.User onClick={this.handleClientModalOpen.bind(this)}>
                                                {this.getFromAttribute("name")}
                                            </Feed.User>
                                            <ClientModal
                                                clientID={this.getFromAttribute("id")}
                                                open={this.state.clientModalOpen}
                                                onOpen={this.handleClientModalOpen.bind(this)}
                                                onClose={this.handleClientModalClose.bind(this)}
                                            />
                                            <TrainerModal
                                                trainerID={this.getAboutAttribute("id")}
                                                open={this.state.clientModalOpen}
                                                onOpen={this.handleClientModalOpen.bind(this)}
                                                onClose={this.handleTrainerModalClose.bind(this)}
                                            />
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
                //alert("hey yah");
                //alert(this.getInviteAttribute("title"));
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
                                            <Feed.User onClick={this.handleChallengeModalOpen.bind(this)}>
                                                {this.getAboutAttribute("title")}
                                            </Feed.User>
                                            <ChallengeDescriptionModal
                                                open={this.state.challengeModalOpen}
                                                onClose={this.handleChallengeModalClose.bind(this)}
                                                challengeID={this.getAboutAttribute("id")}
                                            />
                                            {' '}by{' '}
                                            <Feed.User onClick={this.handleClientModalOpen.bind(this)}>
                                                {this.getFromAttribute("name")}
                                            </Feed.User>
                                            <ClientModal
                                                clientID={this.getFromAttribute("id")}
                                                open={this.state.clientModalOpen}
                                                onOpen={this.handleClientModalOpen.bind(this)}
                                                onClose={this.handleClientModalClose.bind(this)}
                                            />
                                            <TrainerModal
                                                trainerID={this.getAboutAttribute("id")}
                                                open={this.state.clientModalOpen}
                                                onOpen={this.handleClientModalOpen.bind(this)}
                                                onClose={this.handleTrainerModalClose.bind(this)}
                                            />
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
        fetchClient: (id, variablesList) => {
            dispatch(fetchClient(id, variablesList));
        },
        fetchEvent: (id, variablesList) => {
            dispatch(fetchEvent(id, variablesList));
        },
        fetchChallenge: (id, variablesList) => {
            dispatch(fetchChallenge(id, variablesList));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationCard);
