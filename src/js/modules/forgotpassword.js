import "@/css/style.css";
import { auth, sendPasswordResetEmail } from "../firebase/auth.js";
import { showOrHideError, showToast } from "./helper.js";

const form = document.getElementById("forgotForm");
const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");
const toast = document.getElementById("toast");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let valid = true;

    showOrHideError(false, [emailError], [emailInput]);

    if (!emailInput.value || !emailInput.checkValidity()) {
        showOrHideError(true, [emailError], [emailInput]);
        valid = false;
    }

    if (!valid) return;

    const email = emailInput.value.trim();

    try {
        //await sendPasswordResetEmail(auth, email);
        await console.log("email terkirim!", email);
        showToast(false, toast, "Link reset password telah dikirim ke email kamu.");
    } catch (error) {
        console.error(error);
        showToast(true, toast, "Email tidak ditemukan atau terjadi kesalahan.");
    }
});
