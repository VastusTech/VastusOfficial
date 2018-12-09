import React, { Component } from 'react'
import _ from 'lodash';
import {Grid, Button, Message, Image, Modal, Item, Segment, Dropdown, TextArea, Checkbox, Icon} from 'semantic-ui-react';
import CreateEventProp from "./CreateEvent";
import VTLogo from "../img/vt_new.svg"
import ClientCard from "./ClientCard";
import {connect} from "react-redux";
import {Form} from "semantic-ui-react/dist/commonjs/collections/Form/Form";

class EventMemberList extends Component {
    state = {
        error: null,
        isLoading: false,
        eventID: null,
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

    render() {

        return (
            <Modal closeIcon trigger={<Button primary fluid size="large"> <Icon name='plus' /> Post Challenge</Button>}>
                <Modal.Header align='center'>Select Challenge</Modal.Header>
                <Modal.Content>
                    <Grid>
                            <Grid.Row>
                                <Button primary fluid>
                                    <Image src={require('../img/weightsWorkout.png')} avatar />
                                    Lifting Challenge
                                </Button>
                            </Grid.Row>
                            <Grid.Row>
                                <Button primary fluid>
                                    <Image src={require('../img/timeTrialWorkout.png')} avatar />
                                    Timed Challenge
                                </Button>
                            </Grid.Row>
                            <Grid.Row>
                                <Button primary fluid>
                                    <Image src={require('../img/runningWorkout.png')} avatar />
                                    Cardio Challenge
                                </Button>
                            </Grid.Row>
                            <Grid.Row>
                                <Button primary fluid>
                                    <Image src={require('../img/bikingWorkout.png')} avatar />
                                    Bike Challenge
                                </Button>
                            </Grid.Row>
                            <Grid.Row>
                                <CreateEventProp/>
                            </Grid.Row>
                    </Grid>
                </Modal.Content>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    cache: state.cache
});

export default connect(mapStateToProps)(EventMemberList);