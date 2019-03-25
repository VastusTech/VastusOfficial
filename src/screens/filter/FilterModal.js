// TODO This will be the modal that comes up with the button next to the search bar that allows us to filter
// TODO our results in a customized way

import React, {useState, Fragment} from 'react';
import {connect} from 'react-redux';
import {Grid, Form, Popup, Divider, Button, List} from "semantic-ui-react";
import SearchBarProp from "../../vastuscomponents/components/props/SearchBar";

// TODO Take from the SearchTab.js file in order for inspiration / direct stealing :)

type Props = {

};

const handleApplyButton = () => {
    alert("ay lmao");
};

const FilterModal = (props: Props) => {
    return (
        <Fragment>
            <Grid columns={2}>
                <Grid.Column className="ui one column stackable center aligned page grid">
                    <Form>
                        <Form.Input type="text" iconPosition='left' icon='user' name="username" placeholder="Username" onChange={value => this.changeStateText("username", value)}/>
                        <Popup position="left center" trigger={<Form.Input iconPosition='left' icon='lock' type="password" name="password" placeholder="Password" onChange={value => this.changeStateText("password", value)}/>}>
                            Password must be at least 8 characters long, contains lower and upper case letters, contain at least one number.
                        </Popup>
                        <div className="u-flex u-flex-justify--space-between u-padding-y--2 u-margin-top--2">
                            <Button positive color='green' onClick={() => handleApplyButton()}>Apply Filter</Button>
                            <Button negative inverted onClick={() => alert("no")}>Set To Default</Button>
                        </div>
                    </Form>
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