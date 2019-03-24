import React from "react";
import {Grid, Button, Modal} from 'semantic-ui-react'
import CreateGroupProp from "../../vastuscomponents/components/manager/CreateGroup";
import GroupFeed from "../../vastuscomponents/components/feeds/GroupFeed";
import QL from "../../vastuscomponents/api/GraphQL";

const CommunityTab = () => (
    <Grid fluid centered>
        <Grid.Row height={20} style={{marginBottom: '15px', marginTop: '15px'}}>
        <Modal trigger={<Grid centered><Button primary>Create New Group</Button></Grid>}>
            <CreateGroupProp/>
        </Modal>
        </Grid.Row>
        <Grid.Row>
            <Grid centered>
                <GroupFeed filter={null}/>
            </Grid>
        </Grid.Row>
    </Grid>
);

export default CommunityTab;