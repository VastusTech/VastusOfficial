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
    static createChallenge(fromID, owner, time, capacity, address, title, goal, successHandler, failureHandler) {
        alert("Called the first create challenge");
        this.invokeLambda({
            fromID: fromID,
            action: "CREATE",
            itemType: "Challenge",
            createChallengeRequest: {
                owner: owner,
                time: time,
                capacity: capacity,
                address: address,
                title: title,
                goal: goal
            }
        }, successHandler, failureHandler);
    }
    static createChallengeOptional(fromID, owner, time, capacity, address, title, goal, description, difficulty, memberIDs, access, successHandler, failureHandler) {
        alert("Called the second create challenge");
        this.invokeLambda({
            fromID: fromID,
            action: "CREATE",
            itemType: "Challenge",
            createChallengeRequest: {
                owner: owner,
                time: time,
                capacity: capacity,
                address: address,
                title: title,
                goal: goal,
                description: description,
                difficulty: difficulty,
                memberIDs: memberIDs,
                access: access
            }
        }, successHandler, failureHandler);
    }
    static joinChallenge(fromID, clientID, challengeID, successHandler, failureHandler) {
        this.invokeLambda({
            fromID: fromID,
            action: "UPDATEADD",
            itemType: "Client",
            identifiers: [
                clientID
            ],
            attributeName: "scheduledChallenges",
            attributeValues: [
                challengeID
            ]
        }, successHandler, failureHandler);
    }
    static leaveChallenge(fromID, clientID, challengeID, successHandler, failureHandler) {
        this.invokeLambda({
            fromID: fromID,
            action: "UPDATEREMOVE",
            itemType: "Client",
            identifiers: [
                clientID
            ],
            attributeName: "scheduledChallenges",
            attributeValues: [
                challengeID
            ]
        }, successHandler, failureHandler);
    }
    static deleteChallenge(fromID, challengeID, successHandler, failureHandler) {
        this.invokeLambda({
            fromID: fromID,
            action: "DELETE",
            itemType: "Challenge",
            identifiers: [
                challengeID
            ]
        }, successHandler, failureHandler);
    }
    static createParty(fromID, owner, time, capacity, address, title, successHandler, failureHandler) {
        this.invokeLambda({
            fromID: fromID,
            action: "CREATE",
            itemType: "Challenge",
            createChallengeRequest: {
                owner: owner,
                time: time,
                capacity: capacity,
                address: address,
                title: title,
                // TODO Find a way to input optional params
            }
        }, successHandler, failureHandler);
    }
    static createParty(fromID, owner, time, capacity, address, title, description, memberIDs, access, successHandler, failureHandler) {
        this.invokeLambda({
            fromID: fromID,
            action: "CREATE",
            itemType: "Challenge",
            createChallengeRequest: {
                owner: owner,
                time: time,
                capacity: capacity,
                address: address,
                title: title,
                description: description,
                memberIDs: memberIDs,
                access: access
            }
        }, successHandler, failureHandler);
    }
    static joinParty(fromID, clientID, partyID, successHandler, failureHandler) {
        this.invokeLambda({
            fromID: fromID,
            action: "UPDATEADD",
            itemType: "Client",
            identifiers: [
                clientID
            ],
            attributeName: "scheduledParties",
            attributeValues: [
                partyID
            ]
        }, successHandler, failureHandler);
    }
    static leaveParty(fromID, clientID, partyID, successHandler, failureHandler) {
        this.invokeLambda({
            fromID: fromID,
            action: "UPDATEREMOVE",
            itemType: "Client",
            identifiers: [
                clientID
            ],
            attributeName: "scheduledParties",
            attributeValues: [
                partyID
            ]
        }, successHandler, failureHandler);
    }
    static deleteParty(fromID, partyID, successHandler, failureHandler) {
        this.invokeLambda({
            fromID: fromID,
            action: "DELETE",
            itemType: "Party",
            identifiers: [
                partyID
            ]
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
        failureHandler({error: "ay lmao"});
        lambda.invoke({
            FunctionName : lambdaFunctionName,
            Payload: JSON.stringify(payload)
        }, (error, data) => {
            if (error) {
                console.log(error);
                failureHandler(error);
            } else if (data.Payload) {
                const payload = JSON.parse(data.Payload);
                if (payload.errorMessage) {
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