const themeSwitch = document.getElementById("theme-switch");
const themeText = document.getElementById("theme-text");

themeText.textContent = "Dark Mode";

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
