import React, { Component } from 'react'
import _ from 'lodash';
import {Grid, Button, Message, Image, Modal, Item} from 'semantic-ui-react';
import ClientModal from "./ClientModal";
import proPic from "../img/BlakeProfilePic.jpg";
import Lambda from "../Lambda";
import connect from "react-redux/es/connect/connect";

class EventMemberList extends Component {
    state = {
        error: null,
        isLoading: true,
        members: [],
        challengeID: null,
        ifOwned: false,
        clientModalOpen: false,
        selectedClientID: null
    };

    constructor(props) {
        super(props);
        this.openClientModal = this.openClientModal.bind(this);
    }

    componentDidMount() {
        //if (this.props.members) {
        //alert("owned:" + this.props.ifOwned);
        this.setState({isLoading: false, members: this.props.members, ifOwned: this.props.ifOwned});
        //}
    }

    componentWillReceiveProps(newProps) {
        //if (newProps.members) {
        this.setState({isLoading: false, members: newProps.members, ifOwned: newProps.ifOwned});
        //}
    }

    openClientModal = (id) => {this.setState({selectedClientID: id, clientModalOpen: true})};
    closeClientModal = () => {this.setState({clientModalOpen: false})};

    render() {
        // function createCorrectButton(userID, winnerID, challengeID, isOwned) {
        //     //alert("user: " + userID + " winner: " + winnerID + " challenge: " + challengeID + " Owned?: " + isOwned);
        //     if(isOwned === true) {
        //         return (
        //             <Button basic color='purple' onClick={() => {Lambda.completeChallenge(userID, winnerID, challengeID,
        //                 (data) => {
        //                     alert(JSON.stringify(data));
        //                 }, (error) => {
        //                     alert(JSON.stringify(error));
        //                 })}}>
        //                 Declare Winner
        //             </Button>
        //         )
        //     }
        // }

        function rows(userID, members, handleClientPress)
        {
            //alert(members);
            return _.times(members.length, i => (
                <Grid.Row key={i} className="ui one column stackable center aligned page grid">
                    <Button onClick={() => {handleClientPress(members[i])}}>{members[i]}</Button>
                </Grid.Row>
            ));
        }
        if (this.state.isLoading) {
            return(
                <Message>Loading...</Message>
            )
        }
        if (!this.state.selectedClientID) {
            return(
                <Grid>{rows(this.props.user.id, this.state.members, this.openClientModal)}</Grid>
            );
        }
        return(
            <Grid>
                <ClientModal open={this.state.clientModalOpen} onClose={this.closeClientModal.bind(this)} clientID={this.state.selectedClientID}/>
                {rows(this.props.user.id, this.state.members, this.openClientModal)}
            </Grid>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(EventMemberList);