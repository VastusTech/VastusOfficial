import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import EventDescriptionModal from './EventDescriptionModal';
import { connect } from 'react-redux';
import {fetchEvent} from "../redux_helpers/actions/cacheActions";

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
        // isLoading: true,
        eventID: null,
        // event: null,
        // members: {},
        // owner: null,
        // ifOwned: false,
        // ifJoined: false,
        // capacity: null,
        eventModalOpen: false
    };

    // componentDidMount() {
        // if (this.props.event) {
        //     let ifOwned = false;
        //     let ifJoined = false;
        //     //alert("Membahs: " + this.props.event.members);
        //     //alert(this.props.owner + "vs. " + this.props.event.owner);
        //     if (this.props.user.id === this.props.event.owner) {
        //         //alert("Same owner and cur user for: " + this.props.event.id);
        //         ifOwned = true;
        //     }
        //     if (this.props.event.members && this.props.event.members.includes(this.props.user.id)) {
        //         ifJoined = false;
        //     }
        //
        //     this.setState({isLoading: false, event: this.props.event, members: this.props.event.members, ifOwned, ifJoined});
        // }
    // }
    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.eventID && !this.state.eventID) {
            // this.props.fetchEvent(newProps.eventID, ["id", "title", "goal", "time", "time_created", "owner", "members", "capacity", "difficulty"]);
            this.setState({eventID: newProps.eventID});
        }
    }

    convertFromISO(dateTime) {
        let dateTimeString = String(dateTime);
        let date = dateTimeString.substr(0, 10);
        let time = dateTimeString.substr(11, 5);
        let time1 = dateTimeString.substr(37, 5);
        return convertDate(date) + " from " + convertTime(time) + " to " + convertTime(time1);
    }

    getEventAttribute(attribute) {
        if (this.state.eventID) {
            if (this.props.cache.events[this.state.eventID]) {
                if (attribute === "membersLength") {
                    if (this.props.cache.events[this.state.eventID]["members"]) {
                        return this.props.cache.events[this.state.eventID]["members"].length
                    }
                    return 0;
                }
                return this.props.cache.events[this.state.eventID][attribute];
            }
        }
        return null;
    }

    openEventModal = () => { this.setState({eventModalOpen: true})};
    closeEventModal = () => {this.setState({eventModalOpen: false})};

    render() {
        if (!this.getEventAttribute("id")) {
            return(
                <Card fluid raised>
                    <h1>Loading...</h1>
                </Card>
            );
        }
        return(
            // This is displays a few important pieces of information about the challenge for the feed view.
            <Card fluid raised onClick={this.openEventModal.bind(this)}>
                <Card.Content>
                    <Card.Header>{this.getEventAttribute("title")}</Card.Header>
                    <Card.Meta>{this.convertFromISO(this.getEventAttribute("time"))}</Card.Meta>
                    <Card.Description>
                        {String(this.getEventAttribute("goal") + ", " + this.getEventAttribute("difficulty"))}
                    </Card.Description>
                    <EventDescriptionModal open={this.state.eventModalOpen} onClose={this.closeEventModal.bind(this)} eventID={this.state.eventID}/> </Card.Content> <Card.Content extra> {/* <Card.Meta>{this.state.event.time_created}</Card.Meta> */} <Card.Meta>{this.getEventAttribute("membersLength")} out of {this.getEventAttribute("capacity")} people joined</Card.Meta> </Card.Content>
            </Card>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    cache: state.cache,
    info: state.info
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchEvent: (id, variablesList) => {
            dispatch(fetchEvent(id, variablesList));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventCard);
