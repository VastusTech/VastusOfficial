import React, { useState } from 'react';
import { Input, Grid, Form, Header, Button, Image, Segment, Message, Modal, Dimmer, Loader, Divider, List, Container } from 'semantic-ui-react';
import { connect } from "react-redux";
import SignUpModal from './SignUpModal';
import ForgotPasswordModal from "./ForgotPasswordModal";
import Logo from '../vastuscomponents/img/vt_new.svg';
import {logIn, openForgotPasswordModal, openSignUpModal} from "../vastuscomponents/redux/actions/authActions";
import {setError} from "../vastuscomponents/redux/actions/infoActions";
import GoogleSignUp from "./GoogleSignUp";

const changeStateText = (key, value, setStates) => {
    // inspect(value);
    setStates[key](value.target.value);
};

const vastusSignIn = (username, password, logIn, setError) => {
    // TODO Check to see if the input fields are put in correctly
    if (username && password) {
        logIn(username, password);
    }
    else {
        setError(new Error("Username and password must be filled!"));
    }
};

const errorMessage = (error) => {
    if (error) {
        return (
            <Message color='red'>
                <h1>Error!</h1>
                <p>{error.message}</p>
            </Message>
        );
    }
};

const loadingProp = (isLoading) => {
    if (isLoading) {
        return (
            <Dimmer active>
                <Loader/>
            </Dimmer>
        );
    }
    return null;
};

const SignInPage = (props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const setStates = {
        username: setUsername,
        password: setPassword
    };

    return (
        <Container className='login-form'>
            {loadingProp(props.info.isLoading)}
            {errorMessage(props.info.error)}
            <Grid centered textAlign='center'>
                <Segment raised padded inverted style={{minWidth: 340, maxWidth: 570, marginBottom: '-60px'}}>
                    <Segment basic>
                        <Image src={Logo} size="tiny" centered />
                        <Header as='h2' inverted textAlign='center'>
                            Join Below
                        </Header>
                    </Segment>
                    <Form size='large'>
                        <Form.Input fluid icon='user' iconPosition='left' placeholder='Username' onChange={value => changeStateText("username", value, setStates)}/>
                        <Form.Input
                            fluid
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password'
                            type='password'
                            onChange={value => changeStateText("password", value, setStates)}
                        />
                        <Button primary fluid size='large' onClick={() => vastusSignIn(username, password, props.logIn, props.setError)}>
                            Log in
                        </Button>
                    </Form>
                    <Divider horizontal inverted>or</Divider>
                    <List>
                    <List.Item>
                        <SignUpModal/>
                    </List.Item>
                    <List.Item>
                        <ForgotPasswordModal/>
                        </List.Item>
                        <GoogleSignUp/>
                    </List>
                </Segment>
            </Grid>
        </Container>
    );
};

const mapStateToProps = state => ({
    auth: state.auth,
    info: state.info
});

const mapDispatchToProps = (dispatch) => {
    return {
        logIn: (username, password) => {
            dispatch(logIn(username, password));
        },
        setError: (error) => {
            dispatch(setError(error));
        },
        openSignUpModal: () => {
            dispatch(openSignUpModal());
        },
        openForgotPasswordModal: () => {
            dispatch(openForgotPasswordModal());
        }
    }
};
//

export default connect(mapStateToProps, mapDispatchToProps)(SignInPage);
