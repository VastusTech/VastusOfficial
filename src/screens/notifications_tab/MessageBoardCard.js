import React from 'react';
import { Card, Grid, Header } from "semantic-ui-react";

type Props = {
    messageBoardID: string
};

const MessageBoardCard = (props: Props) => {
    return (
        <Card fluid raised onClick={() => this.openClientModal()}>
            <Card.Content>
                <Grid divided verticalAlign='middle'>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <Header size='large' textAlign='center'>{props.messageBoardID}</Header>
                        </Grid.Column>
                        {/*<Grid.Column width={12}>*/}
                            {/*<div className="u-flex u-flex-align--center">*/}
                                {/*{this.profilePicture()} <Header size='small' className='u-margin-top--0 u-margin-left--2'>{this.getClientAttribute("name")}</Header>*/}
                            {/*</div>*/}
                        {/*</Grid.Column>*/}
                    </Grid.Row>
                </Grid>
            </Card.Content>
            {/*<Card.Content extra>*/}
                {/*<Card.Meta>*/}
                    {/*{this.getClientAttribute("challengesWonLength")} challenges won*/}
                {/*</Card.Meta>*/}
            {/*</Card.Content>*/}
        </Card>
    );
};

export default MessageBoardCard;