import React, {Component, Fragment} from 'react'
import _ from 'lodash'
import {Grid, Image, Modal, Button, Item, Dimmer, Loader} from 'semantic-ui-react'
import { API, Auth, graphqlOperation } from "aws-amplify";
import setupAWS from '../AppConfig';
import proPic from "../img/BlakeProfilePic.jpg";
import QL from "../GraphQL";
import Lambda from "../Lambda";
import ClientModal from "./ClientModal";
import Notification from "./Notification";
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";
import {connect} from 'react-redux';

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
        isLoading: true,
        sentRequest: false,
        friendRequests: {}
    };

    constructor(props) {
        super(props);
        this.setState({isLoading: true});
        this.update();
    }


    componentDidMount() {
        this.update();
    }

    componentWillReceiveProps(newProps) {
        // this.setState({isLoading: true});
        this.props = newProps;
        this.update();
    }

    update() {
        const user = this.props.user;
        if (!user.id) {
            alert("Pretty bad error");
            this.setState({isLoading: true});
        }
        if (!this.props.user.hasOwnProperty("friendRequests") && !this.props.user.info.isLoading) {
            if (!this.state.sentRequest && !this.props.user.info.error) {
                this.props.fetchUserAttributes(user.id, ["id", "friendRequests"]);
                this.setState({sentRequest: true, isLoading: false});
            }
        }
    }

    //The buddy requests consists of a profile picture with the name of the user who has sent you a request.
    //To the right of the request is two buttons, one to accept and one to deny the current request.
    render() {
        if (this.state.isLoading) {
            return(
                <Dimmer>
                    <Loader/>
                </Dimmer>
            );
        }
        function rows(friendRequests, userID)
        {
            if (friendRequests != null) {
                return _.times(friendRequests.length, i => (
                    <Notification userID={userID} friendRequestID={friendRequests[i]}/>
                ));
            }
        }
        return(
            <Fragment>
                {rows(this.props.user.friendRequests, this.props.user.id)}
            </Fragment>
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

const mapStateToProps = (state) => ({
    user: state.user
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (id, attributesList) => {
            dispatch(fetchUserAttributes(id, attributesList));
        }
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(NotificationFeed);