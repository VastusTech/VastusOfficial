// TODO This will be the modal that comes up with the button next to the search bar that allows us to filter
// TODO our results in a customized way

import React, {Component} from 'react';
import {connect} from 'react-redux';

// TODO Take from the SearchTab.js file in order for inspiration / direct stealing :)

type Props = {

};

class FilterModal extends Component<Props> {
    render() {
        return (
            <div>

            </div>
        );
    }
}

const mapStateToProps = state => ({
    search: state.search
});

const mapDispatchToProps = dispatch => {
    return {
        // TODO Functions to set the filter
        // TODO and maybe set it back to default
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterModal);