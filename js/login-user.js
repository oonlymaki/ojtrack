import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const loginForm = document.getElementById("loginForm");
const loginButton = loginForm.querySelector(".login-button");
const loginError = document.getElementById("loginError");

const captchaText = document.getElementById("captchaText");
const captchaInput = document.getElementById("captchaInput");
const refreshCaptcha = document.getElementById("refreshCaptcha");

/* =========================
   CAPTCHA GENERATOR
========================= */
function generateCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let captcha = "";

  for (let i = 0; i < 5; i++) {
    captcha += chars[Math.floor(Math.random() * chars.length)];
  }

  captchaText.textContent = captcha;
}

generateCaptcha();

/* =========================
   REFRESH CAPTCHA
========================= */
refreshCaptcha.addEventListener("click", () => {
  generateCaptcha();
  captchaInput.value = "";
});

/* =========================
   LOGIN
========================= */
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  loginButton.classList.add("loading");
  loginButton.disabled = true;
  loginError.textContent = "";

  /* CAPTCHA CHECK */
  const enteredCaptcha = captchaInput.value.trim().toUpperCase();
  const actualCaptcha = captchaText.textContent.trim().toUpperCase();

  if (enteredCaptcha !== actualCaptcha) {
    loginError.textContent = "Incorrect verification code.";

    loginButton.classList.remove("loading");
    loginButton.disabled = false;

    generateCaptcha();
    captchaInput.value = "";

    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userEmail", user.email);

    loginButton.classList.remove("loading");
    loginButton.innerHTML = "<span>✓ Success!</span>";

    /* ADMIN CHECK */
    const adminSnap = await getDoc(doc(db, "admins", user.uid));

    if (adminSnap.exists()) {
      window.location.href = "/pages/admin/admin_dashboard.html";
      return;
    }

    /* STUDENT CHECK */
    const studentSnap = await getDoc(doc(db, "students", user.uid));

    if (!studentSnap.exists()) {
      window.location.href = "/pages/student/pending.html";
      return;
    }

    const status = studentSnap.data().status;

    if (status === "approved") {
      window.location.href = "/pages/student/dashboard.html";
    } else if (status === "rejected") {
      window.location.href = "/pages/student/rejected.html";
    } else {
      window.location.href = "/pages/student/pending.html";
    }

  } catch (error) {
    console.error("Login error:", error);

    loginButton.classList.remove("loading");
    loginButton.disabled = false;

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

    generateCaptcha();
    captchaInput.value = "";
  }
});
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", () => {
  const icon = togglePassword.querySelector("i");

  const isPassword = passwordInput.type === "password";

  passwordInput.type = isPassword ? "text" : "password";

  icon.classList.toggle("fa-eye", !isPassword);
  icon.classList.toggle("fa-eye-slash", isPassword);
});