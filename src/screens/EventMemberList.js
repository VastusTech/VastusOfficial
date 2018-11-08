import React, { Component } from 'react'
import _ from 'lodash';
import {Grid, Button, Message, Image, Modal, Item} from 'semantic-ui-react';
import ClientModal from "./ClientModal";
import proPic from "../img/BlakeProfilePic.jpg";

let fakeMemberList = ["CL310987761", "CL585959295", "CL675206338"];

class EventMemberList extends Component {
    state = {
        error: null,
        isLoading: true,
        members: [],
        ifOwned: false,
    };

    componentDidMount() {
        //if (this.props.members) {
        this.setState({isLoading: false, members: fakeMemberList, ifOwned: this.props.ifOwned});
        //}
    }

    componentWillReceiveProps(newProps) {
        //if (newProps.members) {
        this.setState({isLoading: false, members: newProps.members, ifOwned: newProps.ifOwned});
        //}
    }

    render() {
        function createCorrectButton(isOwned) {
            if(isOwned === true) {
                return (
                    <Button basic color='purple' onClick={() => {alert("Declare winner here!")}}>
                        Declare Winner
                    </Button>
                )
            }
        }

        function rows(members, ifOwned)
        {
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
                        {createCorrectButton(ifOwned)}
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
            <Grid>{rows(this.state.members, this.state.ifOwned)}</Grid>
        );
    }
}

export default EventMemberList;