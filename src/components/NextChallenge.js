import React, {Component, Fragment} from 'react'
import {Icon, Message} from 'semantic-ui-react';
import ChallengeCard from "./cards/ChallengeCard";
import { connect } from "react-redux";
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";
import {fetchChallenge} from "../redux_helpers/actions/cacheActions";
import {parseISOString, timeLeft} from "../logic/TimeHelper";
import Spinner from "./Spinner";

class NextChallengeProp extends Component {
    state = {
        isLoading: true,
        isFetching: false,
        sentRequest: false,
        challenges: [],
        // nearestChallenge: null,
        // nearestTimeLeft: null,
        error: null
    };

    constructor(props) {
        super(props);
        //console.log("Got into Scheduled Events constructor");
        this.update = this.update.bind(this);
    }

    componentDidMount() {
        this.update(this.props);
    }

    componentWillReceiveProps(newProps, nextContext) {
        if (newProps.user && this.props.user && newProps.user.id !== this.props.user.id) {
            // console.log("resetting app for new user!");
            this.resetState();
        }
        this.update(newProps);
    }

    resetState() {
        this.setState({isLoading: true, sentRequest: false, error: null});
    }

    update(props) {
        if (!props.user.id) {
            console.error("No user ID...");
            return;
        }
        //console.log("Cur User for grabbing Attributes: " + this.props.user.id);
        if (!this.state.sentRequest) {
            this.setState({isLoading: true});
            this.state.sentRequest = true;
            this.props.fetchUserAttributes(["challenges"], (user) => {
                if (user.challenges) {
                    const challenges = [];
                    let numChallenges = 0;
                    let numTotal = user.challenges.length;
                    for (let i = 0; i < user.challenges.length; i++) {
                        // alert("Fetching challenge for next challenge");
                        this.props.fetchChallenge(user.challenges[i], ["id", "tags", "title", "goal", "endTime", "time_created", "owner", "ifCompleted", "members", "capacity", "difficulty", "access", "restriction", "submissions"], (challenge) => {
                            if (challenge && challenge.endTime) {
                                const challengeTimeLeft = timeLeft(parseISOString(challenge.endTime));
                                // alert("Received challenge = " + JSON.stringify(challenge));
                                // alert("Time left = " + challengeTimeLeft);
                                if (challengeTimeLeft >= 0) {
                                    challenges.push({
                                        challenge,
                                        timeLeft: challengeTimeLeft
                                    });
                                }
                                // if (challengeTimeLeft >= 0) {
                                //     if ((!this.state.nearestChallenge) || (challenge.endTime && challengeTimeLeft < this.state.nearestTimeLeft)) {
                                //         this.state.nearestTimeLeft = challengeTimeLeft;
                                //         this.state.nearestChallenge = challenge;
                                //     }
                                // }
                            }
                            numChallenges++;
                            if (numChallenges >= numTotal) {
                                this.setState({challenges: challenges});
                            }
                        }, () => {
                            numChallenges++;
                            if (numChallenges >= numTotal) {
                                this.setState({challenges: challenges});
                            }
                        });
                    }
                }
                this.setState({isLoading: false});
            });
        }
    }

    render() {
        if (this.state.isLoading) {
            return(
                <Spinner/>
            );
        }
        if (this.state.challenges && this.state.challenges.length > 0) {
            let challenges = [...this.state.challenges];
            challenges.sort((a, b) => {
                return a.timeLeft - b.timeLeft;
            });
            return (
                <Fragment key={0}>
                    <Message>
                        <ChallengeCard challengeID={challenges[0].challenge.id}/>
                    </Message>
                </Fragment>
            );
        }
        else {
            // Then it's empty, no next scheduled event
            return(
                <Message>No scheduled challenges!</Message>
            );
        }
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    cache: state.cache,
    info: state.info,
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (attributeList, dataHandler) => {
            dispatch(fetchUserAttributes(attributeList, dataHandler));
        },
        fetchChallenge: (id, variablesList, dataHandler, failureHandler) => {
            dispatch(fetchChallenge(id, variablesList, dataHandler, failureHandler));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NextChallengeProp);
