import { setError, setIsLoading } from "./infoActions";
import QL from "../../GraphQL";
import {getCache, getPutQueryFunction} from "./cacheActions";

const ENABLE_TYPE = 'ENABLE_TYPE';
const DISABLE_TYPE = 'DISABLE_TYPE';
const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY';
const SET_TYPE_FILTER = 'SET_TYPE_FILTER';
const SET_TYPE_NEXT_TOKEN = 'SET_TYPE_NEXT_TOKEN';
const ADD_TYPE_RESULTS = 'ADD_TYPE_RESULTS';
const RESET_TYPE_QUERY = 'RESET_TYPE_QUERY';
const RESET_QUERY = 'RESET_QUERY';

export function newSearch(queryString, dataHandler) {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        // Use the current store settings to actually do the search
        if (queryString && queryString.length > 0) {
            dispatch(setSearchQuery(queryString));
            dispatch(resetQuery());
            loadMoreResults(queryString, dataHandler);
        }
        else {
            console.log("I refuse to search for an empty string");
        }
    };
}
export function loadMoreResults(searchQuery, dataHandler) {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        if (searchQuery && searchQuery.length > 0) {
            let numResults = 0;
            let results = [];
            for (const type in getStore().search.typeQueries) {
                if (getStore().search.typeQueries.hasOwnProperty(type)) {
                    const numTypesEnabled = getStore().search.numTypesEnabled;
                    performQuery(type, dispatch, getStore, (data) => {
                        if (data.items && data.nextToken) {
                            dispatch(addTypeResults(type, data.items));
                            dispatch(setTypeNextToken(type, data.nextToken));
                            results.push(...data.items);
                        }
                        else {
                            console.error("Received a weird value from query in the newSearch search redux function. Value = " + JSON.stringify(data));
                        }
                        numResults++;
                        if (numTypesEnabled <= numResults) {
                            dataHandler(results);
                        }
                    }, () => {
                        numResults++;
                        if (getStore().search.numTypesEnabled <= numResults) {
                            dataHandler(results);
                        }
                    })
                }
            }
        }
        else {

        }
    };
}
function performQuery(itemType, dispatch, getStore, successHandler, failureHandler) {
    const searchQuery = getStore().search.searchQuery;
    const typeQuery = getStore().search.typeQueries[itemType];
    if (typeQuery.enabled) {
        const variableList = typeQuery.variableList;
        const filterJSON = typeQuery.filterJSON;
        const filterParameters = {
            ...typeQuery.filterParameters,
            searchQuery,
        };
        const limit = typeQuery.limit;
        const nextToken = typeQuery.nextToken;

        // TODO Will this work?
        QL.getQueryFunction(itemType)(variableList, QL.generateFilter(filterJSON, filterParameters), limit, nextToken, (data) => {
            dispatch(setTypeNextToken(itemType, nextToken));
            successHandler(data);
        }, (error) => {
            dispatch(setError(error));
            failureHandler();
        }, getCache(itemType, getStore), getPutQueryFunction(itemType, getStore));
    }
}
export function enableType(type) {
    return {
        type: ENABLE_TYPE,
        payload: type
    };
}
export function disableType(type) {
    return {
        type: DISABLE_TYPE,
        payload: type
    };
}
export function setSearchQuery(searchQuery) {
    return {
        type: SET_SEARCH_QUERY,
        payload: searchQuery
    }
}
export function addTypeResults(type, results) {
    return {
        type: ADD_TYPE_RESULTS,
        payload: {
            type,
            results
        }
    };
}
export function setTypeFilter(type, filterJSON, filterParameters) {
    return {
        type: SET_TYPE_FILTER,
        payload: {
            type,
            filterJSON,
            filterParameters
        }
    };
}
export function setTypeNextToken(type, nextToken) {
    return {
        type: SET_TYPE_NEXT_TOKEN,
        payload: {
            type,
            nextToken
        }
    }
}
export function resetTypeQuery(type) {
    return {
        type: RESET_TYPE_QUERY,
        payload: type
    };
}
export function resetQuery() {
    return {
        type: RESET_QUERY
    };
}
