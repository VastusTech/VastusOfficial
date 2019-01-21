import React, { Component } from 'react'
import { List, Message } from 'semantic-ui-react';
import EventCard from "../cards/EventCard";
import { connect } from "react-redux";
import { fetchEvent } from "../../redux_helpers/actions/cacheActions";
import Spinner from "../props/Spinner";

type Props = {
    eventIDs: [string],
    noEventsMessage: string,
    sortFunction?: any
}

class EventList extends Component<Props> {
    state = {
        isLoading: true,
        eventIDs: null,
        events: [],
        sentRequest: false,
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.eventIDs && this.state.eventIDs !== newProps.eventIDs) {
            // alert("received eventIDs = " + JSON.stringify(newProps.eventIDs));
            this.setState({isLoading: true, eventIDs: newProps.eventIDs, events: []}, () => {
                this.update(newProps);
            });
        }
    }

    update(props) {
        for (let i = 0; i < props.eventIDs.length; i++) {
            this.props.fetchEvent(props.eventIDs[i], ["id", "title", "time", "time_created", "owner", "members", "capacity", "difficulty", "restriction", "access"], (event) => {
                // Handle received data
                if (event) {
                    this.state.events.push(event);
                }
                this.setState({isLoading: false});
            });
        }
    }

    render() {
        function rows(events, sortFunction) {
            const row = [];
            const rowProps = [];
            for (const key in events) {
                if (events.hasOwnProperty(key)) {
                    row.push(
                        events[key]
                    );
                }
            }

            if (sortFunction) {
                row.sort(sortFunction);
            }

            for (const key in row) {
                if (row.hasOwnProperty(key) === true) {
                    rowProps.push(
                        <List.Item key={key}>
                            <EventCard eventID={row[key].id}/>
                        </List.Item>
                    );
                }
            }

            return rowProps;
        }
        if (this.props.isLoading) {
            //console.log("loading: " + JSON.stringify(this.state));
            return(
                <Spinner/>
            )
        }
        if (this.state.events.length > 0) {
            return(
                <List relaxed verticalAlign="middle">
                    {rows(this.state.events, this.props.sortFunction)}
                </List>
            );
        }
        else {
            return(
                <Message>{this.props.noEventsMessage}</Message>
            );
        }
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchEvent: (id, variablesList, dataHandler) => {
            dispatch(fetchEvent(id, variablesList, dataHandler));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventList);
