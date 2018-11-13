import React, {Component, Fragment} from 'react'
import _ from 'lodash'
import {Grid, Visibility } from 'semantic-ui-react'
import EventCard from "./EventCard";
import QL from "../GraphQL";
import { connect } from 'react-redux';
import ScheduledEventsList from "./ScheduledEventList";
import {fetchEvent, putClientQuery, putEvent, putEventQuery} from "../redux_helpers/actions/cacheActions";
// import * as AWS from "aws-sdk";

// AWS.config.update({region: 'REGION'});
// AWS.config.credentials = new AWS.CognitoIdentityCredentials(
//     {IdentityPoolId: 'us-east-1:d9a16b98-4393-4ff6-9e4b-5e738fef1222'});

/**
* Event Feed
*
* This is the main feed in the home page, it currently displays all public events inside of the database for
* the user to see.
 */
class EventFeed extends Component {
    state = {
        isLoading: true,
        events: [],
        clientNames: {}, // id to name
        eventFeedLength: 10,
        nextToken: null,
        ifFinished: false,
        calculations: {
            topVisible: false,
            bottomVisible: false
        },
    };

    componentDidMount() {
        this.queryEvents();
    }

    componentWillReceiveProps(newProps) {
        // alert("Set state to userID = " + newProps.userID);
        this.setState({userID: newProps.userID});
    }

    queryEvents() {
        this.setState({isLoading: true});
        // alert("Queryin events. State = " + JSON.stringify(this.state));
        if (!this.state.ifFinished) {
            // alert(JSON.stringify(this.props.cache.eventQueries));
            QL.queryEvents(["id", "title", "goal", "time", "time_created", "owner", "members", "capacity", "difficulty"], QL.generateFilter("and",
                {"access": "eq"}, {"access": "public"}), this.state.eventFeedLength,
                this.state.nextToken, (data) => {
                    if (data.items) {
                        // alert(JSON.stringify(data.items));
                        // alert(JSON.stringify(this.state));
                        this.setState({events: [...this.state.events, ...data.items]});
                        for (let i = 0; i < data.items.length; i++) {
                            //alert(data.items[i].time_created);
                            // alert("Putting in event: " + JSON.stringify(data.items[i]));
                            // this.setState({events: [...this.state.events, data.items[i]]});
                            this.props.putEvent(data.items[i]);
                        }
                        // alert("events in the end: " + JSON.stringify(this.state.events));
                        this.setState({nextToken: data.nextToken});
                        if (!data.nextToken) {
                            this.setState({ifFinished: true});
                        }
                    }
                    else {
                        // TODO Came up with no events
                    }
                    this.setState({isLoading: false});
                }, (error) => {
                    console.log("Querying events failed!");
                    console.log(error);
                    alert(error);
                    this.setState({isLoading: false, error: error});
                }, this.props.cache.eventQueries, this.props.putEventQuery);
        }
    }

    /**
     *
     * @param e
     * @param calculations
     */
    handleUpdate = (e, { calculations }) => {
        this.setState({ calculations });
        // console.log(calculations.bottomVisible);
        if(calculations.bottomVisible) {
            console.log("Next Token: " + this.state.nextToken);
            this.queryEvents();
        }
    };

    render() {
        /**
         * This function takes in a list of events and displays them in a list of Event Card views.
         * @param events
         * @returns {*}
         */
        function rows(events) {
            // if(events != null && events.length > 0)
            //     alert(JSON.stringify(events[0].id));
            // alert("EVENTS TO PRINT: ");
            // alert(JSON.stringify(events));
            return _.times(events.length, i => (
                <Fragment key={i}>
                    <EventCard eventID={events[i].id}/>
                </Fragment>
            ));
        }

        //This displays the rows in a grid format, with visibility enabled so that we know when the bottom of the page
        //is hit by the user.
        return (
            <Visibility onUpdate={this.handleUpdate}>
                {rows(this.state.events)}
            </Visibility>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    cache: state.cache
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchEvent: (id, variablesList) => {
            dispatch(fetchEvent(id, variablesList));
        },
        putEvent: (event) => {
            dispatch(putEvent(event));
        },
        putEventQuery: (queryString, queryResult) => {
            dispatch(putEventQuery(queryString, queryResult));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EventFeed);
