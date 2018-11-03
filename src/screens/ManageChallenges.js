import {Tab, Card, Label, Icon, Menu, Item} from "semantic-ui-react";
import React, { Component } from "react";

class ChallengeManagerProp extends Component {
    state = {
        isLoading: true,
        username: null
    };

    constructor(props) {
        super(props);
        if (this.props.username) {
            this.setState({isLoading: false, username: this.props.username});
        }
    }

    render() {
        const panes = [
            {
                menuItem: 'Owned Challenges', render: () => <Tab.Pane attached={false}>
                    <div>Owned Challenges Here</div>
                </Tab.Pane>
            },
            {
                menuItem: 'Joined Challenges', render: () => <Tab.Pane attached={false}>
                    <div>Joined Challenges Here</div>
                </Tab.Pane>
            },
        ];

        return(
            <Tab menu={{inverted: false, secondary: true, pointing: true}} panes={panes}/>
        );
    }
}

/*
    {menuItem: 'Events',
        render: () => <Tab.Pane attached={false}>
            <CreateEventProp/>
            <div className="ui one column stackable center aligned page grid">
                <Card>
                    <Card.Content>
                        <Card.Header textAlign={'center'}>Event Feed</Card.Header>
                    </Card.Content>
                    <Card.Content>
                        <EventFeedProp/>
                    </Card.Content>
                </Card>
            </div>
        </Tab.Pane>
    },
*/

export default ChallengeManagerProp;