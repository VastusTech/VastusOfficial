import { Auth } from "aws-amplify";
import {setError, setIsLoading, setIsNotLoading} from "./infoActions";
import jwt_decode from "jwt-decode";
import {fetchUser, clearUser, setUser, forceSetUser} from "./userActions";
import {firebaseSignIn, firebaseSignOut} from "./firebaseActions";
import QL from "../../GraphQL";
// import Lambda from "../../Lambda";
import ClientFunctions from "../../databaseFunctions/ClientFunctions";

export function updateAuth() {
    return (dispatch) => {
        // TODO This could totally be overkill lol
        Auth.currentCredentials();
        // Auth.currentSession();
        // Auth.currentUserCredentials();
        // Auth.currentUserInfo();
        // Auth.currentUserPoolUser();
        Auth.currentAuthenticatedUser().then((user) => {
            console.log(JSON.stringify(user));
            QL.getClientByUsername(user.username, ["id", "username"], (user) => {
                console.log("REDUX: Successfully updated the authentication credentials");
                dispatch(setUser(user));
                // dispatch(firebaseSignIn(user.id));
                dispatch(authLogIn());
                dispatch(setIsNotLoading());
            }, (error) => {
                console.log("REDUX: Could not fetch the client");
                dispatch(setError(error));
                dispatch(setIsNotLoading());
            });
        }).catch(() => {
            console.log("REDUX: Not currently logged in. Not a problem, no worries.");
            dispatch(setIsNotLoading());
        });
    }
}
export function logIn(username, password) {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        Auth.signIn(username, password).then(() => {
            QL.getClientByUsername(username, ["id", "username"], (user) => {
                console.log("REDUX: Successfully logged in!");
                dispatch(authLogIn());
                if (getStore().user.id !== user.id) {
                    dispatch(forceSetUser(user));
                }
                else {
                    dispatch(setUser(user));
                }
                dispatch(firebaseSignIn(user.id));
                dispatch(setIsNotLoading());
            }, (error) => {
                console.log("REDUX: Could not fetch the client");
                dispatch(setError(error));
                dispatch(setIsNotLoading());
            });
        }).catch((error) => {
            console.log("REDUX: Failed log in...");
            console.log(error);
            dispatch(setError(error));
            dispatch(setIsNotLoading());
        });
    };
}
export function logOut() {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        const userID = getStore().user.id;
        Auth.signOut({global: true}).then((data) => {
            console.log("REDUX: Successfully logged out!");
            if (userID) { dispatch(firebaseSignOut(userID)); }
            dispatch(authLogOut());
            dispatch(setIsNotLoading());
        }).catch((error) => {
            console.log("REDUX: Failed log out...");
            dispatch(setError(error));
            dispatch(setIsNotLoading());
        });
    }
}
export function googleSignIn(googleUser) {
    return (dispatch, getStore) => {
        // Useful data for your client-side scripts:
        const { id_token, expires_at } = googleUser.getAuthResponse();
        const sub = jwt_decode(id_token).sub;
        const profile = googleUser.getBasicProfile();
        const email = profile.getEmail(), name = profile.getName(), birthdate = "undefined", gender = "unspecified";
        const user = { email, name, birthdate, gender, sub };
        Auth.federatedSignIn(
            'google',
            { token: id_token, expires_at },
            user
        ).then(() => {
            // The ID token you need to pass to your backend and the expires_at token:
            console.log("Successfully federated sign in!");
            QL.getClientByFederatedID(sub, ["id", "username", "federatedID"], (client) => {
                if (client) {
                    // Then this user has already signed up
                    console.log("REDUX: Successfully logged in!");
                    dispatch(federatedAuthLogIn());
                    if (getStore().user.id !== client.id) {
                        dispatch(forceSetUser(client));
                    }
                    else {
                        dispatch(setUser(client));
                    }
                    dispatch(firebaseSignIn(user.id));
                    dispatch(setIsNotLoading());
                }
                else {
                    // This user has not yet signed up!
                    console.log("User hasn't signed up yet! Generating a new account!");
                    generateGoogleUsername(name, (username) => {
                        ClientFunctions.createFederatedClient("admin", name, email, username, sub, (data) => {
                            // Then this user has already signed up
                            const id = data.id;
                            client = {
                                id,
                                username,
                                name,
                                email,
                            };
                            console.log("REDUX: Successfully signed up!");
                            dispatch(federatedAuthLogIn());
                            if (getStore().user.id !== client.id) {
                                dispatch(forceSetUser(client));
                            }
                            else {
                                dispatch(setUser(client));
                            }
                            dispatch(firebaseSignIn(user.id));
                            dispatch(setIsNotLoading());
                        }, (error) => {
                            console.log("REDUX: Could not create the federated client!");
                            console.error(error);
                            dispatch(setError(error));
                            dispatch(setIsNotLoading());
                        });
                    }, (error) => {
                        console.log("REDUX: Could not generate the client username!");
                        console.error(error);
                        dispatch(setError(error));
                        dispatch(setIsNotLoading());
                    });
                }
            }, (error) => {
                console.log("REDUX: Could not fetch the client by federated ID!");
                console.error(error);
                dispatch(setError(error));
                dispatch(setIsNotLoading());
            });
        }).catch((error) => {
            console.error("Error while federation sign in!");
            console.log(error);
            dispatch(setError(error));
            dispatch(setIsNotLoading());
        });
    };
}
function generateGoogleUsername(name, usernameHandler, failureHandler, depth=0) {
    const randomInt = Math.floor((Math.random() * 10000) + 1);
    const randomGoogleUsername = name + randomInt;
    QL.getClientByUsername(randomGoogleUsername, ["username"], (client) => {
        if (client) {
            // That means there's a conflict
            console.log("Conflicting username = " + randomGoogleUsername);
            if (depth > 20) {
                failureHandler(new Error("Too many tried usernames... Try again!"));
            }
            else {
                generateGoogleUsername(name, usernameHandler, failureHandler, depth + 1);
            }
        }
        else {
            // That means that there is no username
            console.log("Username free! Username = " + randomGoogleUsername);
            usernameHandler(randomGoogleUsername);
        }
    }, (error) => {
        console.error("Error querying for username while getting Federated username! Error: " + JSON.stringify(error));
        failureHandler(error);
    });
}
export function signUp(username, password, name, gender, birthday, email) {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        const params = {
            username: username,
            password: password,
            attributes: {
                name: name,
                gender: gender,
                birthdate: birthday,
                email: email
            }
        };
        ClientFunctions.createClient("admin", name, gender, birthday, email, username, (clientID) => {
            Auth.signUp(params).then((data) => {
                console.log("REDUX: Successfully signed up!");
                dispatch(authSignUp());
                dispatch(setIsNotLoading());
            }).catch((error) => {
                console.log("REDUX: Failed sign up...");
                dispatch(setError(error));
                dispatch(setIsNotLoading());
                // TODO DELETE CLIENT THAT WAS CREATED!!!!
                ClientFunctions.delete("admin", clientID);
            });
        }, (error) => {
            console.log("REDUX: Creating new client failed...");
            dispatch(setError(error));
            dispatch(setIsNotLoading());
        });
    }
}
export function confirmSignUp(username, confirmationCode) {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        Auth.confirmSignUp(username, confirmationCode).then((authUser) => {
            dispatch(closeSignUpModal());
            dispatch(authConfirmSignUp());
            dispatch(setIsNotLoading());
        }).catch((error) => {
            console.log("REDUX: Failed confirming sign up...");
            dispatch(setError(error));
            dispatch(setIsNotLoading());
        });
    }
}
export function forgotPassword(username) {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        Auth.forgotPassword(username).then(() => {
            console.log("REDUX: Successfully forgot password!");
            dispatch(authForgotPassword());
            dispatch(setIsNotLoading());
        }).catch((error) => {
            console.log("REDUX: Failed forgot password...");
            dispatch(setError(error));
            dispatch(setIsNotLoading());
        });
    };
}
export function confirmForgotPassword(username, confirmationCode, newPassword) {
    return (dispatch, getStore) => {
        dispatch(setIsLoading());
        Auth.forgotPasswordSubmit(username, confirmationCode, newPassword).then(() => {
            console.log("REDUX: Successfully submitted forgot password!");
            dispatch(authConfirmForgotPassword());
            // dispatch(closeForgotPasswordModal());
            dispatch(setIsNotLoading());
        }).catch((error) => {
            console.log("REDUX: Failed submitting forgot password...");
            dispatch(setError(error));
            dispatch(setIsNotLoading());
        });
    }
}

export function openSignUpModal() {
    return {
        type: 'OPEN_SIGN_UP_MODAL'
    };
}
export function closeSignUpModal() {
    return {
        type: 'CLOSE_SIGN_UP_MODAL'
    };
}
export function openForgotPasswordModal() {
    return {
        type: 'OPEN_FORGOT_PASSWORD_MODAL'
    };
}
export function closeForgotPasswordModal() {
    return {
        type: 'CLOSE_FORGOT_PASSWORD_MODAL'
    };
}

function authLogIn() {
    return {
        type: 'LOG_IN'
    };
}
function federatedAuthLogIn() {
    return {
        type: 'FEDERATED_LOG_IN'
    }
}
function authLogOut() {
    return {
        type: 'LOG_OUT'
    };
}
function authSignUp() {
    return {
        type: 'SIGN_UP'
    };
}
function authConfirmSignUp() {
    return {
        type: 'CONFIRM_SIGN_UP'
    };
}
function authForgotPassword() {
    return {
        type: 'FORGOT_PASSWORD'
    };
}
function authConfirmForgotPassword() {
    return {
        type: 'CONFIRM_FORGOT_PASSWORD'
    };
}
