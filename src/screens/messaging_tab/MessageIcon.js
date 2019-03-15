import React, {useState, useEffect} from 'react';
import {Icon, Label} from 'semantic-ui-react';
import {
    peekAtFirstMessageFromBoard,
} from "../../vastuscomponents/redux_actions/messageActions";
import {connect} from "react-redux";
import MessageHandler from "../../vastuscomponents/api/MessageHandler";

const MessageIcon = (props) => {
    useEffect(() => {
        const boards = props.user.messageBoards;
        if (boards) {
            const numBoards = boards.length;
            for (let i = 0; i < numBoards; i++) {
                const boardID = boards[i];
                props.peekAtFirstMessageFromBoard(boardID);
            }
        }
    }, []);

    const numUnread = () => {
        let unread = 0;
        const boards = props.user.messageBoards;
        if (boards) {
            const numBoards = boards.length;
            for (let i = 0; i < numBoards; i++) {
                const board = props.message.boards[boards[i]];
                if (board && board.length > 0) {
                    if (MessageHandler.ifUnreadFor(props.user.id, board[0])) {
                        unread++;
                    }
                }
            }
        }
        return unread;
    };

    let unread = numUnread();
    if (unread > 0) {
        return (
            <div>
                <Icon name='comment' size='large'/>
                {unread}
            </div>
        );
    }
    else {
        return (
            <div>
                <Icon name='comment outline' size='large' />
            </div>
        );
    }
};

const mapStateToProps = state => ({
    user: state.user,
    message: state.message,
});

const mapDispatchToProps = dispatch => {
    return {
        peekAtFirstMessageFromBoard: (board) => {
            dispatch(peekAtFirstMessageFromBoard(board));
        }
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(MessageIcon);