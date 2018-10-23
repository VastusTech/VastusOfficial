import React, { Component } from 'react';
import './App.css';
// import Tabs from './screens/tabs.js';
import Amplify, { Auth, Analytics } from 'aws-amplify';
// import { Authenticator, SignIn, SignUp, ConfirmSignUp, Greetings, Connect, withAuthenticator } from 'aws-amplify-react';
// import aws_exports from './aws-exports';
// import SearchBarProp from "./screens/searchBar";

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

    // TODO Retrieve info from da fields
    vastusSignIn() {
        console.log("Starting Auth.signin!");
        Auth.signIn("KB", "Comedian1985!").then(function (data) {
            console.log("Successfully signed in!");
        }.catch(function (error) {
            console.log("There was an error!");
            alert(error);
        }));
        console.log("We got past the sign in call!");
    }

    // TODO Retrieve information from the fields
    vastusSignUp(username, password, name, gender, birthday, email) {
        console.log("Starting Auth.signup!");
        // The guy before you told us to try to do a JS promise (but it didn't help)
        const attributes = {
            name: name,
            gender: gender,
            birthdate: birthday,
            email: email,
        };
        const params = {
            username: username,
            password: password,
            attributes: attributes,
            validationData: []
        };
        Auth.signUp(params).then(function(data) {
            console.log("Successfully signed up!");
            console.log(data);
        }).catch(function(err) {
            console.log("Sign up has failed :(");
            console.log(err);
        });
        console.log("We got past the sign up call");
    }

    vastusSignOut() {
        Auth.signOut().then(function(data) {
            console.log("Successfully signed out!");
            console.log(data);
        }).catch(function(error) {
            console.log("Sign out has failed :(");
            console.log(error);
        });
    }

    // TODO Make dependent on user
    vastusConfirmSignUp(username, code) {
        Auth.confirmSignUp(username, code).then(function (data) {
            console.log("Successfully confirmed the sign up");
            console.log(data);
        }).catch(function(error) {
            console.log("Confirm sign up has failed :(");
            console.log(error);
        });
    }

    vastusForgotPassword(username) {
        Auth.forgotPassword(username).then(function(data) {
            console.log("Successfully forgot the password! :)");
            console.log(data);
        }).catch(function(error) {
            console.log("Failed to forget the password (just like how I failed to forget the day my dad left me)");
            console.log(error);
        });
    }

    vastusForgetPasswordSubmit(username, code, newPassword) {
        Auth.forgotPasswordSubmit("KB", code, newPassword).then(function(data) {
            console.log("Successfully made a new password");
            console.log(data);
        }).catch(function(error) {
            console.log("Failed to make a new password :(");
            console.log(error);
        });
    }

    render() {
        return (
            <div>
                <div className="field">
                    <label>Username</label>
                    <input type="text" name="username" placeholder="Username"/>
                </div>
                <div className="field">
                    <label>Email</label>
                    <input type="text" name="email" placeholder="Email"/>
                </div>
                <div className="field">
                    <label>Gender</label>
                    <input type="text" name="gender" placeholder="Gender"/>
                </div>
                <div className="field">
                    <label>Birthdate</label>
                    <input type="text" name="birthdate" placeholder="MM/DD/YYYY"/>
                </div>
                <button className="ui button" onClick = {this.vastusSignUp.bind(this)} > Sign Up </button>
                <button className="ui button" onClick = {this.vastusSignIn.bind(this)} > Sign In </button>
            </div>
        );
    }
}

export default App;

