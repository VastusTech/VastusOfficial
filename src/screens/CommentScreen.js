import React, { Component } from 'react';
import CommentBox from '../components/CommentBox';
import Comments from '../components/Comments';

class CommentScreen extends Component {
    constructor(props) {
        super(props);

        this.handleAddComment = this.handleAddComment.bind(this);

        this.state = {
            comments: []
        };
    }



    componentDidMount() {
        /*global Ably*/

        const channel = Ably.channels.get('comments');

        channel.subscribe(function(msg) {
            alert("Received: " + JSON.stringify(msg.data));
        });

        channel.attach();
        channel.once('attached', () => {
            channel.history((err, page) => {
                // create a new array with comments only in an reversed order (i.e old to new)
                const comments = Array.from(page.items.reverse(), item => item.data)

                this.setState({ comments });
            });
        });
    }

    handleAddComment(comment) {
        this.setState(prevState => {
            return {
                comments: prevState.comments.concat(comment)
            };
        });
    }

    render() {
        return (
            <section className="section">
                <div className="container">
                    <div className="columns">
                        <div className="column is-half is-offset-one-quarter">
                            <CommentBox handleAddComment={this.handleAddComment}/>
                            <Comments comments={this.state.comments.reverse()} />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default CommentScreen;