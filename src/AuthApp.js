import React, { Component } from 'react';
import './App.css';
import Tabs from './screens/Tabs.js';
import {Button, Grid} from "semantic-ui-react";
import Amplify, { API, Auth, graphqlOperation, Analytics } from 'aws-amplify';
import SearchBarProp from "./screens/SearchBar";

class AuthApp extends Component {
    state = {
        error: null,
        isLoading: true,
        username: null,

    };

    constructor(props) {
        super(props);
        this.setUsername();
    }

    async setUsername() {
        //alert("Trying to set username");
        const user = await Auth.currentAuthenticatedUser();
        if (user.username) {
            //alert("Successfully set the username to: " + user.username);
            this.setState({username: user.username, isLoading: false});
        }
        else {
            // TODO This is an error and we should log out the user immediately
            // TODO TODO OH Lordy WHAT TODO
            alert("Real weird error here, boyz");
        }
    }

    handleLogOut() {
        this.setState({isLoading: true});
        Auth.signOut().then((data) => {
            console.log("Successfully signed out!");
            console.log(data);
            this.setState({isLoading: false, username: null});
            this.props.signOut();
        }).catch((error) => {
            console.log("Sign out has failed :(");
            console.log(error);
            this.setState({error: error, isLoading: false});
        });
    }

    componentDidMount() {
        // Analytics.record('Amplify_CLI');
    }

    render() {
        return (
            <div className="App">
                <Grid>
                    <Grid.Column floated='left' width={2}>
                        <SearchBarProp width={5}/>
                    </Grid.Column>
                    <Grid.Column floated='right' width={5}>
                            <Button color='purple' onClick={this.handleLogOut.bind(this)} width={5}>Log Out</Button>
                    </Grid.Column>
                </Grid>
                    <Tabs username={this.state.username}/>
            </div>
        );
    }
}


export default AuthApp;

// TODO What's the point of this right now?
// uploadFile = (evt) => {
//     const file = evt.target.files[0];
//     const name = file.name;
//
//     Storage.put(name, file).then(() => {
//         this.setState({ file: name });
//     })
// };
