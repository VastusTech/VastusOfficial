// import info, { infoFunctions, infoReducer } from './infoReducer';

// This is where we will store all the retrieved database items and use a LRU cache to rid them if necessary
const FETCH_CLIENT = 'FETCH_CLIENT';
const FETCH_TRAINER = 'FETCH_TRAINER';
const FETCH_GYM = 'FETCH_GYM';
const FETCH_WORKOUT = 'FETCH_WORKOUT';
const FETCH_REVIEW = 'FETCH_REVIEW';
const FETCH_EVENT = 'FETCH_EVENT';

// const READ_CLIENT = 'READ_CLIENT';
// const READ_TRAINER = 'READ_TRAINER';
// const READ_GYM = 'READ_GYM';
// const READ_WORKOUT = 'READ_WORKOUT';
// const READ_REVIEW = 'READ_REVIEW';
// const READ_EVENT = 'READ_EVENT';

// TODO Play around with these values maybe? How do we decide this?
const clientCacheSize = 100;
const trainerCacheSize = 100;
const gymCacheSize = 100;
const workoutCacheSize = 100;
const reviewCacheSize = 100;
const eventCacheSize = 2000;

const initialState = {
    // info,
    clients: {},
    trainers: {},
    gyms: {},
    workouts: {},
    reviews: {},
    events: {},

    clientLRUHandler: [],
    trainerLRUHandler: [],
    gymLRUHandler: [],
    workoutLRUHandler: [],
    reviewLRUHandler: [],
    eventLRUHandler: []
};

export default (state = initialState, action) => {
    // if (infoFunctions[action.type]) {
    //     return infoReducer(state, action);
    // }
    switch (action.type) {
        case FETCH_CLIENT:
            // TODO Also make sure that the item to get also has all the attributes we desire?
            state = addObjectToCache(state, "clients", clientCacheSize, "clientLRUHandler", action.payload);
            break;
        case FETCH_TRAINER:
            state = addObjectToCache(state, "trainers", trainerCacheSize, "trainerLRUHandler", action.payload);
            break;
        case FETCH_GYM:
            state = addObjectToCache(state, "gyms", gymCacheSize, "gymLRUHandler", action.payload);
            break;
        case FETCH_WORKOUT:
            state = addObjectToCache(state, "workouts", workoutCacheSize, "workoutLRUHandler", action.payload);
            break;
        case FETCH_REVIEW:
            state = addObjectToCache(state, "reviews", reviewCacheSize, "reviewLRUHandler", action.payload);
            break;
        case FETCH_EVENT:
            state = addObjectToCache(state, "events", eventCacheSize, "eventLRUHandler", action.payload);
            break;
        // case READ_CLIENT:
        //     state = updateReadObject(state, "clients", "clientLRUHandler", action.payload);
        //     break;
        // case READ_TRAINER:
        //     state = updateReadObject(state, "trainers", "trainerLRUHandler", action.payload);
        //     break;
        // case READ_GYM:
        //     state = updateReadObject(state, "gyms", "gymLRUHandler", action.payload);
        //     break;
        // case READ_WORKOUT:
        //     state = updateReadObject(state, "workouts", "workoutLRUHandler", action.payload);
        //     break;
        // case READ_REVIEW:
        //     state = updateReadObject(state, "reviews", "reviewLRUHandler", action.payload);
        //     break;
        // case READ_EVENT:
        //     state = updateReadObject(state, "events", "eventLRUHandler", action.payload);
    }
    return state;
};

function addObjectToCache(state, cacheName, maxCacheSize, LRUHandlerName, object) {
    // TODO Check to see that this is all well-formed?
    if (!object.id) {
        alert("Adding object to cache does not include the id!!!");
    }
    if (!state[cacheName][object.id]) {
        state = {
            ...state
        };
        const cache = { ...state[cacheName] };
        const LRUHandler = [ ...state[LRUHandlerName] ];
        LRUHandler.unshift(object.id);
        cache[object.id] = object;
        // TODO If the ID is not already in the cache
        if (LRUHandler.length >= maxCacheSize) {
            // Then we have to pop something out
            delete cache[LRUHandler.pop()];
        }
        state[cacheName] = cache;
        state[LRUHandlerName] = LRUHandler;
        return state;
    }
    else {
        // TODO Update the object
        return updateReadObject(state, cacheName, LRUHandlerName, object);
    }
}

function updateReadObject(state, cacheName, LRUHandlerName, object) {
    state = {
        ...state
    };
    let LRUHandler = [...state[LRUHandlerName]];
    let index = LRUHandler.indexOf(object.id);
    if (index > -1) {
        LRUHandler.splice(index, 1);
    }
    LRUHandler.unshift(object.id);
    state[LRUHandlerName] = LRUHandler;
    // Then we update the object with the additional fields that it may have (if this came from the other function)
    state[cacheName][object.id] = {
        ...state[cacheName][object.id],
        ...object
    };
    return state;
}
