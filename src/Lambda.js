// import AWSConfig from "./AppConfig";
import * as AWS from "aws-sdk";
import {ifDebug} from "./Constants";

// TODO Use this instead?
// AWSConfig();

/// Configure AWS SDK for JavaScript
AWS.config.update({region: 'us-east-1'});
AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: 'us-east-1:d9a16b98-4393-4ff6-9e4b-5e738fef1222'});

// Prepare to call Lambda function
let lambda = new AWS.Lambda({region: 'us-east-1', apiVersion: '2015-03-31'});

class Lambda {
    // All the high-level functions
    // static updateEventToPrivate(fromID, eventID, successHandler, failureHandler) {
    //     this.editEventAttribute(fromID, eventID, "access", "private", successHandler, failureHandler);
    // }
    // static updateEventToPublic(fromID, eventID, successHandler, failureHandler) {
    //     this.editEventAttribute(fromID, eventID, "access", "public", successHandler, failureHandler);
    // }
    // static updateEventToInviteOnly(fromID, eventID, successHandler, failureHandler) {
    //     this.editEventAttribute(fromID, eventID, "restriction", "invite", successHandler, failureHandler);
    // }
    // static updateEventToUnrestricted(fromID, eventID, successHandler, failureHandler) {
    //     this.editEventAttribute(fromID, eventID, "restriction", null, successHandler, failureHandler);
    // }
    // static updateEventAddTag(fromID, eventID, tag, successHandler, failureHandler) {
    //     this.updateAddToAttribute(fromID, eventID, "Event", "tags", tag, successHandler, failureHandler);
    // }
    // static updateEventRemoveTag(fromID, eventID, tag, successHandler, failureHandler) {
    //     this.updateRemoveFromAttribute(fromID, eventID, "Event", "tags", tag, successHandler, failureHandler);
    // }
    // static clientJoinEvent(fromID, clientID, eventID, successHandler, failureHandler) {
    //     this.joinEvent(fromID, clientID, "Client", eventID, successHandler, failureHandler);
    // }
    // static clientJoinChallenge(fromID, clientID, challengeID, successHandler, failureHandler) {
    //     this.joinChallenge(fromID, clientID, "Client", challengeID, successHandler, failureHandler);
    // }
    // TODO Trainer join event and gym join event
    // static joinEvent(fromID, userID, userItemType, eventID, successHandler, failureHandler) {
    //     this.updateAddToAttribute(fromID, userID, userItemType, "scheduledEvents", eventID, successHandler, failureHandler);
    // }
    // static joinChallenge(fromID, userID, userItemType, challengeID, successHandler, failureHandler) {
    //     this.updateAddToAttribute(fromID, userID, userItemType, "challenges", challengeID, successHandler, failureHandler);
    // }
    // static removeClientFromEvent(fromID, clientID, eventID, successHandler, failureHandler) {
    //     this.removeUserFromEvent(fromID, clientID, "Client", eventID, successHandler, failureHandler);
    // }
    // TODO Trainer leave event and gym remove from Event
    // static removeUserFromEvent(fromID, userID, userItemType, eventID, successHandler, failureHandler) {
    //     this.updateRemoveFromAttribute(fromID, userID, userItemType, "scheduledEvents", eventID, successHandler, failureHandler);
    // }
    // static removeClientFromChallenge(fromID, clientID, challengeID, successHandler, failureHandler) {
    //     this.removeUserFromChallenge(fromID, clientID, "Client", challengeID, successHandler, failureHandler);
    // }
    // TODO Trainer leave challenge and gym remove from Challenge
    // static removeUserFromChallenge(fromID, userID, userItemType, challengeID, successHandler, failureHandler) {
    //     this.updateRemoveFromAttribute(fromID, userID, userItemType, "challenges", challengeID, successHandler, failureHandler);
    // }
    // static completeChallenge(fromID, winnerID, challengeID, successHandler, failureHandler) {
    //     this.updateSetAttribute(fromID, challengeID, "Challenge", "winner", winnerID, successHandler, failureHandler);
    // }
    static sendEventInvite(fromID, from, to, eventID, successHandler, failureHandler) {
        this.createEventInvite(fromID, from, to, eventID, successHandler, failureHandler);
    }
    static sendEventInviteWithMessage(fromID, from, to, eventID, message, successHandler, failureHandler) {
        this.createEventInviteOptional(fromID, from, to, eventID, message, successHandler, failureHandler);
    }
    static clientAcceptEventInvite(fromID, clientID, eventID, successHandler, failureHandler) {
        this.acceptEventInvite(fromID, clientID, "Client", eventID, successHandler, failureHandler);
    }
    // TODO Trainer accept event invite and gym accept event invite
    static acceptEventInvite(fromID, userID, userItemType, eventID, successHandler, failureHandler) {
        this.joinEvent(fromID, userID, userItemType, eventID, successHandler, failureHandler);
    }
    // These both do the same thing, but I'm hoping that the naming will help people understand their purpose
    static declineEventInvite(fromID, inviteID, successHandler, failureHandler) {
        this.deleteInvite(fromID, inviteID, successHandler, failureHandler);
    }
    static undoEventInvite(fromID, inviteID, successHandler, failureHandler) {
        this.deleteInvite(fromID, inviteID, successHandler, failureHandler);
    }
    static sendFriendRequest(fromID, from, to, successHandler, failureHandler) {
        this.createFriendRequest(fromID, from, to, successHandler, failureHandler);
    }
    static clientAcceptFriendRequest(fromID, clientID, friendID, successHandler, failureHandler) {
        this.acceptFriendRequest(fromID, clientID, "Client", friendID, successHandler, failureHandler);
    }
    // TODO Trainer... Gym...
    static acceptFriendRequest(fromID, userID, userItemType, friendID, successHandler, failureHandler) {
        this.updateAddToAttribute(fromID, userID, userItemType, "friends", friendID, successHandler, failureHandler);
    }
    // lmao this does the same thing too, when will the madness end
    static declineFriendRequest(fromID, inviteID, successHandler, failureHandler) {
        this.deleteInvite(fromID, inviteID, successHandler, failureHandler);
    }
    // 4 in a row, I'm on a roll
    static undoFriendRequest(fromID, inviteID, successHandler, failureHandler) {
        this.deleteInvite(fromID, inviteID, successHandler, failureHandler);
    }
    static clientRemoveFriend(fromID, clientID, friendID, successHandler, failureHandler) {
        this.removeFriend(fromID, clientID, "Client", friendID, successHandler, failureHandler);
    }
    // TODO Trainer... Gym...
    // static removeFriend(fromID, userID, userItemType, friendID, successHandler, failureHandler) {
    //     this.updateRemoveFromAttribute(fromID, userID, userItemType, "friends", friendID, successHandler, failureHandler);
    // }
    static eventAddTag(fromID, eventID, tag, successHandler, failureHandler) {
        this.updateAddToAttribute(fromID, eventID, "Event", "tags", tag, successHandler, failureHandler);
    }
    static eventRemoveTag(fromID, eventID, tag, successHandler, failureHandler) {
        this.updateRemoveFromAttribute(fromID, eventID, "Event", "tags", tag, successHandler, failureHandler);
    }
    // static challengeAddTag(fromID, challengeID, tag, successHandler, failureHandler) {
    //     this.updateAddToAttribute(fromID, challengeID, "Challenge", "tags", tag, successHandler, failureHandler);
    // }
    // static challengeRemoveTag(fromID, challengeID, tag, successHandler, failureHandler) {
    //     this.updateRemoveFromAttribute(fromID, challengeID, "Challenge", "tags", tag, successHandler, failureHandler);
    // }
    // Create Functions
    // // These may serve a bigger purpose than just creating something. Often times, they will send as well as create!
    // static createClient(fromID, name, gender, birthday, email, username, successHandler, failureHandler) {
    //     this.create(fromID, "Client", {
    //         name,
    //         gender,
    //         birthday,
    //         email,
    //         username,
    //     }, successHandler, failureHandler);
    // }
    // static createClientOptional(fromID, name, gender, birthday, email, username, bio, successHandler, failureHandler) {
    //     this.create(fromID, "Client", {
    //         name,
    //         gender,
    //         birthday,
    //         email,
    //         username,
    //         bio,
    //     }, successHandler, failureHandler);
    // }
    // // TODO createTrainer, createGym, createWorkout, and createReview
    // static createEvent(fromID, owner, time, capacity, address, title, tags, successHandler, failureHandler) {
    //     this.create(fromID, "Event", {
    //         owner,
    //         time,
    //         capacity,
    //         address,
    //         title,
    //         tags,
    //     }, successHandler, failureHandler);
    // }
    // static createEventOptional(fromID, owner, time, capacity, address, title, description, memberIDs, access, tags, successHandler, failureHandler) {
    //     this.create(fromID, "Event", {
    //         owner,
    //         time,
    //         capacity,
    //         address,
    //         title,
    //         description,
    //         memberIDs,
    //         access,
    //         tags,
    //     }, successHandler, failureHandler);
    // }
    // static createChallengeEvent(fromID, challengeID, owner, time, capacity, address, title, tags, successHandler, failureHandler) {
    //     this.create(fromID, "Event", {
    //         owner,
    //         time,
    //         capacity,
    //         address,
    //         title,
    //         tags,
    //         challenge: challengeID
    //     }, successHandler, failureHandler);
    // }
    // static createChallengeEventOptional(fromID, challengeID, owner, time, capacity, address, title, description, memberIDs, access, tags, successHandler, failureHandler) {
    //     this.create(fromID, "Event", {
    //         owner,
    //         time,
    //         capacity,
    //         address,
    //         title,
    //         description,
    //         memberIDs,
    //         access,
    //         tags,
    //         challenge: challengeID
    //     }, successHandler, failureHandler);
    // }
    // static createChallenge(fromID, owner, endTime, capacity, title, goal, tags, successHandler, failureHandler) {
    //     this.create(fromID, "Challenge", {
    //         owner,
    //         endTime,
    //         capacity,
    //         title,
    //         goal,
    //         tags,
    //     }, successHandler, failureHandler);
    // }
    // static createChallengeOptional(fromID, owner, endTime, capacity, address, title, goal, description, difficulty, memberIDs, tags, access, restriction, prize, successHandler, failureHandler) {
    //     this.create(fromID, "Challenge", {
    //         owner,
    //         endTime,
    //         capacity,
    //         title,
    //         goal,
    //         description,
    //         difficulty,
    //         memberIDs,
    //         tags,
    //         access,
    //         restriction,
    //         prize,
    //     }, successHandler, failureHandler);
    // }
    // static createFriendRequest(fromID, from, to, successHandler, failureHandler) {
    //     this.create(fromID, "Invite", {
    //         from,
    //         to,
    //         inviteType: "friendRequest",
    //         about: from,
    //     }, successHandler, failureHandler);
    // }
    // static createFriendRequestOptional(fromID, from, to, message, successHandler, failureHandler) {
    //     this.create(fromID, "Invite", {
    //         from,
    //         to,
    //         inviteType: "friendRequest",
    //         about: from,
    //         description: message,
    //     }, successHandler, failureHandler);
    // }
    // static createEventInvite(fromID, from, to, eventID, successHandler, failureHandler) {
    //     this.create(fromID, "Invite", {
    //         from,
    //         to,
    //         inviteType: "eventInvite",
    //         about: eventID,
    //     }, successHandler, failureHandler);
    // }
    // static createEventInviteOptional(fromID, from, to, eventID, message, successHandler, failureHandler) {
    //     this.create(fromID, "Invite", {
    //         from,
    //         to,
    //         inviteType: "eventInvite",
    //         about: eventID,
    //         description: message,
    //     }, successHandler, failureHandler);
    // }
    // static createChallengeInvite(fromID, from, to, challengeID, successHandler, failureHandler) {
    //     this.create(fromID, "Invite", {
    //         from,
    //         to,
    //         inviteType: "challengeInvite",
    //         about: challengeID,
    //     }, successHandler, failureHandler);
    // }
    // static createChallengeInviteOptional(fromID, from, to, challengeID, message, successHandler, failureHandler) {
    //     this.create(fromID, "Invite", {
    //         from,
    //         to,
    //         inviteType: "challengeInvite",
    //         about: challengeID,
    //         description: message,
    //     }, successHandler, failureHandler);
    // }
    // static createEventRequest(fromID, from, eventID, successHandler, failureHandler) {
    //     this.create(fromID, "Invite", {
    //         from,
    //         to: eventID,
    //         inviteType: "eventRequest",
    //         about: from,
    //     }, successHandler, failureHandler);
    // }
    // static createEventRequestOptional(fromID, from, eventID, message, successHandler, failureHandler) {
    //     this.create(fromID, "Invite", {
    //         from,
    //         to: eventID,
    //         inviteType: "eventRequest",
    //         about: from,
    //         description: message,
    //     }, successHandler, failureHandler);
    // }
    // static createChallengeRequest(fromID, from, challengeID, successHandler, failureHandler) {
    //     this.create(fromID, "Invite", {
    //         from,
    //         to: challengeID,
    //         inviteType: "challengeRequest",
    //         about: from,
    //     }, successHandler, failureHandler);
    // }
    // static createChallengeRequestOptional(fromID, from, challengeID, message, successHandler, failureHandler) {
    //     this.create(fromID, "Invite", {
    //         from,
    //         to: challengeID,
    //         inviteType: "challengeRequest",
    //         about: from,
    //         description: message,
    //     }, successHandler, failureHandler);
    // }
    // static createBarePost(fromID, by, description, access, successHandler, failureHandler) {
    //     this.createNormalPost(fromID, by, description, access, null, null, successHandler, failureHandler);
    // }
    // static createNewEventPost(fromID, by, description, access, eventID, picturePaths, videoPaths, successHandler, failureHandler) {
    //     this.createNewItemPost(fromID, by, description, access, "Event", eventID, picturePaths, videoPaths, successHandler, failureHandler);
    // }
    // static createNewChallengePost(fromID, by, description, access, challengeID, picturePaths, videoPaths, successHandler, failureHandler) {
    //     this.createNewItemPost(fromID, by, description, access, "Challenge", challengeID, picturePaths, videoPaths, successHandler, failureHandler);
    // }
    // static createNormalPost(fromID, by, description, access, picturePaths, videoPaths, successHandler, failureHandler) {
    //     this.createPost(fromID, by, description, access, null, null, picturePaths, videoPaths, successHandler, failureHandler);
    // }
    // static createShareItemPost(fromID, by, description, access, itemType, itemID, picturePaths, videoPaths, successHandler, failureHandler) {
    //     this.createPost(fromID, by, description, access, itemType, itemID, picturePaths, videoPaths, successHandler, failureHandler);
    // }
    // static createNewItemPost(fromID, by, description, access, itemType, itemID, picturePaths, videoPaths, successHandler, failureHandler) {
    //     this.createPost(fromID, by, description, access, "new" + itemType, itemID, picturePaths, videoPaths, successHandler, failureHandler);
    // }
    // static createPost(fromID, by, description, access, postType, about, picturePaths, videoPaths, successHandler, failureHandler) {
    //     this.create(fromID, "Post", {
    //         by,
    //         description,
    //         access,
    //         postType,
    //         about,
    //         picturePaths,
    //         videoPaths,
    //     }, successHandler, failureHandler);
    // }
    //
    // // Update Set Functions
    // // This will be used for things like name or birthday
    // static editClientAttribute(fromID, clientID, attributeName, attributeValue, successHandler, failureHandler) {
    //     this.updateSetAttribute(fromID, clientID, "Client", attributeName, attributeValue, successHandler, failureHandler);
    // }
    // static editTrainerAttribute(fromID, trainerID, attributeName, attributeValue, successHandler, failureHandler) {
    //     this.updateSetAttribute(fromID, trainerID, "Trainer", attributeName, attributeValue, successHandler, failureHandler);
    // }
    // static editGymAttribute(fromID, gymID, attributeName, attributeValue, successHandler, failureHandler) {
    //     this.updateSetAttribute(fromID, gymID, "Gym", attributeName, attributeValue, successHandler, failureHandler);
    // }
    // static editWorkoutAttribute(fromID, workoutID, attributeName, attributeValue, successHandler, failureHandler) {
    //     this.updateSetAttribute(fromID, workoutID, "Workout", attributeName, attributeValue, successHandler, failureHandler);
    // }
    // static editReviewAttribute(fromID, reviewID, attributeName, attributeValue, successHandler, failureHandler) {
    //     this.updateSetAttribute(fromID, reviewID, "Review", attributeName, attributeValue, successHandler, failureHandler);
    // }
    // static editEventAttribute(fromID, eventID, attributeName, attributeValue, successHandler, failureHandler) {
    //     this.updateSetAttribute(fromID, eventID, "Event", attributeName, attributeValue, successHandler, failureHandler);
    // }
    // static editChallengeAttribute(fromID, challengeID, attributeName, attributeValue, successHandler, failureHandler) {
    //     this.updateSetAttribute(fromID, challengeID, "Challenge", attributeName, attributeValue, successHandler, failureHandler);
    // }
    // static editInviteAttribute(fromID, inviteID, attributeName, attributeValue, successHandler, failureHandler) {
    //     this.updateSetAttribute(fromID, inviteID, "Invite", attributeName, attributeValue, successHandler, failureHandler);
    // }
    // static editPostAttribute(fromID, postID, attributeName, attributeValue, successHandler, failureHandler) {
    //     this.updateSetAttribute(fromID, postID, "Post", attributeName, attributeValue, successHandler, failureHandler);
    // }
    //
    // // Delete functions
    // static deleteClient(fromID, clientID, successHandler, failureHandler) {
    //     this.delete(fromID, clientID, "Client", successHandler, failureHandler);
    // }
    // static deleteTrainer(fromID, trainerID, successHandler, failureHandler) {
    //     this.delete(fromID, trainerID, "Trainer", successHandler, failureHandler);
    // }
    // static deleteGym(fromID, gymID, successHandler, failureHandler) {
    //     this.delete(fromID, gymID, "Gym", successHandler, failureHandler);
    // }
    // static deleteWorkout(fromID, workoutID, successHandler, failureHandler) {
    //     this.delete(fromID, workoutID, "Workout", successHandler, failureHandler);
    // }
    // static deleteReview(fromID, reviewID, successHandler, failureHandler) {
    //     this.delete(fromID, reviewID, "Review", successHandler, failureHandler);
    // }
    // static deleteEvent(fromID, eventID, successHandler, failureHandler) {
    //     this.delete(fromID, eventID, "Event", successHandler, failureHandler);
    // }
    // static deleteChallenge(fromID, challengeID, successHandler, failureHandler) {
    //     this.delete(fromID, challengeID, "Challenge", successHandler, failureHandler);
    // }
    // static deleteInvite(fromID, inviteID, successHandler, failureHandler) {
    //     this.delete(fromID, inviteID, "Invite", successHandler, failureHandler);
    // }
    // static deletePost(fromID, postID, successHandler, failureHandler) {
    //     this.delete(fromID, postID, "Post", successHandler, failureHandler);
    // }

    // All the basic CRUD Functions with my own personally defined JSONs
    // TODO Is there a case where we would need specify action yet?
    static create(fromID, itemType, createRequest, successHandler, failureHandler) {
        this.invokeDatabaseLambda({
            fromID: fromID,
            action: "CREATE",
            itemType: itemType,
            [("create" + itemType + "Request")]: createRequest,
        }, successHandler, failureHandler);
    }
    static updateSetAttribute(fromID, objectID, objectItemType, attributeName, attributeValue, successHandler, failureHandler) {
        this.invokeDatabaseLambda({
            fromID: fromID,
            action: "UPDATESET",
            itemType: objectItemType,
            identifiers: [ objectID ] ? objectID != null : [],
            attributeName: attributeName,
            attributeValues: [
                attributeValue
            ]
        }, successHandler, failureHandler);
    }
    static updateAddToAttribute(fromID, objectID, objectItemType, attributeName, attributeValue, successHandler, failureHandler) {
        this.invokeDatabaseLambda({
            fromID,
            action: "UPDATEADD",
            itemType: objectItemType,
            identifiers: [
                objectID
            ],
            attributeName,
            attributeValues: [
                attributeValue
            ],
        }, successHandler, failureHandler);
    }
    static updateRemoveFromAttribute(fromID, objectID, objectItemType, attributeName, attributeValue, successHandler, failureHandler) {
        this.invokeDatabaseLambda({
            fromID,
            action: "UPDATEREMOVE",
            itemType: objectItemType,
            identifiers: [
                objectID
            ],
            attributeName,
            attributeValues: [
                attributeValue
            ],
        }, successHandler, failureHandler);
    }
    static delete(fromID, objectID, objectItemType, successHandler, failureHandler) {
        this.invokeDatabaseLambda({
            fromID,
            action: "DELETE",
            itemType: objectItemType,
            identifiers: [
                objectID
            ],
        }, successHandler, failureHandler)
    }
    static invokeDatabaseLambda(payload, successHandler, failureHandler) {
        this.invokeLambda("VastusDatabaseLambdaFunction", payload, successHandler, failureHandler);
    }
    static invokePaymentLambda(payload, successHandler, failureHandler) {
        this.invokeLambda("VastusPaymentLambdaFunction", payload, successHandler, failureHandler);
    }
    static invokeLambda(functionName, payload, successHandler, failureHandler) {
        console.log("Sending lambda payload: " + JSON.stringify(payload));
        if (ifDebug) {
            console.log("Sending lambda payload: " + JSON.stringify(payload));
        }
        lambda.invoke({
            FunctionName : functionName,
            Payload: JSON.stringify(payload)
        }, (error, data) => {
            if (error) {
                console.error(error);
                console.error("Lambda failure: " + JSON.stringify(error));
                failureHandler(error);
            } else if (data.Payload) {
                //console.log(data.Payload);
                const payload = JSON.parse(data.Payload);
                if (payload.errorMessage) {
                    console.error("Bad payload!: " + JSON.stringify(payload));
                    console.error(payload.errorMessage);
                    failureHandler(payload.errorMessage);
                }
                else {
                    console.log("Successfully invoked lambda function!");
                    if (ifDebug) {
                        console.log("Successful Lambda, received " + JSON.stringify(payload));
                    }
                    successHandler(payload);
                }
            }
            else {
                console.error("Weird error: payload returned with nothing...");
                failureHandler("Payload returned with null");
            }
        });
    }
}

export default Lambda;