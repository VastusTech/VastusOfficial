import React, { Component } from 'react';
import {Card, Image} from 'semantic-ui-react';
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
                /*if(attribute === "tags") {
                    alert(challenge[attribute]);
                }*/
                return challenge[attribute];
            }
        }
        return null;
    }

    displayTagIcons(tags) {
        if(tags) {
            if (tags.length === 1) {
                return (
                    <Image size='small' src={require('../img/' + tags[0] + '_icon.png')}/>
                );
            }
            else if (tags.length === 2) {
                return (
                    <div>
                        <Image size='small' src={require('../img/' + tags[0] + '_icon.png')}/>
                        <Image size='small' src={require('../img/' + tags[1] + '_icon.png')}/>
                    </div>
                );
            }
            else if (tags.length === 3) {
                return(
                    <div>
                        <Image avatar src={require('../img/' + tags[0] + '_icon.png')}/>
                        <Image avatar src={require('../img/' + tags[1] + '_icon.png')}/>
                        <Image avatar src={require('../img/' + tags[2] + '_icon.png')}/>
                    </div>
                    );
            }
            else if (tags.length === 4) {
                return(
                    <div>
                        <Image avatar src={require('../img/' + tags[0] + '_icon.png')}/>
                        <Image avatar src={require('../img/' + tags[1] + '_icon.png')}/>
                        <Image avatar src={require('../img/' + tags[2] + '_icon.png')}/>
                        <Image avatar src={require('../img/' + tags[3] + '_icon.png')}/>
                    </div>
                );
            }
        }
        else {
            return (
                "There ain't no tags round these parts partner " + tags
            );
        }
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
        if(this.getChallengeAttribute("tags")) {
            alert("There be tags!");
            alert(this.getChallengeAttribute("tags"));
        }
        return(
            // This is displays a few important pieces of information about the challenge for the feed view.
            <Card fluid raised onClick={this.openChallengeModal.bind(this)}>
                <Card.Content>
                    <Card.Header textAlign = 'center'>{this.getChallengeAttribute("title")}</Card.Header>
                    <Card.Meta textAlign = 'center' >{convertFromISO(this.getChallengeAttribute("endTime"))} days left</Card.Meta>
                    {this.displayTagIcons(this.getChallengeAttribute("tags"))}
                    <ChallengeDescriptionModal open={this.state.challengeModalOpen} onClose={this.closeChallengeModal.bind(this)} challengeID={this.getChallengeAttribute("id")}/>
                </Card.Content>
                <Card.Content extra>
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
