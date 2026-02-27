import "@/css/style.css";
import img from "@/assets/img/gasmedis_square.jpg";

// Dummy Data
const baseTools = [
    {
        id: 1,
        name: "Defibrillator",
        brand: "Zoll",
        location: "ICU",
        status: "Baik",
        image: img,
    },
    {
        id: 2,
        name: "Ventilator",
        brand: "Dräger",
        location: "NICU",
        status: "Rusak",
        image: img,
    },
    {
        id: 3,
        name: "Timbangan Digital Anak",
        brand: "Philips",
        location: "IGD",
        status: "Baik",
        image: img,
    },
];

// simulate 30 items
const tools = Array.from({ length: 30 }, (_, i) => {
    const item = baseTools[i % baseTools.length];
    return {
        ...item,
        id: i + 1,
    };
});

const tabs = document.querySelectorAll(".tab-item");
const indicator = document.getElementById("tab-indicator");
const toggle = document.getElementById("searchToggle");
const wrapper = document.getElementById("searchWrapper");
const input = document.getElementById("searchInput");
const form = document.getElementById("searchForm");
const toolList = document.getElementById("toolList");
const sentinel = document.getElementById("scrollSentinel");

const ITEMS_PER_LOAD = 6;
let currentIndex = 0;

// =======================
// OBSERVER
// =======================
const observer = new IntersectionObserver(
    (entries) => {
        if (entries[0].isIntersecting) {
            loadMore();
        }
    },
    {
        rootMargin: "100px",
    },
);

window.addEventListener("DOMContentLoaded", () => {
    loadMore(); // initial load
    observer.observe(sentinel);
});

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        // reset active color
        tabs.forEach((t) => t.classList.remove("text-primary"));
        tab.classList.add("text-primary");

        moveIndicator(tab);
    });
});

// set initial
window.addEventListener("load", () => {
    moveIndicator(tabs[0]);
});

toggle.addEventListener("click", () => {
    const isOpen = wrapper.classList.contains("max-h-40");

    if (isOpen) {
        wrapper.classList.remove("max-h-40", "opacity-100");
        wrapper.classList.add("max-h-0", "opacity-0");
    } else {
        wrapper.classList.remove("max-h-0", "opacity-0");
        wrapper.classList.add("max-h-40", "opacity-100");

        setTimeout(() => {
            input.focus();
        }, 200);
    }
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const query = input.value.trim();
    if (!query) return;

    console.log("Search:", query);

    // nanti bisa dihubungkan ke Firestore filter
});

function createCard(tool) {
    const card = document.createElement("a");
    card.href = `/tool-detail.html?id=${tool.id}`;
    card.className = `
    grid grid-cols-[64px_minmax(0,1fr)_60px_60px]
    items-center gap-3 p-3
    bg-white rounded-lg shadow-sm
    hover:shadow-md transition duration-200
    `;

    card.innerHTML = `
    <img src="${tool.image}"
         class="w-16 h-16 object-cover rounded-xl bg-gray-100"
         alt="${tool.name}" />

    <div class="min-w-0">
        <div class="text-sm font-semibold text-gray-800 leading-tight">
            ${tool.name}
        </div>
        <div class="text-sm text-gray-500 leading-tight">
            ${tool.brand}
        </div>
    </div>

    <div class="text-sm text-gray-600 text-center truncate">
        ${tool.location}
    </div>

    <div class="flex items-center justify-center">
        <span class="
            text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap
            ${tool.status === "Baik" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}
        ">
            ${tool.status}
        </span>
    </div>
`;

    return card;
}

function loadMore() {
    const nextItems = tools.slice(currentIndex, currentIndex + ITEMS_PER_LOAD);

    nextItems.forEach((tool) => {
        toolList.appendChild(createCard(tool));
    });

    currentIndex += ITEMS_PER_LOAD;

    if (currentIndex >= tools.length) {
        observer.disconnect();
        sentinel.innerHTML = `
      <p class="text-center text-sm text-gray-400 py-4">
        Semua data telah ditampilkan
      </p>
    `;
    }
}

function moveIndicator(tab) {
    indicator.style.width = tab.offsetWidth + "px";
    indicator.style.left = tab.offsetLeft + "px";
}
