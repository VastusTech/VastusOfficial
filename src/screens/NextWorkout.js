import React, { Component } from 'react'
import EventCard from "./EventCard";
import QL from "../GraphQL";
import { connect } from "react-redux";
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";
import { inspect } from 'util';

class ScheduledEventsList extends Component {
    state = {
        isLoading: true,
        events: {},
        sentRequest: false,
        error: null
    };

    constructor(props) {
        super(props);
        alert("Got into Scheduled Events constructor");
    }

    update() {
        alert("Cur User: " + this.props.user.id);
        /*
        if (!this.state.sentRequest && !this.props.user.info.error) {
            this.props.fetchUserAttributes(user.id, ["scheduledEvents"]);
            this.setState({sentRequest: true});
        }
        */
    }

    componentDidMount() {
        this.update();
    }

    render() {
        alert("Redering");
        return (
            <div>Put the scheduled events here</div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(ScheduledEventsList);
