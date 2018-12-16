import React, { Component } from 'react';
import { Label } from 'semantic-ui-react'
import {fetchUserAttributes, forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import connect from "react-redux/es/connect/connect";
import {Player} from "video-react";
import { Storage } from 'aws-amplify';

class Comment extends Component {
    state = {
        imageUrl: null
    };

    createCorrectMessage() {
        if (this.props.user.username === this.props.comment.name){
            //alert(this.props.comment.comment.substr(0, 40) === 'https://vastusofficial.s3.amazonaws.com/');
            //alert(this.props.comment.comment.substr(0, 40));
            //if (this.props.comment.comment.substr(0, 40) === 'https://vastusofficial.s3.amazonaws.com/') {
                Storage.get(this.props.comment.comment).then((url) => {
                    this.setState({imageURL: url})
                }).catch((error) => {
                    console.error("ERROR IN GETTING PROFILE IMAGE FOR USER");
                    console.log("ERROR IN GETTING PROFILE IMAGE FOR USER");
                    console.error(error);
                });

                if(this.state.imageUrl) {
                    return (
                        <Label className='ui right fluid' pointing='right' color='purple'>
                            <Player preload>
                                <source src={this.state.imageUrl} type="video/mp4"/>
                            </Player>
                        </Label>
                    );
                }
            //}

            /*{
                return (
                    <Label className='ui right fluid' pointing='right'
                           color='purple'>{this.props.comment.comment}</Label>
                );
            }*/
        }
        else {
            if (this.props.comment.comment.substr(0, 40) === 'https://vastusofficial.s3.amazonaws.com/') {
                return (
                    <Label className='ui left fluid' pointing='left'>
                        <Player>
                            <source src={this.props.comment.comment} type="video/mp4" />
                        </Player>
                    </Label>
                );
            }
            else {
                return (
                    <Label pointing='left'>{this.props.comment.comment}</Label>
                );
            }
        }
    }

    render() {
        return (
            <article className="media">
                <figure className="media-left">
                </figure>
                <div className="media-content">
                    <div className="content">
                        <strong className='u-margin-bottom--1'>{this.props.comment.name}</strong>
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