document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation & View Management ---
    // Note: Routing is now handled by multi-page structure (index.html, login.html, signup.html)

    const heroBrowseBtn = document.getElementById('hero-browse-btn');

    if (heroBrowseBtn) {
        heroBrowseBtn.addEventListener('click', () => {
            const grid = document.querySelector('.events-container');
            if (grid) grid.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- Role Management (Login & Signup) ---
    const roleFields = {
        organizer: `
            <div class="input-group">
                <label>Username</label>
                <input type="text" name="username" placeholder="Choose a username" required>
            </div>
            <div class="input-group">
                <label>Organization Name</label>
                <input type="text" name="organization_name" placeholder="Company Name" required>
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
                <input type="password" name="confirm_password" class="signup-confirm-password" placeholder="Re-enter password" required>
                <div class="error-message password-match-error">Passwords do not match</div>
            </div>
        `,
        vendor: `
            <div class="input-group">
                <label>Username</label>
                <input type="text" name="username" placeholder="Choose a username" required>
            </div>
            <div class="input-group">
                <label>Phone Number</label>
                <input type="tel" name="phone_number" placeholder="+966 5x xxx xxxx" required>
            </div>
            <div class="input-group">
                <label>Service Type</label>
                <select name="service_type" style="width: 100%; padding: 0.8rem 1rem; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 1rem; background: transparent;">
                    <option value="Catering">Catering</option>
                    <option value="Venue">Venue</option>
                    <option value="Photography">Photography</option>
                    <option value="Decoration">Decoration</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="input-group">
                <label>Email Address</label>
                <input type="email" name="email" class="signup-email" placeholder="contact@vendor.com" required>
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
                <input type="password" name="confirm_password" class="signup-confirm-password" placeholder="Re-enter password" required>
                <div class="error-message password-match-error">Passwords do not match</div>
            </div>
        `,
        attendee: `
            <div class="input-group">
                <label>Username</label>
                <input type="text" name="username" placeholder="abdulrahman123" required>
            </div>
            <div class="input-group">
                <label>Email Address</label>
                <input type="email" name="email" class="signup-email" placeholder="name@example.com" required>
                <div class="error-message email-error">Please enter a valid email address</div>
            </div>
            <div class="input-group">
                <label>Phone Number</label>
                <input type="tel" name="phone_number" placeholder="+966 5x xxx xxxx" required>
            </div>
            <div class="input-group">
                <label>Date of Birth</label>
                <input type="date" name="date_of_birth" class="date-input" style="width: 100%; padding: 0.8rem;" required>
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
                <input type="password" name="confirm_password" class="signup-confirm-password" placeholder="Re-enter password" required>
                <div class="error-message password-match-error">Passwords do not match</div>
            </div>
        `
    };

    const roleTabs = document.querySelectorAll('.role-tab');
    const signupDynamicContainer = document.getElementById('signup-dynamic-fields');

    // Initialize Signup Fields
    if (signupDynamicContainer) updateSignupFields('organizer');

    roleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetForm = tab.dataset.target; // 'login' or 'signup'
            const role = tab.dataset.role;

            // 1. Update Tabs Visual State
            const parent = tab.parentElement;
            if (parent) {
                parent.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
            }
            tab.classList.add('active');

            // 2. Update Submit Button Text
            const formContainer = document.getElementById(${targetForm}-form-container);
            if (formContainer) {
                const btnSpan = formContainer.querySelector('.current-role-text');
                if (btnSpan) btnSpan.textContent = role.charAt(0).toUpperCase() + role.slice(1);
            }

            // 3. If Signup, inject fully dynamic fields
            if (targetForm === 'signup' && signupDynamicContainer) {
                updateSignupFields(role);
            }
        });
    });

    function updateSignupFields(role) {
        if (!signupDynamicContainer) return;
        signupDynamicContainer.style.opacity = '0';
        setTimeout(() => {
            signupDynamicContainer.innerHTML = roleFields[role] || '';
            signupDynamicContainer.style.opacity = '1';

            // Populate Year Dropdown if attendee
            if (role === 'attendee') {
                const yearSelect = signupDynamicContainer.querySelector('.year-select');
                if (yearSelect) {
                    const currentYear = new Date().getFullYear();
                    const startYear = 1900;
                    for (let i = currentYear; i >= startYear; i--) {
                        const option = document.createElement('option');
                        option.value = i;
                        option.textContent = i;
                        yearSelect.appendChild(option);
                    }
                }
            }

            // Attach Password Validators after injection
            attachPasswordValidators();
            attachEmailCleaners();

        }, 200);
    }

    function attachEmailCleaners() {
        const emailInput = signupDynamicContainer.querySelector('.signup-email');
        if (emailInput) {
            emailInput.addEventListener('input', () => {
                if (emailInput.classList.contains('input-error')) {
                    const emailError = signupDynamicContainer.querySelector('.email-error');
                    if (emailError) emailError.classList.remove('visible');
                    emailInput.classList.remove('input-error');
                }
            });
        }
    }

    function attachPasswordValidators() {
        const passwordInput = signupDynamicContainer.querySelector('.signup-password');
        const confirmInput = signupDynamicContainer.querySelector('.signup-confirm-password');
        const strengthError = signupDynamicContainer.querySelector('.password-strength-error');
        const matchError = signupDynamicContainer.querySelector('.password-match-error');
        const submitButton = document.querySelector('#signup-form button[type="submit"]');

        if (!passwordInput || !confirmInput) return;

        function checkStrength(password) {
            let errors = [];
            if (password.length < 8) errors.push("At least 8 characters");
            if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
            if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
            if (!/[0-9]/.test(password)) errors.push("One number");
            if (!/[^A-Za-z0-9]/.test(password)) errors.push("One special character");
            return errors;
        }

        function validate() {
            const pwd = passwordInput.value;
            const confirm = confirmInput.value;
            let isValid = true;

            // Strength Check
            const strengthErrors = checkStrength(pwd);
            if (pwd && strengthErrors.length > 0) {
                strengthError.textContent = "Password must include: " + strengthErrors.join(", ");
                strengthError.classList.add('visible');
                passwordInput.classList.add('input-error');
                passwordInput.classList.remove('input-success');
                isValid = false;
            } else {
                strengthError.classList.remove('visible');
                if (pwd) {
                    passwordInput.classList.remove('input-error');
                    passwordInput.classList.add('input-success');
                } else {
                    passwordInput.classList.remove('input-success'); // reset if empty
                }
            }

            // Match Check
            if (confirm && pwd !== confirm) {
                matchError.classList.add('visible');
                confirmInput.classList.add('input-error');
                confirmInput.classList.remove('input-success');
                isValid = false;
            } else {
                matchError.classList.remove('visible');
                if (confirm) {
                    confirmInput.classList.remove('input-error');
                    confirmInput.classList.add('input-success');
                } else {
                    confirmInput.classList.remove('input-success');
                }
            }

            // Also disable submit if invalid (optional, but good UX)
            // submitButton.disabled = !isValid;
            return isValid;
        }

        // Validate on Blur (when user leaves the field)
        // REMOVED per user request - only validate on submit
        // passwordInput.addEventListener('blur', validate);
        // confirmInput.addEventListener('blur', validate);

        // Clear error when user starts typing again (to remove the red text while they are fixing it)
        passwordInput.addEventListener('input', () => {
            if (passwordInput.classList.contains('input-error')) {
                const strengthError = signupDynamicContainer.querySelector('.password-strength-error');
                strengthError.classList.remove('visible');
                passwordInput.classList.remove('input-error');
            }
        });

        confirmInput.addEventListener('input', () => {
            if (confirmInput.classList.contains('input-error')) {
                const matchError = signupDynamicContainer.querySelector('.password-match-error');
                matchError.classList.remove('visible');
                confirmInput.classList.remove('input-error');
            }
        });

        // Validate on Submit
        const form = document.getElementById('signup-form');
        if (form) {
            // Remove any existing listener to prevent duplicates if function called multiple times
            // Note: In this simple structure, we are relying on 'signupForm' event listener at bottom.
            // But we need to intercept it.
            // Better approach: Let the global submit listener call a validation check.
            form.setAttribute('novalidate', true); // Disable browser default
        }
    }

    // Form Submit Mock
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Login functionality would trigger here!");
        });
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Trigger validation on all password fields before submitting
            const passwordInput = signupDynamicContainer.querySelector('.signup-password');
            const confirmInput = signupDynamicContainer.querySelector('.signup-confirm-password');
            const emailInput = signupDynamicContainer.querySelector('.signup-email');

            let isValid = true;

            // Email Validation
            if (emailInput) {
                const email = emailInput.value;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const emailError = signupDynamicContainer.querySelector('.email-error');

                if (!emailRegex.test(email)) {
                    if (emailError) emailError.classList.add('visible');
                    emailInput.classList.add('input-error');
                    isValid = false;
                }
            }

            // Password Validation
            if (passwordInput && confirmInput) {
                // We can manually trigger the blur event or call logic that creates the errors
                // But simply checking validity is better.
                function checkStrength(password) {
                    let errors = [];
                    if (password.length < 8) errors.push("At least 8 characters");
                    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
                    if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
                    if (!/[0-9]/.test(password)) errors.push("One number");
                    if (!/[^A-Za-z0-9]/.test(password)) errors.push("One special character");
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

            if (isValid) {
                alert("Signup functionality would trigger here!");
            }
        });
    }

});