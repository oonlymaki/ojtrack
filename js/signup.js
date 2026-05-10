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

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    // =========================
    // PERSONAL INFO
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
    // SCHOOL DETAILS
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
    // DEPARTMENT
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Invalid email.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    if (password.length < 8) {
        alert("Password must be at least 8 characters.");
        return;
    }

    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(contactNumber)) {
        alert("Invalid phone number.");
        return;
    }

    const submitBtn = document.querySelector(".btn-next");
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Creating Account...";

    try {

        // =========================
        // AUTH
        // =========================
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        const fullName = `${firstName} ${middleName} ${lastName}`
            .replace(/\s+/g, " ")
            .trim();

        await updateProfile(user, {
            displayName: fullName
        });

        // =========================
        // FIRESTORE ID = NAME (IMPORTANT)
        // =========================
        const docId = `${firstName}_${lastName}`
            .replace(/\s+/g, "_")
            .toLowerCase();

<<<<<<< HEAD
=======
        let docId = `${firstName}_${lastName}`.trim().replace(/\s+/g, "_").toLowerCase();

        if (!firstName || !lastName) {
        docId = user.uid;
        }

>>>>>>> 1bd88cbd491efb40e0b48281e2dedaaeada2e52a
        await setDoc(doc(db, "student", docId), {
            uid: user.uid,

            // IDs
            studentId,

            // PERSONAL
            firstName,
            middleName,
            lastName,
            fullName,
            birthDate,
            sex,
            contactNumber,
            email,
            address,

            // SCHOOL
            school,
            campus,
            college,
            course,
            yearLevel,
            academicYear,

            requiredHours,
            targetStart,
            targetEnd,

            adviserName,
            adviserContact,

            // DEPT
            selectedDepartment,
            workDays,
            preferredTime,
            notes,

            role: "student",
            applicationStatus: "pending",

            createdAt: serverTimestamp()
        });

        submitBtn.innerHTML = "✓ Account Created!";
        submitBtn.style.background = "#16a34a";

        setTimeout(() => {
            window.location.href = "/pages/index.html";
        }, 1500);

    } catch (error) {
        console.error(error);

        submitBtn.disabled = false;
        submitBtn.innerHTML = "Submit Application ✓";

        alert(error.message);
    }
});