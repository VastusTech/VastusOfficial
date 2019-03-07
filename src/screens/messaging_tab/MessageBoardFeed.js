import React, {Component} from 'react';
import {Dimmer, Header, Loader, Grid} from "semantic-ui-react";
import {connect} from "react-redux";
import Spinner from "../../vastuscomponents/components/props/Spinner";
import MessageBoardCard from "./MessageBoardCard";
import {fetchUserAttributes} from "../../redux_helpers/actions/userActions";
import {err, log} from "../../Constants";
import MessageHandler from "../../vastuscomponents/api/MessageHandler";
import {getObjectAttribute} from "../../vastuscomponents/logic/CacheRetrievalHelper";
import {fetchItem} from "../../vastuscomponents/redux_actions/cacheActions";
import {getItemTypeFromID} from "../../vastuscomponents/logic/ItemType";
import {queryNextMessagesFromBoard, setBoardRead} from "../../vastuscomponents/redux_actions/messageActions";
import MessageFunctions from "../../vastuscomponents/database_functions/MessageFunctions";

type Props = {
    userID: string
};

/**
 * This class will display all the Message boards we are currently a part of
 */
class MessageBoardFeed extends Component<Props> {
    state = {
        userID: null,
        isLoading: false,
        messageBoards: null,
    };

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.userID && this.state.userID !== newProps.userID) {
            this.state.userID = newProps.userID;
            this.state.isLoading = true;
            this.props.fetchUserAttributes(["messageBoards"], (user) => {
                this.setState({messageBoards: user.messageBoards, isLoading: false});
                for (const key in user.messageBoards) {
                    if (user.messageBoards.hasOwnProperty(key)) {
                        const board = user.messageBoards[key];
                        // this.props.queryNextMessagesFromBoard(board, 1);
                        const ids = MessageHandler.getIDsFromBoard(board);
                        for (const key in ids) {
                            if (ids.hasOwnProperty(key) && ids[key] !== newProps.userID) {
                                // fetch the attributes
                                const id = ids[key];
                                const itemType = getItemTypeFromID(id);
                                if (itemType === "Client" || itemType === "Trainer") {
                                    this.props.fetchItem(getItemTypeFromID(id), id, ["name", "profileImagePath"]);
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    boardTitle(board) {
        const ids = MessageHandler.getIDsFromBoard(board);
        if (ids.length === 1) {
            // challenge / event / group ? Will these be here? Actually totally yes!
        }
        else if (ids.length === 2) {
            // other user(s)
            // single chat
            for (const key in ids) {
                if (ids.hasOwnProperty(key) && this.state.userID !== ids[key]) {
                    const title = getObjectAttribute(ids[key], "name", this.props.cache);
                    return title;
                }
            }
        }
        else {
            // Multi-group chat
        }
        return "";
    };
    lastMessage(board) {
        const boards = this.props.message.boards;
        const messages = boards[board];
        if (messages && messages.length > 0) {
            return messages[0].message;
        }
        return "";
    };
    boardProPic(board) {
        const ids = MessageHandler.getIDsFromBoard(board);
        if (ids.length === 1) {
            // challenge / event / group ? Will these be here? Actually totally yes!
        }
        else if (ids.length === 2) {
            // other user(s)
            // single chat
            for (const key in ids) {
                if (ids.hasOwnProperty(key) && this.state.userID !== ids[key]) {
                    const url = getObjectAttribute(ids[key], "profileImage", this.props.cache);
                    return url;
                }
            }
        }
        else {
            // Multi-group chat
        }
        return "";
    };
    unread(board) {
        if (board && this.props.message.boards[board] && this.props.message.boards[board].length > 0) {
            return MessageHandler.ifUnreadFor(this.props.user.id, this.props.message.boards[board][0]);
        }
        return false;
    };
    clickCard(board) {
        // alert("Reading boardID = " + board);
        if (this.unread(board)) {
            alert("SENDING LAMBDA FOR UNREAD");
            MessageFunctions.addLastSeen(this.props.user.id, board, this.props.message.boards[board][0].id, this.props.user.id, () => {
                this.props.setBoardRead(board, this.props.user.id);
                log&&console.log("Updated message board read status successfully!");
            }, (error) => {
                err&&console.error("Could not update read status for message board!");
                err&&console.error(error);
            });
        }
    }

    render() {
        const rows = (messageBoardIDs) => {
            const cards = [];
            for (let i = 0; i < messageBoardIDs.length; i++) {
                const board = messageBoardIDs[i];
                cards.push(
                    <MessageBoardCard
                        messageBoardProPic={this.boardProPic(board)}
                        messageBoardTitle={this.boardTitle(board)}
                        messageBoardLastMessage={this.lastMessage(board)}
                        messageBoardID={board}
                        unread={this.unread(board)}
                        onClickCard={this.clickCard.bind(this)}
                    />
                );
            }
            return cards;
        };

        if (this.state.isLoading) {
            return(
                <Spinner/>
            )
        }
        else if (this.state.messageBoards && this.state.messageBoards.length > 0) {
            return (
                <Grid fluid>
                    <Header> Message Boards: </Header>
                    {rows(this.state.messageBoards)}
                </Grid>
            );
        }
        else {
            return(
                <div>
                    <Header fluid> No Message Boards Yet! </Header>
                </div>
            )
        }
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    cache: state.cache,
    info: state.info,
    message: state.message
});

const mapDispatchToProps = dispatch => {
    return {
        fetchUserAttributes: (variableList, dataHandler) => {
            dispatch(fetchUserAttributes(variableList, dataHandler));
        },
        fetchItem: (itemType, id, variableList, dataHandler, failureHandler) => {
            dispatch(fetchItem(itemType, id, variableList, dataHandler, failureHandler));
        },
        queryNextMessagesFromBoard: (board, limit, dataHandler, failureHandler) => {
            dispatch(queryNextMessagesFromBoard(board, limit, dataHandler, failureHandler));
        },
        setBoardRead: (board, userID) => {
            dispatch(setBoardRead(board, userID));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageBoardFeed);