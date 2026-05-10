import { auth, db } from "/js/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

onAuthStateChanged(auth, async(user) => {

    if (!user) {
        window.location.href = "/pages/index.html";
        return;
    }

    try {

        // FIND USER BY UID
        const q = query(
            collection(db, "student"),
            where("uid", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {

            const data = snapshot.docs[0].data();

            // =========================
            // GET FIRST NAME ONLY
            // =========================
            const firstName = (data.firstName || "").trim();

            document.getElementById("welcomeName").textContent =
                `Welcome, ${firstName || "Student"}`;

        } else {

            document.getElementById("welcomeName").textContent =
                "Welcome, Student";
        }

    } catch (error) {
        console.error("Dashboard error:", error);

        document.getElementById("welcomeName").textContent =
            "Welcome, Student";
    }
});