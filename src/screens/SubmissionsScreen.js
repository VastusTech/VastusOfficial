import React, { Component, Fragment } from 'react';
// import VideoUpload from '../components/VideoUpload';
// import Comments from '../components/Comments';
import {Grid, Card, Dimmer, Loader, List, Icon, Message} from "semantic-ui-react";
// import {fetchUserAttributes, forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import PostCard from "../components/PostCard";
import connect from "react-redux/es/connect/connect";
import {fetchPost, fetchChallenge} from "../redux_helpers/actions/cacheActions";

type Props = {
    challengeID: string
};

class SubmissionsScreen extends Component {
    state = {
        isLoading: true,
        challengeID: null,
        loadedPostIDs: [],
        sentRequest: false
    };

    // _isMounted = true;
    //
    // channelName = "persisted:" + this.props.challengeChannel + "_VideoFeed";
    //channelName = this.props.challengeChannel;

    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
        this.getChallengeAttribute = this.getChallengeAttribute.bind(this);
        this.getLoading = this.getLoading.bind(this);
    }

    componentDidMount() {
        this.update(this.props);
        if (this.state.challengeID !== this.props.challengeID) {
            this.setState({challengeID: this.props.challengeID});
        }
    }

    componentWillReceiveProps(newProps, nextContext) {
        this.update(newProps);
    }

    update(props) {
        // TODO Change this if we want to actually be able to do something while it's loading
        if (this.getChallengeAttribute("id")) {
            const submissions = this.getChallengeAttribute("submissions");
            if (this.state.isLoading && submissions && submissions.length) {
                this.state.isLoading = false;
                for (let i = 0; i < submissions.length; i++) {
                    alert("Fetching: " + submissions[i]);
                    props.fetchPost(submissions[i], ["id", "by", "item_type", "postType", "about", "description", "videoPaths", "picturePaths"],
                        (post) => {
                        alert("Returned a value! Post: " + JSON.stringify(post));
                        if (post && post.id) {
                            this.state.loadedPostIDs.push(post.id);
                        }
                    })
                }
            }
            else if (!this.state.sentRequest && !this.state.isLoading) {
                this.state.sentRequest = true;
                props.fetchChallenge(this.state.challengeID, ["submissions"], () => {
                    this.setState({});
                })
            }
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
        else {
            return null;
        }
    }

    getLoading() {
        if (this.state.isLoading) {
            return (
                <Message icon>
                    <Icon name='spinner' size="small" loading />
                    <Message.Content>
                        <Message.Header>
                            Loading...
                        </Message.Header>
                    </Message.Content>
                </Message>
            )
        }
        return null;
    }

    render() {
        function rows(postIDs) {
            const row = [];
            const rowProps = [];
            for (const key in postIDs) {
                if (postIDs.hasOwnProperty(key)) {
                    //alert(JSON.stringify(events[key]));
                    row.push(
                        postIDs[key]
                    );
                }
            }
            // row.sort(function(a,b){return b.time_created.localeCompare(a.time_created)});

            for (const key in row) {
                if (row.hasOwnProperty(key) === true) {
                    rowProps.push(
                        <List.Item key={key}>
                            <PostCard postID={row[key]}/>
                        </List.Item>
                    );
                }
            }

            return rowProps;
        }
        return (
            <Fragment>
                {/*console.error("Comment screen render user: " + this.props.curUser)*/}
                {this.getLoading()}
                {/* TODO: This should be removed and replaced at the ChallengeDescriptionModal */}
                {/* <VideoUpload handleAddComment={this.handleAddComment} curUser={this.props.curUser} curUserID={this.props.curUserID}
                                challengeChannel={this.channelName}/> */}
                {/*<Comments comments={this.state.comments}/>*/}
                {rows(this.state.loadedPostIDs)}
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    info: state.info,
    cache: state.cache
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchChallenge: (id, variableList, dataHandler) => {
            dispatch(fetchChallenge(id, variableList, dataHandler));
        },
        fetchPost: (id, variableList, dataHandler) => {
            dispatch(fetchPost(id, variableList, dataHandler));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SubmissionsScreen);
