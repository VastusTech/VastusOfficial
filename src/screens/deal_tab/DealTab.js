import React from "react";
import {Header} from "semantic-ui-react";
import QL from "../../vastuscomponents/api/GraphQL";
import DealFeed from "../../vastuscomponents/components/feeds/DealFeed";

/**
 * Displays a feed of all deals visible to the current user.
 *
 * @returns {*} The React JSX used to display the component.
 * @constructor
 */
const MainTab = () => {
  return (
    <div>
      <Header sub>Vastus Deals:</Header>
      <DealFeed/>
    </div>
  );
};

export default MainTab;
