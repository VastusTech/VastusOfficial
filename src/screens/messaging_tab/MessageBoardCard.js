import React from 'react';
import { Card, Grid, Header } from "semantic-ui-react";

type Props = {
    messageBoardID: string,
    otherBoardUserName: string,
};

const MessageBoardCard = (props: Props) => {
    return (
        <Card fluid raised onClick={() => this.props.openClientModal()}>
            <Card.Content>
                <Grid divided verticalAlign='middle'>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <Header size='large' textAlign='center'>{props.otherBoardUserName}</Header>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Card.Content>
        </Card>
    );
};

export default MessageBoardCard;