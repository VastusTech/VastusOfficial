import React, {Component} from 'react'
import _ from 'lodash'
import {Grid, Image, Modal, Button, Item, Dimmer, Loader} from 'semantic-ui-react'
import { API, Auth, Operation } from "aws-amplify";
import setupAWS from '../AppConfig';
import proPic from "../img/BlakeProfilePic.jpg";
import QL from "../GraphQL";
import Lambda from "../Lambda";
import ClientModal from "./ClientModal";
import Notification from "./Notification";
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";
import {connect} from 'react-redux';

// setupAWS();

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
        sentRequest: false,
        friendRequests: {}
    };

    _isMounted = false;

    constructor(props) {
        super(props);
        this.update();
        this.update = this.update.bind(this);
    }

    componentDidMount() {
        //this.setState({isLoading: true});
        this.update();
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentWillReceiveProps(newProps) {
        //this.setState({isLoading: true});
        this.props = newProps;
        this.update();
    }

    update = () => {
        //alert("Updooting");
        const user = this.props.user;
        if (!user.id) {
            alert("Pretty bad error");
            this.setState({isLoading: true});
        }
        if (!this.props.user.hasOwnProperty("friendRequests") && !this.props.user.info.isLoading) {
            if (!this.state.sentRequest && !this.props.user.info.error) {
                this.props.fetchUserAttributes(user.id, ["id", "friendRequests"]);
                //if(this._isMounted)
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
            //alert(friendRequests);
            if (friendRequests != null) {
                return _.times(friendRequests.length, i => (
                    <Notification userID={userID} friendRequestID={friendRequests[i]}/>
                ));
            }
        }
        return(
            <Grid>{rows(this.props.user.friendRequests, this.props.user.id)}</Grid>
        );
    }
}

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