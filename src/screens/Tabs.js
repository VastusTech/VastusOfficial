import {Tab, Card, Label, Menu } from "semantic-ui-react";
import EventFeed from "./EventFeed";
import NotificationFeedProp from "./notificationBellFeed";
import NotificationBellProp from "./notificationBell";
import ProfileProp from "./Profile";
import React, { Component } from "react";
import CreateEventProp from "./createEvent";
import NextWorkoutProp from "./nextWorkout";

/*
* Tabs
*
* The app is currently split up into three sections: home, profile, and notifications.
 */
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
        //This is the the list of the contents in each section of the app.
        const panes = [
            {
                menuItem: (<Menu.Item>
                    <Label icon='home' />
                </Menu.Item>), render: () => <Tab.Pane attached={false}>
                    <CreateEventProp/>
                    <Card>
                        <Card.Content>
                            <NextWorkoutProp/>
                        </Card.Content>
                    </Card>
                    <div className="ui one column stackable center aligned page grid">
                        <EventFeed/>
                    </div>
                </Tab.Pane>
            },
            {
                menuItem: (<Menu.Item>
                    <Label icon='user circle outline' />
                </Menu.Item>), render: () => <Tab.Pane attached={false}>
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

        //This displays the list of app sections in a tab format.
        return(
            <Tab classname='ui center aligned' menu={{inverted: true, secondary: true, pointing: true, tabular: 'right' }} panes={panes}/>
        );
    }
}

export default Tabs;