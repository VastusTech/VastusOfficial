/*
import {Tab, Card, Label, Icon, Menu, Item} from "semantic-ui-react";
import React, { Component } from "react";
import ScheduledChallengesProp from "./ScheduledChallengeList";

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

    /*
        const panes = [
            {
                menuItem: 'Owned Challenges', render: () => <Tab.Pane attached={false}>
                    <OwnedChallengesProp/>
                </Tab.Pane>
            },
            {
                menuItem: 'Scheduled Challenges', render: () => <Tab.Pane attached={false}>
                    <div>Add Scheduled Challenge List with Query</div>
                </Tab.Pane>
            },
        ];
        */
        /*
        <Tab menu={{inverted: false, secondary: true, pointing: true}} panes={panes}/>
         */
        /*
    render() {
        return(
            <ScheduledChallengesProp>
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
/*
export default ChallengeManagerProp;
            */