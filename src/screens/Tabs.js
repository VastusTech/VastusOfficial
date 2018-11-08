import {Tab, Card, Label, Menu } from "semantic-ui-react";
import EventFeed from "./EventFeed";
import NotificationFeedProp from "./NotificationBellFeed";
import NotificationBellProp from "./NotificationBell";
import ProfileProp from "./Profile";
import React from "react";
import CreateEventProp from "./CreateEvent";
import NextWorkoutProp from "./NextWorkout";

/**
* Tabs TODO Potentially clean this up
*
* The app is currently split up into three sections: home, profile, and notifications.
 */
export default (props) => (
    <Tab classname='ui center aligned' menu={{inverted: true, secondary: true, pointing: true, tabular: 'right' }} panes={
        [
            {
                menuItem:
                    (<Menu.Item>
                        <Label icon='home' />
                    </Menu.Item>),
                render: () =>
                    <Tab.Pane attached={false}>
                        <CreateEventProp/>
                        <Card>
                            <Card.Content>
                                <NextWorkoutProp/>
                            </Card.Content>
                        </Card>
                        <div className="ui one column stackable center aligned page grid">
                            <EventFeed userID={this.state.userID}/>
                        </div>
                    </Tab.Pane>
            },
            {
                menuItem: (<Menu.Item>
                    <Label icon='user circle outline' />
                </Menu.Item>),
                render: () => <Tab.Pane attached={false}>
                    <div className="ui one column stackable center aligned page grid">
                        <ProfileProp username={this.state.username}/>
                    </div>
                </Tab.Pane>
            },
            {
                menuItem: (
                    <Menu.Item>
                        <NotificationBellProp />
                    </Menu.Item>),
                render: () => <Tab.Pane attached={false}>
                    <div className="ui one column stackable center aligned page grid">
                        <Card>
                            <Card.Content>
                                <Card.Header textAlign={'center'}>Notification Feed</Card.Header>
                            </Card.Content>
                            <Card.Content>
                                <NotificationFeedProp username={this.state.username}/>
                            </Card.Content>
                        </Card>
                    </div>
                </Tab.Pane>
            },
        ]
    }/>
);