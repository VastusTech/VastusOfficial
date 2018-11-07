import info, { infoFunctions, infoReducer } from './infoReducer';

// TODO This is where we will store all the retrieved database items and use a LRU cache to rid them if necessary
const ADD_CLIENT = 'ADD_CLIENT';
const ADD_TRAINER = 'ADD_TRAINER';
const ADD_GYM = 'ADD_GYM';
const ADD_WORKOUT = 'ADD_WORKOUT';
const ADD_REVIEW = 'ADD_REVIEW';
// TODO I'm considering changing this just to events...
const ADD_PARTY = 'ADD_PARTY';
const ADD_CHALLENGE = 'ADD_CHALLENGE';

const READ_CLIENT = 'READ_CLIENT';
const READ_TRAINER = 'READ_TRAINER';
const READ_GYM = 'READ_GYM';
const READ_WORKOUT = 'READ_WORKOUT';
const READ_REVIEW = 'READ_REVIEW';
// TODO I'm considering changing this just to events...
const READ_PARTY = 'READ_PARTY';
const READ_CHALLENGE = 'READ_CHALLENGE';

// TODO Play around with these values maybe? How do we decide this?
const clientCacheSize = 100;
const trainerCacheSize = 100;
const gymCacheSize = 100;
const workoutCacheSize = 100;
const reviewCacheSize = 100;
// TODO I'm considering changing this just to events...
const partyCacheSize = 1000;
const challengeCacheSize = 1000;

const initialState = {
    info,
    clients: {},
    trainers: {},
    gyms: {},
    workouts: {},
    reviews: {},
// TODO I'm considering changing this just to events...
    parties: {},
    challenges: {},

    clientLRUHandler: [],
    trainerLRUHandler: [],
    gymLRUHandler: [],
    workoutLRUHandler: [],
    reviewLRUHandler: [],
// TODO I'm considering changing this just to events...
    partyLRUHandler: [],
    challengeLRUHandler: [],
};

export default (state = initialState, action) => {
    if (infoFunctions[action.type]) {
        return infoReducer(state, action);
    }

    switch (action.type) {
        case ADD_CLIENT:
            // TODO Also make sure that the item to get also has all the attributes we desire?
            state = addObjectToCache(state, "clients", clientCacheSize, "clientLRUHandler", action.payload);
            break;
        case ADD_TRAINER:
            state = addObjectToCache(state, "trainers", trainerCacheSize, "trainerLRUHandler", action.payload);
            break;
        case ADD_GYM:
            state = addObjectToCache(state, "gyms", gymCacheSize, "gymLRUHandler", action.payload);
            break;
        case ADD_WORKOUT:
            state = addObjectToCache(state, "workouts", workoutCacheSize, "workoutLRUHandler", action.payload);
            break;
        case ADD_REVIEW:
            state = addObjectToCache(state, "reviews", reviewCacheSize, "reviewLRUHandler", action.payload);
            break;
        case ADD_PARTY:
            state = addObjectToCache(state, "parties", partyCacheSize, "partyLRUHandler", action.payload);
            break;
        case ADD_CHALLENGE:
            state = addObjectToCache(state, "challenges", challengeCacheSize, "challengeLRUHandler", action.payload);
            break;
        case READ_CLIENT:
            state = updateReadObject(state, "clients", "clientLRUHandler", action.payload);
            break;
        case READ_TRAINER:
            state = updateReadObject(state, "trainers", "trainerLRUHandler", action.payload);
            break;
        case READ_GYM:
            state = updateReadObject(state, "gyms", "gymLRUHandler", action.payload);
            break;
        case READ_WORKOUT:
            state = updateReadObject(state, "workouts", "workoutLRUHandler", action.payload);
            break;
        case READ_REVIEW:
            state = updateReadObject(state, "reviews", "reviewLRUHandler", action.payload);
            break;
        case READ_PARTY:
            state = updateReadObject(state, "parties", "partyLRUHandler", action.payload);
            break;
        case READ_CHALLENGE:
            state = updateReadObject(state, "challenges", "challengeLRUHandler", action.payload);
            break;
    }
    return state;
};

function addObjectToCache(state, cacheName, maxCacheSize, LRUHandlerName, object) {
    // TODO Check to see that this is all well-formed?
    if (object.id) {
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
        updateReadObject(state, cacheName, LRUHandlerName, object);
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
    state[LRUHandlerName] = LRUHandler;
    // Then we update the object with the additional fields that it may have (if this came from the other function)
    state[cacheName][object.id] = {
        ...state[cacheName][object.id],
        ...object
    };
    return state;
}
