// Import Firebase from CDN (browser-friendly)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Your Firebase config
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
const auth = getAuth(app);

export { auth };
export const db = getFirestore(app);