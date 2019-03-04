import React, {Component} from 'react';
import {Header} from "semantic-ui-react";
import {connect} from "react-redux";
import Spinner from "../../vastuscomponents/components/props/Spinner";
import MessageBoardCard from "./MessageBoardCard";
import {fetchUserAttributes} from "../../redux_helpers/actions/userActions";
import {log} from "../../Constants";
import MessageHandler from "../../vastuscomponents/api/MessageHandler";
import {getObjectAttribute} from "../../vastuscomponents/logic/ReduxHelper";
import {fetchItem} from "../../vastuscomponents/redux_actions/cacheActions";
import {getItemTypeFromID} from "../../vastuscomponents/logic/ItemType";

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
                        const ids = MessageHandler.getIDsFromBoard(board);
                        for (const key in ids) {
                            if (ids.hasOwnProperty(key) && ids[key] !== newProps.userID) {
                                // fetch the attributes
                                const id = ids[key];
                                const itemType = getItemTypeFromID(id);
                                if (itemType === "Client" || itemType === "Trainer") {
                                    this.props.fetchItem(getItemTypeFromID(id), id, ["name"]);
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    render() {
        const boardTitle = (board) => {
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
        function rows(messageBoardIDs) {
            const cards = [];
            for (let i = 0; i < messageBoardIDs.length; i++) {
                const board = messageBoardIDs[i];
                cards.push(
                    <MessageBoardCard messageBoardTitle={boardTitle(board)} messageBoardID={board}/>
                );
            }
            return cards;
        }

        if (this.state.isLoading) {
            return(
                <Spinner/>
            )
        }
        else if (this.state.messageBoards && this.state.messageBoards.length > 0) {
            return (
                <div>
                    <Header> Message Boards: </Header>
                    {rows(this.state.messageBoards)}
                </div>
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
    info: state.info
});

const mapDispatchToProps = dispatch => {
    return {
        fetchUserAttributes: (variableList, dataHandler) => {
            dispatch(fetchUserAttributes(variableList, dataHandler));
        },
        fetchItem: (itemType, id, variableList, dataHandler, failureHandler) => {
            dispatch(fetchItem(itemType, id, variableList, dataHandler, failureHandler));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageBoardFeed);