import _ from 'lodash'
import React, { Component } from 'react'
import {Search, Grid, Header, Segment, Icon, Label, Modal} from 'semantic-ui-react'
import Amplify, { API, Auth, graphqlOperation} from 'aws-amplify';
import EventFeedProp from "./eventFeed";
import setupAWS from "./appConfig";

var numUsers = 0;
var users = [];

//function createNewSearch

setupAWS();

async function asyncCall(query, callback) {
    console.log('calling');
    var result = await API.graphql(graphqlOperation(query));
    console.log(result);
    callback(result);
    // expected output: 'resolved'
}

function callQueryBetter(query, callback) {
    asyncCall(query, function (data) {
        let allChallengesJSON = JSON.stringify(data);
        //alert(allChallengesJSON);
        let allChallenges = JSON.parse(allChallengesJSON);
        if (allChallenges.data.queryClients != null)
            callback(allChallenges.data.queryClients.items);
    });
}

const getClients =
    `query getAllUsers {
              queryClients {
                items{
                  id
                  name
                  username
                  friends
                  friendRequests
                }
              }
            }`;

callQueryBetter(getClients, function (data) {
    if (data != null) {
        numUsers = data.length;
        //alert(numUsers);
    }

    for (var i = 0; i < numUsers; i++) {
        users[i] = data[i].name;
    }
});

const source = _.times(1, () => ({
    title: "Blake",
    description: (<Modal trigger = { <Icon name='eye' />}>
    </Modal>),
    image: "",
    price: "",
}));

export default class SearchBarProp extends Component {
    componentWillMount() {
        this.resetComponent()
    }

    resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

    handleResultSelect = (e, { result }) => this.setState({ value: result.title })

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value })

        setTimeout(() => {
            if (this.state.value.length < 1) return this.resetComponent()

            const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
            const isMatch = result => re.test(result.title)

            this.setState({
                isLoading: false,
                results: _.filter(source, isMatch),
            })
        }, 300)
    }

    render() {
        const { isLoading, value, results } = this.state;

        return (
            <Grid>
                <Grid.Column width={6}>
                    <Search
                        loading={isLoading}
                        onResultSelect={this.handleResultSelect}
                        onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                        results={results}
                        value={value}
                        {...this.props}
                    />
                </Grid.Column>
                <Grid.Column width={10}>
                </Grid.Column>
            </Grid>
        )
    }
}