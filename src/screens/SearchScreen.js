import React, { Component } from "react";
import { connect } from "react-redux";
import {List, Divider, Segment, Grid, Form, Button} from "semantic-ui-react";
import {switchReturnItemType} from "../logic/ItemType";
import ClientCard from "../components/ClientCard";
import EventCard from "../components/EventCard";
import ChallengeCard from "../components/ChallengeCard";
import PostCard from "../components/PostCard";
import {disableSearchBar, enableSearchBar} from "../redux_helpers/actions/searchActions";

// This is going to be for every search functionality we really want.
// We'll have a filter section and a search bar

/*
This will be mainly a search bar filled with search results and then also a "type" section to indicate which types
should be included in the search. Then a filter section for what you want to check for.

       ( Search...                       O_)
       (    Type    )       (    Filter    )

       (               Result              )
       (               Result              )
       (               Result              )
       (               Result              )
                        ...

This'll be pretty weird though because we already have the search bar prop up above... Maybe this wou
 */

class SearchScreen extends Component {
    state = {

    };

    componentWillMount() {
        this.props.disableSearchBar();
    }

    componentWillUnmount() {
        this.props.enableSearchBar();
    }

    getFormattedResults() {
        const results = [];
        for (let i = 0; i < this.props.search.results; i++) {
            const result = this.props.search.results[i];
            const item_type = result.item_type;
            // results.push(
            //     <List.Item>
            //         {switchReturnItemType(item_type,
            //         <ClientCard rank={} clientID={}/>,
            //         null,
            //         null,
            //         null,
            //         null,
            //         <EventCard eventID={}/>,
            //         <ChallengeCard/>,
            //         null,
            //         <PostCard/>, "Result type not implemented!")}
            //     </List.Item>
            // );
        }
    }

    render() {
        return(
            <Segment placeholder>
                <Grid columns={2} relaxed='very' stackable>
                    <Grid.Column>
                        <Form>
                            <Form.Input icon='user' iconPosition='left' label='Username' placeholder='Username' />
                            <Form.Input icon='lock' iconPosition='left' label='Password' type='password' />
                            <Button content='Login' primary />
                        </Form>
                    </Grid.Column>
                    <Grid.Column verticalAlign='middle' >
                        <Button fluid content='Sign up' icon='signup' size='big' />
                    </Grid.Column>
                </Grid>
                {/*<Divider vertical>Or</Divider>*/}
            </Segment>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    cache: state.cache,
    info: state.info,
});

const mapDispatchToProps = (dispatch) => {
    return {
        enableSearchBar: () => {
            dispatch(enableSearchBar());
        },
        disableSearchBar: () => {
            dispatch(disableSearchBar());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);