import React, { Component, Fragment } from 'react';
// import VideoUpload from '../components/VideoUpload';
// import Comments from '../components/Comments';
import {Grid, Card, Dimmer, Loader, List, Icon, Message, Dropdown} from "semantic-ui-react";
// import {fetchUserAttributes, forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import PostCard from "../components/PostCard";
import connect from "react-redux/es/connect/connect";
import {fetchPost, fetchChallenge} from "../redux_helpers/actions/cacheActions";

type Props = {
    challengeID: string
};

class SubmissionsScreen extends Component {
    state = {
        isLoading: false,
        challengeID: null,
        loadedPostIDs: [],
        sentRequest: false,
        challengeMembers: [],
        memberSelected: 'all'
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
        this.getName = this.getName.bind(this);
    }

    componentDidMount() {
        // console.log("cdm");
        if (this.state.challengeID !== this.props.challengeID) {
            this.state.challengeID = this.props.challengeID;
            // this.setState({challengeID: this.props.challengeID});
        }
        this.update(this.props);
    }

    componentWillReceiveProps(newProps, nextContext) {
        // console.log("cwrp");
        if (this.state.challengeID !== this.props.challengeID) {
            this.state.challengeID = this.props.challengeID;
            // this.setState({challengeID: this.props.challengeID});
        }
        this.update(newProps);
    }

    update(props) {
        let curChalMems = this.state.challengeMembers;
        // TODO Change this if we want to actually be able to do something while it's loading
        if (this.getChallengeAttribute("id")) {
            // console.log("Updating!");
            const submissions = this.getChallengeAttribute("submissions");
            if (!this.state.sentRequest && submissions && submissions.length > 0) {
                this.state.isLoading = true;
                this.state.sentRequest = true;
                for (let i = 0; i < submissions.length; i++) {
                    // console.log("Fetching: " + submissions[i]);
                    props.fetchPost(submissions[i], ["id", "time_created", "by", "item_type", "postType", "about", "description", "videoPaths", "picturePaths"],
                        (post) => {
                        // console.log("Returned a value! Post: " + JSON.stringify(post));
                        if (post && post.id) {
                            this.setState({challengeMembers: [...curChalMems, post.by]});
                            alert(JSON.stringify(this.state.challengeMembers));
                            this.state.loadedPostIDs.push(post.id);
                            this.setState({isLoading: false});
                        }
                    })
                }
            }
        }
    }

    getName(id) {
        if (id) {
            if (this.props.cache.clients[id]) {
                return this.props.cache.clients[id].name
            }
            else if (this.props.cache.trainers[id]) {
                return this.props.cache.trainers[id].name
            }
            // else if (!this.props.info.isLoading) {
            //     this.props.fetchClient(owner, ["name"]);
            // }
        }
        return null;
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

    handleFilterChange = (e, data) => {
        this.setState({memberSelected: data.value});
        //console.log(this.eventState.duration);
        // this.setState({
        //     duration: data.value,
        // }, () => {
        //     console.log('value',this.state.duration);
        // });
    };

    render() {
        function rows(postIDs, memberSelected) {
            const row = [];
            const rowProps = [];
            for (const key in postIDs) {
                if (postIDs.hasOwnProperty(key)) {
                    //console.log(JSON.stringify(events[key]));
                    row.push(
                        postIDs[key]
                    );
                }
            }
            // row.sort(function(a,b){return b.time_created.localeCompare(a.time_created)});
            // alert(JSON.stringify(postIDs));
            for (const key in row) {
                if (memberSelected === 'all' || memberSelected === row[key]) {
                    if (row.hasOwnProperty(key) === true) {
                        rowProps.push(
                            <List.Item key={key}>
                                <PostCard postID={row[key]}/>
                            </List.Item>
                        );
                    }
                }
            }

            return rowProps;
        }
        return (
            <Fragment>
                {/*alert(JSON.stringify(this.state.challengeMembers))*/}
                <Dropdown fluid selection inverted placeholder='all' defaultValue={this.state.challengeMembers[0]} options={this.state.challengeMembers} onChange={this.handleFilterChange}/>
                {/*console.error("Comment screen render user: " + this.props.curUser)*/}
                {this.getLoading()}
                {/* TODO: This should be removed and replaced at the ChallengeDescriptionModal */}
                {/* <VideoUpload handleAddComment={this.handleAddComment} curUser={this.props.curUser} curUserID={this.props.curUserID}
                                challengeChannel={this.channelName}/> */}
                {/*<Comments comments={this.state.comments}/>*/}
                {rows(this.state.loadedPostIDs, this.state.memberSelected)}
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
