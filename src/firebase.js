import app from "firebase/app";

// Initialize Firebase
var config = {
    apiKey: "AIzaSyC6jSlO2wclwzmMJbTmUz2iGjzGg6IkQfM",
    authDomain: "testfirebaseproject-3c457.firebaseapp.com",
    databaseURL: "https://testfirebaseproject-3c457.firebaseio.com",
    projectId: "testfirebaseproject-3c457",
    storageBucket: "",
    messagingSenderId: "716504991782"
};

class Firebase {
    constructor() {
        app.initializeApp(config);
    }
}

export default Firebase;
