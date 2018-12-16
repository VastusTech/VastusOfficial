import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import ChallengeDescriptionModal from './ChallengeDescriptionModal';
import { connect } from 'react-redux';
import { fetchChallenge } from "../redux_helpers/actions/cacheActions";
import { convertFromISO, convertFromIntervalISO } from "../logic/TimeHelper";

/*type Props = {
    challengeID: string
}*/

/*
* Challenge Card
*
* This is the generic view for how a challenge shows up in any feeds or lists.
* It is used as a modal trigger in the feed.
 */
class ChallengeCard extends Component {
    state = {
        error: null,
        challengeID: null,
        challengeModalOpen: false
    };

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
        fetchChallenge(this.state.challengeID, ["time_created"])
    }

    componentWillReceiveProps(newProps) {
        if (newProps.challengeID && !this.state.challengeID) {
            this.setState({challengeID: newProps.challengeID});
        }
    }

    getChallengeAttribute(attribute) {
        if (this.state.challengeID) {
            let challenge = this.props.cache.challenges[this.state.challengeID];
            if (challenge) {
                if (attribute.substr(attribute.length - 6) === "Length") {
                    attribute = attribute.substr(0, attribute.length - 6);
                    if (challenge[attribute] && challenge[attribute].length) {
                        return challenge[attribute].length;
                    }
                    else {
                        return 0;
                    }
                }
                return challenge[attribute];
            }
        }
        return null;
    }

    openChallengeModal = () => {this.setState({challengeModalOpen: true})};
    closeChallengeModal = () => {this.setState({challengeModalOpen: false})};

    render() {
        if (!this.getChallengeAttribute("id")) {
            return(
                <Card fluid raised>
                    <h1>Loading...</h1>
                </Card>
            );
        }
        return(
            // This is displays a few important pieces of information about the challenge for the feed view.
            <Card fluid raised onClick={this.openChallengeModal.bind(this)}>
                <Card.Content>
                    <Card.Header textAlign = 'center'>{this.getChallengeAttribute("title")}</Card.Header>
                    <Card.Meta textAlign = 'center' >{convertFromIntervalISO(this.getChallengeAttribute("endTime"))}</Card.Meta>
                    <Card.Meta textAlign = 'center'>Location: {this.getChallengeAttribute("goal")}</Card.Meta>
                    <ChallengeDescriptionModal open={this.state.challengeModalOpen} onClose={this.closeChallengeModal.bind(this)} eventID={this.getChallengeAttribute("id")}/>
                </Card.Content>
                <Card.Content extra>
                    <Card.Meta>Created on {convertFromISO(this.getChallengeAttribute("time_created"))}</Card.Meta>
                    <Card.Meta textAlign = 'center'>
                        {this.getChallengeAttribute("membersLength")} of {this.getChallengeAttribute("capacity")} spots taken.
                    </Card.Meta>
                </Card.Content>
            </Card>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    cache: state.cache,
    info: state.info
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchChallenge: (id, variablesList) => {
            dispatch(fetchChallenge(id, variablesList));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeCard);
