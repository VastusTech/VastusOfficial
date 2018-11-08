import React, { Component } from 'react'
import {Grid, Message} from 'semantic-ui-react';
import EventCard from "./EventCard";
import QL from '../GraphQL';
import { connect } from 'react-redux';
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";

class OwnedChallengesList extends Component {
    state = {
        isLoading: false,
        challenges: {},
        sentRequest: false,
        error: null
    };

    constructor(props) {
        super(props);
        this.update();
    }

    update() {
        // TODO Change this if we want to actually be able to do something while it's loading
        const user = this.props.user;
        if (!user.id) {
            alert("Pretty bad error");
            this.setState({isLoading: true});
        }

        if (user.hasOwnProperty("ownedChallenges") && user.ownedChallenges && user.ownedChallenges.length) {
            for (var i = 0; i < user.ownedChallenges.length; i++) {
                if (!(user.ownedChallenges[i] in this.state.challenges)) {
                    this.addChallengeFromGraphQL(user.ownedChallenges[i]);
                }
            }
        }
        else if (!this.state.isLoading) {
            if (!this.state.sentRequest && !this.props.user.info.error) {
                this.props.fetchUserAttributes(user.id, ["ownedChallenges"]);
                this.setState({sentRequest: true});
            }
        }
    }

    addChallengeFromGraphQL(challengeID) {
        QL.getChallenge(challengeID, ["id", "time", "title", "goal", "owner", "members"], (data) => {
            console.log("successfully got a challenge");
            this.setState({challenges: [...this.state.challenges, data], isLoading: false});
        }, (error) => {
            console.log("Failed to get a challenge");
            console.log(JSON.stringify(error));
            this.setState({error: error});
        });
    }

    componentWillReceiveProps(newProps) {
        // this.props = newProps;
        this.update();
    }

    render() {
        function rows(userID, challenges) {
            const rowProps = [];
            for (const key in challenges) {
                if (challenges.hasOwnProperty(key)) {
                    rowProps.push(
                        <Grid.Row className="ui one column stackable center aligned page grid">
                            <EventCard userID={userID} challenge={challenges[key]}/>
                        </Grid.Row>
                    );
                }
            }
            return rowProps;
        }
        if (this.state.isLoading) {
            return(
                <Message>Loading...</Message>
            )
        }
        return(
            <Grid>{rows(this.state.userID, this.state.challenges)}</Grid>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (id, attributeList) => {
            dispatch(fetchUserAttributes(id, attributeList));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OwnedChallengesList);

