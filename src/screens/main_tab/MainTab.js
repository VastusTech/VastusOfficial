import React from "react";
import {Header} from "semantic-ui-react";
import PostFeedProp from "../../vastuscomponents/components/feeds/PostFeed";
import NextChallengeProp from "./NextChallenge";
import QL from "../../vastuscomponents/api/GraphQL";

const MainTab = () => {
    return [
        <Header sub>Your Next Challenge:</Header>,
        <NextChallengeProp/>,
        <Header sub>Upcoming Posts:</Header>,
        <PostFeedProp filter={
            QL.generateFilter({
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
            })
        }/>
    ];
};

export default MainTab;