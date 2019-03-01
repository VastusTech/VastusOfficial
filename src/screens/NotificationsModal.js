// TODO This is going to be the modal that opens after you press the notification bell in the corner to check your
// TODO. notifications.

import React from 'react';
import NotificationsFeed from "src/screens/messaging_tab/NotificationBellFeed";

const NotificationsModal = () => {
    return (
        <div>
            <NotificationsFeed/>
        </div>
    );
};

export default NotificationsModal;