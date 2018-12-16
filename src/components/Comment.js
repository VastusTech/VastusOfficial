import React, { Component } from 'react';
import { Label } from 'semantic-ui-react'
import {fetchUserAttributes, forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import connect from "react-redux/es/connect/connect";
import {Player} from "video-react";

class Comment extends Component {

    createCorrectMessage() {
        if (this.props.user.username === this.props.comment.name){
            //alert(this.props.comment.comment.substr(0, 40) === 'https://vastusofficial.s3.amazonaws.com/');
            //alert(this.props.comment.comment.substr(0, 40));
            if (this.props.comment.comment.substr(0, 40) === 'https://vastusofficial.s3.amazonaws.com/') {
                return (
                    <Label fluid pointing='right' className='u-bg--primary'>
                        <Player>
                            <source src={this.props.comment.comment} type="video/mp4" />
                        </Player>
                    </Label>
                );
            }
            else
            {
                return (
                    <div className='u-text-align--right'>
                        <strong className='u-display--block u-margin-bottom--1'>{this.props.comment.name}</strong>
                        <Label pointing='right' size='large' className='u-bg--primary u-color--white u-font-weight--normal'>{this.props.comment.comment}
                        </Label>
                    </div>
                );
            }
        }
        else {
            if (this.props.comment.comment.substr(0, 40) === 'https://vastusofficial.s3.amazonaws.com/') {
                return (
                    <Label fluid pointing='left'>
                        <Player>
                            <source src={this.props.comment.comment} type="video/mp4" />
                        </Player>
                    </Label>
                );
            }
            else {
                return (
                    <div className='u-text-align--left'>
                        <strong className='u-display--block u-margin-bottom--1'>{this.props.comment.name}</strong>
                        <Label pointing='left' size='large' className='u-font-weight--normal'>{this.props.comment.comment}</Label>
                    </div>
                );
            }
        }
    }

    render() {
        return (
            <div className='u-margin-bottom--2'>
                {this.createCorrectMessage()}
            </div>
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