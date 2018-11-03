import {Tab, Card, Label, Icon, Menu, Item} from "semantic-ui-react";
import ChallengeFeedProp from "./eventFeed";
import NotificationFeedProp from "./notificationBellFeed";
import NotificationBellProp from "./notificationBell";
import ProfileProp from "./Profile";
import React, { Component } from "react";
import CreateEventProp from "./createEvent";
import NextWorkoutProp from "./nextWorkout";

class Tabs extends Component {
    state = {
        isLoading: true,
        username: null
    };

    constructor(props) {
        super(props);
        if (this.props.username) {
            this.setState({isLoading: false, username: this.props.username});
        }
        else {
            this.setState({isLoading: true, username: null});
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.username) {
            this.setState({isLoading: false, username: newProps.username});
        }
        else {
            this.setState({isLoading: true, username: null});
        }
    }

    render() {
        const panes = [
            {
                menuItem: 'Home', render: () => <Tab.Pane attached={false}>
                    <CreateEventProp/>
                    <div className="ui one column stackable center aligned page grid">
                        <ChallengeFeedProp/>
                        <Card>
                            <Card.Content>
                                <NextWorkoutProp/>
                            </Card.Content>
                        </Card>
                    </div>
                </Tab.Pane>
            },
            {
                menuItem: 'Profile', render: () => <Tab.Pane attached={false}>
                    <div className="ui one column stackable center aligned page grid">
                        <ProfileProp username={this.state.username}/>
                    </div>
                </Tab.Pane>
            },
            {
                menuItem: (<Menu.Item>
                    <NotificationBellProp/>
                </Menu.Item>), render: () => <Tab.Pane attached={false}>
                    <div className="ui one column stackable center aligned page grid">
                        <Card>
                            <Card.Content>
                                <Card.Header textAlign={'center'}>Notification Feed</Card.Header>
                            </Card.Content>
                            <Card.Content>
                                <NotificationFeedProp/>
                            </Card.Content>
                        </Card>
                    </div>
                </Tab.Pane>
            },
        ];

        return(
            <Tab classname='ui center aligned' menu={{inverted: true, secondary: true, pointing: true, tabular: 'right' }} panes={panes}/>
        );
    }
}

export default Tabs;