import React, { Component } from 'react';
import { Modal, Button, Item, Dimmer, Loader, Message, Grid } from 'semantic-ui-react';
import QL from '../GraphQL';
import Lambda from "../Lambda";
import { connect } from "react-redux";
import AWSConfig from "../AppConfig";
import ScheduledEventsList from "./ScheduledEventList";
import InviteToScheduledEventsProp from "./InviteToScheduledEvents";
import _ from "lodash";
import EventCard from "./EventCard";

// AWSConfig();

/*
* Client Modal
*
* This is the generic profile view for any user that the current logged in user clicks on.
 */
class ClientModal extends Component {
    state = {
        error: null,
        isLoading: true,
        client: null,
    };

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.clientID) {
            if (!this.state.client) {
                this.setState({isLoading: true});
                QL.getClient(newProps.clientID, ["id", "name", "friends", "challengesWon", "scheduledEvents"], (data) => {
                    console.log("successfully retrieved the client");
                    this.setState({isLoading: false, client: data})
                }, (error) => {
                    console.log("Failed to receive the client for the modal");
                    this.setState({isLoading: false, error: error});
                });
            }
        }
    }

    handleAddFriendButton(friendID) {
        alert("Adding this friend!");
        if (this.props.user.id && this.state.client) {
            Lambda.sendFriendRequest(this.props.user.id, this.props.user.id, this.state.client.id,
                (data) => {
                    alert("Successfully added " + this.state.client.name + " as a friend!");
                }, (error) => {
                    alert(JSON.stringify(error));
                    this.setState({error: error});
                });
        }
    }

    render() {
        function errorMessage(error) {
            if (error) {
                return (
                    <Message color='red'>
                        <h1>Error!</h1>
                        <p>{error}</p>
                    </Message>
                );
            }
        }
        function loadingProp(isLoading) {
            if (isLoading) {
                return (
                    <Dimmer active inverted>
                        <Loader/>
                    </Dimmer>
                );
            }
            return null;
        }

        if (!this.state.client) {
            return(
                <Modal open={this.props.open} onClose={this.props.onClose.bind(this)}>
                    <Modal.Header>Loading...</Modal.Header>
                </Modal>
            );
        }

        function button_rows(events) {
            //if(events != null)
            //alert(JSON.stringify(events[0]));
            return _.times(events.length, i => (
                <Grid.Row key={i} className="ui one column stackable center aligned page grid">
                    <Button basic color='purple'>Invite to Event</Button>
                </Grid.Row>
            ));
        }
        // <Item.Image size='medium' src={proPic} circular/> TODO

        //This render function displays the user's information in a small profile page, and at the
        //bottom there is an add buddy function, which sends out a buddy request (friend request).
        return(
            <Modal open={this.props.open} onClose={this.props.onClose.bind(this)}>
                {loadingProp(this.state.isLoading)}
                {errorMessage(this.state.error)}
                <Modal.Header>{this.state.client.name}</Modal.Header>
                <Modal.Content image>
                    <Item>
                        <Item.Content>
                            <Item.Header as='a'><div>{}</div></Item.Header>
                            <Item.Meta>Bio: </Item.Meta>
                            <Item.Description>
                                <div>{}</div>
                            </Item.Description>
                            <Item.Extra>Friends: <div>{}</div></Item.Extra>
                            <Item.Extra>Event Wins: <div>{}</div></Item.Extra>
                            <Item.Extra>
                                <Button basic color='purple'
                                        type='button'
                                        onClick={this.handleAddFriendButton.bind(this)}>
                                    Add Buddy
                                </Button>
                            </Item.Extra>
                            <Item.Extra>
                                <div>
                                    <Modal trigger={<Button color='purple'>Invite to Challenge</Button>}>
                                        <Grid columns='three' divided>
                                            <Grid.Row>
                                                <Grid.Column>
                                                    <ScheduledEventsList/>
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <InviteToScheduledEventsProp friendID={this.state.client.id}/>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Modal>
                                </div>
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                </Modal.Content>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(ClientModal);