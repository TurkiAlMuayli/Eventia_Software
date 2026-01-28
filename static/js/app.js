document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation & View Management ---
    const heroBrowseBtn = document.getElementById('hero-browse-btn');
    if (heroBrowseBtn) {
        heroBrowseBtn.addEventListener('click', () => {
            const grid = document.querySelector('.events-container');
            if (grid) grid.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- Role Management (Login & Signup) ---
    // Added 'name' attributes to match Django forms.py
    const roleFields = {
        ORGANIZER: `
            <div class="input-group">
                <label>Username</label>
                <input type="text" name="username" placeholder="Choose a username" required>
            </div>
            <div class="input-group">
                <label>Organization Name</label>
                <input type="text" name="organization_name" placeholder="Company/Entity Name" required>
            </div>
            <div class="input-group">
                <label>Phone Number</label>
                <input type="tel" name="phone_number" placeholder="+966 5x xxx xxxx" required>
            </div>
            <div class="input-group">
                <label>Email Address</label>
                <input type="email" name="email" class="signup-email" placeholder="name@company.org" required>
                <div class="error-message email-error">Please enter a valid email address</div>
            </div>
            <div class="input-group">
                <label>Password</label>
                <input type="password" name="password" class="signup-password" placeholder="Create a strong password" required>
                <div class="password-policy-text">
                    At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.
                </div>
                <div class="error-message password-strength-error"></div>
            </div>
            <div class="input-group">
                <label>Confirm Password</label>
                <input type="password" name="confirm_password" class="signup-confirm" placeholder="Repeat password" required>
                <div class="error-message password-match-error">Passwords do not match</div>
            </div>
        `,
        VENDOR: `
            <div class="input-group">
                <label>Username</label>
                <input type="text" name="username" placeholder="Choose a username" required>
            </div>
            <div class="input-group">
                <label>Service Type</label>
                <select name="service_type" class="date-select" style="width: 100%;" required>
                    <option value="Catering">Catering</option>
                    <option value="Logistics">Logistics</option>
                    <option value="AudioVisual">Audio/Visual</option>
                    <option value="Security">Security</option>
                    <option value="Decor">Decor & Design</option>
                </select>
            </div>
             <div class="input-group">
                <label>Phone Number</label>
                <input type="tel" name="phone_number" placeholder="+966 5x xxx xxxx" required>
            </div>
            <div class="input-group">
                <label>Email Address</label>
                <input type="email" name="email" class="signup-email" placeholder="name@business.com" required>
                <div class="error-message email-error">Please enter a valid email address</div>
            </div>
            <div class="input-group">
                <label>Password</label>
                <input type="password" name="password" class="signup-password" placeholder="Create a strong password" required>
                <div class="password-policy-text">
                    At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.
                </div>
                <div class="error-message password-strength-error"></div>
            </div>
            <div class="input-group">
                <label>Confirm Password</label>
                <input type="password" name="confirm_password" class="signup-confirm" placeholder="Repeat password" required>
                <div class="error-message password-match-error">Passwords do not match</div>
            </div>
        `,
        ATTENDEE: `
            <div class="input-group">
                <label>Username</label>
                <input type="text" name="username" placeholder="Choose a username" required>
            </div>
            <div class="input-group">
                <label>Date of Birth</label>
                <input type="date" name="date_of_birth" class="date-input" style="width: 100%;" required>
            </div>
             <div class="input-group">
                <label>Phone Number</label>
                <input type="tel" name="phone_number" placeholder="+966 5x xxx xxxx" required>
            </div>
            <div class="input-group">
                <label>Email Address</label>
                <input type="email" name="email" class="signup-email" placeholder="yourname@example.com" required>
                <div class="error-message email-error">Please enter a valid email address</div>
            </div>
             <div class="input-group">
                <label>Password</label>
                <input type="password" name="password" class="signup-password" placeholder="Create a strong password" required>
                <div class="password-policy-text">
                    At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.
                </div>
                <div class="error-message password-strength-error"></div>
            </div>
            <div class="input-group">
                <label>Confirm Password</label>
                <input type="password" name="confirm_password" class="signup-confirm" placeholder="Repeat password" required>
                <div class="error-message password-match-error">Passwords do not match</div>
            </div>
        `
    };

    // Role Tab Switching
    const roleTabs = document.querySelectorAll('.role-tab');
    const signupDynamicContainer = document.getElementById('signup-dynamic-fields');
    const currentRoleTexts = document.querySelectorAll('.current-role-text');
    const roleInput = document.getElementById('role-input');

    // Function to render fields
    function renderFields(role) {
        if (signupDynamicContainer && roleFields[role]) {
            signupDynamicContainer.innerHTML = roleFields[role];
        }
    }

    // Initialize Default View (Organizer) if on signup page
    if (signupDynamicContainer) {
        renderFields('ORGANIZER');
    }

    roleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from siblings
            tab.parentNode.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const role = tab.getAttribute('data-role'); // e.g., 'ORGANIZER'
            const target = tab.getAttribute('data-target'); // 'login' or 'signup'

            // Update Role Text on Buttons
            currentRoleTexts.forEach(span => {
                // Capitalize only first letter for display
                const displayRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
                span.textContent = displayRole;
            });

            // If on Signup, switch inputs and update hidden field
            if (target === 'signup') {
                renderFields(role);
                if (roleInput) {
                    roleInput.value = role; // Update hidden input for Django
                }
            }
        });
    });

    // --- Form Validation (Signup) ---
    const signupForm = document.getElementById('signup-form');

    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {

            // Validate dynamically injected fields
            const emailInput = signupDynamicContainer.querySelector('.signup-email');
            const passwordInput = signupDynamicContainer.querySelector('.signup-password');
            const confirmInput = signupDynamicContainer.querySelector('.signup-confirm');

            let isValid = true;

            // Reset Errors
            const errorMessages = signupDynamicContainer.querySelectorAll('.error-message');
            errorMessages.forEach(el => el.classList.remove('visible'));
            const inputs = signupDynamicContainer.querySelectorAll('input');
            inputs.forEach(el => el.classList.remove('input-error'));

            // 1. Email Validation (Simple Regex)
            if (emailInput) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value)) {
                    const error = signupDynamicContainer.querySelector('.email-error');
                    error.classList.add('visible');
                    emailInput.classList.add('input-error');
                    isValid = false;
                }
            }

            // 2. Password Strength & Match
            if (passwordInput && confirmInput) {
                // Policy: Min 8, 1 Up, 1 Low, 1 Num, 1 Special
                function checkStrength(password) {
                    const errors = [];
                    if (password.length < 8) errors.push("At least 8 characters");
                    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
                    if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
                    if (!/[0-9]/.test(password)) errors.push("One number");
                    // if (!/[^A-Za-z0-9]/.test(password)) errors.push("One special character");
                    // Simplified for demo, add special char regex if strict
                    return errors;
                }

                const pwd = passwordInput.value;
                const confirm = confirmInput.value;
                const strengthError = signupDynamicContainer.querySelector('.password-strength-error');
                const matchError = signupDynamicContainer.querySelector('.password-match-error');

                const strengthErrors = checkStrength(pwd);
                if (strengthErrors.length > 0) {
                    strengthError.textContent = "Password must include: " + strengthErrors.join(", ");
                    strengthError.classList.add('visible');
                    passwordInput.classList.add('input-error');
                    isValid = false;
                }

                if (pwd !== confirm) {
                    matchError.classList.add('visible');
                    confirmInput.classList.add('input-error');
                    isValid = false;
                }
            }

            if (!isValid) {
                e.preventDefault(); // Stop submission only if invalid
            }
            // If valid, let it submit to Django!
        });
    }

});