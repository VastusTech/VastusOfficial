import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import user from "./reducers/userReducer";
import cache from "./reducers/cacheReducer";

export default createStore(combineReducers({
    user,
    cache
}), applyMiddleware(logger, thunk));
