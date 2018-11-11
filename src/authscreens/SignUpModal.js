import React, { Component } from 'react';
import Semantic, { Modal, Button, Input, Image, Grid, Form, Message, Dimmer, Loader } from 'semantic-ui-react';
import Amplify, { Auth } from 'aws-amplify';
import Lambda from '../Lambda';
import appConfig from '../AppConfig';

// appConfig();

class SignUpModal extends Component {
    constructor(props) {
        super(props);
        this.authenticate = this.props.authenticate.bind(this);
    }

    state = {
        error: null,
        isLoading: false,
        isConfirming: false
    };

    authState = {
        username: "",
        password: "",
        confirmPassword: "",
        name: "",
        gender: "",
        birthday: "",
        email: "",
        confirmationCode: "",
    };

    async vastusSignUp(successHandler, failureHandler) {
        // TODO Check to see if the input fields are put  in correctly
        console.log("Starting Auth.signup!");
        if (this.authState.password !== this.authState.confirmPassword) {
            console.log("Sign up failed");
            failureHandler("Password and confirm password do not match");
            return;
        }

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

        this.setState({isLoading: true});
        Lambda.createClient("admin", attributes.name, attributes.gender, attributes.birthdate, attributes.email, params.username,
            (data) => {
                if (data.errorMessage) {
                    // Send response with no confirmation
                    console.log("Problem with creating a database item!");
                    const error = data;
                    console.log(error);
                    this.setState({isLoading: false});
                    failureHandler(error);
                }
                else {
                    console.log("Successfully created database item in the database!");
                    Auth.signUp(params).then((data) => {
                        console.log("Successfully signed up!");
                        this.setState({isLoading: false});
                        successHandler(data);
                    }).catch((error) => {
                        console.log("Sign up has failed :(");
                        console.log(error);
                        this.setState({isLoading: false});
                        failureHandler(error);
                    });
                }
        }, (error) => {
            console.log("Problem with creating a database item!");
            console.log(error);
            this.setState({isLoading: false});
            failureHandler(error);
        });

    }

    vastusConfirmSignUp(successHandler, failureHandler) {
        // TODO Check to see if the input fields are put  in correctly
        this.setState({isLoading: true});
        Auth.confirmSignUp(this.authState.username, this.authState.confirmationCode).then((data) => {
            console.log("Successfully confirmed the sign up");
            console.log(data);
            this.setState({isLoading: false});
            successHandler(data);
        }).catch((error) => {
            console.log("Confirm sign up has failed :(");
            console.log(error);
            this.setState({isLoading: false});
            failureHandler(error);
        });
    }

    changeStateText(key, value) {
        this.authState[key] = value.target.value;
        console.log("New " + key + " is equal to " + value.target.value);
    }

    handleCreateButton() {
        // alert("Setting state with isConfirming is true");
        this.vastusSignUp((user) => {
            this.setState({isConfirming: true, error: null})
        }, (error) => {
            this.setState({isConfirming: false, error: error})
        });
    }

    async handleConfirmButton() {
        this.vastusConfirmSignUp((user) => {
            this.setState({isConfirming: false, error: null});
            this.authenticate(user);
        }, (error) => {
            this.setState({isConfirming: true, error: error});
        });
    }

    handleCancelButton() {
        // TODO Have a confirmation like are you sure ya wanna close?
        this.setState({error: null});
        this.props.onClose();
    }

    render() {
        function errorMessage(error) {
            if (error) {
                alert(JSON.stringify(error));
                return (
                    <Modal.Description>
                        <Message color='red'>
                            <h1>Error!</h1>
                            <p>{error.message}</p>
                        </Message>
                    </Modal.Description>
                );
            }
        }
        function loadingProp(isLoading) {
            if (isLoading) {
                return (
                    <Dimmer active inverted>
                        <Loader/>
                    </Dimmer>
                );
            }
            return null;
        }

        if (this.state.isConfirming) {
            return(
                <div>
                    <Modal open={this.props.open} onClose={() => (false)} trigger={<Button fluid color='red' onClick={this.props.onOpen.bind(this)} inverted> Sign Up </Button>} size='tiny'>
                        {loadingProp(this.state.isLoading)}
                        <Modal.Header>Check your email to confirm the sign up!</Modal.Header>
                        {errorMessage(this.state.error)}
                        <Modal.Actions>
                            <div>
                                <Form>
                                    <label>Confirmation Code</label>
                                    <Form.Input type="text" name="confirmationCode" placeholder=" XXXXXX " onChange={value => this.changeStateText("confirmationCode", value)}/>
                                </Form>
                            </div>
                            <div>
                                <Button onClick={this.handleConfirmButton.bind(this)} color='blue'>Confirm Your Account</Button>
                            </div>
                        </Modal.Actions>
                    </Modal>
                </div>
            );
        }
        return(

                <Modal open={this.props.open} trigger={<Button size="large" fluid primary inverted onClick={this.props.onOpen.bind(this)}> Sign Up </Button>} size='tiny'>
                    {loadingProp(this.state.isLoading)}
                    <Modal.Header>Create your new VASTUS account!</Modal.Header>
                    {errorMessage(this.state.error)}
                    <Modal.Actions>
                        <Form>
                            <div className="field">
                                <label>Username</label>
                                <Form.Input type="text" name="username" placeholder="Username" onChange={value => this.changeStateText("username", value)}/>
                            </div>
                            <div className="field">
                                <label>Password</label>
                                <Form.Input type="password" name="password" placeholder="Password" onChange={value => this.changeStateText("password", value)}/>
                            </div>
                            <div className="field">
                                <label>Confirm Password</label>
                                <Form.Input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={value => this.changeStateText("confirmPassword", value)}/>
                            </div>
                            <div className="field">
                                <label>Name</label>
                                <Form.Input type="text" name="name" placeholder="Name" onChange={value => this.changeStateText("name", value)}/>
                            </div>
                            <div className="field">
                                <label>Gender</label>
                                <Form.Input type="text" name="gender" placeholder="Gender" onChange={value => this.changeStateText("gender", value)}/>
                            </div>
                            <div className="field">
                                <label>Birthdate</label>
                                <Form.Input type="text" name="birthdate" placeholder="YYYY-MM-DD" onChange={value => this.changeStateText("birthday", value)}/>
                            </div>
                            <div className="field">
                                <label>Email</label>
                                <Form.Input type="text" name="email" placeholder="Email" onChange={value => this.changeStateText("email", value)}/>
                            </div>
                            <Grid relaxed columns={4}>
                                <Grid.Column>
                                    <Button negative onClick={this.handleCancelButton.bind(this)}>Cancel</Button>
                                </Grid.Column>
                                <Grid.Column/>
                                <Grid.Column/>
                                <Grid.Column>
                                    <Button positive color='green' onClick={this.handleCreateButton.bind(this)}>Create</Button>
                                </Grid.Column>
                            </Grid>
                        </Form>
                    </Modal.Actions>
                </Modal>

        );
    }
}

export default SignUpModal;
