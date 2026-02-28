import "@/css/style.css";
import { showToast } from "./helper.js";
import { initLogoutModal } from "./logout.js";

const saveBtn = document.getElementById("saveBtn");
const loadingOverlay = document.getElementById("loadingOverlay");
const toast = document.getElementById("toast");

// Form fields
const fieldNamaAlat = document.getElementById("fieldNamaAlat");
const fieldMerk = document.getElementById("fieldMerk");
const fieldTipe = document.getElementById("fieldTipe");
const fieldNomorSeri = document.getElementById("fieldNomorSeri");
const fieldLokasi = document.getElementById("fieldLokasi");
const fieldTahun = document.getElementById("fieldTahun");
const fieldStatus = document.getElementById("fieldStatus");

// =======================
// TABS
// =======================
const tabs = document.querySelectorAll(".tab-item");
const indicator = document.getElementById("tab-indicator");
const panels = document.querySelectorAll(".tab-panel");

function switchTab(activeTab) {
    const targetPanel = activeTab.dataset.tab;

    tabs.forEach((t) => t.classList.remove("text-primary"));
    activeTab.classList.add("text-primary");
    moveIndicator(activeTab);

    panels.forEach((panel) => {
        if (panel.id === `panel-${targetPanel}`) {
            panel.classList.remove("hidden");
        } else {
            panel.classList.add("hidden");
        }
    });

    // Tombol save hanya aktif di tab data alat
    saveBtn.classList.toggle("invisible", targetPanel !== "data-alat");
}

function moveIndicator(tab) {
    indicator.style.width = tab.offsetWidth + "px";
    indicator.style.left = tab.offsetLeft + "px";
}

tabs.forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab));
});

window.addEventListener("load", () => {
    moveIndicator(tabs[0]);
});

// =======================
// SAVE DATA ALAT
// =======================
saveBtn.addEventListener("click", async () => {
    if (!validateForm()) return;

    const updatedData = {
        name: fieldNamaAlat.value.trim(),
        brand: fieldMerk.value.trim(),
        type: fieldTipe.value.trim(),
        serialNumber: fieldNomorSeri.value.trim(),
        location: fieldLokasi.value.trim(),
        year: Number(fieldTahun.value),
        status: fieldStatus.value,
    };

    showLoading(true);

    try {
        // --- Firestore (aktifkan setelah Firebase siap) ---
        // const docRef = doc(db, "tools", toolId);
        // await updateDoc(docRef, updatedData);

        // --- Dummy delay (hapus setelah pakai Firestore) ---
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Update info strip
        toolNameEl.textContent = updatedData.name;
        document.getElementById("toolMeta").textContent = [updatedData.brand, updatedData.type, updatedData.serialNumber ? `SN ${updatedData.serialNumber}` : null].filter(Boolean).join(" · ") || "—";

        showToast(false, toast, "Data alat berhasil disimpan.");
    } catch (error) {
        console.error("Gagal menyimpan data:", error);
        showToast(true, toast, "Gagal menyimpan data. Coba lagi.");
    } finally {
        showLoading(false);
    }
});

function validateForm() {
    const requiredFields = [
        { el: fieldNamaAlat, label: "Nama alat" },
        { el: fieldMerk, label: "Merk" },
        { el: fieldTipe, label: "Tipe" },
        { el: fieldNomorSeri, label: "Nomor seri" },
        { el: fieldLokasi, label: "Lokasi" },
        { el: fieldTahun, label: "Tahun pengadaan" },
        { el: fieldStatus, label: "Status" },
    ];

    for (const { el, label } of requiredFields) {
        if (!el.value.trim()) {
            showToast(true, toast, `${label} tidak boleh kosong.`);
            el.focus();
            return false;
        }
    }

    const year = Number(fieldTahun.value);
    if (isNaN(year) || year < 2000 || year > new Date().getFullYear()) {
        showToast(true, toast, "Tahun pengadaan tidak valid.");
        fieldTahun.focus();
        return false;
    }

    return true;
}

// =======================
// HELPERS
// =======================
function showLoading(visible) {
    loadingOverlay.classList.toggle("hidden", !visible);
}

function formatDate(dateStr) {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

// =======================
// MAIN
// =======================
window.addEventListener("DOMContentLoaded", () => {
    initLogoutModal();
});
