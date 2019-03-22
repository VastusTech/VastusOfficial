import React, {useState, useEffect} from 'react'
import {Icon} from 'semantic-ui-react'
import {fetchUserAttributes, forceFetchUserAttributes} from "../../redux_helpers/actions/userActions";
import {connect} from 'react-redux';
import {fetchChallenge, fetchEvent, fetchGroup, fetchInvite} from "../../vastuscomponents/redux_actions/cacheActions";

/*
* NotificationCard Feed
*
* This is a feed which contains all of the buddy (friend) requests that have been sent to the current user.
 */
const NotificationBell = (props) => {
    const [numNotifications, setNumNotifications] = useState(0);

    useEffect(() => {
        const fetchAndAddReceivedInvites = (itemType, id) => {
            let fetchFunction;
            if (itemType === "Event") { fetchFunction = props.fetchEvent; }
            if (itemType === "Challenge") { fetchFunction = props.fetchChallenge; }
            if (itemType === "Group") { fetchFunction = props.fetchGroup; }
            fetchFunction(id, ["receivedInvites"], (data) => {
                if (data.hasOwnProperty("receivedInvites") && data.receivedInvites) {
                    setNumNotifications((prevNumNotifications) => (prevNumNotifications + data.receivedInvites.length));
                }
            });
        };
        const data = props.user;
        if (data) {
            if (data.hasOwnProperty("receivedInvites") && data.receivedInvites) {
                setNumNotifications((prevNumNotifications) => (prevNumNotifications + data.receivedInvites.length));
            }
            if (data.hasOwnProperty("ownedEvents") && data.ownedEvents) {
                for (let i = 0; i < data.ownedEvents.length; i++) {
                    fetchAndAddReceivedInvites("Event", data.ownedEvents[i]);
                }
            }
            if (data.hasOwnProperty("ownedChallenges") && data.ownedChallenges) {
                // console.log("Grabbing " + data.ownedChallenges.length + " challenges for notification bell");
                for (let i = 0; i < data.ownedChallenges.length; i++) {
                    fetchAndAddReceivedInvites("Challenge", data.ownedChallenges[i]);
                }
            }
            if (data.hasOwnProperty("ownedGroups") && data.ownedGroups) {
                for (let i = 0; i < data.ownedGroups.length; i++) {
                    fetchAndAddReceivedInvites("Group", data.ownedGroups[i]);
                }
            }
        }
    }, [props.user.receivedInvites, props.user.ownedEvents, props.user.ownedChallenges, props.user.ownedGroups]);

    if (numNotifications > 0) {
        return (
            <div {...props}>
                <Icon name='bell' size='big'/>
                {numNotifications}
            </div>
        );
    }
    else {
        return (
            <Icon name='bell outline' size='large'/>
        );
    }
};

const mapStateToProps = (state) => ({
    user: state.user,
    info: state.info
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (attributesList, dataHandler) => {
            dispatch(fetchUserAttributes(attributesList, dataHandler));
        },
        forceFetchUserAttributes: (attributeList) => {
            dispatch(forceFetchUserAttributes(attributeList));
        },
        fetchEvent: (id, variablesList, dataHandler) => {
            dispatch(fetchEvent(id, variablesList, dataHandler));
        },
        fetchChallenge: (id, variablesList, dataHandler) => {
            dispatch(fetchChallenge(id, variablesList, dataHandler));
        },
        fetchGroup: (id, variablesList, dataHandler) => {
            dispatch(fetchGroup(id, variablesList, dataHandler));
        },
        fetchInvite: (id, variablesList, dataHandler) => {
            dispatch(fetchInvite(id, variablesList, dataHandler));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationBell);
