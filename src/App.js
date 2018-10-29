import React, { Component } from 'react';
import './App.css';
// import Tabs from './screens/tabs.js';
import { connect } from 'react-redux';
import Amplify, { Auth, Analytics } from 'aws-amplify';
import { inspect } from 'util';
import Semantic, { Input } from 'semantic-ui-react';
// import { Authenticator, SignIn, SignUp, ConfirmSignUp, Greetings, Connect, withAuthenticator } from 'aws-amplify-react';
// import aws_exports from './aws-exports';
// import SearchBarProp from "./screens/searchBar";

import AuthApp from './AuthApp';
import UnauthApp from './UnauthApp';


class App extends Component {
    // This is the function that is called when the sign up button is pressed
    state = {
        user: {},
        isLoading: true
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
                    <UnauthApp />
                </div>
            );
        }
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(App)
