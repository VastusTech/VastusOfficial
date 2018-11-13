import React, { Component } from 'react'
import {Grid, Message, Label} from 'semantic-ui-react';
import EventCard from "./EventCard";
import QL from "../GraphQL";
import { connect } from "react-redux";
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";
import { inspect } from 'util';

class NextEventProp extends Component {
    state = {
        isLoading: true,
        events: {},
        sentRequest: false,
        error: null
    };

    constructor(props) {
        super(props);
        //alert("Got into Scheduled Events constructor");
        this.update = this.update.bind(this);
    }

    update() {
        //alert("Cur User for grabbing Attributes: " + this.props.user.id);
        if (this.props.user.hasOwnProperty("scheduledEvents")) {
            for (var i = 0; i < this.props.user.scheduledEvents.length; i++) {
                if (!(this.props.user.scheduledEvents[i] in this.state.events)) {
                    this.addEventFromGraphQL(this.props.user.scheduledEvents[i]);
                }
            }
        }
        else if (!this.props.info.isLoading) {
            if (!this.state.sentRequest && !this.props.info.error && this.props.user.id != null) {
                this.props.fetchUserAttributes(this.props.user.id, ["scheduledEvents"]);
                this.setState({sentRequest: true});
            }
        }
    }

    addEventFromGraphQL(eventID) {
        QL.getEvent(eventID, ["id", "time", "time_created", "title", "goal", "owner", "members", "capacity"], (data) => {
            console.log("successfully got a event");
            this.setState({events: {...this.state.events, [data.id]: data}, isLoading: false});
        }, (error) => {
            console.log("Failed to get a vent");
            console.log(JSON.stringify(error));
            this.setState({error: error});
        });
    }

    componentDidMount() {
        this.update();
    }

    render() {
        this.update();
        //alert("Redering");
        function rows(events) {
            const row = [];
            for (const key in events) {
                if (events.hasOwnProperty(key)) {
                    //alert(JSON.stringify(events[key]));
                    row.push(
                        events[key]
                    );
                }
            }
            row.sort(function(a,b){return b.time_created.localeCompare(a.time_created)});

            //alert(JSON.stringify(row));

            return (
                <div>
                    <Label>Next Scheduled Event</Label>
                    <EventCard eventID={row[0].id}/>
                </div>
            );
        }
        if (this.state.isLoading) {
            //alert("loading: " + JSON.stringify(this.state));
            return(
                <Message>Loading...</Message>
            )
        }
        return(
            rows(this.state.events)
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    info: state.info
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (id, attributeList) => {
            dispatch(fetchUserAttributes(id, attributeList));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NextEventProp);