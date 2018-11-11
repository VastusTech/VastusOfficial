import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { Auth } from 'aws-amplify';
import { clearUser, fetchUser } from './redux_helpers/actions/userActions';
import AuthApp from './AuthApp';
import UnauthApp from './UnauthApp';
import AWSConfig from './AppConfig';

AWSConfig();

class App extends Component {
    // This is the function that is called when the sign up button is pressed
    state = {
        error: null,
        ifLoggedIn: false
    };

    constructor(props) {
        super(props);

        // const badList = ["2"];
        // const list = ["1", "2", "3"];
        // const filterList = list.filter((v) => {return !badList.includes(v)});
        // alert(filterList);
        // const currentObject = {
        //     id: "id",
        //     name: "name",
        //     username: "username"
        // };
        // const variablesList = ["id", "name", "username", "profileImagePath"];
        // if (variablesList.some(v => !Object.keys(currentObject).includes(v))) {
        //     alert("Your theory works");
        // }
    }

    async authenticate(user) {
        if (user && user.username) {
            // Refresh the tokens potentially?
            // Auth.currentSession();
            Auth.currentCredentials();
            Auth.currentAuthenticatedUser().then((authenticatedUser) => {
                if (authenticatedUser && (user.username === authenticatedUser.username)) {
                    // alert("Logging in the user");
                    this.setState({ifLoggedIn: true});
                    if (user.username !== this.props.user.username) {
                        this.props.clearUser();
                    }
                    this.props.fetchUser(user.username);
                }
                else {
                    alert("Error with second check");
                }
            }).catch((error) => {
                alert("Error");
                this.setState({ifLoggedIn: false, error: error});
            });
        }
        else {
            alert("received null user");
        }
    }

    signOut() {
        // alert("logging out the user");
        this.setState({ifLoggedIn: false});
        // this.props.clearUser();
    }

    async componentDidMount() {
        try {
            const user = await Auth.currentAuthenticatedUser();
            this.authenticate(user);
        } catch (err) {
            this.setState({ error: err })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user) {
            this.setState();
        }
    }

    render() {
        // let loggedIn = false;
        // if (this.props.user.id) {
        //     loggedIn = true
        // }
        if (this.state.ifLoggedIn) {
            // The actual App
            return (
                <div>
                    <AuthApp signOut={this.signOut.bind(this)}/>
                </div>
            );
        }
        else {
            return (
                <div>
                    <UnauthApp authenticate={this.authenticate.bind(this)}/>
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    cache: state.cache
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUser: (username) => {
            dispatch(fetchUser(username));
        },
        clearUser: () => {
            dispatch(clearUser());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
