import React, { Component } from 'react';
import CommentBox from '../components/CommentBox';
import Comments from '../components/Comments';
import {Grid, Card} from "semantic-ui-react";
import {fetchUserAttributes, forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import connect from "react-redux/es/connect/connect";

class CommentScreen extends Component {
    state = {
        currentChannel: '',
        canCallHistory: true,
        comments: []
    };

    _isMounted = true;

    constructor(props) {
        super(props);
        this.handleAddComment = this.handleAddComment.bind(this);
    }

    componentDidMount() {
        /*global Ably*/

        this._isMounted = true;

        //alert(this.props.challengeChannel);

        const channel = Ably.channels.get(this.props.challengeChannel);

        let self = this;

        channel.subscribe(function getMsg(msg) {
            if(self._isMounted) {
                self.setState({comments: self.state.comments.concat(msg.data)});
            }
        });

        channel.attach();
        channel.once('attached', () => {
            channel.history((err, page) => {
                // create a new array with comments only in an reversed order (i.e old to new)
                const commentArray = Array.from(page.items.reverse(), item => item.data);

                //alert(JSON.stringify(commentArray));

                this.setState({comments: commentArray});
            });
        });
        //alert("Comment screen user: " + this.props.curUser);
    }


    componentDidUpdate() {
        //Don't call the history multiple times or else Ably will restrict us lol
        if(this.state.canCallHistory) {
            //alert("Getting the history");
            this.getHistory();
           //alert("I should only be called once");
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleAddComment(comment) {
        //alert("concatted: " + JSON.stringify(this.state.comments.concat(comment)));
        //this.setState({comments: this.state.comments.concat(comment)});
        //alert("after: " + JSON.stringify(this.state.comments));
    }

    getHistory() {
        const channel = Ably.channels.get(this.props.challengeChannel);

        this.setState({canCallHistory: false});

        channel.history((err, page) => {
            // create a new array with comments only in an reversed order (i.e old to new)
            const commentArray = Array.from(page.items.reverse(), item => item.data);

            //alert(JSON.stringify(commentArray));

            if(this._isMounted) {
                this.setState({comments: commentArray});
            }
        });
    }

    render() {
        //alert(JSON.stringify(this.props.user.name));

        //alert(this.props.user.name);

        return (
            <Card>
                <Card.Content>
                    <Grid.Row>
                        <div>{/*alert("Comment screen render user: " + this.props.curUser)*/}</div>
                        <Comments comments={this.state.comments}/>
                        <CommentBox handleAddComment={this.handleAddComment} curUser={this.props.curUser}
                        challengeChannel={this.props.challengeChannel}/>
                    </Grid.Row>
                </Card.Content>
            </Card>
        );
    }
}

export default CommentScreen;
