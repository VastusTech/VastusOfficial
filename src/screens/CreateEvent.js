import React, { Component } from 'react';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { Checkbox, Modal, Button, Input, Form, Segment, TextArea, Popup, Dropdown } from 'semantic-ui-react';
import {
    DateInput,
    TimeInput,
    DateTimeInput,
    DatesRangeInput
} from 'semantic-ui-calendar-react';
import Lambda from "../Lambda";
import {connect} from "react-redux";
import setupAWS from "../AppConfig";

// setupAWS();

function convertDateTimeToISO8601(dateAndTime) {
    let dateTimeString = String(dateAndTime);
    let day = dateTimeString.substr(0, 2);
    let month = dateTimeString.substr(3, 2);
    let year = dateTimeString.substr(6, 4);
    let time = dateTimeString.substr(11, 5);
    let hour = dateTimeString.substr(11, 2);
    let minute = dateTimeString.substr(13, 3);
    let amorpm = dateTimeString.substr(16, 3);

    if(amorpm.trim() === 'AM') {
        return year + "-" + month + "-" + day + "T" + time + ":00+00:00";
    }
    else if(amorpm.trim() === 'PM' && hour == 12) {
        return year + "-" + month + "-" + day + "T" + "12" + minute + ":00+00:00";
    }
    else if(amorpm.trim() === 'AM' && hour == 12) {
        return year + "-" + month + "-" + day + "T" + "00" + minute + ":00+00:00";
    }
    else {
        return year + "-" + month + "-" + day + "T" + (parseInt(hour, 10) + 12) + minute + ":00+00:00";
    }
}

/*
* Create Event Prop
*
* This is the modal for creating events. Every input is in the form of a normal text input.
* Inputting the time and date utilizes the Semantic-ui Calendar React library which isn't vanilla Semantic.
 */
class CreateEventProp extends Component {

    state = {
        date: '',
        time: '',
        dateTime: '',
        dateTimeEnd: '',
        datesRange: '',
        timeFormat: 'AMPM',
        checked: false
    };

    toggle = () => this.setState({ checked: !this.state.checked });

    eventState = {
        title: "",
        date: "",
        location: "",
        time: "",
        time_created: "",
        capacity: "",
        goal: "",
        description: "",
        access: "public"
    };

    yearOptions = [ { key: '18', value: '18', text: '2018' }, { key: '19', value: '19', text: '2019' }  ];
    monthOptions = [ { key: 'JAN', value: 'JAN', text: 'January' },
                    { key: 'FEB', value: 'FEB', text: 'February' },
                    { key: 'MAR', value: 'MAR', text: 'March' },
                    { key: 'APR', value: 'APR', text: 'April' },
                    { key: 'MAY', value: 'MAY', text: 'May' },
                    { key: 'JUN', value: 'JUN', text: 'June' },
                    { key: 'JUL', value: 'JUL', text: 'July' },
                    { key: 'AUG', value: 'AUG', text: 'August' },
                    { key: 'SEP', value: 'SEP', text: 'September' },
                    { key: 'OCT', value: 'OCT', text: 'October' },
                    { key: 'NOV', value: 'NOV', text: 'November' },
                    { key: 'DEC', value: 'DEC', text: 'December' },];
    yearOptions = [ { key: '18', value: '18', text: '2018' }, { key: '19', value: '19', text: '2019' }  ];

    handleDateChangeRaw = (e) => {
        e.preventDefault();
    }

    handleStartTimeChange = (event, {name, value}) => {
        if (this.state.hasOwnProperty(name)) {
            this.setState({ [name]: value });
            console.log(convertDateTimeToISO8601(value));
        }
    }

    handleEndTimeChange = (event, {name, value}) => {
        if (this.state.hasOwnProperty(name)) {
            this.setState({ [name]: value });
            console.log(convertDateTimeToISO8601(value));
        }
    }

    changeStateText(key, value) {
        // TODO Sanitize this input
        // TODO Check to see if this will, in fact, work.!
        this.eventState[key] = value.target.value;
        console.log("New " + key + " is equal to " + value.target.value);
    }

    handleAccessSwitch = () => {
        if(this.eventState.access == 'public') {
            this.eventState.access = 'private';
            //alert(this.eventState.access);
        }
        else if (this.eventState.access == 'private') {
            this.eventState.access = 'public';
            //alert(this.eventState.access);
        }
        else {
            alert("Event access should be public or private");
        }

    };

    handleSubmit = () => {
        const time = convertDateTimeToISO8601(this.state.dateTime) + "_" +
            convertDateTimeToISO8601(this.state.dateTimeEnd);

        if(Number.isInteger(+this.eventState.capacity)) {
            Lambda.createChallenge(this.props.user.id, this.props.user.id, time, String(this.eventState.capacity),
                String(this.eventState.location), String(this.eventState.title),
                String(this.eventState.goal), (data) => {
                    alert(JSON.stringify(data));
                    // HANDLE WHAT HAPPENS afterwards
                    if (data.errorMessage) {
                        // Java error handling
                        alert("ERROR: " + data.errorMessage + "!!! TYPE: " + data.errorType + "!!! STACK TRACE: " + data.stackTrace + "!!!");
                    }
                    else {
                        alert("ya did it ya filthy animal");
                    }
                }, (error) => {
                    alert(error);
                    // TODO HANDLE WHAT HAPPENS afterwards
                    // TODO keep in mind that this is asynchronous
                }
            );
        }
        else {
            alert("Capacity must be an integer! Instead it is: " + this.eventState.capacity);
        }
    }

    //Inside of render is a modal containing each form input required to create a Event.
    render() {
        return (
            <Segment raised inverted>
                <Modal trigger={<Button primary fluid size="large">+ Create Event</Button>}>
                    <Modal.Header align='center'>Create Event</Modal.Header>
                    <Modal.Content>

                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group unstackable widths={2}>
                                <Form.Input label="Title" type="text" name="title" placeholder="Title" onChange={value => this.changeStateText("title", value)}/>
                                <Form.Input label="Location" type="text" name="location" placeholder="Address for Event" onChange={value => this.changeStateText("location", value)}/>
                            </Form.Group>
                            <Form.Group unstackable widths={3}>
                                <div className="field">
                                    <label>Event Date</label>
                                    <input type="date"/>
                                </div>
                                <div className="field">
                                    <label>Start Time</label>
                                    <input type="time"/>
                                </div>
                                <div className="field">
                                    <label>End Time</label>
                                    <input type="time"/>
                                </div>
                            </Form.Group>
                            <Form.Group unstackable widths={2}>
                                <Form.Input label="Capacity" type="text" name="capacity" placeholder="Number of allowed attendees... " onChange={value => this.changeStateText("capacity", value)}/>
                                <Form.Input label="Goal" type="text" name="goal" placeholder="Criteria the victor is decided on..." onChange={value => this.changeStateText("goal", value)}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Field width={12}>
                                    <label>Event Description</label>
                                    <TextArea type="text" name="description" placeholder="Describe Event here... " onChange={value => this.changeStateText("description", value)}/>
                                </Form.Field>
                            </Form.Group>
                            <Form.Group>
                                <Form.Field width={12}>
                                    <Checkbox toggle onClick={this.handleAccessSwitch} onChange={this.toggle} checked={this.state.checked} label={this.eventState.access} />
                                </Form.Field>
                            </Form.Group>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button primary size="big" type='button' onClick={() => { this.handleSubmit()}}>Submit</Button>
                    </Modal.Actions>
                </Modal>
            </Segment>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(CreateEventProp);


