function showOrHideError(isError, errorObjects, inputObjects) {
    if (isError) {
        errorObjects.forEach((e) => e.classList.remove("hidden"));
        inputObjects.forEach((i) => i.classList.add("outline-2", "outline-red-500"));
    } else {
        errorObjects.forEach((e) => e.classList.add("hidden"));
        inputObjects.forEach((i) => i.classList.remove("outline-2", "outline-red-500"));
    }
}

function showToast(isError, toastObject, message) {
    toastObject.textContent = message;

    if (isError) {
        toastObject.classList.add("bg-red-500");
    } else {
        toastObject.classList.add("bg-green-600");
    }

    // Show
    toastObject.classList.remove("opacity-0", "translate-y-5");
    toastObject.classList.add("opacity-100", "translate-y-0");

    // Auto hide after 3s
    setTimeout(() => {
        toastObject.classList.remove("opacity-100", "translate-y-0");
        toastObject.classList.add("opacity-0", "translate-y-5");
    }, 3000);
}

export { showOrHideError, showToast };
