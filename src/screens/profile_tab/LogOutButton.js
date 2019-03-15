import React, {Component} from 'react';
import {Button} from "semantic-ui-react";
import {connect} from "react-redux";
import {logOut} from "../../redux_helpers/actions/authActions";

// TODO Make sure the bind call works here!

const LogOutButton = (props) => (
    <Button fluid inverted size="large" onClick={props.logOut.bind()} width={5}>Log Out</Button>
);

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => { return { logOut: () => { dispatch(logOut());} } };
export default connect(mapStateToProps, mapDispatchToProps)(LogOutButton);