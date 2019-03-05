import React, {useState, useEffect} from 'react';
import {Icon, Label} from 'semantic-ui-react';
import {queryNextMessagesFromBoard} from "../../vastuscomponents/redux_actions/messageActions";
import {connect} from "react-redux";
import MessageHandler from "../../vastuscomponents/api/MessageHandler";

const MessageIcon = (props) => {
    const [unread, setUnread] = useState(false);

    useEffect(() => {
        const boards = props.user.messageBoards;
        if (boards) {
            for (let i = 0; i < boards.length; i++) {
                const boardID = boards[i];
                props.queryNextMessagesFromBoard(boardID, 1, () => {
                    const board = props.message.boards[boardID];
                    if (board && board.length > 0) {
                        if (MessageHandler.ifUnreadFor(props.user.id, board[0])) {
                            setUnread(true);
                        }
                    }
                });
            }
        }
    }, []);

    if (unread) {
        return (
            <div>
                <Icon name='comment' size='large'/>
                {props.user.messageBoards.length}
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
        queryNextMessagesFromBoard: (board, limit, dataHandler, failureHandler) => {
            dispatch(queryNextMessagesFromBoard(board, limit, dataHandler, failureHandler));
        }
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(MessageIcon);