document.addEventListener("DOMContentLoaded", function () {

    function markFirstReady() {
        let list = JSON.parse(localStorage.getItem("ncrData") || "[]");
        if (list.length === 0) return;

        let exists = list.some(n => n.qualityCompleted === true);
        if (exists) return;

        list[0].qualityCompleted = true;
        list[0].engineeringCompleted = false;

        if (!list[0].status) {
            list[0].status = "Active";
        }

        localStorage.setItem("ncrData", JSON.stringify(list));
    }

    function ensureNcrDataReady() {
        let stored = localStorage.getItem("ncrData");

        if (!stored) {
            $.getJSON("/data/data.json", function (data) {
                if (!Array.isArray(data)) data = [];
                localStorage.setItem("ncrData", JSON.stringify(data));
                markFirstReady();
            });
        } else {
            markFirstReady();
        }
    }

    ensureNcrDataReady();

    const createForm = document.getElementById("create-ncr-form");
    const editForm = document.getElementById("edit-ncr-form");
    const engineerForm = document.getElementById("engineer-ncr-form");

    if (createForm) {
        createForm.addEventListener("submit", function (e) {
            if (!this.checkValidity()) return;
            e.preventDefault();
            alert("Your form has been validated and submitted successfully.");
        });
    }

    if (editForm) {
        editForm.addEventListener("submit", function (e) {
            e.preventDefault();
            alert("NCR details saved.");
        });
    }

    if (engineerForm) {
        engineerForm.addEventListener("submit", function (e) {
            e.preventDefault();
            alert("Engineering NCR saved successfully.");
        });
    }

    const themeSwitch = document.getElementById("theme-switch");
    const themeText = document.getElementById("theme-text");

    if (themeSwitch && themeText) {
        const savedTheme = localStorage.getItem("theme");
        const isDark = savedTheme === "dark";

        document.body.classList.toggle("dark", isDark);
        themeSwitch.checked = isDark;
        themeText.textContent = isDark ? "Light Mode" : "Dark Mode";

        themeSwitch.addEventListener("change", function () {
            const useDark = themeSwitch.checked;
            document.body.classList.toggle("dark", useDark);
            themeText.textContent = useDark ? "Light Mode" : "Dark Mode";
            localStorage.setItem("theme", useDark ? "dark" : "light");
        });
    }

    if (typeof $ !== "undefined") {

        let ncrLogs = [];
        $.getJSON("/data/data.json", function (data) {
            ncrLogs = JSON.parse(localStorage.getItem("ncrData")) || data;
            populateTable(ncrLogs);
        });

        function populateTable(list) {
    let rowsHome = "";
    let rows = "";

    $.each(list.slice(0, 5), function (_, log) {
        rowsHome += `
            <tr>
                <td>${log.ncrNumber}</td>
                <td>${log.createdOn}</td>
                <td>${log.supplier}</td>
                <td><span class="status ${log.status.toLowerCase()}">${log.status}</span></td>
                <td>
                    <a href="edit-ncr.html?ncr=${log.ncrNumber}">View</a> |
                    <a href="report-ncr.html?ncr=${log.ncrNumber}">Report</a>
                </td>
            </tr>`;
    });

    $.each(list, function (_, log) {
        rows += `
            <tr>
                <td>${log.ncrNumber}</td>
                <td>${log.createdOn}</td>
                <td>${log.supplier}</td>
                <td><span class="status ${log.status.toLowerCase()}">${log.status}</span></td>
                <td>
                    <a href="edit-ncr.html?ncr=${log.ncrNumber}">View</a> |
                    <a href="report-ncr.html?ncr=${log.ncrNumber}">Report</a>
                </td>
            </tr>`;
    });

    if ($("#ncr-logs-table-home").length) {
        $("#ncr-logs-table-home").html(rowsHome);
    }

    if ($("#ncr-logs-table").length) {
        $("#ncr-logs-table").html(rows);
    }
}


        const searchInput = $("#search-logs");
        if (searchInput.length) {
            searchInput.on("keyup", function () {
                let value = $(this).val().toLowerCase();
                let filtered = ncrLogs.filter(log =>
                    log.ncrNumber.toLowerCase().includes(value)
                );
                populateTable(filtered);
            });
        }

        const statusFilter = $("#status");
        if (statusFilter.length) {
            statusFilter.on("change", function () {
                let value = $(this).val().toLowerCase();
                let filtered = value === "all"
                    ? ncrLogs
                    : ncrLogs.filter(log => log.status.toLowerCase() === value);
                populateTable(filtered);
            });
        }
    }

    const navLinks = document.querySelectorAll("nav ul li a");
    if (navLinks.length > 0) {
        const current = window.location.pathname.split("/").pop();
        navLinks.forEach(link => {
            if (link.getAttribute("href") === current) {
                navLinks.forEach(l => l.parentElement.classList.remove("active"));
                link.parentElement.classList.add("active");
            }
        });
    }

});

document.addEventListener("keydown", function(e) {
    if (e.key === "R" && e.ctrlKey) {
        localStorage.clear();
        alert("Demo reset complete.");
        location.reload();
    }
});