document.addEventListener("DOMContentLoaded", function () {

    function loadNCRs() {
        return JSON.parse(localStorage.getItem("ncrData") || "[]");
    }

    const params = new URLSearchParams(window.location.search);
    const ncrNumber = params.get("ncr");

    if (!ncrNumber) return;

    const list = loadNCRs();
    const ncr = list.find(n => n.ncrNumber === ncrNumber);

    if (!ncr) return;

    // Fill the fields
    document.getElementById("edit-ncr-number").value = ncr.ncrNumber;
    document.getElementById("edit-created-on").value = ncr.createdOn;
    document.getElementById("edit-supplier").value = ncr.supplier;
    document.getElementById("edit-status").value = ncr.status;

    // Save changes
    const form = document.getElementById("edit-ncr-form");
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        ncr.status = document.getElementById("edit-status").value;

        localStorage.setItem("ncrData", JSON.stringify(list));
        alert("NCR details saved.");
    });
});
