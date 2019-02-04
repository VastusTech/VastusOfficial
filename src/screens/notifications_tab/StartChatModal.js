import React, {Component} from 'react';
import {Button, Modal, Grid, Header} from "semantic-ui-react";
import {connect} from "react-redux";
import ClientCard from "../../vastuscomponents/components/cards/ClientCard";
import {fetchClient, fetchTrainer} from "../../vastuscomponents/redux_actions/cacheActions";
import {fetchUserAttributes} from "../../redux_helpers/actions/userActions";
import {getItemTypeFromID} from "../../vastuscomponents/logic/ItemType";
import TrainerCard from "../../vastuscomponents/components/cards/TrainerCard";
import MessageHandler from "../../vastuscomponents/api/MessageHandler";
import UserFunctions from "../../vastuscomponents/database_functions/UserFunctions";

type Props = {
    open: boolean,
    onClose: any
};

class StartChatModal extends Component<Props> {
    state = {
        sentRequest: false,
        selectedIDs: []
    };

    constructor(props) {
        super(props);
        this.close = this.close.bind(this);
        this.createChat = this.createChat.bind(this);
    }

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(newProps) {
        if (!this.state.sentRequest) {
            this.state.sentRequest = true;
            this.props.fetchUserAttributes(["friends"], (user) => {
                if (user.friends && user.friends.length) {
                    for (let i = 0; i < user.friends.length; i++) {
                        const id = user.friends[i];
                        const itemType = getItemTypeFromID(id);
                        if (itemType === "Client") {
                            this.props.fetchClient(id, ClientCard.fetchVariableList);
                        }
                        else if (itemType === "Trainer") {
                            this.props.fetchTrainer(id, TrainerCard.fetchVariableList);
                        }
                    }
                }
            });
        }
    }

    createChat() {
        alert("Creating chat with " + JSON.stringify(this.state.selectedIDs));
        alert(MessageHandler.getBoard(this.state.selectedIDs));
        UserFunctions.addMessageBoard(this.props.user.id, this.props.user.id, MessageHandler.getBoard(this.state.selectedIDs),
            () => {
                console.log("Successfully added message board to chat")
                this.close();
            }, (error) => {

            });
    }

    selectID(id) {
        this.state.selectedIDs.push(id);
        this.setState({});
    }

    unselectID(id) {
        const index = this.state.selectedIDs.indexOf(id);
        if (index > -1) {
            this.state.selectedIDs.splice(index, 1);
        }
        this.setState({});
    }

    close() {
        this.setState({selectedIDs: []});
        this.props.onClose();
    }

    // To choose someone to chat with, get the
    render() {
         const rows = (friendIDs) => {
            if (!friendIDs) {
                return (<Header> No friends yet! </Header>);
            }
            const cards = [];
            const createButton = (friendID) => {
                if (this.state.selectedIDs.includes(friendID)) {
                    return(
                        <Button negative onClick={() => {this.unselectID(friendID)}}> Remove </Button>
                    );
                }
                else {
                    return(
                        <Button primary onClick={() => {this.selectID(friendID)}}> Add </Button>
                    );
                }
            };

            for (let i = 0; i < friendIDs.length; i++) {
                cards.push(
                    <Grid fluid centered>
                        <Grid.Column>
                            <ClientCard clientID={friendIDs[i]}/>
                        </Grid.Column>
                        <Grid.Column>
                            {createButton(friendIDs[i])}
                        </Grid.Column>
                    </Grid>
                )
            }
            return cards;
        };

        return (
            <Modal open={this.props.open} onClose={this.close} fluid>
                <Modal.Header> Choose friends to start the chat with! </Modal.Header>
                <Modal.Content fluid>
                    {rows(this.props.user.friends)}
                    <Grid fluid centered width={3}>
                        <Grid.Column>
                            <Button primary fluid onClick={this.createChat}> Create </Button>
                        </Grid.Column>
                        <Grid.Column/>
                        <Grid.Column>
                            <Button inverted fluid onClick={this.close}> Cancel </Button>
                        </Grid.Column>
                    </Grid>
                </Modal.Content>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (variableList, dataHandler) => {
            dispatch(fetchUserAttributes(variableList, dataHandler));
        },
        fetchClient: (id, variableList, dataHandler) => {
            dispatch(fetchClient(id, variableList, dataHandler));
        },
        fetchTrainer: (id, variableList, dataHandler) => {
            dispatch(fetchTrainer(id, variableList, dataHandler));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StartChatModal);