import React, {Component} from 'react'
import _ from 'lodash'
import {Grid, Visibility, Image, Modal, Button, Header, Card, Label, Item} from 'semantic-ui-react'
import addToFeed from './addToFeed'
import Amplify, { Auth, API, graphqlOperation } from "aws-amplify";
import setupAWS from './appConfig';
import proPic from "./BlakeProfilePic.jpg";
import EventCard from "./EventCard";
import Lambda from "../Lambda";
import QL from "../GraphQL";
import * as AWS from "aws-sdk";

AWS.config.update({region: 'REGION'});
AWS.config.credentials = new AWS.CognitoIdentityCredentials(
    {IdentityPoolId: 'us-east-1:d9a16b98-4393-4ff6-9e4b-5e738fef1222'});

class EventFeed extends Component {
    state = {
        isLoading: true,
        challenges: [],
        clientNames: {}, // id to name
        challengeFeedLength: 10,
        nextToken: null,
        calculations: {
            topVisible: false,
            bottomVisible: false
        },
    };

    // constructor(props) {
    //     super(props);
    // }

    componentDidMount() {
        this.queryChallenges();
    }

    queryChallenges() {
        this.setState({isLoading: true});
        // alert("querying challenges");

        QL.queryChallenges(["id", "title", "goal", "time", "owner"], QL.generateFilter("and",
            {"access": "eq"}, {"access": "public"}), 5,
            this.nextToken, (data) => {
                // TODO You can also use data.nextToken to get the next set of challenges
                // alert("got challenges");
                if (data.items) {
                    // alert("Length: " + data.items.length);
                    for (let i = 0; i < 6; i++) {
                        this.state.challenges.push(data.items[i]);
                    }
                    this.setState({nextToken: data.nextToken});
                    // alert("Challenges in the end is " + JSON.stringify(this.state.challenges));
                }
                else {
                    // TODO Came up with no challenges
                }
                this.setState({isLoading: false});
            }, (error) => {
                console.log("Querying challenges failed!");
                if (error.message) {
                    error = error.message;
                }
                console.log(error);
                alert(error);
                this.setState({isLoading: false});
            });
    }

    handleUpdate = (e, { calculations }) => {
        this.setState({ calculations });
        console.log(calculations.bottomVisible);
        // if(this.state.calculations.bottomVisible) {
        //     this.state.challenges.push(this.nextToken);
        // }
        //console.log(this.state.challenges);

        if(calculations.bottomVisible) {
            console.log("Next Token: " + this.state.nextToken);
            QL.queryChallenges(["id", "title", "goal", "time", "owner"], QL.generateFilter("and",
                {"access": "eq"}, {"access": "public"}), 5,
                this.nextToken, (data) => {
                    // TODO You can also use data.nextToken to get the next set of challenges
                    // alert("got challenges");
                    if (data.items) {
                        // alert("Length: " + data.items.length);
                        for (let i = 0; i < 6; i++) {
                            this.state.challenges.push(data.items[i]);
                        }
                        this.setState({nextToken: data.nextToken});
                        // alert("Challenges in the end is " + JSON.stringify(this.state.challenges));
                    }
                    else {
                        // TODO Came up with no challenges
                    }
                    this.setState({isLoading: false});
                }, (error) => {
                    console.log("Querying challenges failed!");
                    if (error.message) {
                        error = error.message;
                    }
                    console.log(error);
                    alert(error);
                    this.setState({isLoading: false});
                });
        }

        /*
        if(calculations.bottomVisible) {
            alert("Call next token now that bottom is visible!");
        }
        */
    };

    render() {
        //const { calculations } = this.state;

        function rows(challenges) {
            return _.times(challenges.length, i => (
                <Grid.Row key={i} className="ui one column stackable center aligned page grid">
                    <EventCard challenge={challenges[i]}/>
                </Grid.Row>
            ));
        }

        return (
            <Visibility onUpdate={this.handleUpdate}>
                <Grid>
                    {rows(this.state.challenges)}
                </Grid>
            </Visibility>
        );
    }
}

export default EventFeed;
