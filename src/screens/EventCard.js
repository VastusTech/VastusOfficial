import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import EventDescriptionModal from './EventDescriptionModal';
import { connect } from 'react-redux';

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
        event: null,
        ifOwned: false,
        ifJoined: false,
    };

    componentDidMount() {
        if (this.props.event) {
            let ifOwned = false;
            let ifJoined = false;
            // alert(this.props.userID);
            if (this.props.user.id === this.props.event.owner) {
                ifOwned = true;
            }
            if (this.props.event.members && this.props.event.members.includes(this.props.user.id)) {
                ifJoined = true;
            }
            this.setState({isLoading: false, event: this.props.event, ifOwned, ifJoined});
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.event) {
            this.setState({isLoading: false, event: newProps.event});
        }
    }

    render() {
        if (this.state.isLoading) {
            return(
                <Card fluid raised>
                    <h1>Loading...</h1>
                </Card>
            );
        }

        return(
            // This is displays a few important pieces of information about the challenge for the feed view.
            <EventDescriptionModal ifOwned={this.state.ifOwned} ifJoined={this.state.ifJoined} event={this.state.event}
                trigger={
                    <Card fluid raised>
                        <Card.Content>
                            <Card.Header>
                                {this.state.event.title}
                            </Card.Header>
                            <Card.Description>
                                {this.state.event.goal}
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <Card.Meta>{this.state.event.time}</Card.Meta>
                        </Card.Content>
                    </Card>
                }
            />
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(EventCard);
