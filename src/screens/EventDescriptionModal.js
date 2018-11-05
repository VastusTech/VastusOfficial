import React, { Component } from 'react';
import { Modal, Button, Header } from 'semantic-ui-react';
import ClientModal from "./ClientModal";

/*
* Event Description Modal
*
* This is the event description which displays more in depth information about a challenge, and allows the user
* to join the challenge.
 */
class EventDescriptionModal extends Component {
    state = {
        isLoading: false,
        challenge: null,
        clientModalOpen: false,
    };

    componentDidMount() {
        if (this.props.challenge) {
            this.setState({isLoading: false, challenge: this.props.challenge});
        }
        else {
            this.setState({isLoading: true, challenge: null})
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.challenge) {
            this.setState({isLoading: false, challenge: newProps.challenge});
        }
    }

    handleJoinChallengeButton() {
        alert("Handling joining the challenge");
    }

    openClientModal() { this.setState({clientModalOpen: true}); }
    closeClientModal() { this.setState({clientModalOpen: false}); }

    render() {
        if (!this.state.challenge) {
            return null;
        }

        //This modal displays the challenge information and at the bottom contains a button which allows the user
        //to join a challenge.
        return(
            <Modal trigger={this.props.trigger}>
                <Modal.Header>{this.state.challenge.title}</Modal.Header>
                <Modal.Content image>
                    <div>
                        <ClientModal open={this.state.clientModalOpen} onClose={this.closeClientModal.bind(this)} clientID={this.state.challenge.owner}/>
                    </div>
                    <Button basic color='purple' onClick={this.openClientModal.bind(this)}>{this.state.challenge.owner}</Button>
                    <Modal.Description>
                        <Header>Info: </Header>
                        <p>{this.state.challenge.time}</p>
                        <p>{this.state.challenge.goal}</p>
                    </Modal.Description>
                    <div className='join button'>
                        <Button basic color='purple' onClick={this.handleJoinChallengeButton.bind(this)}>
                            Join
                        </Button>
                    </div>
                </Modal.Content>
            </Modal>
        );
    }
}

export default EventDescriptionModal;