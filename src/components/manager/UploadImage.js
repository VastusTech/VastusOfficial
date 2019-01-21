import React, {Component} from 'react';
import {Button, Icon} from "semantic-ui-react";
import AvatarEditor from "react-avatar-editor";
import PropTypes from 'prop-types';

type Props = {
    imageURL: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired
};
type State = {
    rotation: number
};

class UploadImage extends Component<Props, State> {
    state = {
        rotation: 0
    };
    onClickSave = () => {
        function dataURItoBlob(dataURI) {
            const binary = atob(dataURI.split(',')[1]);
            const array = [];
            for(let i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
        }
        if (this.editor) {
            this.props.callback(dataURItoBlob(this.editor.getImageScaledToCanvas().toDataURL("image/jpeg")));
        }
    };
    setEditorRef = (editorRef) => this.editor = editorRef;
    render() {
        return (
            <div>
                <AvatarEditor
                    ref={this.setEditorRef}
                    image={this.props.imageURL}
                    width={250}
                    height={250}
                    border={50}
                    rotate={this.state.rotation}
                    scale={1.2}
                />
                <Button primary onClick={() => {this.setState({rotation: (this.state.rotation + 90) % 360})}}>
                    <Icon name="arrow alternate circle right"/>
                </Button>
                <Button primary onClick={this.onClickSave}>Upload</Button>
            </div>
        );
    }
}

export default UploadImage;