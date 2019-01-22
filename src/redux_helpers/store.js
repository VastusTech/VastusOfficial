import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import user from "./reducers/userReducer";
import cache from "./reducers/cacheReducer";
import auth from "./reducers/authReducer";
import info from "./reducers/infoReducer";
import search from "./reducers/searchReducer";
import ably from "./reducers/ablyReducer";
import message from "./reducers/messageReducer";
import { reduxLog } from "../logic/Constants";

<<<<<<< HEAD
import { log } from "../logic/Constants";

let middleware;
if (log) {
=======
let middleware;
if (reduxLog) {
>>>>>>> f758de6db119aad10477eb63190be557b500f683
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