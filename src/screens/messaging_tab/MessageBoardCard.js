import React from 'react';
import { Card, Grid, Header, Modal, Image } from "semantic-ui-react";
import MessageBoard from "../../vastuscomponents/components/messaging/MessageBoard";

type Props = {
    messageBoardTitle: string,
    messageBoardProPic: string,
    messageBoardLastMessage: string,
    messageBoardID: string,
    unread: boolean,
    onClickCard: (board) => {}
};

const MessageBoardCard = (props: Props) => {
    return (
        <Modal trigger={
            <Card fluid raised onClick={() => {props.onClickCard(props.messageBoardID)}}>
                <Card.Content>
                    <Grid columns={2}>
                        {props.unread ? "!!!" : null}
                        <Grid.Column width={3}>
                            <div className="u-avatar u-avatar--small" style={{backgroundImage: `url(${props.messageBoardProPic})`}}/>
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