import React, { Component } from 'react';
import {Modal, Button, List, Message} from 'semantic-ui-react';
import ClientModal from "./ClientModal";
import { connect } from 'react-redux';
import { fetchClient, forceFetchPost, fetchPost } from "../../redux_helpers/actions/cacheActions";
import { convertFromISO } from "../../logic/TimeHelper";
import { forceFetchUserAttributes } from "../../redux_helpers/actions/userActions";
import PostFunctions from "../../databaseFunctions/PostFunctions";

/*
* Event Description Modal
*
* This is the event description which displays more in depth information about a challenge, and allows the user
* to join the challenge.
 */
class PostDescriptionModal extends Component {
    state = {
        // isLoading: false,
        postID: null,
        // event: null,
        // ownerName: null,
        // members: {},
        clientModalOpen: false,
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
        // this.isJoined = this.isJoined.bind(this);
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

    render() {

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
            <Modal closeIcon open={this.props.open} onClose={this.props.onClose.bind(this)}>
                <Modal.Header>{convertFromISO(this.getPostAttribute("time_created"))}</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <ClientModal open={this.state.clientModalOpen} onClose={this.closeClientModal.bind(this)} clientID={this.getPostAttribute("by")}/>
                        <List relaxed>
                            <List.Item>
                                <List.Icon name='user' />
                                <List.Content>
                                    Created by <Button className="u-button--flat" onClick={this.openClientModal.bind(this)}>{this.getOwnerName()}</Button>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='calendar' />
                                <List.Content>
                                    {convertFromISO(this.getPostAttribute("time_created"))}
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='description' />
                                <List.Content>
                                    {this.getPostAttribute("description")}
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='access' />
                                <List.Content>
                                    {this.getPostAttribute("access")}
                                </List.Content>
                            </List.Item>
                            {/*TODO This is going to be where we show the DETAIL CARD (or some equivalent)*/}
                            <List.Item>
                                <List.Icon name='users' />
                                <List.Content>
                                    <Modal trigger={<Button className="u-button--flat u-padding-left--1">About</Button>} closeIcon>
                                        <Modal.Content>
                                        </Modal.Content>
                                    </Modal>
                                </List.Content>
                            </List.Item>
                        </List>
                        {createCorrectButton(this.state.isOwned, this.handleDelete, this.state.isDeleteLoading)}
                    </Modal.Description>
                    <div>{this.displayError()}</div>
                    {/*
                        <Modal trigger={<Button primary id="ui center aligned"><Icon name="comment outline"/></Button>}>
                            <Grid>
                                <div id="ui center align">

                                </div>
                            </Grid>
                        </Modal>
                        */}
                </Modal.Content>
            </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(PostDescriptionModal);
