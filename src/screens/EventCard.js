import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import EventDescriptionModal from './EventDescriptionModal';

/*
* Event Card
*
* This is the generic view for how a challenge shows up in any feeds or lists.
* It is used as a modal trigger in the feed.
 */
class EventCard extends Component {
    state = {
        error: null,
        isLoading: true,
        challenge: null,
        ifOwned: false,
        ifJoined: false,
    };

    componentDidMount() {
        if (this.props.challenge) {
            let ifOwned = false;
            let ifJoined = false;
            if (this.props.userID === this.props.challenge.owner) {
                ifOwned = true;
            }
            if (this.props.challenge.members && this.props.challenge.members.includes(this.props.userID)) {
                ifJoined = true;
            }
            this.setState({isLoading: false, challenge: this.props.challenge, ifOwned, ifJoined});
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.challenge) {
            this.setState({isLoading: false, challenge: newProps.challenge});
        }
    }

    render() {
        if (this.state.isLoading) {
            return(
                <Card>
                    <h1>Loading...</h1>
                </Card>
            );
        }

        return(
            // This is displays a few important pieces of information about the challenge for the feed view.
            <EventDescriptionModal ifOwned={this.state.ifOwned} ifJoined={this.state.ifJoined} challenge={this.state.challenge}
                trigger={
                    <Card>
                        <Card.Content>
                            <Card.Header>{this.state.challenge.title}</Card.Header>
                            <Card.Meta>{this.state.challenge.time}</Card.Meta>
                            <Card.Description>
                                {this.state.challenge.goal}
                            </Card.Description>
                        </Card.Content>
                    </Card>
                }
            />
        );
    }
}

export default EventCard;
