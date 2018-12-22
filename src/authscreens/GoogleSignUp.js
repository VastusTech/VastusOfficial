import { Auth } from 'aws-amplify';
import React, { Component } from 'react';
import Semantic, { Button, List } from 'semantic-ui-react';
// To federated sign in from Google



class GoogleSignUp extends React.Component {
   
   
   

    render() {
        return (
        <div>
            <List.Item class="g-signin2" data-onsuccess="onSignIn"></List.Item>
            <List.Item href="#" onclick="signOut();">Sign out</List.Item>
        </div>
        );
    }
}
export default GoogleSignUp;
