import {setIsNotLoading} from '../../vastuscomponents/redux_actions/infoActions';
import {fetchItem, forceFetchItem, subscribeFetchItem} from "../../vastuscomponents/redux_actions/cacheActions";
import {getItemTypeFromID} from "../../vastuscomponents/logic/ItemType";

// TODO Cache the user into the clients so that we actually are getting from there
export function setUser(user) {
    return {
        type: "SET_USER",
        payload: user
    };
}
export function forceSetUser(user) {
    return {
        type: "FORCE_SET_USER",
        payload: user
    };
}

export function forceFetchUserAttributes(variablesList, dataHandler) {
    return (dispatch, getStore) => {
        // Just overwrite all the user attributes because we want to process them again
        const userID = getStore().user.id;
        if (userID) {
            forceFetchItem(getItemTypeFromID(userID), userID, variablesList, (client) => {
                dispatch(setUser(client));
                dispatch(setIsNotLoading());
                if (dataHandler) { dataHandler(getStore().user);}
            })(dispatch, getStore);
        }
    }
}

/**
 * This function will only get the user attributes if they haven't been got before.
 * This assumes that you don't care about refreshing these attributes often. Will use the cache.
 * @param id
 * @param variablesList
 * @param dataHandler
 * @returns {Function}
 */
export function fetchUserAttributes(variablesList, dataHandler) {
    return (dispatch, getStore) => {
        const userID = getStore().user.id;
        if (userID) {
            fetchItem(getItemTypeFromID(userID), userID, variablesList, (client) => {
                dispatch(setUser(client));
                dispatch(setIsNotLoading());
                if (dataHandler) { dataHandler(getStore().user); }
            })(dispatch, getStore);
        }
    }
}
export function subscribeFetchUserAttributes(variablesList, dataHandler) {
    return (dispatch, getStore) => {
        const userID = getStore().user.id;
        if (userID) {
            dispatch(subscribeFetchItem(getItemTypeFromID(userID), userID, variablesList, (client) => {
                dispatch(setUser(client));
                dispatch(setIsNotLoading());
                if (dataHandler) { dataHandler(getStore().user); }
            }));
        }
    }
}

export function clearUser() {
    return {
        type: 'CLEAR_USER'
    }
}