
// TODO These detail cards are going to be embedded into the PostCard component when it is applicable. Reference
// TODO Facebook's little cards within posts when you share something for what I am imagining.

// TODO This will be for a post that is sharing an existing Post with your friends!

import React, { Component } from 'react';
import {Card, Modal, Button, Header, Icon, Divider, Image, Message, Dimmer, Loader} from 'semantic-ui-react';
import { connect } from 'react-redux';
import {fetchClient, fetchTrainer, forceFetchPost, fetchPost, removeItem} from "../../redux_helpers/actions/cacheActions";
import { convertFromISO } from "../../logic/TimeHelper";
import { forceFetchUserAttributes } from "../../redux_helpers/actions/userActions";
import PostFunctions from "../../databaseFunctions/PostFunctions";
import {Player} from "video-react";
import { Storage } from "aws-amplify";
import {getItemTypeFromID} from "../../logic/ItemType";
import {consoleError} from "../../logic/DebuggingHelper";

/*
* Event Description Modal
*
* This is the event description which displays more in depth information about a challenge, and allows the user
* to join the challenge.
 */
class PostDetailCard extends Component {
    state = {
        error: null,
        // isLoading: false,
        postID: null,
        // event: null,
        // ownerName: null,
        // members: {},
        clientModalOpen: false,
        videoURL: null,
        pictureURL: null,
        isOwned: null,
        isDeleteLoading: false,
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

    getClientAttribute(attribute) {
        if (this.getPostAttribute("by")) {
            //alert(this.getPostAttribute("by"));
            let client = this.props.cache.clients[this.getPostAttribute("by")];
            let trainer = this.props.cache.trainers[this.getPostAttribute("by")];
            //alert(JSON.stringify(this.props.cache.trainers));
            if (client) {
                //alert("Found the Client!");
                if (attribute.substr(attribute.length - 6) === "Length") {
                    attribute = attribute.substr(0, attribute.length - 6);
                    if (client[attribute] && client[attribute].length) {
                        return client[attribute].length;
                    }
                    else {
                        return 0;
                    }
                }
                return client[attribute];
            }
            else if(trainer) {
                if (attribute.substr(attribute.length - 6) === "Length") {
                    attribute = attribute.substr(0, attribute.length - 6);
                    if (trainer[attribute] && trainer[attribute].length) {
                        return trainer[attribute].length;
                    }
                    else {
                        return 0;
                    }
                }
                return client[attribute];
            }
        }
        else {
            return null;
        }
    }

    getOwnerName() {
        const owner = this.getPostAttribute("by");
        if (owner) {
            if (this.props.cache.clients[owner] || this.props.cache.trainers[owner]) {
                const itemType = getItemTypeFromID(owner);
                //alert(itemType);
                if(itemType === "Trainer") {
                    return this.props.cache.trainers[owner].name
                }
                if(itemType === "Client") {
                    return this.props.cache.clients[owner].name
                }
            }
            // else if (!this.props.info.isLoading) {
            //     this.props.fetchClient(owner, ["name"]);
            // }
        }
        return null;
    }

    profilePicture() {
        if (this.getClientAttribute("profileImagePaths") !== [] || this.getClientAttribute("profileImagePaths") !== null) {
            /*if(!this.state.urlsSet) {
                consoleLog(JSON.stringify("Paths being passed in: " + this.props.user.profileImagePaths));
                this.setURLS(this.getClientAttribute("profileImagePaths"));
                consoleLog("Setting URLS: " + this.state.galleryURLS);
                this.setState({urlsSet: true});
            }*/
            //alert(this.getClientAttribute("profilePicture"));
            return(
                <div avatar align="center" className="ui u-avatar tiny" style={{backgroundImage: `url(${this.getClientAttribute("profilePicture")})`}}></div>
            );
        }
        else {
            return(
                <Dimmer inverted>
                    <Loader />
                </Dimmer>
            );
        }
    }

    handleDeletePostButton() {
        //consoleLog("Handling deleting the event");
        this.setState({isLoading: true});
        PostFunctions.delete(this.props.user.id, this.getPostAttribute("id"), () => {
            this.forceUpdate(this.getPostAttribute("id"));
            // consoleLog(JSON.stringify(data));
            this.setState({isDeleteLoading: false, event: null, isOwned: false});
        }, (error) => {
            // consoleLog(JSON.stringify(error));
            this.setState({isDeleteLoading: false, error: error});
        })
    }

    isOwned() {
        this.setState({isOwned: this.props.user.id === this.getPostAttribute("by")});
    }

    handleDelete() {
        this.setState({isDeleteLoading: true});
        this.handleDeleteEventButton();
    }

    openClientModal() { this.setState({clientModalOpen: true}); }
    closeClientModal() { this.setState({clientModalOpen: false}); }

    forceUpdate = (postID) => {
        // alert("FORCE UPDATE = " + postID);
        this.props.removeItem("Post", postID);
        // this.props.forceFetchPost(postID, ["time_created", "by", "description", "about", "access", "postType", "picturePaths", "videoPaths"]);
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
        //alert("Displaying Media");
        const pictures = this.getPostAttribute("picturePaths");
        const videos = this.getPostAttribute("videoPaths");
        //alert(pictures + " and " + videos);
        if ((videos && videos.length > 0) || (pictures && pictures.length > 0)) {
            if (!this.state.videoURL && videos) {
                //alert("getting video URL");
                const video = videos[0];
                Storage.get(video).then((url) => {
                    this.setState({videoURL: url});
                }).catch((error) => {
                    consoleError(error);
                });
            }
            else if(!this.state.pictureURL && pictures) {
                //alert("getting picture URL");
                const picture = pictures[0];
                Storage.get(picture).then((url) => {
                    this.setState({pictureURL: url});
                }).catch((error) => {
                    consoleError(error);
                })
            }
            else if(this.state.videoURL && !this.state.pictureURL) {
                //alert(this.state.videoURL);
                return (
                    <Player inline={true}>
                        <source src={this.state.videoURL} type="video/mp4"/>
                    </Player>
                );
            }
            else if(!this.state.videoURL && this.state.pictureURL) {
                //alert(this.state.pictureURL);
                return (
                    <Image src={this.state.pictureURL}/>
                );
            }
            else if((this.state.videoURL && this.state.pictureURL)) {
                //alert(this.state.pictureURL + "and" + this.state.videoURL);
                return (
                    <div>
                        {/*this.state.videoURL*/}
                        <Player inline={true}>
                            <source src={this.state.videoURL} type="video/mp4"/>
                        </Player>
                        <Image src={this.state.pictureURL}/>
                    </div>
                );
            }
            else return null;
        }
    }

    render() {
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
                        <Button loading={isDeleteLoading} primary fluid size="tiny" disabled={isDeleteLoading} onClick={deleteHandler}><Icon name='delete'/></Button>
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
                <Card.Header>
                    <Button className="u-button--flat" onClick={this.openClientModal.bind(this)}>{this.profilePicture()}{this.getOwnerName()}</Button>
                </Card.Header>
                <Card.Content>
                    <Card.Description>
                        {this.getPostAttribute("description")}
                    </Card.Description>
                    {this.getDisplayMedia()}
                </Card.Content>
                <Card.Content extra>
                    {createCorrectButton(this.isOwned, this.handleDeletePostButton, this.state.isDeleteLoading)}
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
        fetchTrainer: (id, variablesList) => {
            dispatch(fetchTrainer(id, variablesList));
        },
        forceFetchUserAttributes: (attributeList) => {
            dispatch(forceFetchUserAttributes(attributeList));
        },
        fetchPost: (id, variablesList) => {
            dispatch(fetchPost(id, variablesList));
        },
        removeItem: (itemType, id) => {
            dispatch(removeItem(itemType, id));
        },
        forceFetchPost: (id, variablesList) => {
            dispatch(forceFetchPost(id, variablesList));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostDetailCard);