import React, { Component } from 'react';
import { Card, Modal, Button, Header, List, Divider } from 'semantic-ui-react';
import ClientModal from "./ClientModal";
import Lambda from '../Lambda';
import EventMemberList from "./EventMemberList";
import { connect } from 'react-redux';
import QL from '../GraphQL';
import {fetchClient, fetchEvent} from "../redux_helpers/actions/cacheActions";

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
        if (!this.props.open && newProps.open && newProps.eventID && !this.getEventAttribute("id")) {
            // this.props.fetchEvent(newProps.eventID, ["id", "title", "goal", "time", "time_created", "owner", "members", "capacity", "difficulty"]);
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

    openClientModal() { this.setState({clientModalOpen: true}); }
    closeClientModal() { this.setState({clientModalOpen: false}); }

    render() {
        if (!this.getEventAttribute("id")) {
            return(
                null
            );
        }

        //This modal displays the challenge information and at the bottom contains a button which allows the user
        //to join a challenge.
        function createCorrectButton(isOwned, isJoined, joinHandler, leaveHandler, deleteHandler) {
            if(isOwned) {
                // TODO This should also link the choose winner button
                return (<Button fluid negative size="large" onClick={deleteHandler}>Delete</Button>)
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
            <Modal open={this.props.open} onClose={this.props.onClose.bind(this)}>
                <Modal.Header>{this.getEventAttribute("title")}</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <ClientModal open={this.state.clientModalOpen} onClose={this.closeClientModal.bind(this)} clientID={this.getEventAttribute("owner")}/>
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
                                    <Modal trigger={<Button className="u-button--flat u-padding-left--1">(See more)</Button>}>
                                        <Modal.Content>
                                            <EventMemberList challengeID = {this.state.eventID} members = {this.getEventAttribute("members")} ifOwned = {this.state.isOwned}/>
                                        </Modal.Content>
                                    </Modal>
                                </List.Content>
                            </List.Item>
                        </List>
                            {createCorrectButton(this.isOwned(), this.isJoined(), this.handleJoinEventButton,
                            this.handleLeaveEventButton, this.handleDeleteEventButton)}
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