import React from 'react';
import { Card, Grid, Header, Modal, Image } from "semantic-ui-react";
import MessageBoard from "../../vastuscomponents/components/messaging/MessageBoard";

type Props = {
    messageBoardTitle: string,
    messageBoardProPic: string,
    messageBoardLastMessage: string,
    messageBoardID: string,
};

const MessageBoardCard = (props: Props) => {
    return (
        <Modal trigger={
            <Card fluid raised>
                <Card.Content>
                    <Grid columns={2}>
                        <Grid.Column width={3}>
                            <div className="u-avatar u-avatar--small" style={{backgroundImage: `url(${props.messageBoardProPic})`}}></div>
                        </Grid.Column>
                        <Grid.Column>
                            <Grid.Row style={{marginBottom: '10px'}}>
                                <Header size='medium'>{props.messageBoardTitle}</Header>
                            </Grid.Row>
                            <Grid.Row>
                                <div>{props.messageBoardLastMessage}</div>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid>
                </Card.Content>
            </Card>
        } closeIcon>
            <MessageBoard board={props.messageBoardID}/>
        </Modal>
    );
};

export default MessageBoardCard;