const themeSwitch = document.getElementById("theme-switch");
const themeText = document.getElementById("theme-text");

themeText.textContent = "Dark Mode";

themeSwitch.addEventListener("change", () => {
	const isDark = themeSwitch.checked;
	document.body.classList.toggle("dark", themeSwitch.checked);
	themeText.textContent = isDark ? "Light Mode" : "Dark Mode";
});
