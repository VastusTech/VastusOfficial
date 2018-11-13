import React, { Component } from 'react';
import { Label, Icon, Modal, Button, Item, Dimmer, Loader, Message, Grid } from 'semantic-ui-react';
import Lambda from "../Lambda";
import { connect } from "react-redux";
import ScheduledEventsList from "./ScheduledEventList";
import InviteToScheduledEventsProp from "./InviteToScheduledEvents";
import _ from "lodash";
import {fetchClient} from "../redux_helpers/actions/cacheActions";

/*
* Client Modal
*
* This is the generic profile view for any user that the current logged in user clicks on.
 */
class ClientModal extends Component {
    state = {
        error: null,
        isLoading: true,
        clientID: null,
    };

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.clientID) {
            if (!this.state.clientID) {
                this.props.fetchClient(newProps.clientID, ["id", "name", "friends", "challengesWon", "scheduledEvents", "profileImagePath", "profilePicture"]);
                this.setState({clientID: newProps.clientID});
            }
            // if (!this.state.client) {
            //     this.setState({isLoading: true});
            //     QL.getClient(newProps.clientID, ["id", "name", "friends", "challengesWon", "scheduledEvents"], (data) => {
            //         console.log("successfully retrieved the client");
            //         this.setState({isLoading: false, client: data})
            //     }, (error) => {
            //         console.log("Failed to receive the client for the modal");
            //         this.setState({isLoading: false, error: error});
            //     });
            // }
        }
    }

    getClientAttribute(attributeName) {
        if (this.state.clientID) {
            const client = this.props.cache.clients[this.state.clientID];
            if (client) {
                return client[attributeName];
            }
        }
        else {
            return null;
        }
    }

    handleAddFriendButton(friendID) {
        alert("Adding this friend!");
        if (this.props.user.id && this.getClientAttribute("id")) {
            Lambda.sendFriendRequest(this.props.user.id, this.props.user.id, this.getClient().id,
                (data) => {
                    alert("Successfully added " + this.getClient().name + " as a friend!");
                }, (error) => {
                    alert(JSON.stringify(error));
                    this.setState({error: error});
                });
        }
    }

    profilePicture() {
        if (this.getClientAttribute("profilePicture")) {
            return(
                <div className="u-avatar" style={{backgroundImage: `url(${this.getClientAttribute("profilePicture")})`}}/>
            );
        }
        else {
            return(
                <Dimmer inverted>
                    <Loader />
                </Dimmer>
            );
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

        if (this.props.info.isLoading) {
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
                {loadingProp(this.props.info.isLoading)}
                {errorMessage(this.props.info.error)}
                <Modal.Header>{this.getClientAttribute("name")}</Modal.Header>
                <Modal.Content image>
                    <Item>
                        <Item.Content>
                            {this.profilePicture()}
                        </Item.Content>
                    </Item>
                    <Item>
                        <Item.Content>
                            <Item.Header as='a'><div>{}</div></Item.Header>
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
                                                    <InviteToScheduledEventsProp friendID={this.getClientAttribute("id")}/>
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
    user: state.user,
    cache: state.cache,
    info: state.info
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchClient: (id, variablesList) => {
            dispatch(fetchClient(id, variablesList));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ClientModal);