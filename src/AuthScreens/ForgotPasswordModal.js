import React, { Component } from 'react';
import Semantic, { Modal, Button, Input, Image, Grid, Form, Message } from 'semantic-ui-react';
import Amplify, { Auth } from 'aws-amplify';

class ForgotPasswordModal extends Component {
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
        // inspect(value);
        this.authState[key] = value.target.value;
        console.log("New " + key + " is equal to " + value.target.value);
    }
    render() {
        return(
            <Modal trigger={<Button>Forgot Password?</Button>}size='tiny'>
                <Modal.Header>Delete Your Account</Modal.Header>
                <Modal.Content>
                    <p>Are you sure you want to delete your account</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative>No</Button>
                    <Button positive icon='checkmark' labelPosition='right' content='Yes' />
                </Modal.Actions>
            </Modal>
        );
    }
}

export default ForgotPasswordModal;
