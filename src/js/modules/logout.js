import { showToast } from "./helper.js";
// import { auth } from "../firebase/auth.js";
// import { signOut } from "firebase/auth";

const MODAL_HTML = `
<div id="logoutModal" class="fixed inset-0 z-50 flex items-end justify-center hidden">
    <div id="logoutBackdrop" class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 opacity-0"></div>
    <div id="logoutSheet" class="relative w-full max-w-sm bg-white rounded-t-3xl px-6 pt-6 pb-10 shadow-2xl translate-y-full transition-transform duration-300 ease-out">
        <div class="mx-auto w-10 h-1 bg-gray-200 rounded-full mb-6"></div>
        <div class="flex justify-center mb-4">
            <div class="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                </svg>
            </div>
        </div>
        <h2 class="text-center text-base font-semibold text-secondary mb-1">Keluar dari aplikasi?</h2>
        <p class="text-center text-xs text-gray-400 mb-8">Kamu harus login kembali untuk mengakses e-Maintenance.</p>
        <div class="flex flex-col gap-3">
            <button id="logoutConfirmBtn" type="button" class="w-full bg-primary hover:bg-primary/80 active:bg-primary/60 text-white font-medium py-2.5 rounded-xl transition active:scale-95">
                Logout
            </button>
            <button id="logoutCancelBtn" type="button" class="w-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-secondary font-medium py-2.5 rounded-xl transition active:scale-95">
                Batal
            </button>
        </div>
    </div>
</div>
`;

function openLogoutModal() {
    const modal = document.getElementById("logoutModal");
    const backdrop = document.getElementById("logoutBackdrop");
    const sheet = document.getElementById("logoutSheet");

    modal.classList.remove("hidden");
    requestAnimationFrame(() => {
        backdrop.classList.remove("opacity-0");
        backdrop.classList.add("opacity-100");
        sheet.classList.remove("translate-y-full");
        sheet.classList.add("translate-y-0");
    });
}

function closeLogoutModal() {
    const backdrop = document.getElementById("logoutBackdrop");
    const sheet = document.getElementById("logoutSheet");

    backdrop.classList.remove("opacity-100");
    backdrop.classList.add("opacity-0");
    sheet.classList.remove("translate-y-0");
    sheet.classList.add("translate-y-full");
    setTimeout(() => document.getElementById("logoutModal").classList.add("hidden"), 300);
}

export function initLogoutModal() {
    // Inject HTML modal ke dalam body
    document.body.insertAdjacentHTML("beforeend", MODAL_HTML);

    const logoutBtn = document.querySelector("button[aria-label='Logout']");
    const confirmBtn = document.getElementById("logoutConfirmBtn");
    const cancelBtn = document.getElementById("logoutCancelBtn");
    const backdrop = document.getElementById("logoutBackdrop");

    if (!logoutBtn) {
        console.warn("initLogoutModal: tombol logout tidak ditemukan.");
        return;
    }

    logoutBtn.addEventListener("click", openLogoutModal);
    cancelBtn.addEventListener("click", closeLogoutModal);
    backdrop.addEventListener("click", closeLogoutModal);

    confirmBtn.addEventListener("click", async () => {
        try {
            // await signOut(auth);
            window.location.href = "/index.html";
        } catch (error) {
            console.error("Logout gagal:", error);
            // Jika ada toast di halaman, tampilkan error
            const toast = document.getElementById("toast");
            if (toast) showToast(true, toast, "Logout gagal. Coba lagi.");
        }
    });
}
