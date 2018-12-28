import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import PostDescriptionModal from './PostDescriptionModal';
import {Player} from "video-react";
import { connect } from 'react-redux';
import { fetchPost } from "../redux_helpers/actions/cacheActions";
import { convertFromISO } from "../logic/TimeHelper";
import ItemType from "../logic/ItemType";
import { Storage } from "aws-amplify";
import SubmissionDetailCard from "./post_detail_cards/SubmissionDetailCard";
import ChallengeDetailCard from "./post_detail_cards/ChallengeDetailCard";

type Props = {
    postID: string
};

/*
* Post Card
*
* This is the generic view for how a post shows up in any feeds or lists.
* It is used as a modal trigger in the feed.
 */
class PostCard extends Component {
    state = {
        error: null,
        // isLoading: true,
        postID: null,
        videoURL: null,
        // event: null,
        // members: {},
        // owner: null,
        // ifOwned: false,
        // ifJoined: false,
        // capacity: null,
        postModalOpen: false
    };

    constructor(props) {
        super(props);
        this.openPostModal = this.openPostModal.bind(this);
        this.closePostModal = this.closePostModal.bind(this);
        this.getDisplayMedia = this.getDisplayMedia.bind(this);
        this.getPostAttribute = this.getPostAttribute.bind(this);
    }

    // componentDidMount() {
    // if (this.props.event) {
    //     let ifOwned = false;
    //     let ifJoined = false;
    //     //console.log("Membahs: " + this.props.event.members);
    //     //console.log(this.props.owner + "vs. " + this.props.event.owner);
    //     if (this.props.user.id === this.props.event.owner) {
    //         //console.log("Same owner and cur user for: " + this.props.event.id);
    //         ifOwned = true;
    //     }
    //     if (this.props.event.members && this.props.event.members.includes(this.props.user.id)) {
    //         ifJoined = false;
    //     }
    //
    //     this.setState({isLoading: false, event: this.props.event, members: this.props.event.members, ifOwned, ifJoined});
    // }
    // }
    componentDidMount() {
        this.componentWillReceiveProps(this.props);
        console.log("Post Card Prop: " + this.props.postID);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.postID && !this.state.postID) {
            // this.props.fetchEvent(newProps.eventID, ["id", "title", "goal", "time", "time_created", "owner", "members", "capacity", "difficulty"]);
            this.setState({postID: newProps.postID});
        }
    }

    getPostAttribute(attribute) {
        //alert(this.props.postID);
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
        return null;
    }

    openPostModal = () => {
        if (!this.state.postModalOpen) {
            this.setState({postModalOpen: true})
        };
    }
    closePostModal = () => {this.setState({postModalOpen: false})};

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
                    console.error(error);
                });
            }
            else {
                return (
                    <Player inline={true}>
                        <source src={this.state.videoURL} type="video/mp4"/>
                    </Player>
                );
            }
        }
    }

    getOwnerName() {
        const owner = this.getPostAttribute("by");
        //alert(owner);
        if (owner) {
            if (this.props.cache.clients[owner]) {
                //alert(JSON.stringify(this.props.cache.clients[owner]));
                return this.props.cache.clients[owner].name
            }
            // else if (!this.props.info.isLoading) {
            //     this.props.fetchClient(owner, ["name"]);
            // }
        }
        return null;
    }

    getCorrectDetailCard() {
        const postType = this.getPostAttribute("postType");
        //alert("Post Type: " + postType);
        if (postType && postType.length) {
            let itemType = postType;
            //alert("Item Type: " + itemType);
            if (postType.substr(0, 3) === "new") {
                // TODO This indicates that this is for a newly created Item
                itemType = ItemType[postType.substring(3, postType.length)];
            }
            if (itemType) {
                // TODO Switch the post types
                if (itemType === "Client") {
                    //return (<ClientDetailCard displayMedia = {this.getDisplayMedia}/>);
                }
                else if (itemType === "Trainer") {
                    //return (<TrainerDetailCard displayMedia = {this.getDisplayMedia}/>);
                }
                else if (itemType === "Gym") {
                    //return (<GymDetailCard displayMedia = {this.getDisplayMedia}/>);
                }
                else if (itemType === "Workout") {
                    //return (<WorkoutDetailCard displayMedia = {this.getDisplayMedia}/>);
                }
                else if (itemType === "Review") {
                    //return (<ReviewDetailCard displayMedia = {this.getDisplayMedia}/>);
                }
                else if (itemType === "Event") {
                    //return (<EventDetailCard displayMedia = {this.getDisplayMedia}/>);
                }
                else if (itemType === "Challenge") {
                    return (<ChallengeDetailCard postID={this.state.postID}/>);
                }
                else if (itemType === "Invite") {
                    //return (<InviteDetailCard displayMedia = {this.getDisplayMedia}/>);
                }
                else if (itemType === "Post") {
                    //return (<PostDetailCard displayMedia = {this.getDisplayMedia}/>);
                }
                else if (itemType === "submission") {
                    //alert("This is a submission");
                    return (<SubmissionDetailCard postID={this.state.postID}/>);
                }
            }
        }
        return (<div/>);
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
                <Card fluid raised>
                    <h1>Loading...</h1>
                </Card>
            );
        }
        return(
            // This is displays a few important pieces of information about the challenge for the feed view.
            <Card fluid raised>
                <Card.Header textAlign = 'center'>{this.getOwnerName()} Posted a new {this.getPostAttribute("postType")}</Card.Header>
                <Card.Content>
                    {/*TODO: When the detail cards are done, uncomment this and comment out getDisplayMedia*/}
                    <div align='center'>
                        {this.getCorrectDetailCard()}
                    </div>
                    {/*this.getDisplayMedia()*/}
                </Card.Content>
                <Card.Content extra onClick={this.openPostModal}>
                    <Card.Meta textAlign = 'center'>{this.getPostAttribute("description")}</Card.Meta>
                    <PostDescriptionModal open={this.state.postModalOpen} onClose={this.closePostModal} postID={this.state.postID}/>
                </Card.Content>
                <Card.Content extra>
                    {/* <Card.Meta>{this.state.event.time_created}</Card.Meta> */}
                    <Card.Meta textAlign = 'center'>
                        {this.getPostAttribute("access")}
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
        fetchPost: (id, variablesList, dataHandler) => {
            dispatch(fetchPost(id, variablesList, dataHandler));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostCard);
