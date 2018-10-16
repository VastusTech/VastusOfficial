import React from 'react'
import { Feed } from 'semantic-ui-react'

const events = [
    {
        date: '1 Hour Ago',
        image: '/images/avatar/small/elliot.jpg',
        meta: '4 Likes',
        summary: 'Elliot Fu added you as a friend',
    },
    {
        date: '4 days ago',
        image: '/images/avatar/small/helen.jpg',
        meta: '1 Like',
        summary: 'Helen Troy is playing soccer',
    },
    {
        date: '3 days ago',
        image: '/images/avatar/small/joe.jpg',
        meta: '8 Likes',
        summary: 'Joe Henderson posted on his page',
        extraText:
            "So proud of the team, we've been working out hard!",
    },
    {
        date: '4 days ago',
        image: '/images/avatar/small/justen.jpg',
        meta: '41 Likes',
        summary: 'Justen Kitsune added 2 new photos of you',
        extraText: 'My name may be Kitsune but I hate Kittens >:(',
        extraImages: ['/images/wireframe/image.png', '/images/wireframe/image-text.png'],
    },
]

const EventFeedProp = () => <Feed events={events} />;

export default EventFeedProp;