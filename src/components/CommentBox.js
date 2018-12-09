import React, { Component } from 'react';
import {Button, Input, Grid} from "semantic-ui-react";
import {fetchUserAttributes, forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import connect from "react-redux/es/connect/connect";

class CommentBox extends Component {
    state = {
        sentRequest: false,
    };

    constructor(props) {
        super(props);
        this.addComment = this.addComment.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.user && this.props.user && newProps.user.id !== this.props.user.id) {
            this.resetState();
        }
        //alert("Comment User: " + JSON.stringify(this.props));
    }

    addComment(e) {
        // Prevent the default behaviour of form submit
        e.preventDefault();

        // Get the value of the comment box
        // and make sure it not some empty strings
        let comment = e.target.elements.comment.value.trim();
        //let name = this.props.user.username;
        let name = this.props.curUser;

        //alert(name);

        // Make sure name and comment boxes are filled
        if (comment) {
            //alert(name);
            const commentObject = { name, comment };

            this.props.handleAddComment(commentObject);

            // Publish comment
            /*global Ably*/

            const channel = Ably.channels.get('comments');
            channel.publish('add_comment', commentObject, err => {
                if (err) {
                    console.log('Unable to publish message; err = ' + err.message);
                }
            });

            // Clear input fields
            e.target.elements.comment.value = '';
        }
    }

    render() {
        return (
            <div>
                <form onSubmit={this.addComment}>
                    <Grid.Row>
                        <div className="field">
                            <div className="control">
                                <Input fluid className="textarea" name="comment" placeholder="Add a comment"></Input>
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <Button primary className="button is-primary">Submit</Button>
                            </div>
                        </div>
                    </Grid.Row>
                </form>
            </div>
        );
    }
}

export default CommentBox;