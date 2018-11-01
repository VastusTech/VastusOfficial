import React, { Component } from 'react';
import './App.css';
import Tabs from './screens/tabs.js';
import Amplify, { API, Auth, graphqlOperation, Analytics } from 'aws-amplify';
import * as AWS from "aws-sdk";
import { SignIn, SignUp, withAuthenticator, Connect } from 'aws-amplify-react'; //
import SearchBarProp from "./screens/searchBar";
import setupAWS from "./screens/appConfig";
import EventFeedProp from "./screens/eventFeed";
import {Card} from "semantic-ui-react";

setupAWS();

var lambda = new AWS.Lambda({region: 'us-east-1', apiVersion: '2015-03-31'});

var Payload = {
    fromID: "admin",
    action: "CREATE",
    itemType: "Client",
    createClientRequest: {
        name: "ay",
        gender: "ay",
        birthday: "2018-10-05",
        email: "ay",
        username: "ay"
    }
};

var pullParams = { FunctionName : 'VastusDatabaseLambdaFunction',
    Payload : JSON.stringify(Payload)
};

// (async () => {
//     alert("ay lmao");
//     // Define the query string
//     const getDatabaseObject = `query TestGetDatabaseObjects {
//         queryDatabaseObjects(item_type: "Client") {
//             items {
//                 id
//                 name
//                 username
//             }
//         }
//     }`;
//     alert("ay lmao pt. 2");
//     // Send the request to graph QL
//     const allEvents = await API.graphql(graphqlOperation(getDatabaseObject));
//     alert(JSON.stringify(allEvents));
// })();

// lambda.invoke(pullParams, function(error, data) {
//     if (error) {
//         prompt(error);
//     } else {
//         prompt(data.Payload);
//     }
// });

class AuthApp extends Component {

    uploadFile = (evt) => {
        const file = evt.target.files[0];
        const name = file.name;

        Storage.put(name, file).then(() => {
            this.setState({ file: name });
        })
    };

    componentDidMount() {
        Analytics.record('Amplify_CLI');
    }

    render() {
        // We define the query in a const string
        const getDatabaseObject =
            `query Test {
            queryClients {
                items {
                    name
                }
            }
        }`;
        const ListView = ({ events }) => (
            <div>
                <h3>All events</h3>
                <ul>
                    {events.map(event => <li key={event.id}>{event.title} ({event.id})</li>)}
                </ul>
            </div>
        );

        // Then we use GraphQL Connect to perform the query and display it in a ListView object
        // The error shows up in the data: { queryDatabaseObject }, saying that queryDatabaseObject returns undefined
        return (
            <div className="App">
                <Connect query={graphqlOperation(getDatabaseObject)}>
                    {({ data: { queryDatabaseObjects } }) =>
                        <div> {
                            queryDatabaseObjects ? (<ListView events={queryDatabaseObjects ?
                                queryDatabaseObjects.items : queryDatabaseObjects } />) : (<h3></h3>)
                        } </div>
                    }
                </Connect>
                <SearchBarProp/>
                <Tabs/>
            </div>
        );
    }
}
//Goes in the return for render

export default AuthApp;