// TODO This will be the modal that comes up with the button next to the search bar that allows us to filter
// TODO our results in a customized way

import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {Grid, Form, Popup, Divider, Button, List} from "semantic-ui-react";
import SearchBarProp from "../../vastuscomponents/components/props/SearchBar";

// TODO Take from the SearchTab.js file in order for inspiration / direct stealing :)

type Props = {

};

const FilterModal = (props: Props) => {
    return (
        <Fragment>
            <Grid columns={2}>
                <Grid.Column className="ui one column stackable center aligned page grid">
                    <SearchBarProp/>
                    <Form>
                        <Form.Input type="text" iconPosition='left' icon='user' name="username" placeholder="Username" onChange={value => this.changeStateText("username", value)}/>
                        <Popup position="left center" trigger={<Form.Input iconPosition='left' icon='lock' type="password" name="password" placeholder="Password" onChange={value => this.changeStateText("password", value)}/>}>
                            Password must be at least 8 characters long, contains lower and upper case letters, contain at least one number!
                        </Popup>
                        {/* <Form.Input type="password" label="Password" name="password" placeholder="Password" onChange={value => this.changeStateText("password", value)}/> */}
                        <Form.Input type="password" iconPosition='left' icon='lock' name="confirmPassword" placeholder="Confirm Password" onChange={value => this.changeStateText("confirmPassword", value)}/>
                        <Divider />
                        <Form.Input type="text" iconPosition='left' icon='user circle' name="name" placeholder="Name" onChange={value => this.changeStateText("name", value)}/>
                        <Form.Input type="text" iconPosition='left' icon='male' name="gender" placeholder="Gender" onChange={value => this.changeStateText("gender", value)}/>
                        <Divider />
                        <Form.Input type="date" iconPosition='left' icon='calendar alternate outline' name="birthdate" onChange={value => this.changeStateText("birthday", value)}/>
                        <Form.Input type="text" iconPosition='left' icon='mail' name="email" placeholder="Email" onChange={value => this.changeStateText("email", value)}/>
                        <div className="u-flex u-flex-justify--space-between u-padding-y--2 u-margin-top--2">
                            <Button negative onClick={this.handleCancelButton.bind(this)}>Cancel</Button>
                            <Button positive color='green' onClick={this.handleCreateButton.bind(this)}>Create</Button>
                        </div>
                    </Form>
                </Grid.Column>
                <Grid.Column verticalAlign='middle' >
                    <List>
                        {this.getFormattedResults()}
                    </List>
                </Grid.Column>
            </Grid>
        </Fragment>
    );
};

const mapStateToProps = state => ({
    search: state.search
});

const mapDispatchToProps = dispatch => {
    return {
        // TODO Functions to set the filter
        // TODO and maybe set it back to default
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterModal);