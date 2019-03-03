import React, {Component} from 'react';
import {Button} from "semantic-ui-react";
import {connect} from "react-redux";
import {logOut} from "../../redux_helpers/actions/authActions";

class LogOutButton extends Component {
    render() {
        return (<Button fluid inverted size="large" onClick={this.props.logOut.bind(this)} width={5}>Log Out</Button>);
    }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => { return { logOut: () => { dispatch(logOut());} } };
export default connect(mapStateToProps, mapDispatchToProps)(LogOutButton);