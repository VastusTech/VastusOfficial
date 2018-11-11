import _ from 'lodash'
import React, { Component } from 'react'
import {Search, Grid, Message } from 'semantic-ui-react'
import setupAWS from "../AppConfig";
import QL from '../GraphQL';

// setupAWS();

class SearchBarProp extends Component {
    state = {
        error: null,
        isLoading: true,
        eventsLoading: false,
        clientsLoading: false,
        searchResults: [],
        searchQuery: '',
        source: [],
        nextEventQueryToken: null,
        nextClientQueryToken: null,
        eventsLimit: 100,
        clientsLimit: 100,
    };

    componentWillMount() {
        this.resetComponent()
    }

    resetComponent = () => {
        // TODO How to stop any requests already in progress?
        this.setState({ isLoading: false,
            searchResults: [],
            searchQuery: '',
            source: [],
            nextEventQueryToken: null,
            nextClientQueryToken: null,
            clientsLoading: false,
            eventsLoading: false
        });
    };

    loadMoreEventResults(searchQuery) {
        console.log("Starting to loading more client results");
        if (!this.state.eventsLoading) {
            const eventsVariableComparisons = {
                title: "contains",
                access: "eq"
            };
            const eventsVariableValues = {
                title: searchQuery,
                access: "public"
            };
            this.setState({eventsLoading: true});
            QL.queryEvents(["id", "item_type", "title", "goal", "access"], QL.generateFilter("and",
                eventsVariableComparisons, eventsVariableValues), this.state.eventsLimit, this.state.nextEventQueryToken,
                (data) => {
                    console.log("Received events query: " + JSON.stringify(data));
                    if (data.items && data.items.length) {
                        for (let i = 0; i < data.items.length; i++) {
                            this.addResult(data.items[i]);
                        }
                    }
                    this.setState({
                        nextEventQueryToken: data.nextToken,
                        eventsLoading: false
                    });
                }, (error) => {
                    console.log("query events for search bar has failed");
                    if (error.message) {
                        error = error.message;
                    }
                    console.log(error);
                    this.setState({
                        error: error,
                        nextEventQueryToken: null,
                        eventsLoading: false
                    });
                });
        }
    }
    loadMoreClientResults(searchQuery) {
        console.log("Starting to loading more client results");
        if (!this.state.clientsLoading) {
            const clientsVariableComparisons = {
                name: "contains",
                username: "contains",
                email: "contains"
            };
            const clientsVariableValues = {
                name: searchQuery,
                username: searchQuery,
                email: searchQuery
            };
            this.setState({clientsLoading: true});
            QL.queryClients(["id", "item_type", "name", "username", "email"], QL.generateFilter("or",
                clientsVariableComparisons, clientsVariableValues), this.state.clientsLimit, this.state.nextClientQueryToken,
                (data) => {
                    console.log("Received clients query: " + JSON.stringify(data));
                    if (data.items && data.items.length) {
                        for (let i = 0; i < data.items.length; i++) {
                            this.addResult(data.items[i]);
                        }
                    }
                    this.setState({
                        nextClientQueryToken: data.nextToken,
                        clientsLoading: false
                    });
                }, (error) => {
                    console.log("query clients for search bar has failed");
                    if (error.message) {
                        error = error.message;
                    }
                    console.log(error);
                    this.setState({
                        error: error,
                        nextClientQueryToken: null,
                        clientsLoading: false
                    });
                });
        }
    }
    addResult(item) {
        if (item) {
            if (item.hasOwnProperty("item_type")) {
                var result;
                if (item.item_type === "Client") {
                    result = {
                        title: item.name,
                        description: item.username,
                        content: <Message>Lmao</Message>
                    };
                }
                else if (item.item_type === "Event") {
                    result = {
                        title: (item.title + " ~ (" + item.id + ")"),
                        description: item.goal,
                        content: <Message>Lmao</Message>
                    };
                }
                else {
                    alert("item has item_type of " + item.item_type + " for some reason?");
                    return;
                }
                this.setState({searchResults: [...this.state.searchResults, result]})
            }
        }
    }

    handleResultSelect = (e, { result }) => {

        alert("This will pop up a modal in the future for result: " + JSON.stringify(result));
        // this.setState({ value: result.title });
    };

    handleSearchChange = (e, { value }) => {
        console.log(value);
        this.resetComponent();
        this.setState({ searchQuery: value });
        console.log("Handling search change, state = " + JSON.stringify(this.state));
        if (value.length < 1) return;
        this.loadMoreEventResults(value);
        this.loadMoreClientResults(value);
    };

    render() {
        // TODO Check to see that this is valid to do?
        console.log("Showing " + this.state.searchResults.length + " results");
        const isLoading = (this.state.clientsLoading || this.state.eventsLoading);
        return (
            <Search
                fluid
                size="large"
                loading={isLoading}
                onResultSelect={this.handleResultSelect}
                onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                results={this.state.searchResults}
                value={this.state.searchQuery}
                {...this.props}
            />
        )
    }
}

export default SearchBarProp;