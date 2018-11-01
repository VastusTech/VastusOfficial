import React, { Component } from 'react';
import { connect } from 'react-redux';
import Amplify, { Auth, Analytics } from 'aws-amplify';
import { inspect } from 'util';
import SignInPage from './AuthScreens/SignInPage';

class UnauthApp extends Component {
    // This defines the passed function for use
    authenticate = (user) => {};

    constructor(props) {
        super(props);
        this.authenticate = this.props.authenticate.bind(this);
    }

    async componentDidMount() {
        // StatusBar.setHidden(true);
        try {
            //alert(JSON.stringify(this.props));
            const user = await Auth.currentAuthenticatedUser();
            this.setState({ user, isLoading: false })
        } catch (err) {
            this.setState({ isLoading: false })
        }
    }

    async componentWillReceiveProps(nextProps) {
        //try {
            //alert(JSON.stringify(nextProps));
            //alert(JSON.stringify(this.props));
            //const user = await Auth.currentAuthenticatedUser();
            //this.setState({ user })
        // } catch (err) {
        //     this.setState({ user: {} })
        // }
    }

    render() {
        // Maybe this would be to have a sort of advertisement for our website?
        // Always starts at the sign in page
        // Would states be used here?
        return (
            <SignInPage authenticate={this.authenticate.bind(this)}/>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default UnauthApp;

// authState = {
//     username: "",
//     password: "",
//     confirmPassword: "",
//     name: "",
//     gender: "",
//     birthday: "",
//     email: ""
// };
//
// state = {
//     user: {},
//     isLoading: true
// }

// <Form.Input fluid icon='user' iconPosition='left' placeholder='Username' onChange={value => this.changeStateText("username", value)}/>
// <Button color='green' onClick={this.vastusSignUp.bind(this)}>Create</Button>
// // TODO Retrieve info from da fields
// vastusSignIn() {
//     // TODO Check to see if the input fields are put  in correctly
//     console.log("Starting Auth.signin!");
//     Auth.signIn(this.authState.username, this.authState.password).then(function (data) {
//         console.log("Successfully signed in!");
//         this.props.authenticate()
//         alert(JSON.stringify(data));
//     }).catch(function (error) {
//         console.log("There was an error!");
//         alert(error);
//     });
//     console.log("We got past the sign in call!");
// }
//
// // TODO Retrieve information from the fields
// vastusSignUp() {
//     // TODO Check to see if the input fields are put  in correctly
//     // TODO Check to see that password is with confirm password correctly
//     console.log("Starting Auth.signup!");
//     // The guy before you told us to try to do a JS promise (but it didn't help)
//     const attributes = {
//         name: this.authState.name,
//         gender: this.authState.gender,
//         birthdate: this.authState.birthday,
//         email: this.authState.email,
//     };
//     const params = {
//         username: this.authState.username,
//         password: this.authState.password,
//         attributes: attributes,
//         validationData: []
//     };
//     Auth.signUp(params).then(function(data) {
//         console.log("Successfully signed up!");
//         console.log(data);
//     }).catch(function(err) {
//         console.log("Sign up has failed :(");
//         console.log(err);
//     });
//     console.log("We got past the sign up call");
// }
//
// vastusSignOut() {
//     Auth.signOut().then(function(data) {
//         console.log("Successfully signed out!");
//         console.log(data);
//     }).catch(function(error) {
//         console.log("Sign out has failed :(");
//         console.log(error);
//     });
// }
//
// // TODO Make dependent on user
// vastusConfirmSignUp(code) {
//     // TODO Check to see if the input fields are put  in correctly
//     Auth.confirmSignUp(this.authState.username, code).then(function (data) {
//         console.log("Successfully confirmed the sign up");
//         console.log(data);
//     }).catch(function(error) {
//         console.log("Confirm sign up has failed :(");
//         console.log(error);
//     });
// }
//
// vastusForgotPassword() {
//     // TODO Check to see if the input fields are put  in correctly
//     Auth.forgotPassword(this.authState.username).then(function(data) {
//         console.log("Successfully forgot the password! :)");
//         console.log(data);
//     }).catch(function(error) {
//         console.log("Failed to forget the password (just like how I failed to forget the day my dad left me)");
//         console.log(error);
//     });
// }
//
// vastusForgetPasswordSubmit(code, newPassword) {
//     // TODO Check to see if the input fields are put  in correctly
//     Auth.forgotPasswordSubmit(this.authState.username, code, newPassword).then(function(data) {
//         console.log("Successfully made a new password");
//         console.log(data);
//     }).catch(function(error) {
//         console.log("Failed to make a new password :(");
//         console.log(error);
//     });
// }
//
// changeStateText(key, value) {
//     // TODO Sanitize this input
//     // TODO Check to see if this will, in fact, work.!
//     inspect(value);
//     this.authState[key] = value.target.value;
//     console.log("New " + key + " is equal to " + value.target.value);
// }