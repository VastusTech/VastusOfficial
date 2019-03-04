import React from 'react';
import { Card, Grid, Header, Modal } from "semantic-ui-react";
import MessageBoard from "../../vastuscomponents/components/messaging/MessageBoard";

type Props = {
    messageBoardTitle: string,
    messageBoardID: string,
};

const MessageBoardCard = (props: Props) => {
    return (
        <Modal trigger={
            <Card fluid raised>
                <Card.Content>
                    <Grid divided verticalAlign='middle'>
                        <Grid.Row>
                            <Grid.Column width={4}>
                                <Header size='large' textAlign='center'>{props.messageBoardTitle}</Header>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Card.Content>
            </Card>
        } closeIcon>
            <MessageBoard board={props.messageBoardID}/>
        </Modal>
    );
};

export default MessageBoardCard;