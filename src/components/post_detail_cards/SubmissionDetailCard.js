import React, { Component } from 'react';
import {Card, Modal, Button, Header, List, Divider, Grid, Message} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { fetchClient, forceFetchPost, fetchPost } from "../../redux_helpers/actions/cacheActions";
import { convertFromISO } from "../../logic/TimeHelper";
import { forceFetchUserAttributes } from "../../redux_helpers/actions/userActions";
import PostFunctions from "../../databaseFunctions/PostFunctions";
import {Player} from "video-react";
import { Storage } from "aws-amplify";
import {consoleError} from "../../logic/DebuggingHelper";

/*
* Event Description Modal
*
* This is the event description which displays more in depth information about a challenge, and allows the user
* to join the challenge.
 */
class SubmissionDetailCard extends Component {
    state = {
        error: null,
        // isLoading: false,
        postID: null,
        // event: null,
        // ownerName: null,
        // members: {},
        clientModalOpen: false,
        videoURL: null,
        // completeModalOpen: false,
        // isLeaveLoading: false,
        // isDeleteLoading: false,
        // isJoinLoading: false,
        // joinRequestSent: false,
        // canCallChecks: true,
    };

    constructor(props) {
        super(props);
        // this.handleJoinChallengeButton = this.handleJoinChallengeButton.bind(this);
        // this.handleLeaveChallengeButton = this.handleLeaveChallengeButton.bind(this);
        this.handleDeletePostButton = this.handleDeletePostButton.bind(this);
        // this.handleLeave = this.handleLeave.bind(this);
        // this.handleJoin = this.handleJoin.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.isOwned = this.isOwned.bind(this);
        this.getDisplayMedia = this.getDisplayMedia.bind(this);
        this.getPostAttribute = this.getPostAttribute.bind(this);
    }

    componentDidMount() {
        // this.isJoined();
        this.isOwned();
        //consoleLog("Mount Owned: " + this.state.isOwned);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.postID && !this.state.postID) {
            this.state.postID = newProps.postID;
        }
        const by = this.getPostAttribute("by");
        if (!this.props.open && newProps.open && newProps.postID && by) {
            this.props.fetchClient(by, ["id", "name", "gender", "birthday", "profileImagePath", "profilePicture"]);
        }
    }

    getPostAttribute(attribute) {
        if (this.state.postID) {
            let post = this.props.cache.posts[this.state.postID];
            if (post) {
                if (attribute.substr(attribute.length - 6) === "Length") {
                    attribute = attribute.substr(0, attribute.length - 6);
                    if (post[attribute] && post[attribute].length) {
                        return post[attribute].length;
                    }
                    else {
                        return 0;
                    }
                }
                return post[attribute];
            }
        }
        else {
            return null;
        }
    }

    getOwnerName() {
        const owner = this.getPostAttribute("by");
        if (owner) {
            if (this.props.cache.clients[owner]) {
                return this.props.cache.clients[owner].name
            }
            // else if (!this.props.info.isLoading) {
            //     this.props.fetchClient(owner, ["name"]);
            // }
        }
        return null;
    }

    handleDeletePostButton() {
        //consoleLog("Handling deleting the event");
        this.setState({isLoading: true});
        PostFunctions.delete(this.props.user.id, this.getPostAttribute("id"), (data) => {
            this.forceUpdate(data.id);
            // consoleLog(JSON.stringify(data));
            this.setState({isDeleteLoading: false, event: null, isOwned: false});
        }, (error) => {
            // consoleLog(JSON.stringify(error));
            this.setState({isDeleteLoading: false, error: error});
        })
    }

    // handleLeaveChallengeButton() {
    //     //consoleLog("Handling leaving the event");
    //     this.setState({isLoading: true});
    //     Lambda.removeClientFromEvent(this.props.user.id, this.props.user.id, this.getChallengeAttribute("id"), (data) => {
    //         this.forceUpdate(data.id);
    //         //consoleLog(JSON.stringify(data));
    //         this.setState({isLeaveLoading: false, isJoined: false});
    //     }, (error) => {
    //         //consoleLog(JSON.stringify(error));
    //         this.setState({isLeaveLoading: false, error: error});
    //     })
    // }

    // handleJoinChallengeButton() {
    //     //consoleLog("Handling joining the event");
    //     this.setState({isLoading: true});
    //     Lambda.clientJoinEvent(this.props.user.id, this.props.user.id, this.getChallengeAttribute("id"),
    //         (data) => {
    //             this.forceUpdate(data.id);
    //             //consoleLog(JSON.stringify(data));
    //             this.setState({isJoinLoading: false, isJoined: true});
    //         }, (error) => {
    //             this.setState({isJoinLoading: false, error: error});
    //         })
    // }

    // isJoined() {
    //     const members = this.getChallengeAttribute("members");
    //     if (members) {
    //         const isMembers = members.includes(this.props.user.id);
    //         //consoleLog("Is Members?: " + isMembers);
    //         this.setState({isJoined: isMembers});
    //         //consoleLog("am I in members?: " + members.includes(this.props.user.id));
    //     }
    //     else {
    //         this.setState({isJoined: false});
    //     }
    // }

    isOwned() {
        this.setState({isOwned: this.props.user.id === this.getPostAttribute("by")});
    }

    // handleLeave() {
    //     this.setState({isLeaveLoading: true});
    //     this.handleLeaveChallengeButton();
    // }
    // handleJoin() {
    //     this.setState({isJoinLoading: true});
    //     this.handleJoinChallengeButton();
    // }
    handleDelete() {
        this.setState({isDeleteLoading: true});
        this.handleDeleteEventButton();
    }

    // isCompleted() {
    //     return this.getChallengeAttribute("ifCompleted");
    // }

    openClientModal() { this.setState({clientModalOpen: true}); }
    closeClientModal() { this.setState({clientModalOpen: false}); }

    // openCompleteModal() { this.setState({completeModalOpen: true}); }
    // closeCompleteModal() { this.setState({completeModalOpen: false}); }

    forceUpdate = (postID) => {
        this.props.forceFetchPost(postID, ["time_created", "by", "description", "about", "access", "postType", "picturePaths", "videoPaths"]);
    };

    displayError() {
        if(this.state.error === "Error while trying to update an item in the database safely. Error: The item failed the checkHandler: That challenge is already filled up!") {
            return (<Message negative>
                <Message.Header>Sorry!</Message.Header>
                <p>That challenge is already filled up!</p>
            </Message>);
        }

    }

    getDisplayMedia() {
        // TODO How to properly display videos and pictures?
        const pictures = this.getPostAttribute("picturePaths");
        const videos = this.getPostAttribute("videoPaths");
        if (videos && videos.length > 0) {
            if (!this.state.videoURL) {
                const video = videos[0];
                Storage.get(video).then((url) => {
                    this.setState({videoURL: url});
                }).catch((error) => {
                    consoleError(error);
                });
            }
            else {
                //console.log("Video URL:" + this.state.videoURL);
                return (
                    <Player inline={true}>
                        <source src={this.state.videoURL} type="video/mp4"/>
                    </Player>
                );
            }
        }
    }

    render() {
        // function convertFromISO(dateTime) {
        //     let dateTimeString = String(dateTime);
        //     let dateTimes = String(dateTimeString).split("_");
        //     let fromDateString = dateTimes[0];
        //     let toDateString = dateTimes[1];
        //     let fromDate = new Date(fromDateString);
        //     let toDate = new Date(toDateString);
        //
        //     // Display time logic came from stack over flow
        //     // https://stackoverflow.com/a/18537115
        //     const fromHourInt = fromDate.getHours() > 12 ? fromDate.getHours() - 12 : fromDate.getHours();
        //     const toHourInt = toDate.getHours() > 12 ? toDate.getHours() - 12 : toDate.getHours();
        //     const fromminutes = fromDate.getMinutes().toString().length === 1 ? '0'+ fromDate.getMinutes() : fromDate.getMinutes(),
        //         fromhours = fromHourInt.toString().length === 1 ? '0'+ fromHourInt : fromHourInt,
        //         fromampm = fromDate.getHours() >= 12 ? 'PM' : 'AM',
        //         tominutes = toDate.getMinutes().toString().length === 1 ? '0'+ toDate.getMinutes() : toDate.getMinutes(),
        //         tohours = toHourInt.toString().length === 1 ? '0'+ toHourInt : toHourInt,
        //         toampm = toDate.getHours() >= 12 ? 'PM' : 'AM',
        //         months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        //         days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        //     return days[fromDate.getDay()]+', '+months[fromDate.getMonth()]+' '+fromDate.getDate()+', '+fromDate.getFullYear()+' '+fromhours+':'+fromminutes+fromampm + ' - '+tohours+':'+tominutes+toampm;
        // }

        if (!this.getPostAttribute("id")) {
            return(
                null
            );
        }
        if(this.state.canCallChecks) {
            this.isOwned();
            //consoleLog("Render Owned: " + this.state.isOwned);
            this.setState({canCallChecks: false});
            //consoleLog("Members: " + this.getChallengeAttribute("members") + "Joined?:  " + this.state.isJoined);
        }

        //This modal displays the challenge information and at the bottom contains a button which allows the user
        //to join a challenge.
        function createCorrectButton(isOwned, deleteHandler, isDeleteLoading) {
            //consoleLog("Owned: " + isOwned + " Joined: " + isJoined);
            // consoleLog(ifCompleted);
            if(isOwned) {
                // TODO This should also link the choose winner button
                return(
                    <div>
                        <Button loading={isDeleteLoading} fluid negative size="large" disabled={isDeleteLoading} onClick={deleteHandler}>Delete</Button>
                    </div>
                );
            }
            else {
                //consoleLog(isJoinLoading);
                return null;
            }
        }

        //consoleLog("Challenge Info: " + JSON.stringify(this.state.event));
        return(
            <Card>
                <Card.Header>{convertFromISO(this.getPostAttribute("time_created"))}</Card.Header>
                <Card.Content>
                    {this.getDisplayMedia()}
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
        fetchClient: (id, variablesList) => {
            dispatch(fetchClient(id, variablesList));
        },
        forceFetchUserAttributes: (attributeList) => {
            dispatch(forceFetchUserAttributes(attributeList));
        },
        fetchPost: (id, variablesList) => {
            dispatch(fetchPost(id, variablesList));
        },
        forceFetchPost: (id, variablesList) => {
            dispatch(forceFetchPost(id, variablesList));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SubmissionDetailCard);