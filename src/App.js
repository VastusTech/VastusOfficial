import React, { Component } from 'react';
import './App.css';
// import Tabs from './screens/tabs.js';
import { connect } from 'react-redux';
import Amplify, { Auth, Analytics } from 'aws-amplify';
import { inspect } from 'util';
import Semantic, { Input } from 'semantic-ui-react';
import Lambda from './Lambda';
// import { Authenticator, SignIn, SignUp, ConfirmSignUp, Greetings, Connect, withAuthenticator } from 'aws-amplify-react';
// import aws_exports from './aws-exports';
// import SearchBarProp from "./screens/searchBar";

import AuthApp from './AuthApp';
import UnauthApp from './UnauthApp';

window.LOG_LEVEL='DEBUG';

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
        // oauth: oauth
    }
});

class App extends Component {
    // This is the function that is called when the sign up button is pressed
    state = {
        user: {},
        isLoading: true
    };

    authenticate(user) {
        if (user) {
            // alert("setting the state to " + JSON.stringify(user));
            this.setState({user});
        }
        else {
            alert("received null user");
        }
    }

    async componentDidMount() {
        // StatusBar.setHidden(true);
        try {
            const user = await Auth.currentAuthenticatedUser();
            this.setState({ user, isLoading: false })
        } catch (err) {
            this.setState({ isLoading: false })
        }
    }

    async componentWillReceiveProps(nextProps) {
        try {
            const user = await Auth.currentAuthenticatedUser();
            this.setState({ user })
        } catch (err) {
            this.setState({ user: {} })
        }
    }

    render() {
        if (this.state.isLoading) return null;
        let loggedIn = false;
        if (this.state.user.username) {
            loggedIn = true
        }
        if (loggedIn) {
            // The actual App
            return (
                <div>
                    <AuthApp />
                </div>
            );
        }
        else {
            return (
                <div>
                    <UnauthApp authenticate={this.authenticate.bind(this)}/>
                </div>
            );
        }
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(App)
