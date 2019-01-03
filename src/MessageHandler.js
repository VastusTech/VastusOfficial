import Lambda from "./Lambda";

/*
Messages:

New Table: Messages
    ( board, id, time_created, type, message )

    Things we need to be able to do on it.
        * Query for messages a message "board"
            * Query on the time_created index so that we get the most recent messages first
        * Create a new message "board"
        * Add a message to a message board
        * Find a board from the people who are involved in it.
            * TODO WE SHOULD SORT THE LIST OF IDs ALPHABETICALLY SO THAT IT'S DETERMINISTIC
        *
 */

class MessageHandler {
    static getTopic(ids) {
        // TODO Do some checking?
        let topic = "";

        for (let i = 0; i < ids.length; i++) {
            if (i !== 0) {
                topic += "_";
            }
            topic += ids[i];
        }
        return topic.sorted();
    }
    static sendMessage() {

    }

    static
}

export default MessageHandler;
