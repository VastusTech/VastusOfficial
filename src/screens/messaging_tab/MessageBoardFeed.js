import React, {Component} from 'react';
import {Header} from "semantic-ui-react";
import {connect} from "react-redux";
import Spinner from "../../vastuscomponents/components/props/Spinner";
import MessageBoardCard from "./MessageBoardCard";
import {fetchUserAttributes} from "../../redux_helpers/actions/userActions";

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
            });
        }
    }

    render() {
        function rows(messageBoardIDs) {
            const cards = [];
            for (let i = 0; i < messageBoardIDs.length; i++) {
                cards.push(
                    <MessageBoardCard messageBoardID={messageBoardIDs[i]}/>
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

const mapStateToProps = state => ({
    user: state.user
});

const mapDispatchToProps = dispatch => {
    return {
        fetchUserAttributes: (variableList, dataHandler) => {
            dispatch(fetchUserAttributes(variableList, dataHandler));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageBoardFeed);