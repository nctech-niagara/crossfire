document.addEventListener("DOMContentLoaded", function () {

    function loadList() {
        return JSON.parse(localStorage.getItem("ncrData") || "[]");
    }

    const params = new URLSearchParams(window.location.search);
    const ncrNumber = params.get("ncr");

    if (!ncrNumber) return;

    const list = loadList();
    const ncr = list.find(n => n.ncrNumber === ncrNumber);

    if (!ncr) return;

    const ncrSpan = document.getElementById("report-ncr-number");
    const createdSpan = document.getElementById("report-created-on");
    const supplierSpan = document.getElementById("report-supplier");
    const statusSpan = document.getElementById("report-status");
    const engDecisionSpan = document.getElementById("report-eng-decision");
    const engCustomerSpan = document.getElementById("report-eng-customer");

    if (ncrSpan) ncrSpan.textContent = ncr.ncrNumber || "";
    if (createdSpan) createdSpan.textContent = ncr.createdOn || "";
    if (supplierSpan) supplierSpan.textContent = ncr.supplier || "";
    if (statusSpan) statusSpan.textContent = ncr.status || "";

    if (engDecisionSpan) engDecisionSpan.textContent = ncr.engineeringDecision || "Not completed";
    if (engCustomerSpan) engCustomerSpan.textContent = ncr.customerNotify || "Not specified";
});
