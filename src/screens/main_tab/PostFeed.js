import React, {Component, Fragment} from 'react'
import _ from 'lodash'
import {Visibility, Header, Grid} from 'semantic-ui-react'
import PostCard from "../../vastuscomponents/components/cards/PostCard";
import QL from "../../vastuscomponents/api/GraphQL";
import { connect } from 'react-redux';
import {
    fetchPost,
    putChallengeQuery,
    putPost,
    putPostQuery,
    fetchChallenge,
    putChallenge,
    fetchClient,
    fetchTrainer,
    fetchPostQuery
} from "../../vastuscomponents/redux_actions/cacheActions";
import {fetchUserAttributes} from "../../redux_helpers/actions/userActions";
import NextChallengeProp from "./NextChallenge";
import {getItemTypeFromID} from "../../vastuscomponents/logic/ItemType";
import {log, err} from "../../Constants";
import {debugAlert} from "../../vastuscomponents/logic/DebuggingHelper";
import ChallengeCard from "../../vastuscomponents/components/cards/ChallengeCard";
import ClientDetailCard from "../../vastuscomponents/components/post_detail_cards/ClientDetailCard";
import TrainerDetailCard from "../../vastuscomponents/components/post_detail_cards/TrainerDetailCard";
import ChallengeDetailCard from "../../vastuscomponents/components/post_detail_cards/ChallengeDetailCard";
import PostDetailCard from "../../vastuscomponents/components/post_detail_cards/PostDetailCard";
import {getNowISO} from "../../vastuscomponents/logic/TimeHelper";

/**
 * Event Feed
 *
 * This is the main feed in the home page, it currently displays all public events inside of the database for
 * the user to see.
 */
class PostFeedProp extends Component {
    state = {
        isLoading: true,
        userID: null,
        posts: [],
        challenges: [],
        loadedPostIDs: [],
        clientNames: {}, // id to name
        postFeedLength: 50,
        challengeFeedLength: 10,
        sentRequest: false,
        nextToken: null,
        ifFinished: false,
        calculations: {
            topVisible: false,
            bottomVisible: false
        },
    };

    constructor(props) {
        super(props);
        this.forceUpdate = this.forceUpdate.bind(this);
        this.queryPosts = this.queryPosts.bind(this);
        //this.queryChallenges = this.queryChallenges.bind(this);
    }

    componentWillReceiveProps(newProps) {
        // log&&console.log("Set state to userID = " + newProps.userID);
        if (this.state.userID !== newProps.userID) {
            this.state.userID = newProps.userID;
            this.queryPosts();
        }
    }

    componentDidUpdate(newProps) {
        this.queryPosts();
    }

    /*
    Here we have a feed of posts that we are querying.
    For one query, we only change the nextToken to get the next stuff
    PostQuery nextToken = null (1)
    PostQuery nextToken = 1 (2)
    PostQuery nextToken = 2 (null)
    Done...
     */
    queryPosts() {
        // console.log("BEFORE: " + this.state.sentRequest);
        if (!this.state.sentRequest) {
            this.state.sentRequest = true;
            // console.log("AFTER: " + this.state.sentRequest);
            if (!this.state.ifFinished) {
                this.setState({isLoading: true});
                const filter = QL.generateFilter({
                    and: [{
                        or: [{
                            postType: {
                                eq: "$postType1"
                            }
                        }, {
                            postType: {
                                eq: "$postType2"
                            }
                        }]
                    }
                ]}, {
                    postType1: "Challenge",
                    postType2: "newChallenge",
                });
                // QL.queryPosts(["id", "time_created", "by", "item_type", "postType", "about", "description", "videoPaths", "picturePaths"],
                debugAlert("Fetching Post Feed Query");
                this.props.fetchPostQuery(PostCard.fetchVariableList, filter, this.state.postFeedLength, this.state.nextToken, (data) => {
                        if (!data.nextToken) {
                            this.setState({ifFinished: true});
                        }
                        if (data.items) {
                            // Fetch all the Card information for the received detail cards
                            debugAlert("Post Feed looping " + data.items.length + " times!");
                            for (let i = 0; i < data.items.length; i++) {
                                const post = data.items[i];
                                // Filter the results based on if we are able to see it
                                if (post.access === "public" || this.props.user.friends.includes(post.by)) {
                                    // Fetch the "by" information
                                    const by = post.by;
                                    const byItemType = getItemTypeFromID(by);
                                    if (byItemType === "Client") {
                                        debugAlert("Fetching Client for BY in post for Post Feed");
                                        this.props.fetchClient(by, ["name", "profileImagePath"]);
                                    }
                                    else if (byItemType === "Trainer") {
                                        debugAlert("Fetching Trainer for BY in post for Post Feed");
                                        this.props.fetchTrainer(by, ["name", "profileImagePath"]);
                                    }
                                    // Fetch the "about" information
                                    const about = post.about;
                                    const aboutItemType = getItemTypeFromID(about);
                                    if (aboutItemType === "Client") {
                                        debugAlert("Fetching Client for ABOUT in post for Post Feed");
                                        this.props.fetchClient(about, ClientDetailCard.fetchVariableList);
                                    } else if (aboutItemType === "Trainer") {
                                        debugAlert("Fetching Trainer for ABOUT in post for Post Feed");
                                        this.props.fetchTrainer(about, TrainerDetailCard.fetchVariableList);
                                    } else if (aboutItemType === "Event") {

                                    } else if (aboutItemType === "Challenge") {
                                        // console.log("Fetching challenge for post in post feed");
                                        debugAlert("Fetching Challenge for ABOUT in post for Post Feed");
                                        this.props.fetchChallenge(about, ChallengeCard.fetchVariableList);
                                    } else if (aboutItemType === "Post") {
                                        debugAlert("Fetching Post for ABOUT in post for Post Feed");
                                        this.props.fetchPost(about, PostDetailCard.fetchVariableList);
                                    }
                                    this.state.posts.push(post);
                                }
                                else {
                                    debugAlert("NOT SHOWING: " + JSON.stringify(post));
                                }
                            }
                            this.setState({nextToken: data.nextToken});
                        }
                        else {
                            // TODO Came up with no events
                        }
                        this.setState({isLoading: false});
                    }, (error) => {
                        err&&console.error("Querying Posts failed!");
                        err&&console.error(error);
                        this.setState({isLoading: false, error: error});
                    }, this.props.cache.postQueries, this.props.putPostQuery);
            }
        }
    }

    /**
     *
     * @param e
     * @param calculations
     */
    handleUpdate = (e, { calculations }) => {
        this.setState({ calculations });
        log&&console.log(calculations.bottomVisible);
        if (calculations.bottomVisible) {
            log&&console.log("Next Token: " + this.state.nextToken);
            this.state.sentRequest = false;
            this.queryPosts();
        }
    };

    forceUpdate = () => {
        // What is this even doing?
        // this.props.forceFetchUserAttributes(["Posts"]);
    };

    render() {
        /**
         * This function takes in a list of Posts and displays them in a list of Event Card views.
         * @param Posts
         * @returns {*}
         */
        function rows(Posts) {
            // if(Posts != null && Posts.length > 0)
            //     log&&console.log(JSON.stringify(Posts[0].id));
            // log&&console.log("EVENTS TO PRINT: ");
            // log&&console.log(JSON.stringify(Posts));
            return _.times(Posts.length, i => (
                <Fragment key={i + 1}>
                    {/*console.log(JSON.stringify(Posts[i].id))*/}
                    <PostCard postID={Posts[i].id}/>
                </Fragment>
            ));
        }

        //This displays the rows in a grid format, with visibility enabled so that we know when the bottom of the page
        //is hit by the user.
        return (
            <Visibility onUpdate={_.debounce(this.handleUpdate, 500)}>
                {/*<Grid className='ui center aligned'>
                    <Grid.Column floated='center' width={15}>
                        <CreateChallengeProp queryChallenges={this.queryChallenges} queryPosts={this.queryPosts}/>
                    </Grid.Column>
                    <Grid.Column floated='center' width={15}>
                        <CreatePostProp queryPosts={this.queryPosts}/>
                    </Grid.Column>
                </Grid>*/}
                {/*<Grid className='ui center aligned'>*/}
                    {/*<Grid.Column floated width={15}>*/}
                        {/*<PostManager queryChallenges={this.queryChallenges} queryPosts={this.queryPosts}/>*/}
                    {/*</Grid.Column>*/}
                {/*</Grid>*/}
                <Header sub>Your Next Challenge:</Header>
                <NextChallengeProp/>
                <Header sub>Upcoming Posts:</Header>
                {rows(this.state.posts)}
            </Visibility>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    info: state.info,
    cache: state.cache
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (variablesList, dataHandler) => {
            dispatch(fetchUserAttributes(variablesList, dataHandler));
        },
        fetchClient: (variablesList, dataHandler) => {
            dispatch(fetchClient(variablesList, dataHandler));
        },
        fetchTrainer: (variablesList, dataHandler) => {
            dispatch(fetchTrainer(variablesList, dataHandler));
        },
        fetchPost: (id, variablesList) => {
            dispatch(fetchPost(id, variablesList));
        },
        putPost: (event) => {
            dispatch(putPost(event));
        },
        putPostQuery: (queryString, queryResult) => {
            dispatch(putPostQuery(queryString, queryResult));
        },
        fetchPostQuery: (variablesList, filter, limit, nextToken, dataHandler, failureHandler) => {
            dispatch(fetchPostQuery(variablesList, filter, limit, nextToken, dataHandler, failureHandler));
        },
        fetchChallenge: (id, variablesList) => {
            dispatch(fetchChallenge(id, variablesList));
        },
        putChallenge: (event) => {
            dispatch(putChallenge(event));
        },
        putChallengeQuery: (queryString, queryResult) => {
            dispatch(putChallengeQuery(queryString, queryResult));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PostFeedProp);
