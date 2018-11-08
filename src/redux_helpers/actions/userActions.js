import QL from '../../GraphQL';
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
        QL.getClient(id, variableList, (data) => {
            dispatch(setUser(data));
            dispatch(setIsNotLoading());
        }, (error) => {
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