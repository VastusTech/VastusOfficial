import React, { Component } from 'react'
import { List, Message } from 'semantic-ui-react';
import ChallengeCard from "../cards/ChallengeCard";
import { connect } from "react-redux";
import { fetchChallenge } from "../../redux_helpers/actions/cacheActions";
import Spinner from "../Spinner";

type Props = {
    challengeIDs: [string],
    noChallengesMessage: string,
    sortFunction?: any
}

class ChallengeList extends Component<Props> {
    state = {
        isLoading: true,
        challengeIDs: null,
        challenges: [],
        sentRequest: false,
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.challengeIDs && this.state.challengeIDs !== newProps.challengeIDs) {
            alert("received challengeIDs = " + JSON.stringify(newProps.challengeIDs));
            this.setState({isLoading: true, challengeIDs: newProps.challengeIDs, challenges: []}, () => {
                for (let i = 0; i < newProps.challengeIDs.length; i++) {
                    this.props.fetchChallenge(newProps.challengeIDs[i], ["id", "tags", "title", "goal", "endTime", "time_created", "owner", "ifCompleted", "members", "capacity", "difficulty", "access", "restriction", "submissions"], (challenge) => {
                        // Handle received data
                        if (challenge) {
                            this.state.challenges.push(challenge);
                        }
                        this.setState({isLoading: false});
                    });
                }
            });
        }
    }

    render() {
        function challengeComponents(challenges, sortFunction) {
            const challengeList = [...challenges];
            const components = [];
            if (sortFunction) {
                challengeList.sort(sortFunction);
            }
            for (const key in challengeList) {
                if (challengeList.hasOwnProperty(key)) {
                    components.push(
                        <List.Item>
                            <ChallengeCard challengeID={challengeList[key].id}/>
                        </List.Item>
                    );
                }
            }
            return components;
        }
        if (this.props.isLoading) {
            return(
                <Spinner/>
            )
        }
        if (this.state.challenges.length > 0) {
            return(
                <List relaxed verticalAlign="middle">
                    {challengeComponents(this.state.challenges, this.props.sortFunction)}
                </List>
            );
        }
        else {
            return(
                <Message>{this.props.noChallengesMessage}</Message>
            );
        }
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchChallenge: (id, variablesList, dataHandler) => {
            dispatch(fetchChallenge(id, variablesList, dataHandler));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeList);

