import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import user from "./reducers/userReducer";
import cache from "../vastuscomponents/redux_reducers/cacheReducer";
import auth from "./reducers/authReducer";
import info from "../vastuscomponents/redux_reducers/infoReducer";
import search from "../vastuscomponents/redux_reducers/searchReducer";
import ably from "../vastuscomponents/redux_reducers/ablyReducer";
import message from "../vastuscomponents/redux_reducers/messageReducer";
import { reduxLog } from "../Constants";

let middleware;
if (reduxLog) {
    middleware = applyMiddleware(logger, thunk);
}
else {
    middleware = applyMiddleware(thunk);
}

const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(combineReducers({
        user,
        cache,
        info,
        auth,
        search,
        ably,
        message,
    }),
    composeEnhancers(middleware)
);

export default store;