import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const loginButton = loginForm.querySelector(".login-button");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  loginButton.classList.add("loading");
  loginButton.disabled = true;
  loginError.textContent = "";

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userEmail", userCredential.user.email);

    loginButton.classList.remove("loading");
    loginButton.innerHTML = "<span>✓ Success!</span>";

    setTimeout(() => {
      // Redirect based on email domain
      if (email.endsWith("@gmail.com")) {
        window.location.href = "/pages/admin/admin_dashboard.html";
      } else if (email.endsWith("@pampangastateu.edu.ph")) {
        window.location.href = "/pages/student/dashboard.html";
      } else {
        // Default fallback if domain doesn't match
        window.location.href = "/pages/student/dashboard.html";
      }
    }, 1000);
  } catch (error) {
    loginButton.classList.remove("loading");
    loginButton.disabled = false;
    console.error("Login error:", error.code, error.message);

    document.getElementById("password").value = "";

    let message = "Login failed. Please try again.";
    if (error.code === "auth/invalid-email") {
      message = "Invalid email format.";
    } else if (error.code === "auth/user-not-found") {
      message = "No account found with this email.";
    } else if (error.code === "auth/wrong-password") {
      message = "Incorrect password.";
    } else if (error.code === "auth/invalid-credential") {
      message = "Invalid email or password.";
    }

    loginError.textContent = message;
  }
});
