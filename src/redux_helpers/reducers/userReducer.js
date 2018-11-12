import info, { infoFunctions, infoReducer } from './infoReducer';
import auth, { authFunctions, authReducer } from "./authReducer";

const SET_USER = 'SET_USER';
const CLEAR_USER = 'CLEAR_USER';

const initialState = {
    info,
    auth,
    id: null,
};

export default (state = initialState, action) => {
    if (infoFunctions[action.type]) {
        return infoReducer(state, action);
    }
    else if (authFunctions[action.type]) {
        return authReducer(state, action);
    }

    switch (action.type) {
        // For the user, we want to be able to store all the pertinent information
        case SET_USER:
            // alert("REDUX SET USER, INIT STATE = " + JSON.stringify(state) + ", ACTION PAYLOAD = " + JSON.stringify(action.payload));
            state = {
                ...state,
                ...action.payload
            };
            // alert("STATE AFTER SET USER = " + JSON.stringify(state));
            break;
        case CLEAR_USER:
            state = {
                ...initialState,
                info: state.info
            };
            break;
        default:
            state = {
                ...initialState
            };
    }

    return state;
};
