import React from 'react'
import { Button, Popup } from 'semantic-ui-react'

const CreateEventProp = () => (
    <Popup trigger={<Button icon='add' />} content='Create new event.' />
)

export default CreateEventProp