import _ from 'lodash';
import React, { Component } from 'react';
import { Grid, Label, Icon } from 'semantic-ui-react';

// TODO: Feature to be implemented later don't worry about this file.
class TrophyCase extends Component {
    state = {
        numTrophies: 0
    };

    constructor(props) {
        super(props);
        if (this.props.numTrophies) {
            this.state.numTrophies = this.props.numTrophies;
        }
    }

    render() {
        function columns(num) {
            return(_.times(num, i => (
                <Grid.Column key={i}>
                    <Label>
                        <Icon name='trophy' />
                    </Label>
                </Grid.Column>
            )));
        }

        return(
            <Grid>{columns(this.state.numTrophies)}</Grid>
        );
    }
}

export default TrophyCase;