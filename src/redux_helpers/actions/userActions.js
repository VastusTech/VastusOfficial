import QL from '../../GraphQL';
import { Storage } from "aws-amplify";
import {setError, clearError, setIsLoading, setIsNotLoading} from './infoActions';

export function setUser(user) {
    return {
        type: "SET_USER",
        payload: user
    };
}

// TODO
export function fetchUserAttributes(id, variableList) {
    return (dispatch) => {
        // alert("in fetchUserAttributes");
        // alert("we can do multiple dispatches");
        dispatch(setIsLoading());
        const pictureIndex = variableList.indexOf("profilePicture");
        if (pictureIndex !== -1) { variableList.splice(pictureIndex, 1); }
        QL.getClient(id, variableList, (data) => {
            if (pictureIndex !== -1 && data.profileImagePath) {
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
        }, (error) => {
            alert(JSON.stringify(error));
            dispatch(setError(error));
            dispatch(setIsNotLoading());
        });
    }
}

export function fetchUser(username) {
    return (dispatch) => {
        dispatch(setIsLoading());
        QL.getClientByUsername(username, ["id"], (data) => {
            dispatch(setUser(data));
            dispatch(setIsNotLoading());
        }, (error) => {
            alert(JSON.stringify(error));
            dispatch(setError(error));
            dispatch(setIsNotLoading());
        });
    }
}

export function clearUser() {
    return {
        type: 'CLEAR_USER'
    }
}