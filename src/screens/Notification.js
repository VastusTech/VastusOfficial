import React, {Component} from 'react'
import _ from 'lodash'
import {Grid, Image, Modal, Button, Item, Dimmer, Loader} from 'semantic-ui-react'
import { API, Auth, graphqlOperation } from "aws-amplify";
import setupAWS from '../AppConfig';
import proPic from "../img/BlakeProfilePic.jpg";
import QL from "../GraphQL";
import Lambda from "../Lambda";
import ClientModal from "./ClientModal";

class Notification extends Component {
    state = {
        error: null,
        isLoading: false,
        friendRequestID: null,
        clientModalOpen: false,
        name: null
    };

    constructor(props) {
        super(props);
        this.state.friendRequestID = this.props.friendRequestID;
        this.update()
    }

    componentWillReceiveProps(newProps) {
        this.setState({friendRequestID: newProps.friendRequests});
        this.update();
    }

    update() {
        if (this.state.friendRequestID) {
            QL.getClient(this.state.friendRequestID, ["name"], (data) => {
                if (data.name) {
                    this.setState({isLoading: false, name: data.name});
                }
                else {
                    this.setState({isLoading: false});
                }
            }, (error) => {
                console.log("Getting friend request ID failed");
                if (error.message) {
                    error = error.message;
                }
                console.log(error);
                this.setState({error: error, isLoading: false});
            });
        }
    }

    handleClientModalOpen() { this.setState({clientModalOpen: true})};
    handleClientModalClose() { this.setState({clientModalOpen: false})};

    handleAcceptFriendRequestButton(friendRequestID) {
        alert("TODO Accepting " + friendRequestID);
    }

    handleDeclineFriendRequestButton(friendRequestID) {
        alert("TODO Declining " + friendRequestID);
    }

    render() {
        if (this.state.isLoading) {
            return(
                <Grid.Row className="ui one column stackable center aligned page grid">
                    <Dimmer>
                        <Loader />
                    </Dimmer>
                </Grid.Row>
            );
        }
        return(
            <Grid.Row className="ui one column stackable center aligned page grid">
                <Button basic color='purple' onClick={this.handleClientModalOpen.bind(this)}>{this.state.name}</Button>
                <ClientModal
                    clientID={this.state.friendRequestID}
                    open={this.state.clientModalOpen}
                    onOpen={this.handleClientModalOpen.bind(this)}
                    onClose={this.handleClientModalClose.bind(this)}
                />
                <div> has sent you a buddy request</div>
                <Button basic color='purple' onClick={this.handleAcceptFriendRequestButton.bind(this)}>Accept</Button>
                <Button basic onClick={this.handleDeclineFriendRequestButton.bind(this)}>Deny</Button>
            </Grid.Row>
        );
    }
}

export default Notification;
