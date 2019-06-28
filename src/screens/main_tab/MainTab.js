import React from "react";
import {Header, Modal, Button, Grid} from "semantic-ui-react";
import PostFeedProp from "../../vastuscomponents/components/feeds/PostFeed";
import NextChallengeProp from "../../vastuscomponents/components/info/NextChallenge";
import QL from "../../vastuscomponents/api/GraphQL";
import CreateChallengeProp from "../../vastuscomponents/components/manager/CreateChallenge";

/**
 * Displays a feed of all posts visible to the current user.
 *
 * @returns {*} The React JSX used to display the component.
 * @constructor
 */
const MainTab = () => {
  return (
    <div>
      <Grid centered>

      </Grid>
      <Header sub>Your Next Challenge:</Header>
      <NextChallengeProp/>
      <Header sub>Upcoming Posts:</Header>
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
          ]
        }, {
          postType1: "Challenge",
          postType2: "newChallenge",
        })
      }/>
    </div>
  );
};

export default MainTab;