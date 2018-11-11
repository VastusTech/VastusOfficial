import QL from "../../GraphQL";
import { Storage } from "aws-amplify";

function addProfilePictureToData(data, imageKey, callback) {
    Storage.get(imageKey).then((url) => {
        callback({
            ...data,
            profilePicture: url
        });
    }).catch((error) => {
        console.log("ERROR IN GETTING PROFILE IMAGE FOR USER");
        console.log(error);
        callback(data);
    });
}
function fetch(id, variablesList, cacheSet, QLFunction, fetchDispatchType, readDispatchType) {
    return (dispatch, getState) => {
        dispatch({
            type: "SET_IS_LOADING"
        });
        if (!variablesList.contains("id")) {
            variablesList = [...variablesList, "id"];
        }
        const currentObject = getState().cache[cacheSet][id];
        if (!currentObject || variablesList.some(v => !Object.keys(currentObject).includes(v))) {
            alert("There is something still to fetch in this object");
            const profilePictureIndex = variablesList.indexOf("profilePicture");
            if (profilePictureIndex !== -1) {
                alert("The variable list is requesting the profilePicture to be uploaded as well.");
                variablesList.splice(profilePictureIndex, 1);
                // Add
                if (!variablesList.includes("profileImagePath")) {
                    alert("lmao you forgot to include the profile image path, I'll include it tho, no worries");
                    variablesList = [
                        ...variablesList,
                        "profileImagePath"
                    ]
                }
            }
            QLFunction(id, variablesList, (data) => {
                alert("Successfully retrieved the QL info");
                if (profilePictureIndex !== -1 && data.profileImagePath) {
                    alert("Adding profile image to the data");
                    addProfilePictureToData(data, data.profileImagePath, (updatedData) => {
                        alert("Dispatching the profile image + data");
                        dispatch({
                            type: fetchDispatchType,
                            payload: updatedData
                        });
                        dispatch({
                            type: "SET_IS_NOT_LOADING"
                        });
                    });
                }
                else {
                    alert("Just dispatching the normal data");
                    dispatch({
                        type: fetchDispatchType,
                        payload: data
                    });
                    dispatch({
                        type: "SET_IS_NOT_LOADING"
                    });
                }
            }, (error) => {
                alert("Error in retrieval");
                dispatch({
                    type: "SET_ERROR",
                    payload: error
                });
                dispatch({
                    type: "SET_IS_NOT_LOADING"
                });
            });
        }
        else {
            // We're fine, so just update it in the cache
            alert("Nothing to fetch, just updating the LRU Handler");
            dispatch({
                type: readDispatchType,
                payload: { id }
            });
        }
    };
}
export function fetchClient(id, variablesList) {
    return fetch(id, variablesList, "clients", QL.getClient, "FETCH_CLIENT", "READ_CLIENT");
}
export function fetchTrainer(id, variablesList) {
    return fetch(id, variablesList, "trainers", QL.getTrainer, "FETCH_TRAINER", "READ_TRAINER");
}
export function fetchGym(id, variablesList) {
    return fetch(id, variablesList, "gyms", QL.getGym, "FETCH_GYM", "READ_GYM");
}
export function fetchWorkout(id, variablesList) {
    return fetch(id, variablesList, "workouts", QL.getWorkout, "FETCH_WORKOUT", "READ_WORKOUT");
}
export function fetchReview(id, variablesList) {
    return fetch(id, variablesList, "reviews", QL.getReview, "FETCH_REVIEW", "READ_REVIEW");
}
export function fetchEvent(id, variablesList) {
    return fetch(id, variablesList, "events", QL.getEvent, "FETCH_EVENT", "READ_EVENT");
}
