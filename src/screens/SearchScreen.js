import React, { Component } from "react";
import { connect } from "react-redux";
import {} from "semantic-ui-react";

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

    render() {
        return(
            null
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    cache: state.cache,
    info: state.info,
});

const mapDispatchToProps = (state) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);