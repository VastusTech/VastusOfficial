const ENABLE_TYPE = 'ENABLE_TYPE';
const DISABLE_TYPE = 'DISABLE_TYPE';
const SET_TYPE_FILTER = 'SET_TYPE_FILTER';
const SET_TYPE_VARIABLE_LIST = 'SET_TYPE_VARIABLE_LIST';
const SET_TYPE_NEXT_TOKEN = 'SET_TYPE_NEXT_TOKEN';

// At most how many objects should be grabbed from a query at one time
const queryLimit = 100;
const typeRatios = {

};

const initialState = {
    queryString: "",
    results: [],
    limit: 100, // This should be computed dynamically, based on how many types we're querying to maintain a certain number
    numTypesEnabled: 3,
    typeQueries: {
        Client: {
            enabled: true,
            variableList: [],
            filter: null,
            nextToken: null,
            limit: 10,
            results: [],
        },
        Trainer: {
            enabled: true,
            variableList: [],
            filter: null,
            nextToken: null,
            limit: 10,
            results: [],
        },
        Gym: {
            enabled: false,
            variableList: [],
            filter: null,
            nextToken: null,
            limit: 10,
            results: [],
        },
        Workout: {
            enabled: false,
            variableList: [],
            filter: null,
            nextToken: null,
            limit: 10,
            results: [],
        },
        Review: {
            enabled: false,
            variableList: [],
            filter: null,
            nextToken: null,
            limit: 10,
            results: [],
        },
        Event: {
            enabled: false,
            variableList: [],
            filter: null,
            nextToken: null,
            limit: 10,
            results: [],
        },
        Challenge: {
            enabled: true,
            variableList: [],
            filter: null,
            nextToken: null,
            limit: 10,
            results: [],
        },
        Invite: {
            enabled: false,
            variableList: [],
            filter: null,
            nextToken: null,
            limit: 10,
            results: [],
        },
        Post: {
            enabled: true,
            variableList: [],
            filter: null,
            nextToken: null,
            limit: 10,
            results: [],
        }
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ENABLE_TYPE:
            state = {
                ...state,
                typeQueries: {
                    [action.payload]: {
                        ...state.typeQueries[action.payload],
                        enabled: true
                    }
                },
            };
            state.numTypesEnabled = getNumTypesEnabled(state);
            break;
        case DISABLE_TYPE:
            state = {
                ...state,
                typeQueries: {
                    [action.payload]: {
                        ...state.typeQueries[action.payload],
                        enabled: false
                    }
                },
            };
            state.numTypesEnabled = getNumTypesEnabled(state);
            break;
        case SET_TYPE_FILTER:
            state = {
                ...state,
                typeQueries: {
                    [action.payload.type]: {
                        ...state.typeQueries[action.payload.type],
                        filter: action.payload.filter
                    }
                },
            };
            break;
        case SET_TYPE_VARIABLE_LIST:
            state = {
                ...state,
                typeQueries: {
                    [action.payload.type]: {
                        ...state.typeQueries[action.payload.type],
                        variableList: action.payload.variableList
                    }
                },
            };
            break;
        case SET_TYPE_NEXT_TOKEN:
            state = {
                ...state,
                typeQueries: {
                    [action.payload.type]: {
                        ...state.typeQueries[action.payload.type],
                        nextToken: action.payload.nextToken
                    }
                },
            };
            break;
        default:
            state = {
                ...state
            };
            break;
    }
    // alert("INFO: Did " + action.type + " and now state is = " + JSON.stringify(state));
    return state;
}

function getNumTypesEnabled(state) {
    let numTypesEnabled = 0;
    for (const key in state.typeQueries) {
        if (state.typeQueries.hasOwnProperty(key)) {
            if (state.typeQueries[key].enabled === true) {
                numTypesEnabled++;
            }
        }
    }
    return numTypesEnabled;
}
