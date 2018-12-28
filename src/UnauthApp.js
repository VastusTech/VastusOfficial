import React, { Component } from 'react';
import { connect } from 'react-redux';
import Amplify, { Auth, Analytics } from 'aws-amplify';
import SignInPage from './authscreens/SignInPage';
import OpeningScreen from './authscreens/OpeningScreen';

class UnauthApp extends Component {
    // This defines the passed function for use
    authenticate = (user) => {};

    constructor(props) {
        super(props);
        // this.authenticate = this.props.authenticate.bind(this);
    }


    render() {
        // Maybe this would be to have a sort of advertisement for our website?
        return (
        <div>
        	<OpeningScreen/>
            <SignInPage/>
            </div>
        );
    }
}

// const mapStateToProps = state => ({
//     auth: state.auth
// });

export default UnauthApp;

