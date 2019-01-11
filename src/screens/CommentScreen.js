import React, { Component } from 'react';
import CommentBox from "../components/CommentBox";
import Comments from '../components/Comments';
import { Icon, Message, Divider } from "semantic-ui-react";
import {fetchUserAttributes, forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import {fetchClient, fetchTrainer, fetchMessageQuery, getFetchItemFunction} from "../redux_helpers/actions/cacheActions";
import connect from "react-redux/es/connect/connect";
import QL from "../GraphQL";
import { getItemTypeFromID } from "../logic/ItemType";

type Props = {
    board: string,
};

class CommentScreen extends Component<Props> {
    state = {
        board: null,
        currentChannel: '',
        canCallHistory: true,
        comments: [],
        isLoading: true,
        messagesToFetch: 10,
        messageNextToken: null,
        ifFirst: true
    };

    _isMounted = true;

    // channelName = "persisted:" + this.props.challengeChannel;
    //channelName = this.props.challengeChannel;

    constructor(props) {
        super(props);
        this.handleAddComment = this.handleAddComment.bind(this);
    }

    componentDidMount() {

    }


    componentDidUpdate() {

    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentWillReceiveProps(newProps, nextContext) {
        if (this.state.board !== newProps.board) {
            this.state.board = newProps.board;
            // Set up the board
        }
    }

    handleAddComment(comment) {

    }

    getHistory() {

    }

    queryMessages() {
        if (this.state.ifFirst || this.state.messageNextToken) {
            const filter = QL.generateFilter();
            this.props.fetchMessageQuery(this.state.board, ["board", "id", "from", "message", "type"], filter, this.state.messagesToFetch, this.state.messageNextToken, (data) => {
                this.setState({messageNextToken: data.nextToken, ifFirst: false});
                if (data.items) {
                    //
                    for (let i = 0; i < data.items.length; i++) {
                        // Fetch the users
                        const message = data.items[i];
                        const fromItemType = getItemTypeFromID(message.from);
                        if (fromItemType === "Client") {
                            this
                        }
                        else if (fromItemType === "Trainer") {

                        }
                    }
                    this.setState([...this.state.comments, data.items]);
                    this.setState({isLoading: false});
                }
                else {
                    // TODO What to do if you get no results? Anything
                }
                    // TODO We can see private events
                    // console.log("got items");
                    const newlyQueriedPosts = [];
                    for (let i = 0; i < data.items.length; i++) {
                        const post = data.items[i];
                        //alert(JSON.stringify("")
                        this.props.fetchChallenge(data.items[i].about, ["title", "endTime", "tags", "time_created", "capacity", "members"]);
                        this.props.fetchClient(data.items[i].about, ["id", "profileImagePath", "name"]);
                        this.props.fetchPost(data.items[i].about, ["about", "by", "description", "picturePaths", "videoPaths"]);
                        newlyQueriedPosts.push(post);
                    }
                    this.setState({posts: [...this.state.posts, ...newlyQueriedPosts]});
                    for (let i = 0; i < data.items.length; i++) {
                        //console.log(data.items[i].time_created);
                        // console.log("Putting in event: " + JSON.stringify(data.items[i]));
                        // this.setState({events: [...this.state.events, data.items[i]]});
                        this.props.putPost(data.items[i]);
                    }
                this.setState({isLoading: false});
            }, (error) => {

            });
        }
    }

    loadHistory(historyLoading) {
        if (historyLoading) {
            return (
                    <Message icon>
                        <Icon name='spinner' size="small" loading />
                        <Message.Content>
                            <Message.Header>
                                Loading...
                            </Message.Header>
                        </Message.Content>
                    </Message>
            )
        }
    }

    render() {

        return (
            <div className='u-margin-top--4'>
                {/*console.log("Comment screen render user: " + this.props.curUser)*/}
                {this.loadHistory(this.state.isLoading)}
                <Comments comments={this.state.comments}/>
                <Divider className='u-margin-top--4' />
                <CommentBox handleAddComment={this.handleAddComment} curUser={this.props.curUser} curUserID={this.props.curUserID}
                    challengeChannel={this.channelName}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    cache: state.cache
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchMessageQuery: (board, variablesList, filter, limit, nextToken, dataHandler, failureHandler) => {
            dispatch(fetchMessageQuery(board, variablesList, filter, limit, nextToken, dataHandler, failureHandler));
        },
        getFetchItemFunction: (itemType) => {
            dispatch(getFetchItemFunction(itemType));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentScreen);
