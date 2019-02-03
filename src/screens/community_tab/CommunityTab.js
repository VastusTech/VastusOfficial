import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {Grid, Button, Modal} from 'semantic-ui-react'
import {fetchUserAttributes} from "../../redux_helpers/actions/userActions";
import CreateGroupProp from "../../vastuscomponents/components/manager/CreateGroup";
import QL from "../../vastuscomponents/api/GraphQL";
import GroupCard from "../../vastuscomponents/components/cards/GroupCard";
import {getItemTypeFromID} from "../../vastuscomponents/logic/ItemType";
import ClientDetailCard from "../../vastuscomponents/components/post_detail_cards/ClientDetailCard";
import TrainerDetailCard from "../../vastuscomponents/components/post_detail_cards/TrainerDetailCard";
import ChallengeDetailCard from "../../vastuscomponents/components/post_detail_cards/ChallengeDetailCard";
import PostDetailCard from "../../vastuscomponents/components/post_detail_cards/PostDetailCard";
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
                /*const filter = QL.generateFilter({
                        and: [{
                            or: [{
                                postType: {
                                    eq: "$postType1"
                                }
                            }, {
                                postType: {
                                    eq: "$postType2"
                                }
                            }]
                        }, {
                            access: {
                                eq: "$access"
                            }
                        }]
                    }, {
                        postType1: "Challenge",
                        postType2: "newChallenge",
                        access: "public"
                    }
                );*/
                // QL.queryPosts(["id", "time_created", "by", "item_type", "postType", "about", "description", "videoPaths", "picturePaths"],
                // console.log("QUerying posts!");
                this.props.fetchGroupQuery(GroupCard.fetchVariableList, null, this.state.groupFeedLength, this.state.nextToken, (data) => {
                    if (!data.nextToken) {
                        this.setState({ifFinished: true});
                    }
                    if (data.items) {
                        // TODO We can see private events
                        // consoleLog("got items");
                        // console.log("Received " + data.items.length + " posts!");
                        const newlyQueriedGroups = [];
                        for (let i = 0; i < data.items.length; i++) {
                            const group = data.items[i];
                            //console.log(JSON.stringify("")
                            const aboutItemType = getItemTypeFromID(group.about);
                            alert(aboutItemType);
                            if (aboutItemType === "Client") {
                                this.props.fetchClient(data.items[i].about, ClientDetailCard.fetchVariableList);
                            } else if (aboutItemType === "Trainer") {
                                this.props.fetchTrainer(data.items[i].about, TrainerDetailCard.fetchVariableList);
                            } else if (aboutItemType === "Event") {

                            } else if (aboutItemType === "Challenge") {
                                // console.log("Fetching challenge for post in post feed");
                                this.props.fetchChallenge(data.items[i].about, ChallengeDetailCard.fetchVariableList);
                            } else if (aboutItemType === "Post") {
                                this.props.fetchPost(data.items[i].about, PostDetailCard.fetchVariableList);
                            }
                            else if (aboutItemType === "Group") {
                                this.props.fetchGroup(data.items[i].about, GroupCard.fetchVariableList);
                            }
                            newlyQueriedGroups.push(group);
                        }
                        this.setState({groups: [...this.state.groups, ...newlyQueriedGroups]});
                        for (let i = 0; i < data.items.length; i++) {
                            //consoleLog(data.items[i].time_created);
                            // consoleLog("Putting in event: " + JSON.stringify(data.items[i]));
                            // this.setState({events: [...this.state.events, data.items[i]]});
                            this.props.putGroup(data.items[i]);
                        }
                        // consoleLog("events in the end: " + JSON.stringify(this.state.events));
                        this.setState({nextToken: data.nextToken});
                    }
                    else {
                        // TODO Came up with no events
                    }
                    this.setState({isLoading: false});
                }, (error) => {
                    alert("Querying Groups Failed :(");
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
            <div>
                <Modal trigger={<Grid centered><Button primary>Create New Group</Button></Grid>}>
                    <CreateGroupProp/>
                </Modal>
                <Grid centered>
                    {rows(this.state.groups)}
                </Grid>
            </div>
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