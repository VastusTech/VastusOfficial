import {Tab, Card, Label, Icon, Menu, Item} from "semantic-ui-react";
import PublicFeedProp from "./publicFeed";
import ChallengeFeedProp from "./eventFeed";
import NotificationFeedProp from "./notificationBellFeed";
import NotificationBellProp from "./notificationBell";
import ProfileProp from "./Profile";
import React from "react";
import CreateEventProp from "./createEvent";
import TrophyCaseProp from "./trophyCase";
import NextWorkoutProp from "./nextWorkout";
//import AddPostButtonTestProp from "./addPostTestButton"

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
    {
        menuItem: 'Profile', render: () => <Tab.Pane attached={false}>
            <div className="ui one column stackable center aligned page grid">
                <ProfileProp/>
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

const Tabs = () => (
    <Tab menu={{inverted: true, secondary: true, pointing: true}} panes={panes}/>
);

export default Tabs;