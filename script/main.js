const themeSwitch = document.getElementById("theme-switch");
const themeText = document.getElementById("theme-text");

themeText.textContent = "Dark Mode";

let url = "/data/data.json";
let ncrLogs = [];

$.getJSON(url, function (ncrLogsData) {
	ncrLogs = ncrLogsData;
	populateTable(ncrLogs);
});

// Populate all log data
function populateTable(logs) {
	let rowsHome = "";
	let rows = "";

	$.each(logs.slice(0, 5), function (_, log) {
		rowsHome += `
      <tr>
        <td>${log.ncrNumber}</td>
        <td>${log.createdOn}</td>
        <td>${log.supplier}</td>
        <td><span class="status ${log.status.toLowerCase()}">${
			log.status
		}</span></td>
        <td><a href="edit-ncr.html?ncr=${log.ncrNumber}">View/Edit</a></td>
      </tr>
    `;
	});
	$.each(logs, function (_, log) {
		rows += `
      <tr>
        <td>${log.ncrNumber}</td>
        <td>${log.createdOn}</td>
        <td>${log.supplier}</td>
        <td><span class="status ${log.status.toLowerCase()}">${
			log.status
		}</span></td>
        <td><a href="edit-ncr.html?ncr=${log.ncrNumber}">View/Edit</a></td>
      </tr>
    `;
	});

	$("#ncr-logs-table-home").html(rowsHome);
	$("#ncr-logs-table").html(rows);
}

$("#search-logs").on("keyup", function () {
	let value = $(this).val().toLowerCase();
	let filtered = ncrLogs.filter(
		(log) =>
			log.ncrNumber.toLowerCase().includes(value) ||
			log.supplier.toLowerCase().includes(value) ||
			log.status.toLowerCase().includes(value)
	);
	populateTable(filtered);
});
$("#status").on("change", function () {
	let value = $(this).val().toLowerCase();
	let filtered;

	value === "all"
		? (filtered = ncrLogs)
		: (filtered = ncrLogs.filter((log) => log.status.toLowerCase() === value));

	populateTable(filtered);
});

//Light and dark mode switch
themeSwitch.addEventListener("change", () => {
	const isDark = themeSwitch.checked;
	document.body.classList.toggle("dark", themeSwitch.checked);
	themeText.textContent = isDark ? "Light Mode" : "Dark Mode";
});

//Navigation
document.addEventListener("DOMContentLoaded", () => {
	const navLinks = document.querySelectorAll("nav ul li a");
	const currentPath = window.location.pathname.split("/").pop();

	navLinks.forEach((link) => {
		const linkPath = link.getAttribute("href");

		if (linkPath === currentPath) {
			navLinks.forEach((l) => l.parentElement.classList.remove("active"));
			link.parentElement.classList.add("active");
		}
	});
});
