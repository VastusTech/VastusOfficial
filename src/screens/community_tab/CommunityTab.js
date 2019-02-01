import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {Grid, Button} from 'semantic-ui-react'
import {fetchUserAttributes} from "../../redux_helpers/actions/userActions";
import {fetchClient} from "../../vastuscomponents/redux_actions/cacheActions";

class LeaderBoardTab extends Component {
    state = {
        isLoading: true,
        isFetching: true,
        sentRequest: false,
        friends: [],
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    componentWillReceiveProps(newProps, nextContext) {
    }

    render() {
        return (
            <Grid centered><Button primary>Create New Group</Button></Grid>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    info: state.info,
    cache: state.cache,
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (variablesList) => {
            dispatch(fetchUserAttributes(variablesList));
        },
        fetchClient: (id, variablesList, dataHandler) => {
            dispatch(fetchClient(id, variablesList, dataHandler));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeaderBoardTab);