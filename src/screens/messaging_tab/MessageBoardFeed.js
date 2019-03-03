import React, {Component} from 'react';
import {Header} from "semantic-ui-react";
import {connect} from "react-redux";
import Spinner from "../../vastuscomponents/components/props/Spinner";
import MessageBoardCard from "./MessageBoardCard";
import {fetchUserAttributes} from "../../redux_helpers/actions/userActions";
import {log} from "../../Constants";

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

    getAttribute(attribute, messageBoardID) {
        let id = messageBoardID.substr(12, 11);
        alert(Object.keys(this.props.cache.clients).length);
        alert(id);

        if(id.substr(0, 2) === "CL") {
            let client = this.props.cache.clients[id];
            if (client) {
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
        }
        else if(id.substr(0, 2) === "TR") {
            let trainer = this.props.cache.trainers[id];
            if (trainer) {
                if (attribute.substr(attribute.length - 6) === "Length") {
                    attribute = attribute.substr(0, attribute.length - 6);
                    if (trainer[attribute] && trainer[attribute].length) {
                        return trainer[attribute].length;
                    }
                    else {
                        return 0;
                    }
                }
                return trainer[attribute];
            }
        }
    }

    render() {
        let they = this;
        function rows(messageBoardIDs) {
            const cards = [];
            for (let i = 0; i < messageBoardIDs.length; i++) {
                cards.push(
                    <MessageBoardCard messageBoardID={messageBoardIDs[i]}
                                      otherBoardUserName={they.getAttribute("name", messageBoardIDs[i])}/>
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
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageBoardFeed);