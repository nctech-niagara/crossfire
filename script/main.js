document.addEventListener("DOMContentLoaded", function () {

    /* -------------------------
       GLOBAL NCR LIST
    ------------------------- */
    let allNcrs = [];

    /* -------------------------
       MARK FIRST READY
    ------------------------- */
    function markFirstReady(list) {
        if (!list.length) return list;

        let exists = list.some(n => n.qualityCompleted === true);

        if (!exists) {
            list[0].qualityCompleted = true;
            list[0].engineeringCompleted = false;
            list[0].status = list[0].status || "Active";
        }
        return list;
    }

    /* -------------------------
       RENDER THE TABLE
    ------------------------- */
    function renderTable(list) {
        const tbody = document.getElementById("ncr-logs-table");
        if (!tbody) return;

        tbody.innerHTML = "";

        list.forEach(ncr => {
            const row = document.createElement("tr");

            const isActive = (ncr.status || "").toLowerCase() === "active";

            row.innerHTML = `
                <td>${ncr.ncrNumber || ""}</td>
                <td>${ncr.createdOn || ""}</td>
                <td>${ncr.supplier || ""}</td>
                <td>${ncr.status || ""}</td>
                <td>
                    <button class="btnView">View</button>
                    <button class="btnEdit">Edit</button>
                    ${!isActive ? `<button class="btnExport">Export</button>` : ""}
                </td>
            `;
            tbody.appendChild(row);

            row.querySelector(".btnView").onclick = () => {
                window.location.href = `view-ncr.html?ncrNumber=${encodeURIComponent(ncr.ncrNumber)}`;
            };
            row.querySelector(".btnEdit").onclick = () => {
                window.location.href = `edit-ncr.html?ncrNumber=${encodeURIComponent(ncr.ncrNumber)}`;
            };

            if (!isActive) {
                row.querySelector(".btnExport").onclick = () => {
                    exportPdf();
                };
            }
        });
    }

    /* -------------------------
       LOAD JSON DATA
    ------------------------- */
    fetch("data/data.json")
        .then(res => res.json())
        .then(data => {
            if (!Array.isArray(data)) data = [];
            allNcrs = markFirstReady(data);

            const statusEl = document.getElementById("status");
            if (statusEl) statusEl.value = "active";

            applyFilters();
        })
        .catch(err => console.error("Failed to load data:", err));

    /* -------------------------
       FILTER FUNCTION
    ------------------------- */
    function applyFilters() {

        const statusEl = document.getElementById("status");
        if (statusEl && !statusEl.value) {
            statusEl.value = "active";
        }

        const supplierQuery = document.getElementById("search-logs")?.value.toLowerCase() || "";
        const statusFilter = (document.getElementById("status")?.value.toLowerCase()) || "active";
        const fromDate = document.getElementById("fromDate")?.value;
        const toDate = document.getElementById("toDate")?.value;

        if (!Array.isArray(allNcrs)) return;

        const filtered = allNcrs.filter(ncr => {
            let match = true;

            if (supplierQuery)
                match = match && (ncr.supplier || "").toLowerCase().includes(supplierQuery);

            if (statusFilter !== "all")
                match = match && (ncr.status || "").toLowerCase() === statusFilter;

            if (fromDate)
                match = match && new Date(ncr.createdOn) >= new Date(fromDate);

            if (toDate)
                match = match && new Date(ncr.createdOn) <= new Date(new Date(toDate).setHours(23, 59, 59, 999));

            return match;
        });

        renderTable(filtered);
    }

    /* -------------------------
       EVENT LISTENERS FOR FILTERS
    ------------------------- */
    ["search-logs","status","fromDate","toDate"].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const eventType = id === "search-logs" ? "input" : "change";
        el.addEventListener(eventType, applyFilters);
    });

    /* -------------------------
       PASS NCR NUMBER TO OTHER PAGES
    ------------------------- */
    const url = new URLSearchParams(window.location.search);
    const ncrNum = url.get("ncrNumber");

    if (ncrNum) {
        const input = document.getElementById("ncr-number") ||
                      document.getElementById("edit-ncr-number");
        if (input) input.value = ncrNum;

        fetch("data/data.json")
            .then(res => res.json())
            .then(data => {
                const ncr = data.find(x => x.ncrNumber === ncrNum);
                if (!ncr) return;

                const safeSet = (id, val) => {
                    let el = document.getElementById(id);
                    if (el) el.value = val || "";
                };

                safeSet("created-on", ncr.createdOn);
                safeSet("prod-number", ncr.prodNumber);
                safeSet("sales-number", ncr.salesNumber);
                safeSet("quantity-num", ncr.quantityReceived);
                safeSet("quantity-num-defect", ncr.quantityDefective);
                safeSet("Process", ncr.process);
                safeSet("supplierName", ncr.supplier);
                safeSet("desc-item", ncr.itemDescription);
                safeSet("desc-defect", ncr.defectDescription);
                safeSet("itemMark", ncr.itemMarked);
                safeSet("quality-rep-name", ncr.qualityRepName);
                safeSet("addinfo", ncr.additionalInfo);
            });
    }

    /* -------------------------
       FORM HANDLING
    ------------------------- */
    const formIds = [
        "create-ncr-form",
        "engineer-ncr-form",
        "PO-ncr-form",
        "edit-ncr-form"
    ];

    formIds.forEach(id => {
        let form = document.getElementById(id);
        if (!form) return;

        form.addEventListener("submit", e => {
            if (!form.checkValidity()) return;
            e.preventDefault();
            alert("Your form was submitted successfully!");
            if (id !== "edit-ncr-form") window.location.href = "home.html";
        });
    });

    /* -------------------------
       AUTOFILL DATE
    ------------------------- */
    const today = new Date().toISOString().split("T")[0];

    ["created-on", "engDate", "PODate"].forEach(id => {
        let el = document.getElementById(id);
        if (el && !ncrNum) el.value = today;
    });

    /* -------------------------
       AUTOFILL NCR NUMBER
    ------------------------- */
    if (!ncrNum && document.getElementById("ncr-number")) {

        const now = new Date();

        const year = String(now.getFullYear() - 2000).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        const h = String(now.getHours()).padStart(2, "0");
        const m = String(now.getMinutes()).padStart(2, "0");
        const s = String(now.getSeconds()).padStart(2, "0");

        const rng = String(Math.floor(Math.random() * 99) + 1).padStart(2, "0");

        document.getElementById("ncr-number").value =
            `${year}${month}${day}-${h}${m}${s}-${rng}`;
    }

    /* -------------------------
       SAVE & LOAD FORM DATA
    ------------------------- */
    function saveFormData() {

        const data = {

            createdOn: document.getElementById("created-on").value,
            prodNumber: document.getElementById("prod-number").value,
            salesNumber: document.getElementById("sales-number").value,
            quantityReceived: document.getElementById("quantity-num").value,
            quantityDefective: document.getElementById("quantity-num-defect").value,
            process: document.getElementById("Process").value,
            supplier: document.getElementById("supplierName").value,
            itemDescription: document.getElementById("desc-item").value,
            defectDescription: document.getElementById("desc-defect").value,
            itemMarked: document.getElementById("itemMark").value,
            qualityRepName: document.getElementById("quality-rep-name").value,
            additionalInfo: document.getElementById("addinfo").value
        };

        localStorage.setItem("ncrForm", JSON.stringify(data));

        alert("NCR saved!");
    }

    function loadFormData() {

        const data = JSON.parse(localStorage.getItem("ncrForm"));
        if (!data) return;

        document.getElementById("created-on").value = data.createdOn || "";
        document.getElementById("prod-number").value = data.prodNumber || "";
        document.getElementById("sales-number").value = data.salesNumber || "";
        document.getElementById("quantity-num").value = data.quantityReceived || "";
        document.getElementById("quantity-num-defect").value = data.quantityDefective || "";
        document.getElementById("Process").value = data.process || "";
        document.getElementById("supplierName").value = data.supplier || "";
        document.getElementById("desc-item").value = data.itemDescription || "";
        document.getElementById("desc-defect").value = data.defectDescription || "";
        document.getElementById("itemMark").value = data.itemMarked || "";
        document.getElementById("quality-rep-name").value = data.qualityRepName || "";
        document.getElementById("addinfo").value = data.additionalInfo || "";
    }

    /* -------------------------
       EXPORT PDF
    ------------------------- */
    function exportPdf() {

        const formElement = document.getElementById('create-ncr-form');
        if (!formElement) return;

        html2pdf().from(formElement).save();
    }

});