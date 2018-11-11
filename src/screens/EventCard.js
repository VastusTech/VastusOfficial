import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import EventDescriptionModal from './EventDescriptionModal';
import { connect } from 'react-redux';

function convertTime(time) {
    if (parseInt(time, 10) > 12) {
        return "0" + (parseInt(time, 10) - 12) + time.substr(2, 3) + "pm";
    }
    else if (parseInt(time, 10) === 12) {
        return time + "pm";
    }
    else if (parseInt(time, 10) === 0) {
        return "0" + (parseInt(time, 10) + 12) + time.substr(2, 3) + "am"
    }
    else {
        return time + "am"
    }
}

function convertDate(date) {
    let dateString = String(date);
    let year = dateString.substr(0, 4);
    let month = dateString.substr(5, 2);
    let day = dateString.substr(8, 2);

    return month + "/" + day + "/" + year;
}

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
        members: {},
        owner: null,
        ifOwned: false,
        ifJoined: false,
    };

    componentDidMount() {
        if (this.props.event) {
            let ifOwned = false;
            let ifJoined = false;
            //alert("Membahs: " + this.props.event.members);
            //alert(this.props.owner + "vs. " + this.props.event.owner);
            if (this.props.user.id === this.props.event.owner) {
                alert("Same owner and cur user for: " + this.props.event.id);
                this.setState({ifOwned: true});
            }
            if (this.props.event.members && this.props.event.members.includes(this.props.user.id)) {
                this.setState({ifJoined: true});
            }

            this.setState({isLoading: false, event: this.props.event, members: this.props.event.members, ifOwned: ifOwned, ifJoined: ifJoined});
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.event) {
            this.setState({isLoading: false, event: newProps.event, members: newProps.members});
        }
    }

    convertFromISO(dateTime) {
        let dateTimeString = String(dateTime);
        let date = dateTimeString.substr(0, 10);
        let time = dateTimeString.substr(11, 5);
        let time1 = dateTimeString.substr(37, 5);
        return convertDate(date) + " from " + convertTime(time) + " to " + convertTime(time1);
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
            <EventDescriptionModal members={this.state.members} ifOwned={this.state.ifOwned} ifJoined={this.state.ifJoined} event={this.state.event}
                trigger={
                    <Card>
                        <Card.Content>
                            <Card.Header>{this.state.event.title}</Card.Header>
                            <Card.Meta>{this.convertFromISO(this.state.event.time)}</Card.Meta>
                            <Card.Meta>{this.state.event.members}</Card.Meta>
                            <Card.Description>
                                {String(this.state.event.goal + ", ")}
                            </Card.Description>
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
