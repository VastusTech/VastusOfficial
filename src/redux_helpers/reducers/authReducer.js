export const LOG_IN = 'LOG_IN';
export const FEDERATED_LOG_IN = 'FEDERATED_LOG_IN';
export const LOG_OUT = 'LOG_OUT';
export const SIGN_UP = 'SIGN_UP';
export const CONFIRM_SIGNUP = 'CONFIRM_SIGNUP';
export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
export const CONFIRM_FORGOT_PASSWORD = 'CONFIRM_FORGOT_PASSWORD';
export const OPEN_SIGN_UP_MODAL = 'OPEN_SIGN_UP_MODAL';
export const CLOSE_SIGN_UP_MODAL = 'CLOSE_SIGN_UP_MODAL';
export const OPEN_FORGOT_PASSWORD_MODAL = 'OPEN_FORGOT_PASSWORD_MODAL';
export const CLOSE_FORGOT_PASSWORD_MODAL = 'CLOSE_FORGOT_PASSWORD_MODAL';

const initialState = {
    loggedIn: false,
    confirmingSignUp: false,
    confirmingForgotPassword: false,
    signUpModalOpen: false,
    forgotPasswordModalOpen: false,
    ifFederatedSignIn: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case LOG_IN:
            state = {
                ...state,
                loggedIn: true,
                confirmingSignUp: false,
                confirmingForgotPassword: false,
                signUpModalOpen: false,
                forgotPasswordModalOpen: false,
                ifFederatedSignIn: false,
            };
            break;
        case FEDERATED_LOG_IN:
            state = {
                ...state,
                loggedIn: true,
                confirmingSignUp: false,
                confirmingForgotPassword: false,
                signUpModalOpen: false,
                forgotPasswordModalOpen: false,
                ifFederatedSignIn: true,
            };
            break;
        case LOG_OUT:
            state = {
                ...state,
                loggedIn: false,
                confirmingSignUp: false,
                confirmingForgotPassword: false,
                signUpModalOpen: false,
                forgotPasswordModalOpen: false
            };
            break;
        case SIGN_UP:
            state = {
                ...state,
                loggedIn: false,
                confirmingSignUp: true
            };
            break;
        case CONFIRM_SIGNUP:
            state = {
                ...state,
                loggedIn: false,
                confirmingSignUp: false,
                signUpModalOpen: false,
            };
            break;
        case FORGOT_PASSWORD:
            state = {
                ...state,
                confirmingForgotPassword: true
            };
            break;
        case CONFIRM_FORGOT_PASSWORD:
            state = {
                ...state,
                confirmingForgotPassword: false,
                forgotPasswordModalOpen: false
            };
            break;
        case OPEN_SIGN_UP_MODAL:
            state = {
                ...state,
                signUpModalOpen: true
            };
            break;
        case CLOSE_SIGN_UP_MODAL:
            state = {
                ...state,
                signUpModalOpen: false
            };
            break;
        case OPEN_FORGOT_PASSWORD_MODAL:
            state = {
                ...state,
                forgotPasswordModalOpen: true
            };
            break;
        case CLOSE_FORGOT_PASSWORD_MODAL:
            state = {
                ...state,
                forgotPasswordModalOpen: false
            };
            break;
        default:
            state = {
                ...state
            };
            break;
    }
    // console.log("AUTH: Did " + action.type + " and now state is = " + JSON.stringify(state));
    return state;
}

// const initialState = {
//     isAuthenticating: false,
//
//     signUpError: false,
//     signInError: false,
//
//     showSignUpConfirmationModal: false,
//     showSignInConfirmationModal: false,
//
//     confirmSignUpError: false,
//     confirmLoginError: false,
//
//     signInErrorMessage: '',
//     signUpErrorMessage: '',
//
//     confirmLoginErrorMessage: '',
//     confirmSignUpErrorMessage: ''
// };

// export default (state = initialState, action) => {
//     if (infoFunctions[action.type]) {
//         return infoReducer(state, action);
//     }
//
//     switch (action.type) {
//         case LOG_IN:
//             state = {
//                 ...state,
//                 loggedIn: true,
//                 confirmingSignUp: false,
//                 confirmingForgotPassword: false
//             };
//             break;
//         case LOG_OUT:
//             state = {
//                 ...state,
//                 loggedIn: false,
//                 confirmingSignUp: false,
//                 confirmingForgotPassword: false
//             };
//             break;
//         case SIGN_UP:
//             state = {
//                 ...state,
//                 loggedIn: false,
//                 confirmingSignUp: true
//             };
//             break;
//         case CONFIRM_SIGNUP:
//             state = {
//                 ...state,
//                 loggedIn: true,
//                 confirmingSignUp: false
//             };
//             break;
//         case FORGOT_PASSWORD:
//             state = {
//                 ...state,
//                 confirmingForgotPassword: true
//             };
//             break;
//         case CONFIRM_FORGOT_PASSWORD:
//             state = {
//                 ...state,
//                 loggedIn: true,
//                 confirmingForgotPassword: false,
//             };
//             break;
//     }
//
//     return state;
// }

// switch(action.type) {
//     case SHOW_SIGN_IN_CONFIRMATION_MODAL:
//         return {
//             ...state,
//             isAuthenticating: false,
//             showSignInConfirmationModal: true
//         };
//     case SHOW_SIGN_UP_CONFIRMATION_MODAL:
//         return {
//             ...state,
//             isAuthenticating: false,
//             showSignUpConfirmationModal: true
//         };
//     case CONFIRM_SIGNUP:
//         return {
//             ...state,
//             isAuthenticating: true
//         }
//     case CONFIRM_SIGNUP_SUCCESS:
//         return {
//             ...state,
//             isAuthenticating: false,
//             showSignUpConfirmationModal: false
//         }
//     case CONFIRM_SIGNUP_FAILURE:
//         return {
//             ...state,
//             isAuthenticating: false,
//             confirmSignUpError: false,
//             confirmSignupErrorMessage: action.error.message
//         }
//     case SIGN_UP:
//         return {
//             ...state,
//             isAuthenticating: true,
//         }
//     case SIGN_UP_SUCCESS:
//         return {
//             ...state,
//             isAuthenticating: false
//         }
//     case SIGN_UP_FAILURE:
//         return {
//             ...state,
//             isAuthenticating: false,
//             signUpError: true,
//             signUpErrorMessage: action.error.message
//         }
//     case LOG_IN:
//         return {
//             ...state,
//             isAuthenticating: true,
//             signInError: false
//         }
//     case LOG_IN_SUCCESS:
//         return {
//             isAuthenticating: false,
//             user: action.user,
//             showSignInConfirmationModal: true
//         }
//     case LOG_IN_FAILURE:
//         return {
//             ...state,
//             isAuthenticating: false,
//             signInError: true,
//             signInErrorMessage: action.error.message
//         };
//     case CONFIRM_LOGIN: {
//         return {
//             ...state,
//             isAuthenticating: true
//         }
//     }
//     case CONFIRM_LOGIN_SUCCESS:
//         return {
//             ...state,
//             isAuthenticating: false,
//             showSignInConfirmationModal: false
//         };
//     case CONFIRM_LOGIN_FAILURE: {
//         return {
//             ...state,
//             isAuthenticating: false
//         };
//     }
//     case LOG_OUT:
//         return {
//             ...initialState,
//         };
//     default:
//         return state
// }
