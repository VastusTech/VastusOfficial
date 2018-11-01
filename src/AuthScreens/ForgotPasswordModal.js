import React, { Component } from 'react';
import Semantic, { Modal, Button, Input, Image, Grid, Form, Message } from 'semantic-ui-react';
import Amplify, { Auth } from 'aws-amplify';

class ForgotPasswordModal extends Component {
    authState = {
        username: "",
        confirmationCode: "",
        newPassword: "",
        confirmNewPassword: ""
    };

    state = {
        isConfirming: false,
        error: null
    };

    vastusForgotPassword(successHandler, failureHandler) {
        // TODO Check to see if the input fields are put in correctly
        Auth.forgotPassword(this.authState.username).then((data) => {
            console.log("Successfully forgot the password! :)");
            console.log(data);
            successHandler(data);
        }).catch((error) => {
            console.log("Failed to forget the password (just like how I failed to forget the day my dad left me)");
            if (error.message) {
                error = error.message
            }
            console.log(error);
            failureHandler(error);
        });
    }

    vastusForgetPasswordSubmit(successHandler, failureHandler) {
        // TODO Check to see if the input fields are put  in correctly
        if (this.authState.newPassword !== this.authState.confirmNewPassword) {
            console.log("Failed to make a new password :(");
            console.log("Passwords did not match");
            failureHandler("The Passwords do not match");
        }
        Auth.forgotPasswordSubmit(this.authState.username, this.authState.confirmationCode, this.authState.newPassword).then(function(data) {
            console.log("Successfully made a new password");
            console.log(data);
            successHandler(data);
        }).catch(function(error) {
            console.log("Failed to make a new password :(");
            if (error.message) {
                error = error.message
            }
            console.log(error);
            failureHandler(error);
        });
    }

    changeStateText(key, value) {
        // TODO Sanitize this input
        // TODO Check to see if this will, in fact, work.!
        // inspect(value);
        this.authState[key] = value.target.value;
        console.log("New " + key + " is equal to " + value.target.value);
    }

    handleSubmitButton() {
        this.vastusForgotPassword((user) => {
            this.setState({isConfirming: true, error: null});
        }, (error) => {
            this.setState({error: error});
        });
    }

    handleConfirmButton() {
        this.vastusForgetPasswordSubmit((user) => {
            this.setState({isConfirming: false, error: null})
        }, (error) => {
            this.setState({error: error});
        });
    }

    handleCancelButton() {
        // TODO Have a are you sure? thing attached to this
        this.setState({error: null, isConfirming: false});
        this.props.onClose();
    }

    render() {
        function errorMessage(error) {
            if (error) {
                return (
                    <Modal.Description>
                        <Message color='red'>
                            <h1>Error!</h1>
                            <p>{error}</p>
                        </Message>
                    </Modal.Description>
                );
            }
        }

        if (this.state.isConfirming) {
            return(
                <Modal open={this.props.open} onClose={() => (false)} trigger={<Button onClick={this.props.onOpen.bind(this)}>Forgot Password?</Button>}size='tiny'>
                    <Modal.Header>Confirm your email and choose your new password!</Modal.Header>
                    {errorMessage(this.state.error)}
                    <Modal.Content>
                        <p>Enter your username to retrieve your information</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Form>
                            <div className="field">
                                <label>Confirmation Code from your Email</label>
                                <Form.Input type="text" name="confirmationCode" placeholder="XXXXXX" onChange={value => this.changeStateText("confirmationCode", value)}/>
                            </div>
                            <div className="field">
                                <label>New Password</label>
                                <Form.Input type="password" name="newPassword" placeholder="new password" onChange={value => this.changeStateText("newPassword", value)}/>
                            </div>
                            <div className="field">
                                <label>Confirm New Password</label>
                                <Form.Input type="password" name="confirmNewPassword" placeholder="confirm new password" onChange={value => this.changeStateText("confirmNewPassword", value)}/>
                            </div>
                            <Grid relaxed columns={4}>
                                <Grid.Column>
                                    <Button negative onClick={this.handleCancelButton.bind(this)}>Cancel</Button>
                                </Grid.Column>
                                <Grid.Column/>
                                <Grid.Column/>
                                <Grid.Column>
                                    <Button positive color='green' onClick={this.handleConfirmButton.bind(this)}>Confirm</Button>
                                </Grid.Column>
                            </Grid>
                        </Form>
                    </Modal.Actions>
                </Modal>
            );
        }
        return(
            <Modal open={this.props.open} onClose={() => (false)} trigger={<Button onClick={this.props.onOpen.bind(this)}>Forgot Password?</Button>}size='tiny'>
                <Modal.Header>Forgot Password?</Modal.Header>
                {errorMessage(this.state.error)}
                <Modal.Content>
                    <p>Enter your username to retrieve your information</p>
                </Modal.Content>
                <Modal.Actions>
                    <Form>
                        <div className="field">
                            <label>Username</label>
                            <Form.Input type="text" name="username" placeholder="username" onChange={value => this.changeStateText("username", value)}/>
                        </div>
                        <Grid relaxed columns={4}>
                            <Grid.Column>
                                <Button negative onClick={this.handleCancelButton.bind(this)}>Cancel</Button>
                            </Grid.Column>
                            <Grid.Column/>
                            <Grid.Column/>
                            <Grid.Column>
                                <Button positive color='green' onClick={this.handleSubmitButton.bind(this)}>Submit</Button>
                            </Grid.Column>
                        </Grid>
                    </Form>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default ForgotPasswordModal;
