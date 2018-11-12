import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { Auth } from 'aws-amplify';
import { updateAuth } from "./redux_helpers/actions/authActions";
import AuthApp from './AuthApp';
import UnauthApp from './UnauthApp';
import AWSConfig from './AppConfig';

AWSConfig();

class App extends Component {
    // This is the function that is called when the sign up button is pressed
    state = {
        error: null,
    };

    constructor(props) {
        super(props);
    }

    // async authenticate(user) {
    //     if (user && user.username) {
    //         // Refresh the tokens potentially?
    //         // Auth.currentSession();
    //         Auth.currentCredentials();
    //         Auth.currentAuthenticatedUser().then((authenticatedUser) => {
    //             if (authenticatedUser && (user.username === authenticatedUser.username)) {
    //                 // alert("Logging in the user");
    //                 this.setState({ifLoggedIn: true});
    //                 if (user.username !== this.props.user.username) {
    //                     this.props.clearUser();
    //                 }
    //                 this.props.fetchUser(user.username);
    //             }
    //             else {
    //                 alert("Error with second check");
    //             }
    //         }).catch((error) => {
    //             alert("Error");
    //             this.setState({ifLoggedIn: false, error: error});
    //         });
    //     }
    //     else {
    //         alert("received null user");
    //     }
    // }

    // signOut() {
    //     // alert("logging out the user");
    //     this.setState({ifLoggedIn: false});
    //     // this.props.clearUser();
    // }

    async componentDidMount() {
        this.props.updateAuth();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth) {
            this.setState();
        }
    }

    render() {
        if (this.props.auth.loggedIn) {
            // The actual App
            return (
                <div>
                    <AuthApp/>
                </div>
            );
        }
        else {
            return (
                <div>
                    <UnauthApp/>
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => ({
    // user: state.user,
    auth: state.auth
    // cache: state.cache,
});

const mapDispatchToProps = (dispatch) => {
    return {
        updateAuth: () => {
            dispatch(updateAuth());
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
