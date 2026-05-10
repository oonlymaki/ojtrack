import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// FORM
const signupForm = document.getElementById("signupForm");

// SUBMIT EVENT
signupForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    // =========================
    // STEP 1 - PERSONAL INFO
    // =========================
    const firstName = document.getElementById("firstName").value.trim();
    const middleName = document.getElementById("middleName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const birthDate = document.getElementById("birthDate").value;
    const sex = document.getElementById("sex").value;
    const contactNumber = document.getElementById("contactNumber").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // =========================
    // STEP 2 - SCHOOL DETAILS
    // =========================
    const school = document.getElementById("school").value.trim();
    const campus = document.getElementById("campus").value.trim();
    const college = document.getElementById("college").value.trim();
    const course = document.getElementById("course").value.trim();
    const yearLevel = document.getElementById("yearLevel").value;
    const studentId = document.getElementById("studentId").value.trim();
    const academicYear = document.getElementById("academicYear").value.trim();

    const requiredHours = document.getElementById("requiredHours").value;
    const targetStart = document.getElementById("targetStart").value;
    const targetEnd = document.getElementById("targetEnd").value;

    const adviserName = document.getElementById("adviserName").value.trim();
    const adviserContact = document.getElementById("adviserContact").value.trim();

    // =========================
    // STEP 4 - DEPARTMENT
    // =========================
    let selectedDepartment = "";

    const selectedCard = document.querySelector(".dept-card.selected");

    if (selectedCard) {
        selectedDepartment = selectedCard.dataset.dept;
    }

    const workDays = document.getElementById("workDays").value;
    const preferredTime = document.getElementById("preferredTime").value;
    const notes = document.getElementById("notes").value.trim();

    // =========================
    // VALIDATION
    // =========================

    if (!firstName ||
        !lastName ||
        !birthDate ||
        !sex ||
        !contactNumber ||
        !email ||
        !address ||
        !password ||
        !confirmPassword ||
        !school ||
        !college ||
        !course ||
        !yearLevel ||
        !studentId ||
        !academicYear ||
        !requiredHours ||
        !targetStart ||
        !targetEnd ||
        !adviserName
    ) {
        alert("Please fill in all required fields.");
        return;
    }

    // EMAIL VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // PASSWORD MATCH
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // PASSWORD LENGTH
    if (password.length < 8) {
        alert("Password must be at least 8 characters.");
        return;
    }

    // CONTACT NUMBER VALIDATION
    const phoneRegex = /^09\d{9}$/;

    if (!phoneRegex.test(contactNumber)) {
        alert("Please enter a valid Philippine mobile number.");
        return;
    }

    // =========================
    // BUTTON LOADING
    // =========================
    const submitBtn = document.querySelector(".btn-next");

    submitBtn.disabled = true;
    submitBtn.innerHTML = "Creating Account...";

    try {
        // =========================
        // FIREBASE AUTH
        // =========================
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        const fullName = `${firstName} ${middleName} ${lastName}`.replace(
            /\s+/g,
            " "
        );

        // UPDATE AUTH PROFILE
        await updateProfile(user, {
            displayName: fullName
        });

        // =========================
        // FIRESTORE DATABASE
        // COLLECTION: student
        // =========================
        await setDoc(doc(db, "student", user.uid), {
            uid: user.uid,

            // PERSONAL INFO
            firstName,
            middleName,
            lastName,
            fullName,
            birthDate,
            sex,
            contactNumber,
            email,
            address,

            // SCHOOL DETAILS
            school,
            campus,
            college,
            course,
            yearLevel,
            studentId,
            academicYear,

            requiredHours,
            targetStart,
            targetEnd,

            adviserName,
            adviserContact,

            // DEPARTMENT
            selectedDepartment,
            workDays,
            preferredTime,
            notes,

            // STATUS
            role: "student",
            applicationStatus: "pending",

            createdAt: serverTimestamp()
        });

        // SUCCESS UI
        submitBtn.innerHTML = "✓ Account Created!";
        submitBtn.style.background = "#16a34a";

        // REDIRECT
        setTimeout(() => {
            window.location.href = "/pages/index.html";
        }, 1500);

    } catch (error) {
        console.error("Signup Error:", error);

        submitBtn.disabled = false;
        submitBtn.innerHTML = "Submit Application ✓";

        if (error.code === "auth/email-already-in-use") {
            alert("Email is already registered.");
        } else if (error.code === "auth/invalid-email") {
            alert("Invalid email address.");
        } else if (error.code === "auth/weak-password") {
            alert("Password is too weak.");
        } else {
            alert("Signup failed: " + error.message);
        }
    }
});