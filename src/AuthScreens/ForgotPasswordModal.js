import React, { Component } from 'react';
import Semantic, { Modal, Button, Input } from 'semantic-ui-react';

class ForgotPasswordModal extends Component {
    render() {
        return(
            <Modal trigger={<Button>Forgot Password?</Button>}size='tiny'>
                <Modal.Header>Delete Your Account</Modal.Header>
                <Modal.Content>
                    <p>Are you sure you want to delete your account</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative>No</Button>
                    <Button positive icon='checkmark' labelPosition='right' content='Yes' />
                </Modal.Actions>
            </Modal>
        );
    }
}

export default ForgotPasswordModal;
