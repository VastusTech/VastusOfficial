import React, { Component } from 'react';
import { Label } from 'semantic-ui-react'
import {fetchUserAttributes, forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import connect from "react-redux/es/connect/connect";

class Comment extends Component {
    createCorrectMessage() {
        if (this.props.user.username === this.props.comment.name){
            return (
                <Label className='ui right fluid' pointing='right' color='purple'>{this.props.comment.comment}</Label>
            );
        }
        else {
            return (
                <Label pointing='left'>{this.props.comment.comment}</Label>
            );
        }
    }

    render() {
        return (
            <article className="media">
                <figure className="media-left">
                </figure>
                <div className="media-content">
                    <div className="content">
                        <strong>{this.props.comment.name}</strong>
                        <br />
                        {this.createCorrectMessage()}
                    </div>
                </div>
            </article>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    info: state.info
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (attributesList) => {
            dispatch(fetchUserAttributes(attributesList));
        },
        forceFetchUserAttributes: (variablesList) => {
            dispatch(forceFetchUserAttributes(variablesList));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);