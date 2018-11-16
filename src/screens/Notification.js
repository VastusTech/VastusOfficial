import React, {Component} from 'react'
import _ from 'lodash'
import {Image, Modal, Grid, Button, Dimmer, Loader, Card, Feed, Icon, Divider} from 'semantic-ui-react'
import { API, Auth, graphqlOperation } from "aws-amplify";
import setupAWS from '../AppConfig';
import proPic from "../img/BlakeProfilePic.jpg";
import QL from "../GraphQL";
import Lambda from "../Lambda";
import ClientModal from "./ClientModal";
import EventCard from "./EventCard";
import EventDescriptionModal from "./EventDescriptionModal";
import { connect } from "react-redux";

class Notification extends Component {
    state = {
        error: null,
        isLoading: false,
        inviteID: null,
        clientModalOpen: false,
        eventModalOpen: false,
    };

    constructor(props) {
        super(props);
        // this.update = this.update.bind(this);
        // this.update();
    }

    // componentWillReceiveProps(newProps) {
    //     this.update();
    // }

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
        //     //alert("ERID: " + this.props.eventRequestID);
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

    handleClientModalOpen() { this.setState({clientModalOpen: true})};
    handleClientModalClose() { this.setState({clientModalOpen: false})};
    handleEventModalOpen() { this.setState({eventModalOpen: true})};
    handleEventModalClose() { this.setState({eventModalOpen: false})};

    handleAcceptFriendRequestButton() {
        const userID = this.props.user.id;
        const friendRequestID = this.state.inviteID;
        alert("Accepting friend request id = " + friendRequestID);
        if(userID && friendRequestID) {
            const friendID = this.getAboutAttribute("id");
            alert("User ID: " + userID + " Friend ID: " + friendID);
            Lambda.clientAcceptFriendRequest(userID, userID, friendID,
                (data) => {
                    alert("Successfully added " + friendID + " as a friend!");
                    this.props.feedUpdate();
                }, (error) => {
                    alert(JSON.stringify(error));
                    this.setState({error: error});
                });
        }
        else {
            alert("user id or invite id not set yet");
        }
    }

    handleAcceptEventRequestButton() {
        const userID = this.props.user.id;
        const inviteID = this.state.inviteID;
        alert("Accepting event invite " + inviteID);
        if(userID && inviteID) {
            const eventID = this.getAboutAttribute("id");
            alert("User ID: " + userID + " event ID: " + eventID);
            Lambda.clientAcceptEventInvite(userID, userID, eventID,
                (data) => {
                    alert("Successfully added " + eventID + " to the schedule!");
                    this.props.feedUpdate();
                }, (error) => {
                    alert(JSON.stringify(error));
                    this.setState({error: error});
                });
        }
        else {
            alert("user id or invite id not set yet");
        }
    }

    handleDeclineFriendRequestButton() {
        const userID = this.props.user.id;
        const inviteID = this.state.inviteID;
        alert("DECLINING " + "User ID: " + userID + " Friend Request ID: " + inviteID);
        if(userID && inviteID) {
            Lambda.declineFriendRequest(userID, inviteID,
                (data) => {
                    alert("Successfully declined " + inviteID + " friend request!");
                    this.props.feedUpdate();
                }, (error) => {
                    alert(JSON.stringify(error));
                    this.setState({error: error});
                });
        }
        else {
            alert("user id or invite id not set");
        }
    }

    handleDeclineEventRequestButton() {
        const userID = this.props.user.id;
        const inviteID = this.state.inviteID;
        alert("DECLINING " + "User ID: " + userID + " Invite ID: " + inviteID);
        if(userID && inviteID) {
            Lambda.declineEventInvite(userID, inviteID,
                (data) => {
                    alert("Successfully declined " + inviteID + " event invite!");
                    this.props.feedUpdate();
                }, (error) => {
                    alert(JSON.stringify(error));
                    this.setState({error: error});
                });
        }
        else {
            alert("user id or invite id not set");
        }
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
        if (invite.about) {
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
        }
        return null;
    }

    render() {
        if (this.state.isLoading) {
            return(
                <Grid.Row className="ui one column stackable center aligned page grid">
                    <Dimmer>
                        <Loader />
                    </Dimmer>
                </Grid.Row>
            );
        }
        if (this.props.inviteID && this.getAboutAttribute("id")) {
            if (this.props.inviteID.inviteType === "friendRequest") {
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
                                            <Feed.User onClick={this.handleClientModalOpen.bind(this)}>
                                                {this.getFromAttribute("name")}
                                            </Feed.User>
                                            <ClientModal
                                                clientID={this.getAboutAttribute("id")}
                                                open={this.state.clientModalOpen}
                                                onOpen={this.handleClientModalOpen.bind(this)}
                                                onClose={this.handleClientModalClose.bind(this)}
                                            />
                                            {' '}has sent you a buddy request
                                            <Feed.Date>4 hours ago</Feed.Date>
                                        </Feed.Summary>
                                        <Divider/>
                                        <Feed.Extra>
                                            <Button inverted floated="right" size="small" onClick={this.handleDeclineFriendRequestButton.bind(this)}>Deny</Button>
                                            <Button primary floated="right" size="small" onClick={this.handleAcceptFriendRequestButton.bind(this)}>Accept</Button>
                                        </Feed.Extra>
                                    </Feed.Content>
                                </Feed.Event>
                            </Feed>
                        </Card.Content>
                    </Card>
                );
            }
            else if (this.props.inviteID.inviteID === "eventInvite") {
                return (
                    <Card fluid raised>
                        <Card.Content>
                            <Feed>
                                <Feed.Event>
                                    <Feed.Label>
                                        <Image src={this.getAboutAttribute("profilePicture")} circular size="large"/>
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
                                                clientID={this.getAboutAttribute("id")}
                                                open={this.state.clientModalOpen}
                                                onOpen={this.handleClientModalOpen.bind(this)}
                                                onClose={this.handleClientModalClose.bind(this)}
                                            />
                                            <Feed.Date>4 hours ago</Feed.Date>
                                        </Feed.Summary>
                                        <Divider/>
                                        <Feed.Extra>
                                            <Button inverted floated="right" size="small" onClick={this.handleDeclineEventRequestButton.bind(this)}>Deny</Button>
                                            <Button primary floated="right" size="small" onClick={this.handleAcceptEventRequestButton.bind(this)}>Accept</Button>
                                        </Feed.Extra>
                                    </Feed.Content>
                                </Feed.Event>
                            </Feed>
                        </Card.Content>
                    </Card>
                );
            }
        }
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    cache: state.cache,
    info: state.info
});

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
