import React, {Component} from 'react'
import _ from 'lodash'
import {Grid, Visibility } from 'semantic-ui-react'
import EventCard from "./EventCard";
import QL from "../GraphQL";
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

        if (!this.state.ifFinished) {
            QL.queryEvents(["id", "title", "goal", "time", "time_created", "owner", "members"], QL.generateFilter("and",
                {"access": "eq"}, {"access": "public"}), this.state.eventFeedLength,
                this.state.nextToken, (data) => {
                    if (data.items) {
                        for (let i = 0; i < data.items.length; i++) {
                            this.setState({events: [...this.state.events, data.items[i]]});
                        }
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
                });
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
            //if(events != null)
                //alert(JSON.stringify(events[0]));
            return _.times(events.length, i => (
                <Grid.Row key={i} className="ui one column stackable center aligned page grid">
                    <EventCard event={events[i]}/>
                </Grid.Row>
            ));
        }

        //This displays the rows in a grid format, with visibility enabled so that we know when the bottom of the page
        //is hit by the user.
        return (
            <Visibility onUpdate={this.handleUpdate}>
                <Grid>
                    {rows(this.state.events.sort(function(a,b){return b.time_created.localeCompare(a.time_created)}))}
                </Grid>
            </Visibility>
        );
    }
}

export default EventFeed;
