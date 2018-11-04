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

//var i;
// var MAX_FEED_ITEMS = 0;
//
// //Get the current user information
// //username of the current user
// var curUserName;
//
// //name of the current user
// var curName;
//
// //Number of challenge wins for the current user
// var curChalWins;
//
// //ID of the current user
// var curID;
//
// //Get all of the owners of the challenges
// setupAWS();
//
// async function asyncCallCurUser(callback) {
//     console.log('calling');
//     var result = await Auth.currentAuthenticatedUser()
//         .then(user => user.username)
//         .catch(err => console.log(err));
//     console.log(result);
//     callback(result);
//     // expected output: 'resolved'
// }
//
// function callBetterCurUser(callback) {
//     asyncCallCurUser(function(data) {
//         /*
//         let usernameJSON = JSON.stringify(data);
//         alert(usernameJSON);
//         let username = JSON.parse(usernameJSON);
//         */
//         //alert(data);
//         callback(data);
//     });
// }
//
// function callQueryUser(query, callback) {
//     asyncCall(query, function(data) {
//         let userJSON = JSON.stringify(data);
//         //alert(userJSON);
//         let user = JSON.parse(userJSON);
//         callback(user.data.getClientByUsername);
//     });
//     /*
//     let allChallengesJSON = JSON.stringify(asyncCall(query));//.data.queryChallenges.items);
//     alert(allChallengesJSON);
//     let allChallenges = JSON.parse(allChallengesJSON);
//     callback(allChallenges);*/
// }
//
// callBetterCurUser(function(data) {
//     curUserName = data;
//     //alert(getClient(curUserName));
//     callQueryUser(getClientByUsername(curUserName), function(data) {
//         curID = data.id;
//         //alert("Current ID: " + curID);
//         curName = data.name;
//         curChalWins = data.challengesWon;
//     });
// });
//
// async function asyncCall(query, callback) {
//     console.log('calling');
//     var result = await API.graphql(graphqlOperation(query));
//     console.log(result);
//     callback(result);
//     // expected output: 'resolved'
// }
//
// function callQueryChallenge(query, callback) {
//     asyncCall(query, function (data) {
//         let allChallengesJSON = JSON.stringify(data);
//         //alert(allChallengesJSON);
//         let allChallenges = JSON.parse(allChallengesJSON);
//         if (allChallenges.data.queryChallenges != null)
//             callback(allChallenges.data.queryChallenges.items);
//     });
//     /*
//     let allChallengesJSON = JSON.stringify(asyncCall(query));//.data.queryChallenges.items);
//     alert(allChallengesJSON);
//     let allChallenges = JSON.parse(allChallengesJSON);
//     callback(allChallenges);*/
// }
//
// const curIDs = [];
// const curNames = [];
// const challengeTimes = [];
// const challengeTitles = [];
// const challengeGoals = [];
// const challengeOwner = [];
// const challengeID = [];
// //<AddPostButtonTestProp/>
//
// const getChallenges =
//     `query TestChallenges{
//                       queryChallenges{
//                         items {
//                           id
//                           title
//                           goal
//                           time
//                           owner
//                         }
//                       }
//                     }`;
//
// function getClientByID(userID) {
//     const userQuery = `query getUser {
//         getClient(id: "` + userID + `") {
//             id
//             name
//             username
//             challengesWon
//             scheduledChallenges
//             friends
//             friendRequests
//             }
//         }`;
//     return userQuery;
// }
//
// function getClientByUsername(userName) {
//     const userQuery = `query getUser {
//         getClientByUsername(username: "` + userName + `") {
//             id
//             name
//             username
//             challengesWon
//             scheduledChallenges
//             friends
//             friendRequests
//             }
//         }`;
//     return userQuery;
// }
//
// function getUser(n, query, callback) {
//     asyncCall(query, function (data) {
//         callback(data.data.getClient);
//     });
// }
//
// callQueryChallenge(getChallenges, function (data) {
//     if (data != null) {
//         MAX_FEED_ITEMS = data.length;
//         //alert(MAX_FEED_ITEMS);
//     }
//
//     for (var i = 0; i < MAX_FEED_ITEMS; i++) {
//         /*
//         const newPost = addToFeed(data[i].time, null, data[i].goal, data[i].title, null);//getChallenges.items[i], null, null);
//         events.unshift(newPost);
//         */
//         challengeTimes[i] = data[i].time;
//         challengeTitles[i] = data[i].title;
//         challengeGoals[i] = data[i].goal;
//         challengeOwner[i] = data[i].owner;
//         challengeID[i] = data[i].id;
//         console.log(challengeTitles[i]);
//         console.log(challengeTimes[i]);
//         console.log(challengeGoals[i]);
//         console.log("Owner" + i + " " + challengeOwner[i]);
//
//         try{throw i}
//         catch(ii) {
//             getUser(ii, getClientByID(challengeOwner[ii]), function (data) {
//                 console.log(ii);
//                 curNames[ii] = data.name;
//                 curIDs[ii] = data.id;
//             });
//         }
//     }
// });
//
// function handleJoinChallenge(curID, challengeID) {
//     Lambda.joinChallenge(curID, curID, challengeID, handleBudRequestSuccess, handleBudRequestFailure)
// }
//
// function handleBudRequestSuccess(success) {
//     alert(success);
// }
//
// function handleBudRequestFailure(failure) {
//     alert(failure);
// }

class EventFeed extends Component {
    state = {
        isLoading: true,
        challenges: [],
        clientNames: {}, // id to name
        challengeFeedLength: 10,
        calculations: {
            topVisible: false,
            bottomVisible: false
        }
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
        QL.queryChallenges(["id", "title", "goal", "time", "owner"], null, this.state.challengeFeedLength,
            null, (data) => {
                // TODO You can also use data.nextToken to get the next set of challenges
                // alert("got challenges");
                if (data.items) {
                    // alert("Length: " + data.items.length);
                    for (let i = 0; i < data.items.length; i++) {
                        this.state.challenges.push(data.items[i]);
                    }
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

    handleContextRef = contextRef => this.setState({ contextRef })

    handleUpdate = (e, { calculations }) => this.setState({ calculations })

    render() {
        function rows(challenges) {
            return _.times(6, i => (
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
