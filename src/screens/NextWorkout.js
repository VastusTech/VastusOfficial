import React, {Component, Fragment} from 'react'
import {Icon, Message, Label, Header} from 'semantic-ui-react';
import EventCard from "./EventCard";
import QL from "../GraphQL";
import { connect } from "react-redux";
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";
import { inspect } from 'util';
import {fetchEvent} from "../redux_helpers/actions/cacheActions";

class NextEventProp extends Component {
    state = {
        isLoading: true,
        sentRequest: false,
        error: null
    };

    constructor(props) {
        super(props);
        //alert("Got into Scheduled Events constructor");
        this.update = this.update.bind(this);
    }

    resetState() {
        this.setState({isLoading: true, sentRequest: false, error: null});
    }

    update(props) {
        if (!props.user.id) {
            alert("No user ID...");
            return;
        }
        //alert("Cur User for grabbing Attributes: " + this.props.user.id);
        if (props.user.hasOwnProperty("scheduledEvents") && props.user.scheduledEvents && props.user.scheduledEvents.length && this.state.isLoading) {
            this.setState({isLoading: false});
            for (var i = 0; i < props.user.scheduledEvents.length; i++) {
                // if (!(this.props.user.scheduledEvents[i] in this.state.events)) {
                //     this.addEventFromGraphQL(this.props.user.scheduledEvents[i]);
                // }
                props.fetchEvent(props.user.scheduledEvents[i], ["id", "time"]);
            }
        }
        else if (!props.info.isLoading) {
            if (!this.state.sentRequest && !props.info.error && props.user.id != null) {
                props.fetchUserAttributes(props.user.id, ["scheduledEvents"]);
                this.setState({sentRequest: true});
            }
        }
    }

    // addEventFromGraphQL(eventID) {
    //     QL.getEvent(eventID, ["id", "time", "time_created", "title", "goal", "owner", "members", "capacity"], (data) => {
    //         console.log("successfully got a event");
    //         this.setState({events: {...this.state.events, [data.id]: data}, isLoading: false});
    //     }, (error) => {
    //         console.log("Failed to get a vent");
    //         console.log(JSON.stringify(error));
    //         this.setState({error: error});
    //     });
    // }
    getEventTime(id) {
        // alert("getting " + id);
        if (this.props.cache.events[id]) {
            // alert("returning " + this.props.cache.events[id].time);
            return this.props.cache.events[id].time;
        }
        return null;
    }

    // componentDidMount() {
    //     this.update();
    // }

    componentWillReceiveProps(newProps, nextContext) {
        if (newProps.user && this.props.user && newProps.user.id !== this.props.user.id) {
            alert("resetting app for new user!");
            this.resetState();
        }
        this.update(newProps);
    }

    render() {
        // this.update();
        //alert("Redering");
        function rows(eventIDs, getEventTimeFunction) {
            const row = [];
            // alert("eventIDs = " + JSON.stringify(eventIDs));
            for (const key in eventIDs) {
                if (eventIDs.hasOwnProperty(key) && eventIDs[key]) {
                    const time = getEventTimeFunction(eventIDs[key]);
                    if (time) {
                        row.push({
                            id: eventIDs[key],
                            time
                        });
                    }
                }
            }
            // alert("row = " + JSON.stringify(row));

            row.sort(function(a,b){return (b.time).localeCompare(a.time)});

            if (row.length > 0) {
                return (
                    <Fragment key={0}>
                        <Message>
                            <Header>Next Scheduled Event</Header>
                            <EventCard eventID={row[0].id}/>
                        </Message>
                    </Fragment>
                );
            }
            else {
                return(null);
            }
        }
        if (this.props.info.isLoading) {
            //alert("loading: " + JSON.stringify(this.state));
            return(
                <Message icon>
                    <Icon name='spinner' size="small" loading />
                    <Message.Content>
                        <Message.Header>
                            Loading...
                        </Message.Header>
                    </Message.Content>
                    
                </Message>
            )
        }
        if (this.props.user.scheduledEvents && this.props.user.scheduledEvents.length && this.props.user.scheduledEvents.length > 0) {
            return(
                rows(this.props.user.scheduledEvents, this.getEventTime.bind(this))
            );
        }
        else {
            // Then it's empty, no next scheduled event
            return(
                <Message>No scheduled events!</Message>
            );
        }
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    cache: state.cache,
    info: state.info,
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (id, attributeList) => {
            dispatch(fetchUserAttributes(id, attributeList));
        },
        fetchEvent: (id, variablesList) => {
            dispatch(fetchEvent(id, variablesList));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NextEventProp);