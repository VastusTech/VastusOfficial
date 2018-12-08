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

    constructor(props) {
        super(props);

        this.handleAddComment = this.handleAddComment.bind(this);
    }



    componentDidMount() {
        /*global Ably*/

        const channel = Ably.channels.get('comments');

        let self = this;

        channel.subscribe(function getMsg(msg) {
            self.setState({comments: self.state.comments.concat(msg.data)});
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
    }

    handleAddComment(comment) {
        //alert("concatted: " + JSON.stringify(this.state.comments.concat(comment)));
        //this.setState({comments: this.state.comments.concat(comment)});
        //alert("after: " + JSON.stringify(this.state.comments));
    }

    getHistory() {
        const channel = Ably.channels.get('comments');

        this.setState({canCallHistory: false});

        channel.history((err, page) => {
            // create a new array with comments only in an reversed order (i.e old to new)
            const commentArray = Array.from(page.items.reverse(), item => item.data);

            //alert(JSON.stringify(commentArray));

            this.setState({comments: commentArray});
        });
    }

    render() {
        //Don't call the history multiple times or else Ably will restrict us lol
        if(this.state.canCallHistory) {
            //alert("Getting the history");
            this.getHistory();
        }

        //alert(JSON.stringify(this.props.user.name));

        //alert(this.props.user.name);

        return (
            <Card>
                <Card.Content>
            <Grid.Row>
                <Comments comments={this.state.comments} />
                <CommentBox handleAddComment={this.handleAddComment}/>
            </Grid.Row>
                </Card.Content>
            </Card>
        );
    }
}

export default CommentScreen;