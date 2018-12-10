import React, { Component } from 'react';
import Comment from './Comment';
import {Segment} from 'semantic-ui-react'

class Comments extends Component {
    render() {
        return (
            //<Segment style={{overflow: 'auto', maxHeight: 200 }}>
            <div>
                    {
                        this.props.comments.map((comment, index) => {
                            //alert(index + ":" + JSON.stringify(comment));
                            return <Comment key={index} comment={comment} />
                        })
                    }
            </div>
            //</Segment>
        );
    }
}

export default Comments;