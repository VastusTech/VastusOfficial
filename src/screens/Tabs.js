import { Fragment } from 'react';
import {Tab, Menu, Icon, Header } from "semantic-ui-react";
import NotificationFeed from "./messaging_tab/NotificationBellFeed";
import ProfileTab from "./profile_tab/ProfileTab";
import React from "react";
import TrainerTab from "./trainer_tab/TrainerTab";
import NotificationBellProp from "../vastuscomponents/components/props/NotificationBell";
import NotificationsTab from "./messaging_tab/NotificationsTab";
import PostFeedProp from "./main_tab/PostFeed";
import MessageTab from "./messaging_tab/MessageTab";
import MessageIcon from "../vastuscomponents/components/messaging/MessageIcon";
import GroupFeed from "./trainer_tab/CommunityTab";

type Props = {
    user: any
};

/**
* Tabs TODO Potentially clean this up
*
* The app is currently split up into three sections: home, profile, and notifications.
 */
export default (props: Props) => (
    <Tab menu={{fixed: "bottom", widths: 5, size: "large", inverted: true}} panes={
        [
            {
                menuItem:
                    (<Menu.Item key={0}>
                        <Icon name='trophy' size='large' />
                    </Menu.Item>),
                render: () =>
                    <Tab.Pane basic attached={false}>
                        <PostFeedProp/>
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
                        <Icon name='trophy' size='large' />
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
                    <ProfileTab user={props.user}/>
                </Tab.Pane>
            },
        ]
    }/>
);