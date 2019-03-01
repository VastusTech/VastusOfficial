import React, { Component } from 'react'
import { List, Icon, Grid, Button, Message } from 'semantic-ui-react';
import ClientCard from "../../vastuscomponents/components/cards/ClientCard";
import { connect } from "react-redux";
import {fetchItem} from "../../vastuscomponents/redux_actions/cacheActions";
import Spinner from "../../vastuscomponents/components/props/Spinner";
import {getItemTypeFromID, switchHandleItemType, switchReturnItemType} from "../../vastuscomponents/logic/ItemType";
import TrainerCard from "../../vastuscomponents/components/cards/TrainerCard";
import EventCard from "../../vastuscomponents/components/cards/EventCard";
import ChallengeCard from "../../vastuscomponents/components/cards/ChallengeCard";
import PostCard from "../../vastuscomponents/components/cards/PostCard";
import MessageBoardCard from "../../screens/messaging_tab/MessageBoardCard";

type Props = {
    ids: [string],
    noObjectsMessage: string,
    acceptedItemTypes?: [string],
    sortFunction?: any
}

class DatabaseObjectList extends Component<Props> {
    state = {
        isLoading: true,
        ids: null,
        objects: [],
        marker: 0
    };

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(newProps) {
        // We can use json stringify to check this because it's an array of strings
        if (newProps.ids && JSON.stringify(this.state.ids) !== JSON.stringify(newProps.ids)) {
            this.state.ids = newProps.ids;
            // alert("received ids = " + JSON.stringify(newProps.ids));
            this.setState({isLoading: true, ids: newProps.ids, objects: []}, () => {
                const addObject = (object) => {
                    if (object) {
                        this.state.objects.push(object);
                    }
                    this.setState({isLoading: false});
                };
                for (let i = 0; i < newProps.ids.length; i++) {
                    const id = newProps.ids[i];
                    const itemType = getItemTypeFromID(id);
                    if (!newProps.acceptedItemTypes || newProps.acceptedItemTypes.includes(itemType)) {
                        const variableList = switchReturnItemType(itemType,
                            ClientCard.fetchVariableList,
                            ["id", "name", "gender", "birthday", "profileImagePath", "profilePicture", "profileImagePaths"],
                            null, null, null,
                            EventCard.fetchVariableList,
                            ChallengeCard.fetchVariableList,
                            null,
                            PostCard.fetchVariableList,
                            null, null, null, MessageBoardCard.fetchVariableList,
                            "Get variable list from item type not implemented!");
                        this.props.fetchItem(itemType, id, variableList, addObject);
                    }
                }
            });
        }
    }

    render() {
        function objectComponents(objects, sortFunction) {
            const objectList = [...objects];
            const components = [];
            if (sortFunction) {
                objectList.sort(sortFunction);
            }
            for (const key in objectList) {
                if (objectList.hasOwnProperty(key)) {
                    const id = objectList[key].id;
                    const itemType = objectList[key].item_type;
                    const rank = parseInt(key) + 1;
                    components.push(
                        <List.Item key={key}>
                            <Grid>
                                <Grid.Column width={12}>
                                    {switchReturnItemType(itemType,
                                        <ClientCard rank={rank} clientID={id}/>,
                                        <TrainerCard rank={rank} trainerID={id}/>,
                                        null,
                                        null,
                                        null,
                                        <EventCard eventID={id}/>,
                                        <ChallengeCard challengeID={id}/>,
                                        null,
                                        <PostCard postID={id}/>,
                                        null,
                                        null,
                                        null,
                                        <MessageBoardCard messageBoardID={id}/>,
                                        "Get database object list object not implemented for item type"
                                    )}
                                </Grid.Column>
                                <Grid.Column width={3}>
                                    <Button primary fluid onClick = {() => {alert("open new message")}}><Icon name='comment outline' size='large' />
                                        <Icon name='plus' size='large' /></Button>
                                </Grid.Column>
                            </Grid>
                        </List.Item>
                    );
                    components.push(switchReturnItemType())
                }
            }
            return components;
        }
        if (this.props.isLoading) {
            return(
                <Spinner/>
            )
        }
        if (this.state.objects.length > 0) {
            return(
                <List relaxed verticalAlign="middle">
                    {objectComponents(this.state.objects, this.props.sortFunction)}
                </List>
            );
        }
        else {
            return(
                <Message>{this.props.noObjectsMessage}</Message>
            );
        }
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchItem: (itemType, id, variableList, dataHandler, failureHandler) => {
            dispatch(fetchItem(itemType, id, variableList, dataHandler, failureHandler));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DatabaseObjectList);