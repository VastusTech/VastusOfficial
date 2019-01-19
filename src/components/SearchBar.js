import _ from 'lodash'
import React, { Component, Fragment } from 'react'
import {Search } from 'semantic-ui-react'
import EventDescriptionModal from "./EventDescriptionModal";
import ClientModal from "./ClientModal";
import TrainerModal from "./TrainerModal";
import {connect} from "react-redux";
import {fetchClient, fetchEvent, putClientQuery, putEventQuery} from "../redux_helpers/actions/cacheActions";
import {newSearch, loadMoreResults} from "../redux_helpers/actions/searchActions";
import {switchReturnItemType} from "../logic/ItemType";
import ChallengeDescriptionModal from "./ChallengeDescriptionModal";
import {consoleLog} from "../logic/DebuggingHelper";

class SearchBarProp extends Component {
    state = {
        error: null,
        isLoading: false,
        minimumSearchResults: 6,
        // eventsLoading: false,
        // clientsLoading: false,
        // searchResults: [],
        // searchQuery: '',
        // source: [],
        // nextEventQueryToken: null,
        // nextClientQueryToken: null,
        // eventsLimit: 100,
        // clientsLimit: 100,
        selectedResult: null,
        result: null,
        resultModal: null,
        resultModalOpen: false
    };

    constructor(props) {
        super(props);
        this.handleResultSelect = this.handleResultSelect.bind(this);
        this.openResultModal = this.openResultModal.bind(this);
        this.closeResultModal = this.closeResultModal.bind(this);
    }

    componentWillMount() {
        // this.resetComponent()
    }

    handleResultSelect = (e, { result }) => {
        this.setState({result: result.resultcontent});
        this.setState({resultModalOpen: true});
    };

    handleSearchChange = (e, { value }) => {
        consoleLog(value);
        this.retrieveSearchResults(value);
    };

    retrieveSearchResults(searchQuery) {
        this.setState({isLoading: true});
        this.props.newSearch(searchQuery, (data) => {
            if (data && data.length) {
                if (data.length < this.state.minimumSearchResults && !this.props.search.ifFinished) {
                    this.retrieveMoreResults(searchQuery, data);
                }
                else {
                    this.setState({isLoading: false});
                }
            }
            else {
                this.setState({isLoading: false});
            }
        });
    }

    retrieveMoreResults(searchQuery, results) {
        this.props.loadMoreResults(searchQuery, (data) => {
            results.push(...data);
            if (results.length < this.state.minimumSearchResults && !this.props.search.ifFinished) {
                // consoleLog("Grabbing more results: numResults = " + results.length + ", ifFinished = " + this.props.search.ifFinished);
                this.retrieveMoreResults(searchQuery, results);
            }
            else {
                this.setState({isLoading: false});
            }
        })
    }

    resultModal(result) {
        if (!result) {
            return null;
        }
        const type = result.item_type;
        // if (this.state.toOpenResultModal) {
        //     this.setState({toOpenResultModal: false, resultModalOpen: true});
        // }
        if (type === "Client") {
            return(
                <ClientModal open={this.state.resultModalOpen} onClose={this.closeResultModal} clientID={result.id}/>
            );
        }
        else if (type === "Trainer") {
            return (
                <TrainerModal open={this.state.resultModalOpen} onClose={this.closeResultModal} trainerID={result.id}/>
            );
        }
        else if (type === "Event") {
            return(
                <EventDescriptionModal open={this.state.resultModalOpen} onClose={this.closeResultModal}
                                       eventID={result.id}
                />
            );
        }
        else if (type === "Challenge") {
            return(
                <ChallengeDescriptionModal open={this.state.resultModalOpen} onClose={this.closeResultModal} challengeID={result.id}/>
        )
        }
        else {
            consoleLog("Wrong type inputted! Received " + type);
        }
    }

    getFormattedResults() {
        const formattedResults = [];
        if (this.props.search.searchBarEnabled) {
            const results = this.props.search.results;
            const resultTitles = [];
            for (const i in results) {
                if (results.hasOwnProperty(i)) {
                    const result = results[i];
                    // console.log(JSON.stringify(result));
                    if (result.hasOwnProperty("item_type") && result.item_type) {
                        let formattedResult = switchReturnItemType(result.item_type,
                            { // Client
                                title: result.name,
                                description: result.username,
                                resultcontent: result
                            },
                            { // Trainer
                                title: result.name,
                                description: result.username,
                                resultcontent: result
                            },
                            null,
                            null,
                            null,
                            { // Event
                                title: (result.title),
                                description: result.goal,
                                resultcontent: result
                            },
                            { // Challenge
                                title: (result.title),
                                description: result.description,
                                resultcontent: result
                            },
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            "Handle search bar result type not implemented!");

                        if (formattedResult) {
                            // TODO Insertsort this? By what basis though?
                            while (formattedResult.title && resultTitles.includes(formattedResult.title)) {
                                const len = formattedResult.title.length;
                                // consoleLog(JSON.stringify(resultTitles));
                                // consoleLog(formattedResult.title + "~ -3: " + formattedResult.title[len - 3] + ", -1: " + formattedResult.title[len - 1]);
                                if (formattedResult.title[len - 3] === "(" && formattedResult.title[len - 1] === ")") {
                                    let num = parseInt(formattedResult.title[len - 2]);
                                    num++;
                                    formattedResult.title = formattedResult.title.substr(0, len - 3) + "(" + num + ")";
                                    // formattedResult.title[len - 2] = num;
                                }
                                else {
                                    formattedResult.title += " (2)";
                                }
                            }
                            // console.log(formattedResult.title + " is not in " + JSON.stringify(resultTitles));
                            formattedResults.push(formattedResult);
                            resultTitles.push(formattedResult.title);
                        }
                    }
                }
            }
        }
        // console.log(formattedResults.length);
        return formattedResults;
    }

    openResultModal = () => { this.setState({resultModalOpen: true}); };
    closeResultModal = () => { this.setState({resultModalOpen: false}); };

    render() {
        // TODO Check to see that this is valid to do?
        // console.log("Showing " + this.state.searchResults.length + " results");
        // const isLoading = (this.state.clientsLoading || this.state.eventsLoading);
        // console.log(this.props.search.results.length);
        return (
            <Fragment>
                {this.resultModal(this.state.result)}
                <Search
                    fluid
                    size="large"
                    placeholder="Search for Users and Challenges"
                    loading={this.state.isLoading}
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={_.debounce(this.handleSearchChange, 1000, { leading: true })}
                    results={this.getFormattedResults()}
                    value={this.props.search.searchQuery}
                    showNoResults={this.props.search.searchBarEnabled}
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    cache: state.cache,
    search: state.search
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchClient: (id, variablesList) => {
            dispatch(fetchClient(id, variablesList));
        },
        fetchEvent: (id, variablesList) => {
            dispatch(fetchEvent(id, variablesList));
        },
        putClientQuery: (queryString, queryResult) => {
            dispatch(putClientQuery(queryString, queryResult));
        },
        putEventQuery: (queryString, queryResult) => {
            dispatch(putEventQuery(queryString, queryResult));
        },
        newSearch: (queryString, dataHandler) => {
            dispatch(newSearch(queryString, dataHandler));
        },
        loadMoreResults: (queryString, dataHandler) => {
            dispatch(loadMoreResults(queryString, dataHandler));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBarProp);