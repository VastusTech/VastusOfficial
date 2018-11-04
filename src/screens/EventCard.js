import React, { Component } from 'react';
import { Card, Modal, Header, Button } from 'semantic-ui-react';
import EventDescriptionModal from './EventDescriptionModal';

class EventCard extends Component {
    state = {
        error: null,
        isLoading: true,
        challenge: null
    };

    componentDidMount() {
        if (this.props.challenge) {
            this.setState({isLoading: false, challenge: this.props.challenge});
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
            <EventDescriptionModal challenge={this.state.challenge}
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
