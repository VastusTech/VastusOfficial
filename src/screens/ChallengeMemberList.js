import React, { Component } from 'react'
import _ from 'lodash';
import {Grid, Button, Message, Image, Modal, Item} from 'semantic-ui-react';
import ClientModal from "../components/ClientModal";
import proPic from "../img/BlakeProfilePic.jpg";
import Lambda from "../Lambda";
import connect from "react-redux/es/connect/connect";
import ClientCard from "../components/ClientCard";

class ChallengeMemberList extends Component {
    state = {
        error: null,
        isLoading: false,
        challengeID: null,
        // members: [],
        // challengeID: null,
        // ifOwned: false,
        // clientModalOpen: false,
        // selectedClientID: null
    };

    constructor(props) {
        super(props);
        // this.openClientModal = this.openClientModal.bind(this);
    }

    componentDidMount() {
        if (this.props.challengeID) {
            this.setState({challengeID: this.props.challengeID, isLoading: false});
        }
        //if (this.props.members) {
        //alert("owned:" + this.props.ifOwned);
        // this.setState({isLoading: false, members: this.props.members, ifOwned: this.props.ifOwned});
        //}
    }

    componentWillReceiveProps(newProps) {
        if (newProps.challengeID !== this.props.challengeID) {
            this.setState({challengeID: newProps.challengeID, isLoading: false});
        }
        //if (newProps.members) {
        // this.setState({isLoading: false, members: newProps.members, ifOwned: newProps.ifOwned});
        //}
    }

    getChallengeAttribute(attribute) {
        if (this.state.challengeID) {
            const Challenge = this.props.cache.Challenges[this.state.challengeID];
            if (Challenge) {
                return Challenge[attribute];
            }
        }
        return null;
    }

    // openClientModal = (id) => {this.setState({selectedClientID: id, clientModalOpen: true})};
    // closeClientModal = () => {this.setState({clientModalOpen: false})};

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
                    <ClientCard clientID={members[i]}/>
                </Grid.Row>
            ));
        }
        if (this.state.isLoading) {
            return(
                <Message>Loading...</Message>
            )
        }
        // if (!this.state.selectedClientID) {
        //     return(
        //         <Grid>{rows(this.props.user.id, this.state.members, this.openClientModal)}</Grid>
        //     );
        // }
        if (this.getChallengeAttribute("members") && this.getChallengeAttribute("members").length > 0) {
            return (
                <Grid>
                    {rows(this.props.user.id, this.getChallengeAttribute("members"), this.openClientModal)}
                </Grid>
            );
        }
        else {
            return(
                <Message>No current members!</Message>
            )
        }
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    cache: state.cache
});

export default connect(mapStateToProps)(ChallengeMemberList);