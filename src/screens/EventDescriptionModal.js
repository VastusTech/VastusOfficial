import React, { Component } from 'react';
import { Modal, Button, Header } from 'semantic-ui-react';
import ClientModal from "./ClientModal";
import Lambda from '../Lambda';
import EventMemberList from "./EventMemberList";
import { connect } from 'react-redux';

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
        members: [],
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
            //alert("Owned: " + this.props.ifOwned + " Joined: " + this.props.ifJoined);
            this.setState({isLoading: false, event: this.props.event, isOwned: this.props.ifOwned,
                isJoined: this.props.ifJoined, members: this.props.members});
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
                return (<Button basic color='purple' onClick={deleteHandler}>Delete</Button>)
            }
            else if(isJoined) {
                return (<Button basic color='purple' onClick={leaveHandler}>Leave</Button>)
            }
            else {
                return (<Button basic color='purple' onClick={joinHandler}>Join</Button>)
            }
        }

        return(
            <Modal trigger={this.props.trigger}>
                <Modal.Header>{this.state.event.title}</Modal.Header>
                <Modal.Content image>
                    <div>
                        <ClientModal open={this.state.clientModalOpen} onClose={this.closeClientModal.bind(this)} clientID={this.state.event.owner}/>
                    </div>
                    <Button basic color='purple' onClick={this.openClientModal.bind(this)}>{this.state.event.owner}</Button>
                    <Modal.Description>
                        <Header>Info: </Header>
                        <p>{this.state.event.time}</p>
                        <p>{this.state.event.goal}</p>
                    </Modal.Description>
                    <div className='event list'>
                        <Modal trigger={<Button basic color='purple'>Members</Button>}>
                            <Modal.Content>
                                <EventMemberList ifOwned = {this.state.isOwned}/>
                            </Modal.Content>
                        </Modal>
                    </div>
                    <div className='button'>
                        {createCorrectButton(this.state.isOwned, this.state.isJoined, this.handleJoinEventButton,
                        this.handleLeaveEventButton, this.handleDeleteEventButton)}
                    </div>
                </Modal.Content>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(EventDescriptionModal);