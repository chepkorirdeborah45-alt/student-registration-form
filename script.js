const form = document.getElementById("registrationForm");

const formMessage = document.getElementById("formMessage");


form.addEventListener("submit", function(event) {

    event.preventDefault();


    const studentId = document.getElementById("studentId").value.trim();

    const firstName = document.getElementById("firstName").value.trim();

    const lastName = document.getElementById("lastName").value.trim();

    const gender = document.getElementById("gender").value;

    const dateOfBirth = document.getElementById("dateOfBirth").value;

    const phone = document.getElementById("phone").value.trim();

    const email = document.getElementById("email").value.trim();

    const course = document.getElementById("course").value;

    const year = document.getElementById("year").value;


    let errors = [];


    if (studentId === "") {
        errors.push("Student ID is required.");
    }

    if (firstName === "") {
        errors.push("First name is required.");
    }

    if (lastName === "") {
        errors.push("Last name is required.");
    }

    if (gender === "") {
        errors.push("Please select your gender.");
    }

    if (dateOfBirth === "") {
        errors.push("Date of birth is required.");
    }


    const phonePattern = /^[0-9]{10}$/;

    if (!phonePattern.test(phone)) {
        errors.push("Phone number must contain exactly 10 digits.");
    }


    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        errors.push("Please enter a valid email address.");
    }


    if (course === "") {
        errors.push("Please select a course.");
    }

    if (year === "") {
        errors.push("Please select your year of study.");
    }


    if (errors.length > 0) {

        formMessage.innerHTML = errors
            .map(error => `<p>${error}</p>`)
            .join("");

        formMessage.className = "error";

        return;
    }


    formMessage.textContent = "Student registered successfully!";

    formMessage.className = "success";

});