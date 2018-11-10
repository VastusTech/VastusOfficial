import * as AWS from "aws-sdk";

/// Configure AWS SDK for JavaScript
AWS.config.update({region: 'us-east-1'});
AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: 'us-east-1:d9a16b98-4393-4ff6-9e4b-5e738fef1222'});

// Prepare to call Lambda function
let lambda = new AWS.Lambda({region: 'us-east-1', apiVersion: '2015-03-31'});

// The lambda function to invoke
const lambdaFunctionName = "VastusDatabaseLambdaFunction";

class Lambda {
    // TODO This will be used for things like name or birthday
    static editClientAttribute(fromID, clientID, attributeName, attributeValue, successHandler, failureHandler) {
        this.invokeLambda({
            fromID: fromID,
            action: "UPDATESET",
            itemType: "Client",
            identifiers: [
                clientID
            ],
            attributeName: attributeName,
            attributeValues: [
                attributeValue
            ]
        }, successHandler, failureHandler);
    }
    static editEventAttribute(fromID, eventID, attributeName, attributeValue, successHandler, failureHandler) {
        this.invokeLambda({
            fromID: fromID,
            action: "UPDATESET",
            itemType: "Event",
            identifiers: [
                eventID
            ],
            attributeName: attributeName,
            attributeValues: [
                attributeValue
            ]
        }, successHandler, failureHandler);
    }
    static createClient(fromID, name, gender, birthday, email, username, successHandler, failureHandler) {
        this.invokeLambda({
            fromID: fromID,
            action: "CREATE",
            itemType: "Client",
            createClientRequest: {
                name: name,
                gender: gender,
                birthday: birthday,
                email: email,
                username: username
            }
        }, successHandler, failureHandler)
    }
    static createChallenge(fromID, owner, time, capacity, address, title, goal, successHandler, failureHandler) {
        this.invokeLambda({
            fromID: fromID,
            action: "CREATE",
            itemType: "Event",
            createEventRequest: {
                owner: owner,
                time: time,
                capacity: capacity,
                address: address,
                title: title,
                ifChallenge: "true",
                goal: goal
            }
        }, successHandler, failureHandler);
    }
    static createChallengeOptional(fromID, owner, time, capacity, address, title, goal, description, difficulty, memberIDs, access, successHandler, failureHandler) {
       this.invokeLambda({
            fromID: fromID,
            action: "CREATE",
            itemType: "Event",
            createEventRequest: {
                owner: owner,
                time: time,
                capacity: capacity,
                address: address,
                title: title,
                ifChallenge: "true",
                goal: goal,
                description: description,
                difficulty: difficulty,
                memberIDs: memberIDs,
                access: access
            }
        }, successHandler, failureHandler);
    }
    static joinEvent(fromID, clientID, eventID, successHandler, failureHandler) {
        this.invokeLambda({
            fromID: fromID,
            action: "UPDATEADD",
            itemType: "Client",
            identifiers: [
                clientID
            ],
            attributeName: "scheduledEvents",
            attributeValues: [
                eventID
            ]
        }, successHandler, failureHandler);
    }
    static completeChallenge(fromID, winnerID, challengeID, successHandler, failureHandler) {
        this.invokeLambda({
            fromID: fromID,
            action: "UPDATESET",
            itemType: "Event",
            identifiers: [
                challengeID
            ],
            attributeName: "winner",
            attributeValues: {
                winnerID
            },
        }, successHandler, failureHandler);
    }
    static leaveEvent(fromID, clientID, eventID, successHandler, failureHandler) {
        this.invokeLambda({
            fromID: fromID,
            action: "UPDATEREMOVE",
            itemType: "Client",
            identifiers: [
                clientID
            ],
            attributeName: "scheduledEvents",
            attributeValues: [
                eventID
            ]
        }, successHandler, failureHandler);
    }
    static deleteEvent(fromID, eventID, successHandler, failureHandler) {
        this.invokeLambda({
            fromID: fromID,
            action: "DELETE",
            itemType: "Event",
            identifiers: [
                eventID
            ]
        }, successHandler, failureHandler);
    }
    static createParty(fromID, owner, time, capacity, address, title, successHandler, failureHandler) {
        this.invokeLambda({
            fromID: fromID,
            action: "CREATE",
            itemType: "Event",
            createEventRequest: {
                owner: owner,
                time: time,
                capacity: capacity,
                address: address,
                title: title,
                ifChallenge: "false"
            }
        }, successHandler, failureHandler);
    }
    static createPartyOptional(fromID, owner, time, capacity, address, title, description, memberIDs, access, successHandler, failureHandler) {
        this.invokeLambda({
            fromID: fromID,
            action: "CREATE",
            itemType: "Event",
            createEventRequest: {
                owner: owner,
                time: time,
                capacity: capacity,
                address: address,
                title: title,
                description: description,
                memberIDs: memberIDs,
                access: access,
                ifChallenge: "false",
            }
        }, successHandler, failureHandler);
    }
    static sendFriendRequest(fromID, clientID, friendID, successHandler, failureHandler) {
        this.invokeLambda({
            fromID: fromID,
            action: "UPDATEADD",
            itemType: "Client",
            identifiers: [
                friendID
            ],
            attributeName: "friendRequests",
            attributeValues: [
                clientID
            ]
        }, successHandler, failureHandler);
    }
    static acceptFriendRequest(fromID, clientID, friendID, successHandler, failureHandler) {
        this.invokeLambda({
            fromID: fromID,
            action: "UPDATEADD",
            itemType: "Client",
            identifiers: [
                clientID
            ],
            attributeName: "friends",
            attributeValues: [
                friendID
            ]
        }, successHandler, failureHandler);
    }
    static declineFriendRequest(fromID, clientID, friendID, successHandler, failureHandler) {
        this.invokeLambda({
            fromID: fromID,
            action: "UPDATEREMOVE",
            itemType: "Client",
            identifiers: [
                clientID
            ],
            attributeName: "friendRequests",
            attributeValues: [
                friendID
            ]
        }, successHandler, failureHandler);
    }
    static removeFriend(fromID, clientID, friendID, successHandler, failureHandler) {
        this.invokeLambda({
            fromID: fromID,
            action: "UPDATEREMOVE",
            itemType: "Client",
            identifiers: [
                clientID
            ],
            attributeName: "friends",
            attributeValues: [
                friendID
            ]
        }, successHandler, failureHandler);
    }
    static invokeLambda(payload, successHandler, failureHandler) {
        console.log("Sending lambda payload: " + JSON.stringify(payload));
        lambda.invoke({
            FunctionName : lambdaFunctionName,
            Payload: JSON.stringify(payload)
        }, (error, data) => {
            if (error) {
                console.log(error);
                failureHandler(error);
            } else if (data.Payload) {
                //alert(data.Payload);
                const payload = JSON.parse(data.Payload);
                if (payload.errorMessage) {
                    alert("Bad payload!: " + JSON.stringify(payload));
                    console.log(payload.errorMessage);
                    failureHandler(payload.errorMessage);
                }
                else {
                    console.log("Successfully invoked lambda function!");
                    successHandler(payload);
                }
            }
            else {
                console.log("Weird error: payload returned with nothing...");
                failureHandler("Payload returned with null");
            }
        });
    }
}

export default Lambda;