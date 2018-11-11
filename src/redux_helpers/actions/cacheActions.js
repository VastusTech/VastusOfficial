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
            const profilePictureIndex = variablesList.indexOf("profilePicture");
            if (profilePictureIndex !== -1) { variablesList.splice(profilePictureIndex, 1); }
            QLFunction(id, variablesList, (data) => {
                if (profilePictureIndex !== -1 && data.profileImagePath) {
                    addProfilePictureToData(data, data.profileImagePath, (updatedData) => {
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
                    dispatch({
                        type: fetchDispatchType,
                        payload: data
                    });
                    dispatch({
                        type: "SET_IS_NOT_LOADING"
                    });
                }
            }, (error) => {
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
