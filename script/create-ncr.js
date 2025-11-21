const submitbtn = document.getElementById("submitbtn")
const createform = document.getElementById("create-ncr-form")
src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"

//emailjs API KEY here
//emailjs.init(""); 

function sendEmail() {
    emailjs.send("SERVICE_ID", {
        subject: "EXAMPLE",
        message: "An NCR is ready to be filled out."
    });
}

createform.addEventListener("submit", function(event) {

    if (!this.checkValidity()) {
        return;
    }
    //sendEmail()

    alert("Your form had been validated and submitted successfully! a notification has been sent to an engeneer!");
});

