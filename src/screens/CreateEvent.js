import React, { Component } from 'react';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { Checkbox, Modal, Button, Input, Form, Container, TextArea } from 'semantic-ui-react';
import {
    DateInput,
    TimeInput,
    DateTimeInput,
    DatesRangeInput
} from 'semantic-ui-calendar-react';
import Lambda from "../Lambda";
import {connect} from "react-redux";
import setupAWS from "./AppConfig";

setupAWS();


function convertDateTimeToISO8601(dateAndTime) {
    var dateTimeString = String(dateAndTime);
    var day = dateTimeString.substr(0, 2);
    var month = dateTimeString.substr(3, 2);
    var year = dateTimeString.substr(6, 4);
    var time = dateTimeString.substr(11, 5);
    var hour = dateTimeString.substr(11, 2);
    var minute = dateTimeString.substr(13, 3);
    var amorpm = dateTimeString.substr(16, 3);

    if(amorpm.trim() === 'AM') {
        return year + "-" + month + "-" + day + "T" + time + ":00+00:00";
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

    challengeState = {
        title: "",
        date: "",
        location: "",
        time: "",
        capacity: "",
        goal: "",
        description: "",
        access: "public"
    };

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
        this.challengeState[key] = value.target.value;
        console.log("New " + key + " is equal to " + value.target.value);
    }

    handleAccessSwitch = () => {
        if(this.challengeState.access == 'public') {
            this.challengeState.access = 'private';
            //alert(this.challengeState.access);
        }
        else if (this.challengeState.access == 'private') {
            this.challengeState.access = 'public';
            //alert(this.challengeState.access);
        }
        else {
            alert("Challenge access should be public or private");
        }

    };

    handleSubmit = () => {
        const time = convertDateTimeToISO8601(this.state.dateTime) + "_" +
            convertDateTimeToISO8601(this.state.dateTimeEnd);

        Lambda.createChallenge(this.props.user.id, this.props.user.id, time, String(this.challengeState.capacity),
            String(this.challengeState.location), String(this.challengeState.title),
            String(this.challengeState.goal), (data) => {
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

    //Inside of render is a modal containing each form input required to create a challenge.
    render() {
        return (
            <Container style={{padding: 10}}>
                <Modal trigger={<Button basic color='purple'>+ Create Challenge</Button>}>
                    <Modal.Header align='center'>Create Event</Modal.Header>
                    <Modal.Content>

                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group unstackable widths={2}>

                                <div className="field">
                                    <label>Title</label>
                                    <Input type="text" name="title" placeholder="Title" onChange={value => this.changeStateText("title", value)}/>
                                </div>

                                <div className="field">
                                    <label>Location</label>
                                    <Input type="text" name="location" placeholder="Address for challenge" onChange={value => this.changeStateText("location", value)}/>
                                </div>

                                <div className="field">
                                    <label>Start Date and Time</label>
                                    <DateTimeInput
                                        name="dateTime"
                                        placeholder="Start"
                                        value={this.state.dateTime}
                                        iconPosition="left"
                                        onChange={this.handleStartTimeChange}
                                        timeFormat={this.state.timeFormat} />
                                </div>

                                <div className="field">
                                    <label>End Date and Time</label>
                                    <DateTimeInput
                                        name="dateTimeEnd"
                                        placeholder="End"
                                        value={this.state.dateTimeEnd}
                                        iconPosition="left"
                                        onChange={this.handleEndTimeChange}
                                        timeFormat={this.state.timeFormat}/>
                                </div>

                                <div className="field">
                                    <label>Capacity</label>
                                    <Input type="text" name="capacity" placeholder="Number of allowed attendees... " onChange={value => this.changeStateText("capacity", value)}/>
                                </div>

                                <div className="field">
                                    <label>Goal</label>
                                    <Input type="text" name="goal" placeholder="Criteria the victor is decided on..." onChange={value => this.changeStateText("goal", value)}/>
                                </div>

                            </Form.Group>

                            <div className="Challenge Description">
                                <label>Challenge Description</label>
                                <TextArea type="text" name="description" placeholder="Describe challenge here... " onChange={value => this.changeStateText("description", value)}/>
                            </div>

                            <div className="Submit Button">
                                <Button type='button' onClick={() => { this.handleSubmit()}}>Submit</Button>
                            </div>

                            <div className="Privacy Switch">
                                <Checkbox toggle onClick={this.handleAccessSwitch} onChange={this.toggle} checked={this.state.checked}/>
                                <div>{this.challengeState.access}</div>
                            </div>

                        </Form>
                    </Modal.Content>
                </Modal>
            </Container>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(CreateEventProp);


