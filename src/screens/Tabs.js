import { Fragment } from 'react';
import {Tab, Card, Label, Menu, Icon, Header } from "semantic-ui-react";
import EventFeed from "./EventFeed";
import NotificationFeed from "./NotificationBellFeed";
import ProfileProp from "./Profile";
import React from "react";
import CreateEventProp from "./CreateEvent";
import NextWorkoutProp from "./NextWorkout";

/**
* Tabs TODO Potentially clean this up
*
* The app is currently split up into three sections: home, profile, and notifications.
 */
export default () => (
    <Tab menu={{fixed: "bottom", widths: 3, size: "huge", inverted: true}} panes={
        [
            {
                menuItem:
                    (<Menu.Item>
                        <Icon name='home' size='large' />
                    </Menu.Item>),
                render: () =>
                    <Tab.Pane basic attached={false}>
                        <CreateEventProp/>
                        <NextWorkoutProp/>
                        <EventFeed/>
                    </Tab.Pane>
            },
            {
                menuItem: (<Menu.Item>
                    <Icon name='user circle outline' size='large' />
                </Menu.Item>),
                render: () => <Tab.Pane basic attached={false}>
                    <ProfileProp/>
                </Tab.Pane>
            },
            {
                menuItem: (
                    <Menu.Item>
                        <Icon name='bell outline' size='large' />
                    </Menu.Item>),
                render: () => <Tab.Pane basic attached={false}>
                    <Fragment>
                        <Header inverted textAlign={'center'}>Notification Feed</Header>
                        <NotificationFeed/>
                    </Fragment>
                </Tab.Pane>
            },
        ]
    }/>
);