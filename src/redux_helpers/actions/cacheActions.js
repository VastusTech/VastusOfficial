import QL from "../../GraphQL";

export function fetchClient(id, variablesList) {
    return (dispatch) => {
        if (!variablesList.contains("id")) {
            variablesList = [...variablesList, "id"];
        }
        QL.getClient(id, variablesList, (data) => {
            dispatch({
                type: "FETCH_CLIENT",
                payload: data
            });
        }, (error) => {
            dispatch({
                type: "SET_ERROR",
                payload: error
            });
        });
    };
}
export function fetchTrainer(id, variablesList) {
    return (dispatch) => {
        if (!variablesList.contains("id")) {
            variablesList = [...variablesList, "id"];
        }
        QL.getTrainer(id, variablesList, (data) => {
            dispatch({
                type: "FETCH_CLIENT",
                payload: data
            });
        }, (error) => {
            dispatch({
                type: "SET_ERROR",
                payload: error
            });
        });
    };
}
export function fetchGym(id, variablesList) {
    return (dispatch) => {
        if (!variablesList.contains("id")) {
            variablesList = [...variablesList, "id"];
        }
        QL.getGym(id, variablesList, (data) => {
            dispatch({
                type: "FETCH_GYM",
                payload: data
            });
        }, (error) => {
            dispatch({
                type: "SET_ERROR",
                payload: error
            });
        });
    };
}
export function fetchWorkout(id, variablesList) {
    return (dispatch) => {
        if (!variablesList.contains("id")) {
            variablesList = [...variablesList, "id"];
        }
        QL.getWorkout(id, variablesList, (data) => {
            dispatch({
                type: "FETCH_WORKOUT",
                payload: data
            });
        }, (error) => {
            dispatch({
                type: "SET_ERROR",
                payload: error
            });
        });
    };
}
export function fetchReview(id, variablesList) {
    return (dispatch) => {
        if (!variablesList.contains("id")) {
            variablesList = [...variablesList, "id"];
        }
        QL.getReview(id, variablesList, (data) => {
            dispatch({
                type: "FETCH_REVIEW",
                payload: data
            });
        }, (error) => {
            dispatch({
                type: "SET_ERROR",
                payload: error
            });
        });
    };
}
export function fetchParty(id, variablesList) {
    return (dispatch) => {
        if (!variablesList.contains("id")) {
            variablesList = [...variablesList, "id"];
        }
        QL.getParty(id, variablesList, (data) => {
            dispatch({
                type: "FETCH_PARTY",
                payload: data
            });
        }, (error) => {
            dispatch({
                type: "SET_ERROR",
                payload: error
            });
        });
    };
}
export function fetchChallenge(id, variablesList) {
    return (dispatch) => {
        if (!variablesList.contains("id")) {
            variablesList = [...variablesList, "id"];
        }
        QL.getChallenge(id, variablesList, (data) => {
            dispatch({
                type: "FETCH_CHALLENGE",
                payload: data
            });
        }, (error) => {
            dispatch({
                type: "SET_ERROR",
                payload: error
            });
        });
    };
}

export function updateReadClient(id) {
    return {
        type: "READ_CLIENT",
        payload: { id }
    }
}
export function updateReadTrainer(id) {
    return {
        type: "READ_TRAINER",
        payload: { id }
    }
}
export function updateReadGym(id) {
    return {
        type: "READ_GYM",
        payload: { id }
    }
}
export function updateReadWorkout(id) {
    return {
        type: "READ_WORKOUT",
        payload: { id }
    }
}
export function updateReadReview(id) {
    return {
        type: "READ_REVIEW",
        payload: { id }
    }
}
export function updateReadParty(id) {
    return {
        type: "READ_PARTY",
        payload: { id }
    }
}
export function updateReadChallenge(id) {
    return {
        type: "READ_CHALLENGE",
        payload: { id }
    }
}
