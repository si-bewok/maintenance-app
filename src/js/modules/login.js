import "@/css/style.css";
import logo from "@/assets/img/logo-large.png";
import { showOrHideError, showToast } from "./helper.js";

const logoImg = document.getElementById("appLogo");
logoImg.src = logo;

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const toast = document.getElementById("toast");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let valid = true;

    showOrHideError(false, [emailError, passwordError], [emailInput, passwordInput]);

    if (!emailInput.value || !emailInput.checkValidity()) {
        showOrHideError(true, [emailError], [emailInput]);
        valid = false;
    }

    if (passwordInput.value.length < 6) {
        showOrHideError(true, [passwordError], [passwordInput]);
        valid = false;
    }

    if (!valid) return;

    // Dummy login (nanti ganti Firebase Auth)
    if (emailInput.value === "admin@email.com" && passwordInput.value === "123456") {
        window.location.href = "/tool-lists.html";
    } else {
        showToast(false, toast, "Login gagal. Periksa kembali email & password.");
        showOrHideError(true, [emailError, passwordError], [emailInput, passwordInput]);
    }
});
