import { auth } from "/js/firebase.js";
import { createUserWithEmailAndPassword, updateProfile }
from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async(e) => {
            e.preventDefault();