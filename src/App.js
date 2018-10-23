import React, { Component } from 'react';
import './App.css';
// import Tabs from './screens/tabs.js';
import Amplify, { Auth, Analytics } from 'aws-amplify';
import { inspect } from 'util'
import Semantic, { Input } from 'semantic-ui-react';
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
    authState = {
        username: "",
        password: "",
        confirmPassword: "",
        name: "",
        gender: "",
        birthday: "",
        email: ""
    };

    // TODO Retrieve info from da fields
    vastusSignIn() {
        // TODO Check to see if the input fields are put  in correctly
        console.log("Starting Auth.signin!");
        Auth.signIn(this.authState.username, this.authState.password).then(function (data) {
            console.log("Successfully signed in!");
        }.catch(function (error) {
            console.log("There was an error!");
            alert(error);
        }));
        console.log("We got past the sign in call!");
    }

    // TODO Retrieve information from the fields
    vastusSignUp() {
        // TODO Check to see if the input fields are put  in correctly
        // TODO Check to see that password is with confirm password correctly
        console.log("Starting Auth.signup!");
        // The guy before you told us to try to do a JS promise (but it didn't help)
        const attributes = {
            name: this.authState.name,
            gender: this.authState.gender,
            birthdate: this.authState.birthday,
            email: this.authState.email,
        };
        const params = {
            username: this.authState.username,
            password: this.authState.password,
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
    vastusConfirmSignUp(code) {
        // TODO Check to see if the input fields are put  in correctly
        Auth.confirmSignUp(this.authState.username, code).then(function (data) {
            console.log("Successfully confirmed the sign up");
            console.log(data);
        }).catch(function(error) {
            console.log("Confirm sign up has failed :(");
            console.log(error);
        });
    }

    vastusForgotPassword() {
        // TODO Check to see if the input fields are put  in correctly
        Auth.forgotPassword(this.authState.username).then(function(data) {
            console.log("Successfully forgot the password! :)");
            console.log(data);
        }).catch(function(error) {
            console.log("Failed to forget the password (just like how I failed to forget the day my dad left me)");
            console.log(error);
        });
    }

    vastusForgetPasswordSubmit(code, newPassword) {
        // TODO Check to see if the input fields are put  in correctly
        Auth.forgotPasswordSubmit(this.authState.username, code, newPassword).then(function(data) {
            console.log("Successfully made a new password");
            console.log(data);
        }).catch(function(error) {
            console.log("Failed to make a new password :(");
            console.log(error);
        });
    }

    changeStateText(key, value) {
        // TODO Sanitize this input
        // TODO Check to see if this will, in fact, work.!
        this.authState[key] = value.target.value;
        console.log("New " + key + " is equal to " + value.target.value);
    }

    // changeBirthdayText(value) {
    //     // TODO Sanitize this input
    //     const valueString = value.target.value;
    //     this.authState.birthday = valueString;
    //     console.log("New birthday is " + valueString);
    //     // console.log("value JSON = " + inspect(value.target.value));
    // }

    render() {
        return (
            <div>
                <div className="field">
                    <label>Username</label>
                    <Input type="text" name="username" placeholder="Username" onChange={value => this.changeStateText("username", value)}/>
                </div>
                <div className="field">
                    <label>Password</label>
                    <Input type="text" name="password" placeholder="Password" onChange={value => this.changeStateText("password", value)}/>
                </div>
                <div className="field">
                    <label>Confirm Password</label>
                    <Input type="text" name="confirmPassword" placeholder="Confirm Password" onChange={value => this.changeStateText("confirmPassword", value)}/>
                </div>
                <div className="field">
                    <label>Name</label>
                    <Input type="text" name="name" placeholder="Name" onChange={value => this.changeStateText("name", value)}/>
                </div>
                <div className="field">
                    <label>Gender</label>
                    <Input type="text" name="gender" placeholder="Gender" onChange={value => this.changeStateText("gender", value)}/>
                </div>
                <div className="field">
                    <label>Birthdate</label>
                    <Input type="text" name="birthdate" placeholder="YYYY-MM-DD" onChange={value => this.changeStateText("birthday", value)}/>
                </div>
                <div className="field">
                    <label>Email</label>
                    <Input type="text" name="email" placeholder="Email" onChange={value => this.changeStateText("email", value)}/>
                </div>
                <button className="ui button" onClick = {this.vastusSignUp.bind(this)} > Sign Up </button>
                <button className="ui button" onClick = {this.vastusSignIn.bind(this)} > Sign In </button>
            </div>
        );
    }
}

export default App;
