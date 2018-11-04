import React, { Component } from 'react';
import './App.css';
import Tabs from './screens/Tabs.js';
import Amplify, { API, Auth, graphqlOperation, Analytics } from 'aws-amplify';
import SearchBarProp from "./screens/SearchBar";

class AuthApp extends Component {
    state = {
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

    componentDidMount() {
        // Analytics.record('Amplify_CLI');
    }

    render() {
        return (
            <div className="App">
                <div class="ui center aligned">
                    <SearchBarProp/>
                    <Tabs username={this.state.username}/>
                </div>
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
