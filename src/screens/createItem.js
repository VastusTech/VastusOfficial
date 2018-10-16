import React, { Component } from 'react';
import { Form, Modal, Button, Container } from 'semantic-ui-react'
import Amplify, { API } from 'aws-amplify';

class CreateItemModal extends Component {
constructor(props) {
	
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
handleChange(event, {name, value}) {
    this.setState({ [name]: value });
  }
  
  handleSubmit(event) {
    let apiName = 'sampleCloudApi';
    let path = '/items';
    let newItem = {
      body: {
          name: this.state.itemName, price: this.state.itemPrice, description: this.state.itemDescription
        }
      };
    API.post(apiName, path, newItem).then(response => {
    console.log(response)
    }).catch(error => {
        console.log(error.response)
    });
    event.preventDefault();
    this.handleClose()
  }
  
handleSubmit(event) {
}
handleOpen = () => this.setState({ modalOpen: true })
handleClose = () => this.setState({ modalOpen: false })
render () {
    return (
        <Modal trigger={<Button onClick={this.handleOpen}>+ Schedule It</Button>}
               closeIcon={true} open={this.state.modalOpen} onClose={this.handleClose}>
          <Modal.Header>Schedule Time</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit} >
              <Form.Group unstackable widths={2}>
                <Form.Input name='trainerName' label='Trainer Name' placeholder='Enter Name' onChange={this.handleChange} value={this.state.trainerName} />
                <Form.Input name='slotPrice' label='Slot Price' placeholder='Enter Slot Price...' onChange={this.handleChange} type='number' value={this.state.slotPrice} />
              </Form.Group>
              <Form.TextArea name='item_description' label='Item Description' placeholder='Add a Description of the Item...' onChange={this.handleChange} value={this.state.itemDescription}/>
<Form.Button type='submit'>Submit</Form.Button>
            </Form>
          </Modal.Content>
        </Modal>
      );
    }
  }
export default CreateItemModal;