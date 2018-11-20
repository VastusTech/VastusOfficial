import React, { Component } from 'react';
import { Card, Modal, Button, Header, List, Divider, Grid } from 'semantic-ui-react';
import ClientModal from "./ClientModal";
import Lambda from '../Lambda';
import EventMemberList from "./EventMemberList";
import { connect } from 'react-redux';
import QL from '../GraphQL';
import {fetchClient, fetchEvent} from "../redux_helpers/actions/cacheActions";
import CompleteChallengeModal from "./CompleteChallengeModal";

function convertTime(time) {
    if (parseInt(time, 10) > 12) {
        return "0" + (parseInt(time, 10) - 12) + time.substr(2, 3) + "pm";
    }
    else if (parseInt(time, 10) === 12) {
        return time + "pm";
    }
    else if (parseInt(time, 10) === 0) {
        return "0" + (parseInt(time, 10) + 12) + time.substr(2, 3) + "am"
    }
    else {
        return time + "am"
    }
}

function convertDate(date) {
    let dateString = String(date);
    let year = dateString.substr(0, 4);
    let month = dateString.substr(5, 2);
    let day = dateString.substr(8, 2);

    return month + "/" + day + "/" + year;
}

/*
* Event Description Modal
*
* This is the event description which displays more in depth information about a challenge, and allows the user
* to join the challenge.
 */
class EventDescriptionModal extends Component {
    state = {
        // isLoading: false,
        // isOwned: null,
        // isJoined: null,
        eventID: null,
        // event: null,
        // ownerName: null,
        // members: {},
        clientModalOpen: false,
        completeModalOpen: false
    };

    constructor(props) {
        super(props);
        this.handleJoinEventButton = this.handleJoinEventButton.bind(this);
        this.handleLeaveEventButton = this.handleLeaveEventButton.bind(this);
        this.handleDeleteEventButton = this.handleDeleteEventButton.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.eventID && !this.state.eventID) {
            this.state.eventID = newProps.eventID;
        }
        const members = this.getEventAttribute("members");
        if (!this.props.open && newProps.open && newProps.eventID && members && members.length > 0) {
            for (let i = 0; i < members.length; i++) {
                this.props.fetchClient(members[i], ["id", "name", "gender", "birthday", "profileImagePath", "profilePicture"]);
            }
        }
    }

    getEventAttribute(attribute) {
        if (this.state.eventID && this.props.cache.events[this.state.eventID]) {
            return this.props.cache.events[this.state.eventID][attribute];
        }
        else {
            return null;
        }
    }

    getOwnerName() {
        const owner = this.getEventAttribute("owner");
        if (owner) {
            if (this.props.cache.clients[owner]) {
                return this.props.cache.clients[owner].name
            }
            // else if (!this.props.info.isLoading) {
            //     this.props.fetchClient(owner, ["name"]);
            // }
        }
        return null;
    }

    convertFromISO(dateTime) {
        let dateTimeString = String(dateTime);
        let date = dateTimeString.substr(0, 10);
        let time = dateTimeString.substr(11, 5);
        let time1 = dateTimeString.substr(37, 5);
        return convertDate(date) + " from " + convertTime(time) + " to " + convertTime(time1);
    }

    handleDeleteEventButton() {
        alert("Handling deleting the event");
        this.setState({isLoading: true});
        Lambda.deleteEvent(this.props.user.id, this.getEventAttribute("id"), (data) => {
            this.props.feedUpdate();
            // alert(JSON.stringify(data));
            this.setState({isLoading: false, event: null, isOwned: false, isJoined: false});
        }, (error) => {
            // alert(JSON.stringify(error));
            this.setState({isLoading: false, error: error});
        })
    }

    handleLeaveEventButton() {
        alert("Handling leaving the event");
        this.setState({isLoading: true});
        Lambda.removeClientFromEvent(this.props.user.id, this.props.user.id, this.getEventAttribute("id"), (data) => {
            //alert(JSON.stringify(data));
            this.setState({isLoading: false, isJoined: false});
        }, (error) => {
            //alert(JSON.stringify(error));
            this.setState({isLoading: false, error: error});
        })
    }

    handleJoinEventButton() {
        alert("Handling joining the event");
        this.setState({isLoading: true});
        Lambda.clientJoinEvent(this.props.user.id, this.props.user.id, this.getEventAttribute("id"),
            (data) => {
                this.setState({isLoading: false, isJoined: true});
            }, (error) => {
                this.setState({isLoading: false, error: error});
            })
    }

    isJoined() {
        const members = this.getEventAttribute("members");
        if (members) {
            return members.includes(this.props.user.id);
        }
        return false;
    }

    isOwned() {
        return this.props.user.id === this.getEventAttribute("owner");
    }

    // isCompleted() {
    //     return this.getEventAttribute("ifCompleted");
    // }

    openClientModal() { this.setState({clientModalOpen: true}); }
    closeClientModal() { this.setState({clientModalOpen: false}); }

    openCompleteModal() { this.setState({completeModalOpen: true}); }
    closeCompleteModal() { this.setState({completeModalOpen: false}); }

    render() {
        if (!this.getEventAttribute("id")) {
            return(
                null
            );
        }

        //This modal displays the challenge information and at the bottom contains a button which allows the user
        //to join a challenge.
        function createCorrectButton(isOwned, isJoined, ifCompleted, ifChallenge, joinHandler, leaveHandler, deleteHandler, completeHandler) {
            // alert(ifCompleted);
            if (ifCompleted === "true") {
                return(
                    <Button fluid inverted size="large">This Event is completed</Button>
                );
            }
            else if(isOwned) {
                // TODO This should also link the choose winner button
                if (ifChallenge) {
                    return (
                        <Grid columns={2}>
                            <Grid.Column>
                                <Button fluid negative size="large" onClick={deleteHandler}>Delete</Button>
                            </Grid.Column>
                            <Grid.Column>
                                <Button primary fluid size="large" onClick={completeHandler}>Input the winner!</Button>
                            </Grid.Column>
                        </Grid>
                    )
                }
                else {
                    return(
                        <Button fluid negative size="large" onClick={deleteHandler}>Delete</Button>
                    );
                }
            }
            else if(isJoined) {
                return (<Button inverted fluid size="large" onClick={leaveHandler}>Leave</Button>)
            }
            else {
                return (<Button primary fluid size="large" onClick={joinHandler}>Join</Button>)
            }
        }

        //alert("Challenge Info: " + JSON.stringify(this.state.event));
        return(
            <Modal open={this.props.open} onClose={this.props.onClose.bind(this)} closeIcon>
                <Modal.Header>{this.getEventAttribute("title")}</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <ClientModal open={this.state.clientModalOpen} onClose={this.closeClientModal.bind(this)} clientID={this.getEventAttribute("owner")}/>
                        <CompleteChallengeModal open={this.state.completeModalOpen} onClose={this.closeCompleteModal.bind(this)} challengeID={this.getEventAttribute("id")}/>
                        <List relaxed>
                            <List.Item>
                                <List.Icon name='user' />
                                <List.Content>
                                    Created by <Button className="u-button--flat" onClick={this.openClientModal.bind(this)}>{this.getOwnerName()}</Button>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='calendar' />
                                <List.Content>
                                    {this.convertFromISO(this.getEventAttribute("time"))}
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='trophy' />
                                <List.Content>
                                    {this.getEventAttribute("goal")}
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='users' />
                                <List.Content>
                                    {this.getEventAttribute("members")}
                                    <Modal trigger={<Button className="u-button--flat u-padding-left--1">(See more)</Button>} closeIcon>
                                        <Modal.Content>
                                            <EventMemberList eventID={this.state.eventID} />
                                        </Modal.Content>
                                    </Modal>
                                </List.Content>
                            </List.Item>
                        </List>
                            {createCorrectButton(this.isOwned(), this.isJoined(), this.getEventAttribute("ifCompleted"), this.getEventAttribute("ifChallenge"), this.handleJoinEventButton,
                            this.handleLeaveEventButton, this.handleDeleteEventButton, this.openCompleteModal.bind(this))}
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
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
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventDescriptionModal);