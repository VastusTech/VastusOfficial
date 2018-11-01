import React, { Component } from 'react';
import Amplify, { Auth, Analytics } from 'aws-amplify';
import { inspect } from 'util';
import Semantic, { Input, Grid, Form, Header, Button, Image, Segment, Message, Modal } from 'semantic-ui-react';
import SignUpModal from './SignUpModal';
import ForgotPasswordModal from "./ForgotPasswordModal";
import BlakePicture from '../screens/BlakeProfilePic.jpg';

class SignInPage extends Component {
    // This is the function that is called when the sign up button is pressed

    // This defines the passed function for use
    authenticate = (user) => {};

    constructor(props) {
        super(props);
        this.authenticate = this.props.authenticate.bind(this);
    }

    authState = {
        username: "",
        password: "",
    };

    state = {
        user: {},
        isLoading: true
    };

    // TODO Retrieve info from da fields
    vastusSignIn() {
        // TODO Check to see if the input fields are put  in correctly
        console.log("Starting Auth.signin!");
        Auth.signIn(this.authState.username, this.authState.password).then((data) => {
            console.log("Successfully signed in!");
            this.authenticate(data);
        }).catch(function (error) {
            console.log("There was an error!");
            alert(error);
        });
        console.log("We got past the sign in call!");
    }

    changeStateText(key, value) {
        // TODO Sanitize this input
        // TODO Check to see if this will, in fact, work.!
        inspect(value);
        this.authState[key] = value.target.value;
        console.log("New " + key + " is equal to " + value.target.value);
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
        // The login page
        return (
            <div className='login-form'>
                {/*
      Heads up! The styles below are necessary for the correct render of this example.
      You can do same with CSS, the main idea is that all the elements up to the `Grid`
      below must have a height of 100%.
    */}

                <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' color='teal' textAlign='center'>
                            <Image src={BlakePicture} /> Log-in to your account
                        </Header>
                        <Form size='large'>
                            <Segment stacked>
                                <Form.Input fluid icon='user' iconPosition='left' placeholder='Username' onChange={value => this.changeStateText("username", value)}/>
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Password'
                                    type='password'
                                    onChange={value => this.changeStateText("password", value)}
                                />
                                <Button color='teal' fluid size='large' onClick={this.vastusSignIn.bind(this)}>
                                    Login
                                </Button>
                            </Segment>
                        </Form>
                        <Message>
                            <Grid style={{ height: '25%'}}>
                                <Grid.Column width={8} style={{ paddingRight: '10px'}}>
                                    <SignUpModal authenticate={this.authenticate.bind(this)}/>
                                </Grid.Column>
                                <Grid.Column width={8} style={{ paddingLeft: '10px'}}>
                                    <ForgotPasswordModal authenticate={this.authenticate.bind(this)}/>
                                </Grid.Column>
                            </Grid>
                        </Message>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}
// {/*<div>*/}
//     {/*<button className="ui button" onClick = {this.vastusSignUp.bind(this)} > Sign Up </button>*/}
//     {/*<button className="ui button" onClick = {this.vastusSignIn.bind(this)} > Sign In </button>*/}
// {/*</div>*/}

const mapStateToProps = state => ({
    auth: state.auth
});

export default SignInPage;
