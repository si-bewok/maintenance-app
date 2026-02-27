import "@/css/style.css";
import { showToast } from "./helper.js";
// import { db } from "../firebase/config.js";
// import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";

// =======================
// INIT
// =======================
const toolId = new URLSearchParams(window.location.search).get("id");

const toolNameEl = document.getElementById("toolName");
const saveBtn = document.getElementById("saveBtn");
const loadingOverlay = document.getElementById("loadingOverlay");
const toast = document.getElementById("toast");
const kunjunganList = document.getElementById("kunjunganList");
const sentinel = document.getElementById("kunjunganSentinel");

// Form fields
const toolForm = document.getElementById("toolForm");
const fieldNamaAlat = document.getElementById("fieldNamaAlat");
const fieldMerk = document.getElementById("fieldMerk");
const fieldTipe = document.getElementById("fieldTipe");
const fieldNomorSeri = document.getElementById("fieldNomorSeri");
const fieldLokasi = document.getElementById("fieldLokasi");
const fieldTahun = document.getElementById("fieldTahun");
const fieldStatus = document.getElementById("fieldStatus");

// =======================
// GUARD: tidak ada ID
// =======================
if (!toolId) {
    showToast(true, toast, "ID alat tidak ditemukan.");
    setTimeout(() => {
        window.location.href = "/tool-lists.html";
    }, 2000);
}

// =======================
// DUMMY DATA
// (hapus saat sudah pakai Firestore)
// =======================
const dummyTool = {
    id: toolId,
    name: "Defibrillator",
    brand: "Zoll",
    type: "AED Plus",
    serialNumber: "SN-20240001",
    location: "ICU Lantai 2",
    year: 2022,
    status: "Baik",
};

const dummyKunjungan = [
    { id: "k1", date: "2025-01-12", technician: "Budi Santoso", user: "Dr. Siti Rahayu", status: "Selesai" },
    { id: "k2", date: "2025-02-03", technician: "Ahmad Fauzi", user: "Ns. Dewi Lestari", status: "Menunggu" },
    { id: "k3", date: "2025-03-15", technician: "Rizky Pratama", user: "Dr. Hendra Gunawan", status: "Selesai" },
];

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
// LOAD DATA ALAT
// =======================
async function loadToolData() {
    try {
        // --- Firestore (aktifkan setelah Firebase siap) ---
        // const docRef = doc(db, "tools", toolId);
        // const docSnap = await getDoc(docRef);
        // if (!docSnap.exists()) throw new Error("Alat tidak ditemukan");
        // const tool = docSnap.data();

        // --- Dummy (hapus setelah pakai Firestore) ---
        const tool = dummyTool;

        populateForm(tool);
    } catch (error) {
        console.error("Gagal memuat data alat:", error);
        showToast(true, toast, "Gagal memuat data alat.");
    }
}

function populateForm(tool) {
    toolNameEl.textContent = tool.name;
    fieldNamaAlat.value = tool.name ?? "";
    fieldMerk.value = tool.brand ?? "";
    fieldTipe.value = tool.type ?? "";
    fieldNomorSeri.value = tool.serialNumber ?? "";
    fieldLokasi.value = tool.location ?? "";
    fieldTahun.value = tool.year ?? "";
    fieldStatus.value = tool.status ?? "";
}

// =======================
// SAVE DATA ALAT
// =======================
toolForm.addEventListener("submit", async (e) => {
    e.preventDefault();

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

        toolNameEl.textContent = updatedData.name;
        showToast(false, toast, "Data alat berhasil disimpan.");
    } catch (error) {
        console.error("Gagal menyimpan data:", error);
        showToast(true, toast, "Gagal menyimpan data. Coba lagi.");
    } finally {
        showLoading(false);
    }
});

saveBtn.addEventListener("click", async () => {
    toolForm.requestSubmit();
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
// LOAD DATA KUNJUNGAN
// =======================
let kunjunganIndex = 0;
const KUNJUNGAN_PER_LOAD = 6;
let allKunjungan = [];

const kunjunganObserver = new IntersectionObserver(
    (entries) => {
        if (entries[0].isIntersecting) loadMoreKunjungan();
    },
    { rootMargin: "100px" },
);

async function loadKunjunganData() {
    try {
        // --- Firestore (aktifkan setelah Firebase siap) ---
        // const colRef = collection(db, "tools", toolId, "kunjungan");
        // const snapshot = await getDocs(colRef);
        // allKunjungan = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

        // --- Dummy (hapus setelah pakai Firestore) ---
        allKunjungan = dummyKunjungan;

        // Bersihkan dummy HTML yang ada di template
        kunjunganList.innerHTML = "";
        kunjunganIndex = 0;

        loadMoreKunjungan();
        kunjunganObserver.observe(sentinel);
    } catch (error) {
        console.error("Gagal memuat data kunjungan:", error);
        showToast(true, toast, "Gagal memuat data kunjungan.");
    }
}

function loadMoreKunjungan() {
    const nextItems = allKunjungan.slice(kunjunganIndex, kunjunganIndex + KUNJUNGAN_PER_LOAD);

    nextItems.forEach((kunjungan) => {
        kunjunganList.appendChild(createKunjunganCard(kunjungan));
    });

    kunjunganIndex += KUNJUNGAN_PER_LOAD;

    if (kunjunganIndex >= allKunjungan.length) {
        kunjunganObserver.disconnect();
        sentinel.innerHTML = `
            <p class="text-center text-sm text-gray-400 py-4">
                Semua data telah ditampilkan
            </p>
        `;
    }
}

function createKunjunganCard(kunjungan) {
    const card = document.createElement("a");
    card.href = `/kunjungan-detail.html?id=${kunjungan.id}&toolId=${toolId}`;
    card.className = "grid grid-cols-[1fr_auto] items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200";

    const isSelesai = kunjungan.status === "Selesai";
    const formattedDate = formatDate(kunjungan.date);

    card.innerHTML = `
        <div class="space-y-1 min-w-0">
            <p class="text-xs text-gray-400">${formattedDate}</p>
            <p class="text-sm font-semibold text-gray-800 truncate">Teknisi: ${kunjungan.technician}</p>
            <p class="text-sm text-gray-500 truncate">User: ${kunjungan.user}</p>
        </div>
        <div class="flex items-center justify-end pt-1">
            <span class="text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap
                ${isSelesai ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}">
                ${kunjungan.status}
            </span>
        </div>
    `;

    return card;
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
    loadToolData();
    loadKunjunganData();
});
