/**
 * Listen for incoming Push events
 */

addEventListener('push', (event) => {
    var data = {};
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    if (!(self.Notification && self.Notification.permission === 'granted'))
        return;

    if (event.data)
        data = event.data.json();

    // Customize the UI for the message box
    var title = data.title || "Web Push Notification";
    var message = data.message || "New Push Notification Received";
    var icon = "images/notification-icon.png";
    var badge = 'images/notification-badge.png';
    var options = {
        body: message,
        icon: icon,
        badge: badge
    };

    event.waitUntil(self.registration.showNotification(title,options));

});