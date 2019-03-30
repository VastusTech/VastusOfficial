import React, {useState, useEffect, Fragment} from 'react';
import {connect} from 'react-redux';
import {Grid, Modal, Checkbox} from "semantic-ui-react";
import {disableType, enableType} from "../../vastuscomponents/redux_actions/searchActions";

type Props = {
    open: boolean,
    onClose: () => void
};

const getCheckBoxes = (filterTypes, setFilterTypes, enableType, disableType) => {
    const checkBoxes = [];
    for (const type in filterTypes) {
        if (filterTypes.hasOwnProperty(type)) {
            checkBoxes.push(
                <div key={type}>
                    <Grid.Column>
                        <Checkbox label={type} toggle
                                  checked={filterTypes[type]}
                                  onChange={() => toggleTypeCheckbox(type, setFilterTypes, enableType, disableType)}/>
                    </Grid.Column>
                </div>
            )
        }
    }
    return checkBoxes;
};

const toggleTypeCheckbox = (type, setFilterTypes, enableType, disableType) => {
    setFilterTypes(p => {
        if (p[type]) {
            // Disable type
            alert("disabling " + type);
            disableType(type);
        }
        else {
            // Enable type
            alert("enabling " + type);
            enableType(type);
        }
        return {
            ...p,
            [type]: !p[type]
        }
    });
    // alert(JSON.stringify(event.target.checked))
};

/**
 * The Modal to filter out results from the search bar. Chooses which item types to include in the actual search
 * functionality.
 *
 * @param props
 * @return {*}
 * @constructor
 */
const FilterModal = (props: Props) => {
    const [filterTypes, setFilterTypes] = useState({});

    useEffect(() => {
        if (props.open) {
            setFilterTypes({});
            const types = props.search.typeQueries;
            for (const type in types) {
                if (types.hasOwnProperty(type)) {
                    if (["Client", "Trainer", "Event", "Challenge", "Group"].includes(type)) {
                        setFilterTypes(p => ({
                            ...p,
                            [type]: types[type].enabled
                        }));
                    }
                }
            }
        }
    }, [props.open, props.search]);

    return (
        <Modal open={props.open} onClose={props.onClose} closeIcon>
            <Modal.Header>Filter</Modal.Header>
            <Modal.Description>
                Choose which item types show up in the search bar!
            </Modal.Description>
            <Modal.Actions>
                <Fragment>
                    <Grid stackable stretched columns={9}>
                        {getCheckBoxes(filterTypes, setFilterTypes, props.enableType, props.disableType)}
                    </Grid>
                </Fragment>
            </Modal.Actions>
        </Modal>
    );
};

const mapStateToProps = state => ({
    search: state.search
});

const mapDispatchToProps = dispatch => {
    return {
        enableType: (type) => {
            dispatch(enableType(type));
        },
        disableType: (type) => {
            dispatch(disableType(type));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterModal);