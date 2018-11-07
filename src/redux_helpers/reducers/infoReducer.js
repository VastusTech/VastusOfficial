const SET_ERROR = 'SET_ERROR';
const CLEAR_ERROR = 'CLEAR_ERROR';
const SET_IS_LOADING = 'SET_IS_LOADING';
const SET_IS_NOT_LOADING = 'SET_IS_NOT_LOADING';
const TOGGLE_IS_LOADING = 'TOGGLE_IS_LOADING';

export const infoFunctions = {
    SET_ERROR,
    CLEAR_ERROR,
    SET_IS_LOADING,
    SET_IS_NOT_LOADING,
    TOGGLE_IS_LOADING
};

export default {
    isLoading: false,
    error: null
};

export function infoReducer(state, action) {
    switch (action.type) {
        case SET_ERROR:
            state = {
                ...state,
                info: {
                    ...state.info,
                    error: action.payload
                }
            };
            break;
        case CLEAR_ERROR:
            state = {
                ...state,
                info: {
                    ...state.info,
                    error: null
                }
            };
            break;
        case SET_IS_LOADING:
            state = {
                ...state,
                info: {
                    ...state.info,
                    isLoading: true
                }
            };
            break;
        case SET_IS_NOT_LOADING:
            state = {
                ...state,
                info: {
                    ...state.info,
                    isLoading: false
                }
            };
            break;
        case TOGGLE_IS_LOADING:
            state = {
                ...state,
                info: {
                    ...state.info,
                    isLoading: !state.info.isLoading
                }
            };
            break;
    }
    return state;
}

