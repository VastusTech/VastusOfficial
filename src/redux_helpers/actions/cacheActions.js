import { setIsNotLoading, setError, setIsLoading } from "./infoActions";
import QL from "../../GraphQL";
import { Storage } from "aws-amplify";

function addProfilePictureToData(data, imageKey, callback) {
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
    if (variablesList.length > 0) {
        if (!variablesList.includes("id")) {
            variablesList = [...variablesList, "id"];
        }
        QL[QLFunctionName](id, variablesList, (data) => {
            // alert("Successfully retrieved the QL info");
            if (profilePictureIndex !== -1 && data.profileImagePath) {
                alert("Adding profile image to the data");
                addProfilePictureToData(data, data.profileImagePath, (updatedData) => {
                    alert("Dispatching the profile image + data");
                    dispatch({
                        type: fetchDispatchType,
                        payload: updatedData
                    });
                    dispatch(setIsNotLoading());
                });
            }
            else {
                alert("Just dispatching the normal data");
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
