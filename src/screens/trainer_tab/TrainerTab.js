import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {Grid, Button, Modal, Visibility} from 'semantic-ui-react';
import {fetchUserAttributes} from "../../redux_helpers/actions/userActions";
import CreateGroupProp from "../../vastuscomponents/components/manager/CreateGroup";
import TrainerCard from "../../vastuscomponents/components/cards/TrainerCard";
import {
    fetchClient,
    fetchTrainerQuery,
    fetchTrainer,
    putTrainer,
    putTrainerQuery,
} from "../../vastuscomponents/redux_actions/cacheActions";
import _ from "lodash";
import {err, log} from "../../Constants";

class CommunityTab extends Component {
    state = {
        isLoading: true,
        userID: null,
        trainers: [],
        trainerFeedLength: 10,
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
        this.queryTrainers = this.queryTrainers.bind(this);
    }

    componentWillReceiveProps(newProps, nextContext) {
        //alert(newProps.userID + " vs " + this.state.userID);
        if (this.state.userID !== newProps.userID) {
            this.setState({userID: newProps.userID});
            this.queryTrainers(newProps.userID);
        }
    }

    componentDidUpdate(newProps) {
        this.queryTrainers(newProps.userID);
    }

    componentDidMount() {
        this.queryTrainers();
    }

    queryTrainers() {
        if (!this.state.sentRequest) {
            this.state.sentRequest = true;
            if (!this.state.ifFinished) {
                this.setState({isLoading: true});
                this.props.fetchTrainerQuery(TrainerCard.fetchVariableList, null, this.state.trainerFeedLength, this.state.nextToken, (data) => {
                    if (!data.nextToken) {
                        this.setState({ifFinished: true});
                    }
                    if (data.items) {
                        for (let i = 0; i < data.items.length; i++) {
                            const trainer = data.items[i];

                            // TODO Fetch all the information that we need to about the trainers

                            this.state.trainers.push(trainer);
                        }
                        this.setState({nextToken: data.nextToken});
                    }
                    else {
                        // TODO Came up with no events
                    }
                    this.setState({isLoading: false});
                }, (error) => {
                    err&&console.error("Querying trainers failed!");
                    err&&console.error(error);
                    this.setState({isLoading: false, error: error});
                }, this.props.cache.trainerQueries, this.props.putTrainerQuery);
            }
        }
    }

    handleUpdate = (e, { calculations }) => {
        this.setState({ calculations });
        log&&console.log(calculations.bottomVisible);
        if (calculations.bottomVisible) {
            log&&console.log("Next Token: " + this.state.nextToken);
            this.state.sentRequest = false;
            this.queryTrainers();
        }
    };

    render() {
        /**
         * This function takes in a list of trainers and displays them in a list of Event Card views.
         * @param trainers
         * @returns {*}
         */
        function rows(trainers) {
            // if(Posts != null && Posts.length > 0)
            return _.times(trainers.length, i => (
                <Grid.Row key={i + 1}>
                    <TrainerCard rank={0} trainerID={trainers[i].id}/>
                </Grid.Row>
            ));
        }

        return (
            <Visibility onUpdate={_.debounce(this.handleUpdate, 500)}>
                <Grid fluid centered>
                    {rows(this.state.trainers)}
                </Grid>
            </Visibility>
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
        putTrainer: (event) => {
            dispatch(putTrainer(event));
        },
        putTrainerQuery: (queryString, queryResult) => {
            dispatch(putTrainerQuery(queryString, queryResult));
        },
        fetchTrainerQuery: (variablesList, filter, limit, nextToken, dataHandler, failureHandler) => {
            dispatch(fetchTrainerQuery(variablesList, filter, limit, nextToken, dataHandler, failureHandler));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommunityTab);