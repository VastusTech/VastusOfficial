// TODO Use this so that our structure is more scalable (as opposed to just putting NotificationFeed.js in there
import React, {Component} from 'react';
import {Divider, Button, Grid} from "semantic-ui-react";
import NotificationFeed from "./NotificationBellFeed";
import MessageBoardFeed from "../../vastuscomponents/components/messaging/MessageBoardFeed";
import StartChatModal from "../../vastuscomponents/components/manager/StartChatModal";

class NotificationsTab extends Component<{}> {
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
            <div>
                <MessageBoardFeed/>
                {/*<Divider/>
                <div>
                    <Grid>
                        <Grid.Row>
                            <Button floated fluid primary onClick={this.openStartChatModal}> Start a new Chat! </Button>
                            <StartChatModal open={this.state.startChatModalOpen} onClose={this.closeStartChatModal}/>
                        </Grid.Row>
                        <Grid.Row>
                            <MessageBoardFeed/>
                        </Grid.Row>
                    </Grid>
                </div>*/}
            </div>
        );
    }
};

export default NotificationsTab;