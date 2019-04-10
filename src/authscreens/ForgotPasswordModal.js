import React, { useState } from 'react';
import { Modal, Button, Form, Message, Dimmer } from 'semantic-ui-react';
import {
    closeForgotPasswordModal,
    confirmForgotPassword,
    forgotPassword, openForgotPasswordModal,
} from "../redux_helpers/actions/authActions";
import { connect } from "react-redux";
import {setError} from "../vastuscomponents/redux_actions/infoActions";
import Spinner from "../vastuscomponents/components/props/Spinner";

const changeStateText = (key, value, setStates) => {
    // TODO Sanitize this input?
    // inspect(value);
    setStates[key](value.target.value);
};

const handleSubmitButton = (username, forgotPassword) => {
    forgotPassword(username);
};

const handleConfirmButton = (username, confirmationCode, newPassword, confirmNewPassword, setError, confirmForgotPassword) => {
    if (newPassword !== confirmNewPassword) {
        console.log("Failed to make a new password :(");
        console.log("Passwords did not match");
        setError(new Error("Password and confirm password do not match!"));
    }
    else if (!(username && confirmationCode && newPassword && confirmNewPassword)) {
        setError(new Error("All fields need to be filled in!"));
    }
    else {
        confirmForgotPassword(username, confirmationCode, newPassword);
    }
};

const handleCancelButton = (closeForgotPasswordModal) => {
    // TODO Have a are you sure? thing attached to this
    // this.setState({error: null, isConfirming: false});
    closeForgotPasswordModal();
};

function errorMessage(error) {
    if (error) {
        return (
            <Modal.Description>
                <Message color='red'>
                    <h1>Error!</h1>
                    <p>{JSON.stringify(error)}</p>
                </Message>
            </Modal.Description>
        );
    }
}
function loadingProp(isLoading) {
    if (isLoading) {
        return (
            <Dimmer active>
                <Spinner/>
            </Dimmer>
        );
    }
    return null;
}

const ForgotPasswordModal = (props) => {
    const [username, setUsername] = useState("");
    const [confirmationCode, setConfirmationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    // Make an object to set the state dynamically
    const setStates = {
        username: setUsername,
        confirmationCode: setConfirmationCode,
        newPassword: setNewPassword,
        confirmNewPassword: setConfirmNewPassword
    };

    if (props.auth.confirmingForgotPassword) {
        return(
            <Modal open={props.auth.forgotPasswordModalOpen} onClose={() => (false)} trigger={<Button onClick={() => props.openForgotPasswordModal()}>Forgot Password?</Button>} size='tiny'>
                {loadingProp(props.info.isLoading)}
                <Modal.Header>Confirm your email and choose your new password!</Modal.Header>
                {errorMessage(props.info.error)}
                <Modal.Content>
                    <p>Enter your username to retrieve your information</p>
                </Modal.Content>
                <Modal.Actions style={{borderTop: 'none'}}>
                    <Form>
                        <Form.Input type="text" label="Confirmation Code from your Email" name="confirmationCode" placeholder="XXXXXX" onChange={value => changeStateText("confirmationCode", value, setStates)}/>
                        <Form.Input type="password" label="New Password" name="newPassword" placeholder="new password" onChange={value => changeStateText("newPassword", value, setStates)}/>
                        <Form.Input type="password" name="confirmNewPassword" placeholder="confirm new password" onChange={value => changeStateText("confirmNewPassword", value, setStates)}/>
                        <div className="u-flex u-flex-justify--space-between u-padding-y--2 u-margin-top--2">
                            <Button negative onClick={() => handleCancelButton(props.closeForgotPasswordModal)}>Cancel</Button>
                            <Button positive color='green' onClick={() => handleConfirmButton(username, confirmationCode, newPassword, confirmNewPassword, props.setError, props.confirmForgotPassword)}>Confirm</Button>
                        </div>
                    </Form>
                </Modal.Actions>
            </Modal>
        );
    }
    return(
        <Modal open={props.auth.forgotPasswordModalOpen} onClose={() => (false)} trigger={<Button size="large" fluid inverted onClick={() => props.openForgotPasswordModal()}>Forgot Password?</Button>} size='tiny'>
            {loadingProp(props.info.isLoading)}
            <Modal.Header style={{borderBottom: 'none'}}>Forgot Password?</Modal.Header>
            {errorMessage(props.info.error)}
            <Modal.Content>
                <p>Enter your username to retrieve your information</p>
            </Modal.Content>
            <Modal.Actions style={{borderTop: 'none'}}>
                <Form>
                    <Form.Input type="text" name="username" placeholder="username" onChange={value => changeStateText("username", value, setStates)}/>
                    <div className="u-flex u-flex-justify--space-between u-padding-y--2 u-margin-top--2">
                        <Button negative onClick={() => handleCancelButton(props.closeForgotPasswordModal)}>Cancel</Button>
                        <Button positive color='green' onClick={() => handleSubmitButton(username, props.forgotPassword)}>Submit</Button>
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
        forgotPassword: (username) => {
            dispatch(forgotPassword(username));
        },
        confirmForgotPassword: (username, confirmationCode, newPassword) => {
            dispatch(confirmForgotPassword(username, confirmationCode, newPassword));
        },
        setError: (error) => {
            dispatch(setError(error));
        },
        openForgotPasswordModal: () => {
            dispatch(openForgotPasswordModal());
        },
        closeForgotPasswordModal: () => {
            dispatch(closeForgotPasswordModal());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordModal);
