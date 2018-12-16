import React, { Component, Fragment } from 'react';
import {Button, Input, Grid, Label, Icon} from "semantic-ui-react";
import { Storage } from 'aws-amplify';
import {fetchUserAttributes, forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import connect from "react-redux/es/connect/connect";
import Lambda from "../Lambda";
import defaultProfilePicture from "../img/roundProfile.png";

class CommentBox extends Component {
    state = {
        imagePath: '',
        imageURL: '',
        sentRequest: false,
        canAddImage: true
    };

    constructor(props) {
        super(props);
        this.addComment = this.addComment.bind(this);
        this.addPicOrVid = this.addPicOrVid.bind(this);
        this.setPicture = this.setPicture.bind(this);
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
            //alert(this.props.challengeChannel);
            const channel = Ably.channels.get(this.props.challengeChannel);
            channel.publish('add_comment', commentObject, err => {
                if (err) {
                    console.log('Unable to publish message; err = ' + err.message);
                }
            });

            // Clear input fields
            e.target.elements.comment.value = '';
        }
    }

    addPicOrVid(url) {
        // Get the value of the comment box
        // and make sure it not some empty strings
        let comment = url;
        //let name = this.props.user.username;
        let name = this.props.curUser;

        //alert(name);
        //alert(name);
        const commentObject = { name, comment };

        this.props.handleAddComment(commentObject);

        // Publish comment
        /*global Ably*/
        //alert(this.props.challengeChannel);
        const channel = Ably.channels.get(this.props.challengeChannel);
        channel.publish('add_comment', commentObject, err => {
            alert("Added Comment: " + commentObject.comment);
            if (err) {
                console.log('Unable to publish message; err = ' + err.message);
            }
        });
    }

    setPicture(event) {
        //alert(JSON.stringify(this.props));
        //alert(this.props.curUserID);
        if (this.props.curUserID) {
            const path = "/ClientFiles/" + this.props.curUserID + "/commentImage" + Math.floor((Math.random() * 10000000000000) + 1);

            Storage.get(path).then((url) => {
                this.setState({imageURL: url})
            }).catch((error) => {
                console.error("ERROR IN GETTING PROFILE IMAGE FOR USER");
                console.log("ERROR IN GETTING PROFILE IMAGE FOR USER");
                console.error(error);
            });

            //alert("Calling storage put");
            //alert("File = " + JSON.stringify(event.target.files[0]));
            Storage.put(path, event.target.files[0], { contentType: "video/*;image/*" }).then((result) => {
                this.setState({imagePath: path});
                this.setState({isLoading: true});
            }).catch((error) => {
                alert("failed storage put");
                alert(error);
            });
        }
    }



    render() {
        if(this.state.imageURL && this.state.canAddImage) {
            alert("Image URL found: " + this.state.imageURL);
            this.addPicOrVid(this.state.imageURL);
            this.setState({canAddImage: false});
        }
        return (
            <Fragment>
                <form onSubmit={this.addComment} className='u-margin-top--3'>
                    <Input type='text' action fluid className="textarea" name="comment" placeholder="Write Message...">
                        <input />
                        <Label as='label' for='proPicUpload' basic className='u-bg--input u-margin--0 u-border-x--0 u-border-y--1 u-border-color--border u-radius--0 u-flex u-flex-justify--center u-flex-align--center'>
                            <Icon name='camera' className='u-margin--0' />
                            <input type="file" accept="video/*;capture=camcorder" id="proPicUpload" hidden='true' onChange={this.setPicture}/>
                        </Label>
                        <Button primary>Send</Button>
                    </Input>
                    
                </form>
            </Fragment>
        );
    }
}

export default CommentBox;