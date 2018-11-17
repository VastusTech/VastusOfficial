import QL from '../../GraphQL';
import { Storage } from "aws-amplify";
import {setError, clearError, setIsLoading, setIsNotLoading} from './infoActions';
import defaultProfilePicture from "../../img/roundProfile.png";

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

export function forceFetchUserAttributes(id, variablesList) {
    return (dispatch) => {
        // Just overwrite all the user attributes because we want to process them again
        overwriteFetchUserAttributes(id, variablesList, dispatch);
    }
}

/**
 * This function will only get the user attributes if they haven't been got before.
 * This assumes that you don't care about refreshing these attributes often. Will use the cache.
 * @param id
 * @param variablesList
 * @returns {Function}
 */
export function fetchUserAttributes(id, variablesList) {
    return (dispatch, getStore) => {
        // alert("Filtering out results for fetch!");
        const userKeyList = Object.keys(getStore().user);
        // alert("Originally asked for variablesList = " + JSON.stringify(variablesList));
        // alert("UserKeyList = " + JSON.stringify(userKeyList));
        const filterVariablesList = variablesList.filter((v) => { return !userKeyList.includes(v) });
        // alert("Final filtered list is = " + JSON.stringify(filterVariablesList));
        overwriteFetchUserAttributes(id, filterVariablesList, dispatch);
    }
}

function overwriteFetchUserAttributes(id, variablesList, dispatch) {
    dispatch(setIsLoading());
    if (variablesList.length > 0) {
        const pictureIndex = variablesList.indexOf("profilePicture");
        if (pictureIndex !== -1) {
            variablesList.splice(pictureIndex, 1);
        }
        QL.getClient(id, variablesList, (data) => {
            if (pictureIndex !== -1) {
                if (data.profileImagePath) {
                    Storage.get(data.profileImagePath).then((url) => {
                        data = {
                            ...data,
                            profilePicture: url
                        };
                        dispatch(setUser(data));
                        dispatch(setIsNotLoading());
                    }, (error) => {
                        console.log("Failed to get profile image");
                        console.log(error);
                        dispatch(setUser(data));
                        dispatch(setIsNotLoading());
                    });
                }
                else {
                    // Put the default image there
                    data = {
                        ...data,
                        profilePicture: defaultProfilePicture
                    };
                    dispatch(setUser(data));
                    dispatch(setIsNotLoading());
                }
            }
            else {
                dispatch(setUser(data));
                dispatch(setIsNotLoading());
            }
        }, (error) => {
            alert(JSON.stringify(error));
            dispatch(setError(error));
            dispatch(setIsNotLoading());
        });
    }
    else {
        dispatch(setIsNotLoading());
    }
}

// export function fetchUser(username, successHandler, failureHandler) {
//     return (dispatch) => {
//         dispatch(setIsLoading());
//         QL.getClientByUsername(username, ["id", "username"], (data) => {
//             dispatch(setUser(data));
//             dispatch(setIsNotLoading());
//         }, (error) => {
//             alert(JSON.stringify(error));
//             dispatch(setError(error));
//             dispatch(setIsNotLoading());
//         });
//     }
// }

export function clearUser() {
    return {
        type: 'CLEAR_USER'
    }
}