import React, { Component } from 'react';
import { Checkbox, Modal, Button, Input, Form, Segment, TextArea, Dropdown } from 'semantic-ui-react';
import {
    DateInput,
    TimeInput,
    DateTimeInput,
    DatesRangeInput
} from 'semantic-ui-calendar-react';
import Lambda from "../Lambda";
import {connect} from "react-redux";

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

const timeOptions = [ { key: '0:15', value: '0:15', text: '0:15' },
    { key: '0:30', value: '0:30', text: '0:30' },
    { key: '0:45', value: '0:45', text: '0:45' },
    { key: '1:00', value: '1:00', text: '1:00' },
    { key: '1:15', value: '1:15', text: '1:15' },
    { key: '1:30', value: '1:30', text: '1:30' },
    { key: '1:45', value: '1:45', text: '1:45' },
    { key: '2:00', value: '2:00', text: '2:00' },
    { key: '2:15', value: '2:15', text: '2:15' },
    { key: '2:30', value: '2:30', text: '2:30' },
    { key: '2:45', value: '2:45', text: '2:45' },
    { key: '3:00', value: '3:00', text: '3:00' },
    { key: '3:00+', value: '3:00+', text: '3:00+' }
];

alert(timeOptions[1].text);

/*
* Create Event Prop
*
* This is the modal for creating events. Every input is in the form of a normal text input.
* Inputting the time and date utilizes the Semantic-ui Calendar React library which isn't vanilla Semantic.
 */
class CreateEventProp extends Component {

    state = {
        date: '',
        startDateTime: '',
        duration: '',
        datesRange: '',
        timeFormat: 'AMPM',
        checked: false
    };

    toggle = () => this.setState({ checked: !this.state.checked });

    eventState = {
        title: "",
        startDateTime: "",
        duration: "",
        location: "",
        time: "",
        time_created: "",
        capacity: "",
        goal: "",
        description: "",
        access: "public"
    };

    changeStateText(key, value) {
        // TODO Sanitize this input
        // TODO Check to see if this will, in fact, work.!
        this.eventState[key] = value.target.value;
        console.log("New " + key + " is equal to " + value.target.value);
    }

    handleDurationChange(event, data) {
        const { value } = data.options.find(o => o.value === value);
        console.log(value);
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
        let time = '';
        let endTime;

        let date = this.eventState.startDateTime.substr(0, 11);
        let nextDate = this.eventState.startDateTime.substr(0, 8) + "0" +
            (parseInt(this.eventState.startDateTime.substr(8, 2), 10) + 1) +
            this.eventState.startDateTime.substr(10, 1);
        let hour = this.eventState.startDateTime.substr(11, 2);
        let durationHour = this.state.duration.substr(0, 1);
        let minute = this.eventState.startDateTime.substr(14, 2);
        let durationMinute = this.state.duration.substr(2, 2);
        let endHour = (parseInt(hour, 10) + parseInt(durationHour, 10));

        if(endHour >= 24) {
            endTime = (this.eventState.startDateTime + "_" + nextDate + "0" + (parseInt(hour, 10) +
                parseInt(durationHour, 10) - 24));
        }
        else if((endHour < 24) && (endHour < 10)) {
            endTime = this.eventState.startDateTime + "_" + date + "0" +
                (parseInt(hour, 10) + parseInt(durationHour, 10));
        }
        else {
            endTime = this.eventState.startDateTime + "_" + date +
                (parseInt(hour, 10) + parseInt(durationHour, 10));
        }

        alert("Minute: " + minute + " " + "Duration: " + durationMinute);
        
        if(((parseInt(minute, 10) + parseInt(durationMinute, 10))) >= 60) {
            minute = (parseInt(minute, 10) + parseInt(durationMinute, 10)) - 60;
            hour = "0" + (parseInt(hour, 10) + 1);
            alert("Min: " + minute);
            endTime = endTime.substr(0, 28) + (hour + ":" + minute);
            alert("End: " + endTime);
        }
        else {
            minute = (parseInt(minute, 10) + parseInt(durationMinute, 10));
            alert("Min: " + minute);
            endTime += (":" + minute);
            alert("End: " + endTime);
        }

        alert("End time substring: " + endTime.substr(0, 28));
        alert(endTime);

        alert(endTime);

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
    };

    handleDurationChange = (e, data) => {
        this.setState({
            duration: data.value,
        }, () => {
            console.log('value',this.state.duration);
        });
    };

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
                                    <label>Start Date and Time</label>
                                    <input type="datetime-local" name="startDateTime" onChange={value => this.changeStateText("startDateTime", value)}/>

                                </div>
                                <div className="field">
                                    <label>Duration</label>
                                    <Dropdown placeholder='duration' value = {this.state.duration} fluid search selection options={timeOptions} onChange={this.handleDurationChange}/>
                                </div>

                                <div className="field">
                                    <label>Capacity</label>
                                    <Input type="text" name="capacity" placeholder="Number of allowed attendees... " onChange={value => this.changeStateText("goal", value)}/>
                                </div>

                                <div className="field">
                                    <label>Goal</label>
                                    <Input type="text" name="goal" placeholder="Criteria the victor is decided on..." onChange={value => this.changeStateText("goal", value)}/>
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


