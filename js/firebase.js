// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyATrFSgc2ZXNjhLbMXQdfeOTr27hZdsuz8",
    authDomain: "ojt-tracker-b179e.firebaseapp.com",
    projectId: "ojt-tracker-b179e",
    storageBucket: "ojt-tracker-b179e.firebasestorage.app",
    messagingSenderId: "1057035967672",
    appId: "1:1057035967672:web:2b83e3ab53518d9c96a84d",
    measurementId: "G-LS20YKG8FN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);