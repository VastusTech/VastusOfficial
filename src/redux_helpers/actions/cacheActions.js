import { setIsNotLoading, setError, setIsLoading } from "./infoActions";
import QL from "../../GraphQL";
import { Storage } from "aws-amplify";
import defaultProfilePicture from "../../img/roundProfile.png";

function addProfilePictureToData(data, imageKey, callback) {
    if (imageKey) {
        Storage.get(imageKey).then((url) => {
            callback({
                ...data,
                profilePicture: url
            });
        }).catch((error) => {
            alert("ERROR IN GETTING PROFILE IMAGE FOR USER");
            console.log("ERROR IN GETTING PROFILE IMAGE FOR USER");
            console.log(error);
            callback(data);
        });
    }
    else {
        callback({
            ...data,
            profilePicture: defaultProfilePicture
        });
    }
}
function fetch(id, variablesList, cacheSet, QLFunctionName, fetchDispatchType) {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        const currentObject = getStore().cache[cacheSet][id];
        if (currentObject) {
            const objectKeyList = Object.keys(currentObject);
            variablesList = variablesList.filter((v) => { return !objectKeyList.includes(v) });
            // alert("Final filtered list is = " + JSON.stringify(variablesList));
        }
        overwriteFetch(id, variablesList, cacheSet, QLFunctionName, fetchDispatchType, dispatch);
    };
}
function forceFetch(id, variablesList, cacheSet, QLFunctionName, fetchDispatchType) {
    return (dispatch) => {
        dispatch(setIsLoading());
        overwriteFetch(id, variablesList, cacheSet, QLFunctionName, fetchDispatchType, dispatch);
    };
}
function overwriteFetch(id, variablesList, cacheSet, QLFunctionName, fetchDispatchType, dispatch) {
    const profilePictureIndex = variablesList.indexOf("profilePicture");
    if (profilePictureIndex !== -1) {
        // alert("The variable list is requesting the profilePicture to be uploaded as well.");
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
    if (variablesList.length > 0) {
        if (!variablesList.includes("id")) {
            variablesList = [...variablesList, "id"];
        }
        QL[QLFunctionName](id, variablesList, (data) => {
            // alert("Successfully retrieved the QL info");
            if (profilePictureIndex !== -1) {
                // alert("Adding profile image to the data");
                addProfilePictureToData(data, data.profileImagePath, (updatedData) => {
                    // alert("Dispatching the profile image + data");
                    dispatch({
                        type: fetchDispatchType,
                        payload: updatedData
                    });
                    dispatch(setIsNotLoading());
                });
            }
            else {
                // alert("Just dispatching the normal data");
                dispatch({
                    type: fetchDispatchType,
                    payload: data
                });
                dispatch(setIsNotLoading());
            }
        }, (error) => {
            alert("Error in retrieval");
            dispatch(setError(error));
            dispatch(setIsNotLoading());
        });
    }
    else {
        dispatch({
            type: fetchDispatchType,
            payload: {id}
        });
        dispatch(setIsNotLoading());
    }
}
export function fetchClient(id, variablesList) {
    return fetch(id, variablesList, "clients", "getClient", "FETCH_CLIENT");
}
export function fetchTrainer(id, variablesList) {
    return fetch(id, variablesList, "trainers", "getTrainer", "FETCH_TRAINER");
}
export function fetchGym(id, variablesList) {
    return fetch(id, variablesList, "gyms", "getGym", "FETCH_GYM");
}
export function fetchWorkout(id, variablesList) {
    return fetch(id, variablesList, "workouts", "getWorkout", "FETCH_WORKOUT");
}
export function fetchReview(id, variablesList) {
    return fetch(id, variablesList, "reviews", "getReview", "FETCH_REVIEW");
}
export function fetchEvent(id, variablesList) {
    return fetch(id, variablesList, "events", "getEvent", "FETCH_EVENT");
}
// TODO Consider how this might scale? Another LRU Cache here?
export function putClientQuery(queryString, queryResult) {
    return {
        type: "FETCH_CLIENT_QUERY",
        payload: {
            queryString,
            queryResult
        }
    };
}
export function putTrainerQuery(queryString, queryResult) {
    return {
        type: "FETCH_TRAINER_QUERY",
        payload: {
            queryString,
            queryResult
        }
    };
}
export function putGymQuery(queryString, queryResult) {
    return {
        type: "FETCH_GYM_QUERY",
        payload: {
            queryString,
            queryResult
        }
    };
}
export function putWorkoutQuery(queryString, queryResult) {
    return {
        type: "FETCH_WORKOUT_QUERY",
        payload: {
            queryString,
            queryResult
        }
    };
}
export function putReviewQuery(queryString, queryResult) {
    return {
        type: "FETCH_REVIEW_QUERY",
        payload: {
            queryString,
            queryResult
        }
    };
}
export function putEventQuery(queryString, queryResult) {
    return {
        type: "FETCH_EVENT_QUERY",
        payload: {
            queryString,
            queryResult
        }
    };
}
export function putClient(client) {
    return {
        type: "FETCH_EVENT",
        payload: client
    };
}
export function putTrainer(trainer) {
    return {
        type: "FETCH_EVENT",
        payload: trainer
    };
}
export function putGym(gym) {
    return {
        type: "FETCH_EVENT",
        payload: gym
    };
}
export function putWorkout(workout) {
    return {
        type: "FETCH_EVENT",
        payload: workout
    };
}
export function putReview(review) {
    return {
        type: "FETCH_EVENT",
        payload: review
    };
}
export function putEvent(event) {
    return {
        type: "FETCH_EVENT",
        payload: event
    };
}
