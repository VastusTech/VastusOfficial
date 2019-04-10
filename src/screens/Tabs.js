import { Fragment } from 'react';
import {Tab, Menu, Icon } from "semantic-ui-react";
import ProfileTab from "./profile_tab/ProfileTab";
import React from "react";
import TrainerTab from "./trainer_tab/TrainerTab";
import MainTab from "./main_tab/MainTab";
import MessageTab from "./messaging_tab/MessageTab";
import MessageIcon from "../vastuscomponents/components/messaging/MessageIcon";
import GroupFeed from "./trainer_tab/CommunityTab";

/**
* Tabs TODO Potentially clean this up
*
* The app is currently split up into three sections: home, profile, and notifications.
 */
export default () => (
    <Tab menu={{fixed: "bottom", widths: 5, size: "large", inverted: true}} panes={
        [
            {
                menuItem:
                    (<Menu.Item key={0}>
                        <Icon name='home' size='large' />
                    </Menu.Item>),
                render: () =>
                    <Tab.Pane basic attached={false}>
                        <MainTab/>
                    </Tab.Pane>
            },
            {
                menuItem:
                    (<Menu.Item key={1}>
                        <Icon name='group' size='large' />
                    </Menu.Item>),
                render: () =>
                    <Tab.Pane basic attached={false}>
                        <GroupFeed/>
                    </Tab.Pane>
            },
            {
                menuItem: (
                    <Menu.Item key={2}>
                        <Icon name='stopwatch' size='large' />
                    </Menu.Item>),
                render: () => <Tab.Pane basic attached={false}>
                    <TrainerTab/>
                </Tab.Pane>
            },
            {
                menuItem: (
                    <Menu.Item key={3}>
                        <MessageIcon/>
                    </Menu.Item>),
                render: () => <Tab.Pane basic attached={false}>
                    <Fragment>
                        <MessageTab/>
                    </Fragment>
                </Tab.Pane>
            },
            {
                menuItem: (
                    <Menu.Item key={4}>
                        <Icon name='user circle outline' size='large' />
                    </Menu.Item>),
                render: () => <Tab.Pane basic attached={false}>
                    <ProfileTab/>
                </Tab.Pane>
            },
        ]
    }/>
);