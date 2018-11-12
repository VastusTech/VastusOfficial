import React, { Component } from 'react';
import { Modal, Button, Header, List, Divider } from 'semantic-ui-react';
import ClientModal from "./ClientModal";
import Lambda from '../Lambda';
import EventMemberList from "./EventMemberList";
import { connect } from 'react-redux';
import QL from '../GraphQL';

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
        isLoading: false,
        isOwned: null,
        isJoined: null,
        event: null,
        ownerName: null,
        members: {},
        clientModalOpen: false,
    };

    constructor(props) {
        super(props);
        this.handleJoinEventButton = this.handleJoinEventButton.bind(this);
        this.handleLeaveEventButton = this.handleLeaveEventButton.bind(this);
        this.handleDeleteEventButton = this.handleDeleteEventButton.bind(this);
    }

    componentDidMount() {
        if (this.props.event) {
            //("Owned: " + this.props.ifOwned + " Joined: " + this.props.ifJoined);
            // if(this.props.members) {
            //     alert("Members: " + this.props.members);
            //}
            this.setState({isLoading: false, event: this.props.event, isOwned: this.props.ifOwned,
                isJoined: this.props.ifJoined, members: this.props.members});
            QL.getClient(this.props.event.owner, ["name"], (data) => {
                this.setState({ownerName: data.name});
            }, (error) => {
                alert(JSON.stringify(error));
            })
        }
        else {
            this.setState({isLoading: true, event: null, isOwned: null, isJoined: null, members: []})
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.event) {
            this.setState({isLoading: false, event: newProps.event, isOwned: newProps.ifOwned,
                isJoined: newProps.ifJoined, members: newProps.members});
        }
        else {
            this.setState({isLoading: true, event: null, isOwned: false, isJoined: false});
        }
        // if (newProps.challenge && this.props.id && this.props.ifJoined && this.props.ifOwned) {
        //     this.setState({isLoading: false, challenge: newProps.challenge, id: newProps.id});
        // }
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
        Lambda.deleteEvent(this.props.user.id, this.state.event.id, (data) => {
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
        Lambda.leaveEvent(this.props.user.id, this.props.user.id, this.state.event.id, (data) => {
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
        Lambda.joinEvent(this.props.user.id, this.props.user.id, this.state.event.id, (data) => {
            // alert(JSON.stringify(data));
            this.setState({isLoading: false, isJoined: true});
        }, (error) => {
            // alert(JSON.stringify(error));
            this.setState({isLoading: false, error: error});
        })
    }

    openClientModal() { this.setState({clientModalOpen: true}); }
    closeClientModal() { this.setState({clientModalOpen: false}); }

    render() {
        if (!this.state.event) {
            return null;
        }

        //This modal displays the challenge information and at the bottom contains a button which allows the user
        //to join a challenge.
        function createCorrectButton(isOwned, isJoined, joinHandler, leaveHandler, deleteHandler) {
            if(isOwned) {
                // TODO This should also link the choose winner button
                return (<Button inverted fluid size="large" onClick={deleteHandler}>Delete</Button>)
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
                <Modal.Header>{this.state.event.title}</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <ClientModal open={this.state.clientModalOpen} onClose={this.closeClientModal.bind(this)} clientID={this.state.event.owner}/>
                        <List relaxed>
                            <List.Item>
                                <List.Icon name='user' />
                                <List.Content>
                                    Created by <Button className="u-button--flat" onClick={this.openClientModal.bind(this)}>{this.state.ownerName}</Button>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='calendar' />
                                <List.Content>
                                    {this.convertFromISO(this.state.event.time)}
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='trophy' />
                                <List.Content>
                                    {this.state.event.goal}
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='users' />
                                <List.Content>
                                    {this.state.event.members}
                                    <Modal trigger={<Button className="u-button--flat u-padding-left--1">(See more)</Button>}>
                                        <Modal.Content>
                                            <EventMemberList challengeID = {this.state.event.id} members = {this.state.event.members} ifOwned = {this.state.isOwned}/>
                                        </Modal.Content>
                                    </Modal>
                                </List.Content>
                            </List.Item>
                        </List>
                            {createCorrectButton(this.state.isOwned, this.state.isJoined, this.handleJoinEventButton,
                            this.handleLeaveEventButton, this.handleDeleteEventButton)}
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(EventDescriptionModal);