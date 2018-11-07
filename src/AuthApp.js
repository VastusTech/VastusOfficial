import React, { Component } from 'react';
import './App.css';
import Tabs from './screens/Tabs.js';
import {Button, Grid} from "semantic-ui-react";
import { Auth } from 'aws-amplify';
import SearchBarProp from "./screens/SearchBar";
import { connect } from "react-redux";
import { fetchUser } from "./redux_helpers/actions/userActions";

/**
* Auth App
*
* This file contains the general outline of the app in a grid based format.
 */
class AuthApp extends Component {
    state = {
        error: null,
        isLoading: false
    };

    constructor(props) {
        super(props);
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

    componentWillReceiveProps(newProps) {
        // alert("NEW PROPS: " + JSON.stringify(newProps));
    }

    //This displays the search bar, log out button, and tab system inside of the grid.
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
                <Tabs />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUser: (username) => {
            dispatch(fetchUser(username));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthApp);

// TODO What's the point of this right now?
// uploadFile = (evt) => {
//     const file = evt.target.files[0];
//     const name = file.name;
//
//     Storage.put(name, file).then(() => {
//         this.setState({ file: name });
//     })
// };
