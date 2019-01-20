import React, { Component } from 'react'
import { List, Message } from 'semantic-ui-react';
import ClientCard from "../cards/ClientCard";
import { connect } from "react-redux";
import { fetchClient } from "../../redux_helpers/actions/cacheActions";
import Spinner from "../props/Spinner";

type Props = {
    clientIDs: [string],
    noClientsMessage: string,
    sortFunction?: any
}

class ClientList extends Component<Props> {
    state = {
        isLoading: true,
        clientIDs: null,
        clients: [],
        sentRequest: false,
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.clientIDs && this.state.clientIDs !== newProps.clientIDs) {
            // alert("received clientIDs = " + JSON.stringify(newProps.clientIDs));
            this.setState({isLoading: true, clientIDs: newProps.clientIDs, clients: []}, () => {
                for (let i = 0; i < newProps.clientIDs.length; i++) {
                    this.props.fetchClient(newProps.clientIDs[i], ["id", "username", "gender", "birthday", "name", "friends", "challengesWon", "scheduledEvents", "profileImagePath", "profilePicture", "friendRequests"], (client) => {
                        // Handle received data
                        if (client) {
                            this.state.clients.push(client);
                        }
                        this.setState({isLoading: false});
                    });
                }
            });
        }
    }

    render() {
        function clientComponents(clients, sortFunction) {
            const clientList = [...clients];
            const components = [];
            if (sortFunction) {
                clientList.sort(sortFunction);
            }
            for (const key in clientList) {
                if (clientList.hasOwnProperty(key)) {
                    components.push(
                        <List.Item key={key}>
                            <ClientCard rank={parseInt(key) + 1} clientID={clientList[key].id}/>
                        </List.Item>
                    );
                }
            }
            return components;
        }
        if (this.props.isLoading) {
            return(
                <Spinner/>
            )
        }
        if (this.state.clients.length > 0) {
            return(
                <List relaxed verticalAlign="middle">
                    {clientComponents(this.state.clients, this.props.sortFunction)}
                </List>
            );
        }
        else {
            return(
                <Message>{this.props.noClientsMessage}</Message>
            );
        }
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchClient: (id, variablesList, dataHandler) => {
            dispatch(fetchClient(id, variablesList, dataHandler));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClientList);
