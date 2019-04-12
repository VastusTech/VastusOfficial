import React from 'react';
import {Grid, Button, Modal} from "semantic-ui-react";
import MessageBoardFeed from "../../vastuscomponents/components/messaging/MessageBoardFeed";
import MessageSelectionScreen from "../../vastuscomponents/components/messaging/MessageSelectionScreen";
import connect from "react-redux/es/connect/connect";

/**
 * Displays all of the current conversations the user has going and allows the user to start new ones with other users.
 *
 * @param {Props} props The given props to the component.
 * @returns {*} The React JSX used to display the component.
 * @constructor
 */
const MessageTab = (props) => (
    <Grid centered>
        <Grid.Row>
        <Modal trigger={<Button primary>Start New Chat</Button>} closeIcon>
            <MessageSelectionScreen
                ids={props.user.friends}
                noObjectsMessage={"No clients or trainers to message"}
                acceptedItemTypes={["Client", "Trainer"]}
            />
        </Modal>
        </Grid.Row>
        <Grid.Row>
            <MessageBoardFeed userID={props.user.id}/>
        </Grid.Row>
    </Grid>
);

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(MessageTab);