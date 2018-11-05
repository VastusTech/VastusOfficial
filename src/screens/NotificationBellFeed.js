import React, {Component} from 'react'
import _ from 'lodash'
import {Grid, Image, Modal, Button, Item} from 'semantic-ui-react'
import { API, Auth, graphqlOperation } from "aws-amplify";
import setupAWS from './AppConfig';
import proPic from "../img/BlakeProfilePic.jpg";
import QL from "../GraphQL";
import Lambda from "../Lambda";
import ClientModal from "./ClientModal";
import Notification from "./Notification";

setupAWS();

// function denyFriendRequest(userID, requestID) {
//     Lambda.declineFriendRequest(userID, userID, requestID, handleBudRequestSuccess, handleBudRequestFailure)
// }
//
// function acceptFriendRequest(userID, requestID) {
//     Lambda.acceptFriendRequest(userID, userID, requestID, handleBudRequestSuccess, handleBudRequestFailure)
// }
//
// function handleBudRequestSuccess(success) {
//     alert(JSON.stringify(success));
// }
//
// function handleBudRequestFailure(failure) {
//     alert(failure);
// }

/*
* Notification Feed
*
* This is a feed which contains all of the buddy (friend) requests that have been sent to the current user.
 */
class NotificationFeed extends Component {
    state = {
        error: null,
        isLoading: false,
        username: null,
        friendRequests: [],
    };

    constructor(props) {
        super(props);
        this.state.username = props.username;
        this.update();
    }


    componentDidMount() {

    }

    componentWillReceiveProps(newProps) {
        this.setState({username: newProps.username});
        this.update();
    }

    update() {
        if (!this.state.username) {
            return;
        }
        this.setState({isLoading: true});
        QL.getClientByUsername(this.state.username, ["friendRequests"], (data) => {
            if (data.friendRequests) {
                this.setState({friendRequests: data.friendRequests, isLoading: false});
            }
            else {
                this.setState({isLoading: false});
            }
        }, (error) => {

        });
    }


    //The buddy requests consists of a profile picture with the name of the user who has sent you a request.
    //To the right of the request is two buttons, one to accept and one to deny the current request.
    render() {
        function rows(friendRequests)
        {
            return _.times(friendRequests.length, i => (
                <Notification friendRequestID={friendRequests[i]}/>
            ));
        }

        return(
            <Grid>{rows(this.state.friendRequests)}</Grid>
        );
    }
}
// {/*<Modal>*/}
//     {/*<Modal.Header>Select a Photo</Modal.Header>*/}
//     {/*<Modal.Content image>*/}
//         {/*<Item>*/}
//             {/*<Item.Image size='medium' src={proPic} circular/>*/}
//             {/*<Item.Content>*/}
//                 {/*<Item.Header as='a'><div>{friendRequestNames[i]}</div></Item.Header>*/}
//                 {/*<Item.Extra>Friends: <div>{}</div></Item.Extra>*/}
//                 {/*<Item.Extra>Event Wins: <div>{}</div></Item.Extra>*/}
//             {/*</Item.Content>*/}
//         {/*</Item>*/}
//     {/*</Modal.Content>*/}
// {/*</Modal>*/}

export default NotificationFeed;