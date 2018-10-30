import React, { Component } from 'react';
import Semantic, { Modal, Button, Input, Image, Grid, Form } from 'semantic-ui-react';
import Amplify, { Auth } from 'aws-amplify';

class SignUpModal extends Component {
    authState = {
        username: "",
        password: "",
        confirmPassword: "",
        name: "",
        gender: "",
        birthday: "",
        email: ""
    };

    // TODO Retrieve information from the fields
    async vastusSignUp() {
        // TODO Check to see if the input fields are put  in correctly
        // TODO Check to see that password is with confirm password correctly
        console.log("Starting Auth.signup!");

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
            alert(JSON.stringify(data));
        }).catch(function(err) {
            console.log("Sign up has failed :(");
            console.log(err);
        });
        console.log("We got past the sign up call");
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

    changeStateText(key, value) {
        // TODO Sanitize this input
        // TODO Check to see if this will, in fact, work.!
        // inspect(value);
        this.authState[key] = value.target.value;
        console.log("New " + key + " is equal to " + value.target.value);
    }

    render() {
        return(
            <div>
                <Modal trigger={<Button fluid color='red' inverted> Sign Up </Button>} size='tiny'>
                    <Grid>
                    </Grid>
                    <Modal.Header>Create your new VASTUS account!</Modal.Header>
                    <Modal.Content>

                    </Modal.Content>
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
                            <div/>
                            <div/>
                            <Grid/>
                            <Grid relaxed columns={4}>
                                <Grid.Column>
                                    <Button>Cancel</Button>
                                </Grid.Column>
                                <Grid.Column/>
                                <Grid.Column/>
                                <Grid.Column>
                                    <Button color='green' onClick={this.vastusSignUp.bind(this)}>Create</Button>
                                </Grid.Column>
                            </Grid>
                        </Form>
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}

export default SignUpModal;
