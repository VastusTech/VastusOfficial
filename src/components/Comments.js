import React, { Component, Fragment } from 'react';
import Comment from './Comment';
import {Segment} from 'semantic-ui-react'

type Props = {
    board: string
};

class Comments extends Component<Props> {
    render() {
        return (
            <Fragment>
                <div style={{overflow: 'auto', maxHeight: '200px', display: 'flex', flexDirection: 'column-reverse'}}>
                {
                    this.props.comments.slice(0).reverse().map((comment, index) => {
                        return <Comment key={index} comment={comment} />
                    })
                }
                </div>
            </Fragment>
        );
    }
}

export default Comments;