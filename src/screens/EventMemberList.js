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
        ifOwned: false
    };

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

    render() {
        function createCorrectButton(userID, winnerID, challengeID, isOwned) {
            //alert("user: " + userID + " winner: " + winnerID + " challenge: " + challengeID + " Owned?: " + isOwned);
            if(isOwned === true) {
                return (
                    <Button basic color='purple' onClick={() => {Lambda.completeChallenge(userID, winnerID, challengeID,
                        (data) => {
                            alert(JSON.stringify(data));
                        }, (error) => {
                            alert(JSON.stringify(error));
                        })}}>
                        Declare Winner
                    </Button>
                )
            }
        }

        function rows(userID, members, challengeID, ifOwned)
        {
            //alert(members);
            return _.times(members.length, i => (
                <Grid.Row key={i} className="ui one column stackable center aligned page grid">
                    <Modal size='mini' trigger ={<div><Image src={proPic} circular avatar/>
                        <span>{members[i]}</span></div>}>
                        <Modal.Content image>
                            <Item>
                                <Item.Image size='medium' src={proPic} circular/>
                                <Item.Content>
                                    <Item.Header as='a'><div>{members[i]}</div></Item.Header>
                                    <Item.Description>
                                        <div>{}</div>
                                    </Item.Description>
                                    <Item.Extra>Friends: <div>{}</div></Item.Extra>
                                    <Item.Extra>Event Wins: <div>{}</div></Item.Extra>
                                </Item.Content>
                            </Item>
                        </Modal.Content>
                    </Modal>
                    <div>
                        {createCorrectButton(userID, members[i], challengeID, ifOwned)}
                    </div>
                </Grid.Row>
            ));
        }
        if (this.state.isLoading) {
            return(
                <Message>Loading...</Message>
            )
        }
        return(
            <Grid>{rows(this.props.user.id, this.state.members, this.props.challengeID, this.props.ifOwned)}</Grid>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(EventMemberList);