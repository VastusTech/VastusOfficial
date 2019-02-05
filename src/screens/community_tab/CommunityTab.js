import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {Grid, Button, Modal} from 'semantic-ui-react'
import {fetchUserAttributes} from "../../redux_helpers/actions/userActions";
import CreateGroupProp from "../../vastuscomponents/components/manager/CreateGroup";
import GroupCard from "../../vastuscomponents/components/cards/GroupCard";
import {getItemTypeFromID} from "../../vastuscomponents/logic/ItemType";
import {consoleError} from "../../vastuscomponents/logic/DebuggingHelper";
import {
    fetchClient,
    fetchGroupQuery,
    fetchGroup,
    fetchTrainer,
    putGroup,
    putGroupQuery,
} from "../../vastuscomponents/redux_actions/cacheActions";
import _ from "lodash";

class CommunityTab extends Component {
    state = {
        isLoading: true,
        userID: null,
        groups: [],
        groupFeedLength: 10,
        sentRequest: false,
        nextToken: null,
        ifFinished: false,
        calculations: {
            topVisible: false,
            bottomVisible: false
        },
    };

    constructor(props) {
        super(props);
        this.queryGroups = this.queryGroups.bind(this);
    }

    componentDidMount() {
    }

    componentWillReceiveProps(newProps, nextContext) {
        if (this.state.userID !== newProps.userID) {
            this.setState({userID: newProps.userID});
            this.queryGroups(newProps.userID);
        }
    }

    queryGroups() {
        // console.log("BEFORE: " + this.state.sentRequest);
        if (!this.state.sentRequest) {
            this.state.sentRequest = true;
            // console.log("AFTER: " + this.state.sentRequest);
            if (!this.state.ifFinished) {
                this.setState({isLoading: true});
                this.props.fetchGroupQuery(GroupCard.fetchVariableList, null, this.state.groupFeedLength, this.state.nextToken, (data) => {
                    if (!data.nextToken) {
                        this.setState({ifFinished: true});
                    }
                    if (data.items) {
                        for (let i = 0; i < data.items.length; i++) {
                            const group = data.items[i];

                            // TODO Fetch all the information that we need to about the groups

                            this.state.groups.push(group);
                        }
                        this.setState({nextToken: data.nextToken});
                    }
                    else {
                        // TODO Came up with no events
                    }
                    this.setState({isLoading: false});
                }, (error) => {
                    consoleError("Querying Groups failed!");
                    consoleError(error);
                    this.setState({isLoading: false, error: error});
                }, this.props.cache.groupQueries, this.props.putGroupQuery);
            }
        }
    }

    render() {
        /**
         * This function takes in a list of Groups and displays them in a list of Event Card views.
         * @param Groups
         * @returns {*}
         */
        function rows(groups) {
            // if(Posts != null && Posts.length > 0)
            //     consoleLog(JSON.stringify(Posts[0].id));
            // consoleLog("EVENTS TO PRINT: ");
            // consoleLog(JSON.stringify(Posts));
            return _.times(groups.length, i => (
                <Fragment key={i + 1}>
                    <GroupCard groupID={groups[i].id}/>
                </Fragment>
            ));
        }

        return (
            <Grid fluid centered>
                <Grid.Row height={20} style={{marginBottom: '15px', marginTop: '15px'}}>
                <Modal trigger={<Grid centered><Button primary>Create New Group</Button></Grid>}>
                    <CreateGroupProp/>
                </Modal>
                </Grid.Row>
                <Grid.Row>
                    <Grid centered>
                        {rows(this.state.groups)}
                    </Grid>
                </Grid.Row>
            </Grid>
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
        },
        fetchTrainer: (id, variablesList, dataHandler) => {
            dispatch(fetchTrainer(id, variablesList, dataHandler));
        },
        fetchGroup: (id, variablesList, dataHandler) => {
            dispatch(fetchGroup(id, variablesList, dataHandler));
        },
        putGroup: (event) => {
            dispatch(putGroup(event));
        },
        putGroupQuery: (queryString, queryResult) => {
            dispatch(putGroupQuery(queryString, queryResult));
        },
        fetchGroupQuery: (variablesList, filter, limit, nextToken, dataHandler, failureHandler) => {
            dispatch(fetchGroupQuery(variablesList, filter, limit, nextToken, dataHandler, failureHandler));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommunityTab);