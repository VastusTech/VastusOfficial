const ENABLE_TYPE = 'ENABLE_TYPE';
const DISABLE_TYPE = 'DISABLE_TYPE';
const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY';
const SET_TYPE_FILTER = 'SET_TYPE_FILTER';
const SET_TYPE_NEXT_TOKEN = 'SET_TYPE_NEXT_TOKEN';
const ADD_TYPE_RESULTS = 'ADD_TYPE_RESULTS';
const RESET_TYPE_QUERY = 'RESET_TYPE_QUERY';
const RESET_QUERY = 'RESET_QUERY';
// const CLEAR_TYPE_RESULTS = 'CLEAR_TYPE_RESULTS';
// const CLEAR_ALL_RESULTS = 'CLEAR_ALL_RESULTS';

// At most how many objects should be grabbed from a query at one time
const queryLimit = 100;

// This will determine the ratios of which objects to get out of the 
const typeRatios = {
    Client: 2, Trainer: 3, Gym: 5, Workout: 1, Review: 1, Event: 5, Challenge: 10, Invite: 1, Post: 15
};

const initialClientState = {
    enabled: true,
    variableList: ["id", "username", "gender", "birthday", "name", "friends", "challengesWon", /*"scheduledEvents",*/ "profileImagePath", "profilePicture", /*"friendRequests"*/],
    filterJSON: {
        or: [{
            username: {
                contains: "$searchQuery"
            }
        },{
            name: {
                contains: "$searchQuery"
            }
        },{
            email: {
                contains: "$searchQuery"
            }
        }]
    },
    filterParameters: {},
    nextToken: null,
    ifFirst: true,
    limit: 10,
    results: [],
};

const initialTrainerState = {
    enabled: true,
    variableList: [],
    filterJSON: {
        or: [{
            username: {
                contains: "$searchQuery"
            }
        },{
            name: {
                contains: "$searchQuery"
            }
        },{
            email: {
                contains: "$searchQuery"
            }
        }]
    },
    filterParameters: {},
    nextToken: null,
    ifFirst: true,
    limit: 10,
    results: [],
};

const initialGymState = {
    enabled: false,
    variableList: [],
    filterJSON: {
        or: [{
            username: {
                contains: "$searchQuery"
            }
        },{
            name: {
                contains: "$searchQuery"
            }
        },{
            email: {
                contains: "$searchQuery"
            }
        }]
    },
    filterParameters: {},
    nextToken: null,
    ifFirst: true,
    limit: 10,
    results: [],
};

const initialWorkoutState = {
    enabled: false,
    variableList: [],
    filterJSON: {},
    filterParameters: {},
    nextToken: null,
    ifFirst: true,
    limit: 10,
    results: [],
};

const initialReviewState = {
    enabled: false,
    variableList: [],
    filterJSON: {},
    filterParameters: {},
    nextToken: null,
    ifFirst: true,
    limit: 10,
    results: [],
};

const initialEventState = {
    enabled: false,
    variableList: [],
    filterJSON: {
        and: [{
            or: [{
                title: {
                    contains: "$searchQuery"
                }
            },{
                description: {
                    contains: "$searchQuery"
                }
            }]
        },{
            access: {
                eq: "$access"
            }
        }]
    },
    filterParameters: {
        access: "public",
    },
    nextToken: null,
    ifFirst: true,
    limit: 10,
    results: [],
};

const initialChallengeState = {
    enabled: true,
    variableList: [],
    filterJSON: {
        and: [{
            or: [{
                title: {
                    contains: "$searchQuery"
                }
            },{
                description: {
                    contains: "$searchQuery"
                }
            }]
        },{
            access: {
                eq: "$access"
            }
        }]
    },
    filterParameters: {
        access: "public",
    },
    nextToken: null,
    ifFirst: true,
    limit: 10,
    results: [],
};

const initialInviteState = {
    enabled: false,
    variableList: [],
    filterJSON: {},
    filterParameters: {},
    nextToken: null,
    ifFirst: true,
    limit: 10,
    results: [],
};

const initialPostState = {
    enabled: true,
    variableList: [],
    filterJSON: {},
    filterParameters: {},
    nextToken: null,
    ifFirst: true,
    limit: 10,
    results: [],
};

const initialState = {
    searchQuery: "",
    results: [],
    limit: 100, // This should be computed dynamically, based on how many types we're querying to maintain a certain number
    numTypesEnabled: 3,
    typeQueries: {
        Client: initialClientState,
        Trainer: initialTrainerState,
        Gym: initialGymState,
        Workout: initialWorkoutState,
        Review: initialReviewState,
        Event: initialEventState,
        Challenge: initialChallengeState,
        Invite: initialInviteState,
        Post: initialPostState
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        // TODO Update the retrieval limits based on what is enabled and not
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
        case SET_SEARCH_QUERY:
            state = {
                ...state,
                searchQuery: action.payload
            };
            break;
        case SET_TYPE_FILTER:
            state = {
                ...state,
                typeQueries: {
                    [action.payload.type]: {
                        ...state.typeQueries[action.payload.type],
                        filterJSON: action.payload.filterJSON,
                        filterParameters: action.payload.filterParameters
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
                        nextToken: action.payload.nextToken,
                        ifFirst: false
                    }
                },
            };
            break;
        case ADD_TYPE_RESULTS:
            state = {
                ...state,
                results: [...state.results, ...action.payload.results],
                typeQueries: {
                    [action.payload.type]: {
                        ...state.typeQueries[action.payload.type],
                        results: [
                            ...state.typeQueries[action.payload.type].results,
                            // TODO Spread or nah?
                            ...action.payload.results
                        ]
                    }
                }
            };
            break;
        case RESET_QUERY:
            state = {
                ...state,
                results: [],
            };
            for (const type in state.typeQueries) {
                if (state.typeQueries.hasOwnProperty(type)) {
                    state.typeQueries[type].results = [];
                    state.typeQueries[type].nextToken = null;
                    state.typeQueries[type].ifFirst = true;
                }
            }
            break;
        case RESET_TYPE_QUERY:
            state = {
                ...state,
                typeQueries: {
                    [action.payload]: {
                        ...state.typeQueries[action.payload],
                        results: [],
                        nextToken: null,
                        ifFirst: true,
                    }
                }
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
