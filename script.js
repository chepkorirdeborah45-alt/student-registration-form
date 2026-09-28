const form = document.getElementById("studentForm");
const message = document.getElementById("formMessage");
const dob = document.getElementById("dob");
const submitButton = form.querySelector(
    'button[type="submit"]'
);

// Set today's date as the maximum date of birth.
const today = new Date();

const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().slice(0, 10);

dob.max = localToday;


// Display validation error
function showError(input, text) {
    const field = input.closest(".field");

    field.classList.add("invalid");
    field.querySelector(".error").textContent = text;

    input.setAttribute("aria-invalid", "true");
}


// Clear validation error
function clearError(input) {
    const field = input.closest(".field");

    field.classList.remove("invalid");
    field.querySelector(".error").textContent = "";

    input.removeAttribute("aria-invalid");
}


// Validate individual input
function validate(input) {
    const value = input.value.trim();
    let error = "";

    // Required fields
    if (input.required && !value) {
        error = "This field is required.";
    }

    // Student ID validation
    else if (
        input.id === "studentId" &&
        value &&
        !/^[A-Za-z0-9-]{3,20}$/.test(value)
    ) {
        error = "Use 3–20 letters, numbers, or hyphens.";
    }

    // Name validation
    else if (
        ["firstName", "lastName"].includes(input.id) &&
        value &&
        !/^[\p{L}][\p{L} .'-]{1,49}$/u.test(value)
    ) {
        error = "Enter a valid name.";
    }

    // Email validation
    else if (
        input.type === "email" &&
        value &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
    ) {
        error = "Enter a valid email address.";
    }

    // Phone validation
    else if (
        input.id === "phone" &&
        value &&
        !/^\+?[0-9][0-9 ()-]{5,23}[0-9]$/.test(value)
    ) {
        error = "Enter a valid phone number.";
    }

    // Date of birth validation
    else if (
        input.id === "dob" &&
        value &&
        value > localToday
    ) {
        error = "Date of birth cannot be in the future.";
    }

    // Minimum length validation
    else if (
        input.minLength > 0 &&
        value &&
        value.length < input.minLength
    ) {
        error = `Enter at least ${input.minLength} characters.`;
    }

    if (error) {
        showError(input, error);
        return false;
    }

    clearError(input);
    return true;
}


// Get all input fields
const fields = [
    ...form.querySelectorAll("input, select")
];


// Validate fields when the user leaves them
fields.forEach(input => {

    input.addEventListener("blur", () => {
        validate(input);
    });

    input.addEventListener("input", () => {
        if (
            input.closest(".field").classList.contains("invalid")
        ) {
            validate(input);
        }

        message.hidden = true;
    });

    input.addEventListener("change", () => {
        validate(input);
        message.hidden = true;
    });

});


// Show success or error message
function showMessage(text, isError = false) {
    message.textContent = text;

    message.classList.toggle(
        "error-message",
        isError
    );

    message.hidden = false;
}


// Submit the form
form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Validate all fields
    const isValid = fields
        .map(input => validate(input))
        .every(Boolean);

    // Stop if there are validation errors
    if (!isValid) {
        const firstInvalid = form.querySelector(
            '[aria-invalid="true"]'
        );

        firstInvalid?.focus();
        return;
    }

    // Collect student data
    const student = Object.fromEntries(
        new FormData(form).entries()
    );

    // Disable button during submission
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    try {
        /*
          Replace this endpoint with your backend URL
          when your PHP or Node.js API is ready.
        */

        const response = await fetch("/api/students", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(student)
        });

        if (!response.ok) {
            throw new Error("Registration failed.");
        }

        const result = await response.json();

        // Show success message
        showMessage(
            result.message || "Student registered successfully!"
        );

        // Clear form after successful registration
        form.reset();

    } catch (error) {
        console.error(error);

        showMessage(
            "Unable to register student. Please try again.",
            true
        );

    } finally {
        // Enable button again
        submitButton.disabled = false;
        submitButton.textContent = "Register Student";
    }
});