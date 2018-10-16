import _ from 'lodash'
import React from 'react'
import { Grid, Label, Icon } from 'semantic-ui-react'

const columns = _.times(5, i => (
    <Grid.Column key={i}>
        <Label>
            <Icon name='trophy' />
        </Label>
    </Grid.Column>
))

const TrophyCaseProp = () => <Grid>{columns}</Grid>

export default TrophyCaseProp;