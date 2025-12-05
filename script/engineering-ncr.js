document.addEventListener("DOMContentLoaded", function () {

    function loadList() {
        return JSON.parse(localStorage.getItem("ncrData") || "[]");
    }

    function saveList(list) {
        localStorage.setItem("ncrData", JSON.stringify(list));
    }

    let list = loadList();

    // NCR for demos
    if (list.length > 0 && !list.some(n => n.qualityCompleted === true)) {
        list[0].qualityCompleted = true;
        list[0].engineeringCompleted = false;
        if (!list[0].status) {
            list[0].status = "Active";
        }
        saveList(list);
    }

    const table = document.getElementById("engineering-ncr-table");
    const form = document.getElementById("engineering-ncr-form");

    function updateBell() {
        const btn = document.querySelector(".notification-btn");
        if (!btn) return;

        const count = loadList().filter(n => n.qualityCompleted === true && n.engineeringCompleted !== true).length;
        if (count > 0) {
            btn.classList.add("active-notification");
        } else {
            btn.classList.remove("active-notification");
        }
    }

    function loadTable() {
        list = loadList();
        if (!table) return;

        const ready = list.filter(n => n.qualityCompleted === true && n.engineeringCompleted !== true);
        let rows = "";

        ready.forEach(ncr => {
            rows += `
                <tr>
                    <td>${ncr.ncrNumber}</td>
                    <td>${ncr.createdOn}</td>
                    <td>${ncr.supplier}</td>
                    <td>${ncr.status}</td>
                    <td><button type="button" class="btn-style open-engineering" data-ncr="${ncr.ncrNumber}">Open</button></td>
                </tr>
            `;
        });

        table.innerHTML = rows;
        updateBell();
    }

    function setRadioGroup(name, value) {
        const radios = document.querySelectorAll(`input[name='${name}']`);
        radios.forEach(r => {
            r.checked = (r.value === value);
        });
    }

    function getRadioValue(name) {
        const radios = document.querySelectorAll(`input[name='${name}']`);
        let value = "";
        radios.forEach(r => {
            if (r.checked) value = r.value;
        });
        return value;
    }

    function openEngineering(ncrNumber) {
        if (!form) return;

        const item = list.find(n => n.ncrNumber === ncrNumber);
        if (!item) return;

        form.dataset.ncr = ncrNumber;

        const num = document.getElementById("eng-ncr-number");
        const created = document.getElementById("eng-created-on");
        const supplier = document.getElementById("eng-supplier");

        if (num) num.value = item.ncrNumber || "";
        if (created) created.value = item.createdOn || "";
        if (supplier) supplier.value = item.supplier || "";

        setRadioGroup("ncrEngineer", item.engineeringDecision || "");
        setRadioGroup("ncrCustomer", item.customerNotify || "");
    }

    if (table) {
        document.addEventListener("click", function (e) {
            if (e.target.classList.contains("open-engineering")) {
                const ncrNumber = e.target.getAttribute("data-ncr");
                openEngineering(ncrNumber);
            }
        });
    }

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const ncrNumber = form.dataset.ncr;
            if (!ncrNumber) return;

            list = loadList();
            const item = list.find(n => n.ncrNumber === ncrNumber);
            if (!item) return;

            const decision = getRadioValue("ncrEngineer");
            const notify = getRadioValue("ncrCustomer");

            item.engineeringDecision = decision;
            item.customerNotify = notify;

            saveList(list);
            alert("Engineering NCR saved.");
        });
    }

    const completeBtn = document.getElementById("engineering-complete");
    if (completeBtn && form) {
        completeBtn.addEventListener("click", function () {
            const ncrNumber = form.dataset.ncr;
            if (!ncrNumber) return;

            list = loadList();
            const item = list.find(n => n.ncrNumber === ncrNumber);
            if (!item) return;

            const decision = getRadioValue("ncrEngineer");
            const notify = getRadioValue("ncrCustomer");

            item.engineeringDecision = decision;
            item.customerNotify = notify;
            item.engineeringCompleted = true;
            item.status = "Pending Purchasing";

            saveList(list);
            loadTable();
            alert("Engineering portion completed. Purchasing has been notified.");
        });
    }

    loadTable();
});
