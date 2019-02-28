// TODO Use this so that our structure is more scalable (as opposed to just putting NotificationFeed.js in there
import React, {Component} from 'react';
import {Grid, Button, Modal} from "semantic-ui-react";
import MessageBoardFeed from "./MessageBoardFeed";
import DatabaseObjectList from "../../vastuscomponents/components/lists/DatabaseObjectList";
import {fetchUserAttributes, forceFetchUserAttributes} from "../../redux_helpers/actions/userActions";
import {logOut} from "../../redux_helpers/actions/authActions";
import connect from "react-redux/es/connect/connect";

class MessageTab extends Component<{}> {
    state = {
        startChatModalOpen: false,
    };

    constructor(props) {
        super(props);
        this.openStartChatModal = this.openStartChatModal.bind(this);
        this.closeStartChatModal = this.closeStartChatModal.bind(this);
    }

    openStartChatModal = () => {this.setState({startChatModalOpen: true})};
    closeStartChatModal = () => {this.setState({startChatModalOpen: false})};

    render() {
        return (
            <Grid centered>
                <Grid.Row>
                <Modal trigger={<Button primary>Start New Chat</Button>}>
                    <DatabaseObjectList
                        ids={this.props.user.friends}
                        noObjectsMessage={"No friends yet!"}
                        acceptedItemTypes={["Client", "Trainer"]}
                    />
                </Modal>
                </Grid.Row>
                <Grid.Row>
                    <MessageBoardFeed/>
                </Grid.Row>
            </Grid>
        );
    }
};

const mapStateToProps = (state) => ({
    user: state.user,
    info: state.info
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (variablesList, dataHandler) => {
            dispatch(fetchUserAttributes(variablesList, dataHandler));
        },
        forceFetchUserAttributes: (variablesList) => {
            dispatch(forceFetchUserAttributes(variablesList));
        },
        logOut: () => {
            dispatch(logOut());
        },

        // fetchUser: (username) => {
        //     dispatch(fetchUser(username));
        // }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageTab);