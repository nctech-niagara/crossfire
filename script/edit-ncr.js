const editForm = document.getElementById("edit-ncr-form");

if (editForm) 
{
    editForm.addEventListener("submit", function (e) {e.preventDefault();
        alert("NCR saved successfully!");
    });
}