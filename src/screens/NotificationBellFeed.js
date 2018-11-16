import React, {Component, Fragment} from 'react'
import _ from 'lodash'
import {Dimmer, Loader, Grid} from 'semantic-ui-react'
// import { Operation } from "aws-amplify";
import Notification from "./Notification";
import {fetchUserAttributes, forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import {connect} from 'react-redux';
import {fetchInvite} from "../redux_helpers/actions/cacheActions";

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
        this.forceUpdate = this.forceUpdate.bind(this);
    }

    componentDidMount() {
        //this.setState({isLoading: true});
        // this.update();
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentWillReceiveProps(newProps) {
        //this.setState({isLoading: true});
        this.update();
    }

    update = () => {
        const user = this.props.user;
        //alert("Updating Scheduled Events");
        if (!user.id) {
            alert("Pretty bad error");
            this.setState({isLoading: true});
        }

        if (this.state.isLoading && user.hasOwnProperty("receivedInvites") && user.receivedInvites && user.receivedInvites.length) {
            this.setState({isLoading: false});
            for (let i = 0; i < user.receivedInvites.length; i++) {
                this.props.fetchEvent(user.receivedInvites[i], ["time_created", "from", "inviteType", "about", "description"]);
                // if (!(user.scheduledEvents[i] in this.state.events)) {
                //     this.addEventFromGraphQL(user.scheduledEvents[i]);
                // }
            }
        }
        else if (!this.props.info.isLoading) {
            if (!this.state.sentRequest && !this.props.info.error) {
                this.props.fetchUserAttributes(user.id, ["receivedInvites"]);
                this.setState({sentRequest: true});
            }
        }
    };

    forceUpdate = () => {
        this.props.forceFetchUserAttributes(this.props.user.id, ["receivedInvites"]);
    };

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

        function friendRows(friendRequests, userID, feedUpdate)
        {
            //alert(friendRequests);
            if (friendRequests != null) {
                return _.times(friendRequests.length, i => (
                    <Notification userID={userID} friendRequestID={friendRequests[i]} feedUpdate={feedUpdate}/>
                ));
            }
        }

        function challengeRows(eventRequests, userID)
        {
            //alert(friendRequests);
            if (eventRequests != null) {
                return _.times(eventRequests.length, i => (
                    <Notification userID={userID} eventRequestID={eventRequests[i]}/>
                ));
            }
        }
        return(
            <Fragment>
                {friendRows(this.props.user.friendRequests, this.props.user.id, this.forceUpdate.bind(this))}
                {challengeRows(this.props.user.invitedEvents, this.props.user.id)}
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    info: state.info
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (id, attributesList) => {
            dispatch(fetchUserAttributes(id, attributesList));
        },
        forceFetchUserAttributes: (id, attributeList) => {
            dispatch(forceFetchUserAttributes(id, attributeList));
        },
        fetchInvite: (id, variablesList) => {
            dispatch(fetchInvite(id, variablesList));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationFeed);