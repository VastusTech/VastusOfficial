import React, { Component } from 'react';
import './App.css';
import Tabs from './screens/tabs.js';
import Amplify, { API, Auth, graphqlOperation, Analytics } from 'aws-amplify';
import { Authenticator, SignIn, SignUp, ConfirmSignUp, Greetings, Connect, withAuthenticator } from 'aws-amplify-react';
import aws_exports from './aws-exports';
import SearchBarProp from "./screens/searchBar";
//import gql from 'graphql-tag';

 let myAppConfig = {
    // ...
     'aws_appsync_graphqlEndpoint': "https://ferhxllitvaypgfmlu75ra22su.appsync-api.us-east-1.amazonaws.com/graphql",
     'aws_appsync_region': 'us-east-1',
     // If we comment out, this line, then the GraphQL request is actually sent
     'aws_appsync_authenticationType': 'AMAZON_COGNITO_USER_POOLS',
//     //'aws_appsync_apiKey': 'da2-2h7e6fjjkffypdg6peqjv7khxa'
 }


Amplify.configure(myAppConfig);


Amplify.configure({
API: {
    graphql_endpoint: 'https://ferhxllitvaypgfmlu75ra22su.appsync-api.us-east-1.amazonaws.com/graphql',
	graphql_endpoint_iam_region: 'us-east-1'
     }
 });

const oauth = {
    // Domain name
    domain : 'vastusclienteuserpool.auth.us-east-1.amazoncognito.com',

    // Authorized scopes
    scope : ['birthdate', 'gender', 'email', 'profile', 'openid','aws.cognito.signin.user.admin'], 

    // Callback URL
    redirectSignIn : 'http://localhost:3000', 

    // Sign out URL
    redirectSignOut : 'http://www.example.com/signout',

    // 'code' for Authorization code grant, 
    // 'token' for Implicit grant
    responseType: 'code'

    // optional, for Cognito hosted ui specified options
    //options: {
        // Indicates if the data collection is enabled to support Cognito advanced security features. By default, this flag is set to true.
      //  AdvancedSecurityDataCollectionFlag : true
    //}
}

Amplify.configure({
    Auth: {

        // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
        identityPoolId: 'us-east-1:d9a16b98-4393-4ff6-9e4b-5e738fef1222',
        
        // REQUIRED - Amazon Cognito Region
        region: 'us-east-1',


        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: 'us-east-1_t1rvP2wBr',

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: '124v8f255kaqivbm5bp71s6rej',

        // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
        mandatorySignIn: false,

       /* // OPTIONAL - Configuration for cookie storage
        cookieStorage: {
        // REQUIRED - Cookie domain (only required if cookieStorage is provided)
            domain: '.yourdomain.com',
        // OPTIONAL - Cookie path
            path: '/',
        // OPTIONAL - Cookie expiration in days
            expires: 365,
        // OPTIONAL - Cookie secure flag
            secure: true
        },

        // OPTIONAL - customized storage object
        storage: new MyStorage(),
        */
        // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
        authenticationFlowType: 'USER_PASSWORD_AUTH',
        
        oauth: oauth
    }
});

const AlwaysOn = (props) => {
    return (
        <div>
            <div>I am always here to show current auth state: {props.authState}</div>
            <button onClick={() => props.onStateChange('signUp')}>Show Sign Up</button>
        </div>
    )
}


var AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'});
AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: 'us-east-1:d9a16b98-4393-4ff6-9e4b-5e738fef1222'});



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

class App extends Component {

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
                    id
                    name
                }
            }
        }`;

      const ListView = ({ events }) => (
          <div>
              <h3>All events</h3>
              <ul>
                  {events.map(event => <li key={event.id}>{event.name} ({event.id})</li>)}
              </ul>
          </div>
      );

      // Then we use GraphQL Connect to perform the query and display it in a ListView object
      // The error shows up in the data: { queryDatabaseObject }, saying that queryDatabaseObject returns undefined
  return (
  <div className="App">
        <p> Pick a file</p>
        <input type="file" onChange={this.uploadFile} />
        <button onClick={this.listQuery}>GraphQL Query</button>
        <button onClick={this.todoMutation}>GraphQL Mutation</button>
        <Connect query={graphqlOperation(getDatabaseObject)}>
				{({ data: { queryDatabaseObjects } }) =>
					<div> {
					queryDatabaseObjects ? (<ListView events={queryDatabaseObjects ? queryDatabaseObjects.items : queryDatabaseObjects } />) : (<h3> Loading... </h3>)
					} </div>
				}
        </Connect>
        <SearchBarProp/>
        <Tabs/>
       
      </div>
    );
  }
}

// export default withAuthenticator(App, true);
 