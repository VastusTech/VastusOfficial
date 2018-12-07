import React, { Component } from 'react';
import CommentBox from '../components/CommentBox';
import Comments from '../components/Comments';

class CommentScreen extends Component {
    state = {
        currentChannel: '',
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

                alert(JSON.stringify(commentArray));

                this.setState({comments: commentArray});
            });
        });
    }

    handleAddComment(comment) {
        //alert("concatted: " + JSON.stringify(this.state.comments.concat(comment)));
        //this.setState({comments: this.state.comments.concat(comment)});
        //alert("after: " + JSON.stringify(this.state.comments));
    }

    update() {
        const channel = Ably.channels.get('comments');

        channel.history((err, page) => {
            // create a new array with comments only in an reversed order (i.e old to new)
            const commentArray = Array.from(page.items.reverse(), item => item.data);

            //alert(JSON.stringify(commentArray));

            this.setState({comments: commentArray});
        });
    }

    render() {
        this.update();
        return (
            <section className="section">
                <div className="container">
                    <div className="columns">
                        <div className="column is-half is-offset-one-quarter">
                            <Comments comments={this.state.comments} />
                            <CommentBox handleAddComment={this.handleAddComment}/>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default CommentScreen;