import React, { useState } from 'react';
import { Modal, Button, Form, Message, Dimmer, Loader, Popup, Divider } from 'semantic-ui-react';
// import Amplify, { Auth } from 'aws-amplify';
// import Lambda from '../Lambda';
// import appConfig from '../AppConfig';
import {closeSignUpModal, confirmSignUp, openSignUpModal, signUp} from "../vastuscomponents/redux/actions/authActions";
import { connect } from "react-redux";
import {clearError, setError} from "../vastuscomponents/redux/actions/infoActions";
import {err} from "../Constants";

const setStateText = (key, value, setStates) => {
    const setState = setStates[key];
    if (setState) {
        setState(value);
    }
    else {
        err&&console.error("Setting non-handled set state case: " + key);
    }
};

const handleCreateButton = (username, password, confirmPassword, name, email, enterpriseID, setError, signUp) => {
    // console.log("Setting state with isConfirming is true");
    // TODO Do extra checking for the specifications of the account!
    if (fieldsAreFilledCorrectly(username, password, confirmPassword, name, email, setError)) {
        signUp(username, password, name, email, enterpriseID);
    }
};

const handleConfirmButton = (username, confirmationCode, confirmSignUp, setError) => {
    // TODO Is there a chance that the username could be lost here?
    if (confirmationCode) {
        confirmSignUp(username, confirmationCode);
    }
    else {
        setError(new Error("Confirmation code cannot be empty"));
    }
};

const handleCancelButton = (clearError, closeSignUpModal) => {
    // TODO Have a confirmation like are you sure ya wanna close?
    clearError();
    closeSignUpModal();
};

const fieldsAreFilledCorrectly = (username, password, confirmPassword, name, email, setError) => {
    // console.log("Setting state with isConfirming is true");
    // TODO Do extra checking for the specifications of the account!
    if (username && password && confirmPassword && name && email) {
        if (password !== confirmPassword) {
            setError(new Error("Password and confirm password do not match!"));
        }
        else if (!email.includes("@") || !email.includes(".")) {
            setError(new Error("Email needs to be properly formed!"));
        }
        else if (username.includes(" ")) {
            setError(new Error("Username cannot contain spaces!"));
        }
        // Password checking: minLength = 8, needs a number, a lowercase letter, and an uppercase letter
        else if (!properlyFormedPassword(password)) {
            setError(new Error("Password must be longer than 8 characters, must need a number, a lower case letter, and an upper case letter"));
        }
        else {
            return true;
        }
    }
    else {
        setError(new Error("All fields need to be filled in!"));
    }
    return false;
};

const properlyFormedPassword = (password) => {
    return (password.length > 8 && /\d/.test(password) && (password.toUpperCase() !== password) && (password.toLowerCase() !== password));
};

const errorMessage = (error) => {
    if (error && error.message) {
        return (
            <Modal.Description>
                <Message color='red'>
                    <h1>Error!</h1>
                    <p>{error.message}</p>
                </Message>
            </Modal.Description>
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

const SignUpModal = (props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    // const [gender, setGender] = useState("");
    // const [birthday, setBirthday] = useState("");
    const [email, setEmail] = useState("");
    const [confirmationCode, setConfirmationCode] = useState("");
    const [enterpriseID, setEnterpriseID] = useState("");
    const setStates = {
        username: setUsername,
        password: setPassword,
        confirmPassword: setConfirmPassword,
        name: setName,
        // gender: setGender,
        // birthday: setBirthday,
        email: setEmail,
        confirmationCode: setConfirmationCode,
        enterpriseID: setEnterpriseID
    };

    if (props.auth.confirmingSignUp) {
        return(
            <div>
                <Modal open={props.auth.signUpModalOpen} onClose={() => (false)} trigger={<Button fluid color='red' onClick={() => props.openSignUpModal()} inverted> Sign Up </Button>} size='tiny'>
                    {loadingProp(props.info.isLoading)}
                    <Modal.Header>Check your email to confirm the sign up!</Modal.Header>
                    {errorMessage(props.info.error)}
                    <Modal.Actions>
                        <div>
                            <Form>
                                <label>Confirm Username!</label>
                                <Form.Input type="text" name="username" placeholder=" Username " onChange={value => this.changeStateText("username", value)}/>
                                <label>Confirmation Code</label>
                                <Form.Input type="text" name="confirmationCode" placeholder=" XXXXXX " onChange={value => this.changeStateText("confirmationCode", value)}/>
                            </Form>
                        </div>
                        <div>
                            <Button onClick={() => handleConfirmButton(username, confirmationCode, props.confirmSignUp, props.setError)} color='blue'>Confirm Your Account</Button>
                        </div>
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
    return(
        <Modal open={props.auth.signUpModalOpen} trigger={<Button size="large" fluid inverted onClick={() => props.openSignUpModal()}> Sign Up </Button>} size='tiny'>
            {loadingProp(props.info.isLoading)}
            <Modal.Header>Create Account to Join</Modal.Header>
            {errorMessage(props.info.error)}
            <Modal.Actions style={{borderTop: 'none'}}>
                <Form>
                    <Form.Input type="text" iconPosition='left' icon='user' name="username" placeholder="Username" onChange={value => setStateText("username", value, setStates)}/>
                    <Popup position="left center" trigger={<Form.Input iconPosition='left' icon='lock' type="password" name="password" placeholder="Password" onChange={value => setStateText("password", value, setStates)}/>}>
                        Password must be at least 8 characters long, contains lower and upper case letters, contain at least one number.
                    </Popup>
                    {/* <Form.Input type="password" label="Password" name="password" placeholder="Password" onChange={value => this.changeStateText("password", value)}/> */}
                    <Form.Input type="password" iconPosition='left' icon='lock' name="confirmPassword" placeholder="Confirm Password" onChange={value => setStateText("confirmPassword", value, setStates)}/>
                    <Divider />
                    <Popup position="left center" trigger={<Form.Input type="text" iconPosition='left' icon='user circle' name="name" placeholder="Screen Name" onChange={value => setStateText("name", value, setStates)}/>}>
                        This will be what your friends will see your name as.
                    </Popup>
                    {/*<Form.Input type="text" iconPosition='left' icon='male' name="gender" placeholder="Gender" onChange={value => this.changeStateText("gender", value)}/>*/}
                    {/*<Divider />*/}
                    {/*<Form.Input type="date" iconPosition='left' icon='calendar alternate outline' name="birthdate" onChange={value => this.changeStateText("birthday", value)}/>*/}
                    <Form.Input type="text" iconPosition='left' icon='mail' name="email" placeholder="Email" onChange={value => setStateText("email", value, setStates)}/>
                    <Divider />
                    <Popup position="left center" trigger={<Form.Input type="text" iconPosition='left' icon='id card' name='enterprise code' placeHolder="Company ID" onChange={value => setStateText("enterpriseID", value, setStates)}/>}>
                        If you are signing up with your company, input the given ID here.
                    </Popup>
                    <div className="u-flex u-flex-justify--space-between u-padding-y--2 u-margin-top--2">
                        <Button negative onClick={() => handleCancelButton(props.clearError, props.closeSignUpModal)}>Cancel</Button>
                        <Button positive color='green' onClick={() => handleCreateButton(username, password, confirmPassword, name, email, enterpriseID, props.setError, props.signUp)}>Create</Button>
                    </div>
                </Form>
            </Modal.Actions>
        </Modal>
    );
};

const mapStateToProps = state => ({
    auth: state.auth,
    info: state.info
});

const mapDispatchToProps = (dispatch) => {
    return {
        signUp: (username, password, name, gender, birthday, email) => {
            dispatch(signUp(username, password, name, gender, birthday, email));
        },
        confirmSignUp: (username, confirmationCode) => {
            dispatch(confirmSignUp(username, confirmationCode));
        },
        setError: (error) => {
            dispatch(setError(error));
        },
        clearError: () => {
            dispatch(clearError());
        },
        openSignUpModal: () => {
            dispatch(openSignUpModal());
        },
        closeSignUpModal: () => {
            dispatch(closeSignUpModal());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpModal);
