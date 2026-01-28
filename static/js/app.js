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
    // ADDED: 'name' attributes to match Django forms.py
    const roleFields = {
        organizer: `
            <div class="input-group">
                <label>Username</label>
                <input type="text" name="username" placeholder="Choose a username" required>
            </div>
            <div class="input-group">
                <label>Organization Name</label>
                <input type="text" name="organization_name" placeholder="" required>
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
                    Password must include: At least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character.
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
                <label>Organization Name</label>
                <input type="text" name="organization_name" placeholder="Event Services Ltd." required>
            </div>
            <div class="input-group">
                <label>Phone Number</label>
                <input type="tel" name="phone_number" placeholder="+966 5x xxx xxxx" required>
            </div>
            <div class="input-group">
                <label>Service Type</label>
                <select name="service_type" required>
                    <option value="" disabled selected>Select Service Type</option>
                    <option value="catering">Catering</option>
                    <option value="venue">Venue</option>
                    <option value="photography">Photography</option>
                    <option value="decoration">Decoration</option>
                    <option value="other">Other</option>
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
                    Password must include: At least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character.
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
                <label>Gender</label>
                <select name="gender" required>
                    <option value="" disabled selected>Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                </select>
            </div>
            <div class="input-group">
                <label>Date of Birth</label>
                <input type="date" name="date_of_birth" class="date-input" style="width: 100%; padding: 0.8rem;" required>
            </div>
            <div class="input-group">
                <label>Password</label>
                <input type="password" name="password" class="signup-password" placeholder="Create a strong password" required>
                <div class="password-policy-text">
                    Password must include: At least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character.
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
    const roleInput = document.getElementById('role-input'); // Django Hidden Input

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
            const formContainer = document.getElementById(`${targetForm}-form-container`);
            if (formContainer) {
                const btnSpan = formContainer.querySelector('.current-role-text');
                if (btnSpan) btnSpan.textContent = role.charAt(0).toUpperCase() + role.slice(1);
            }

            // 3. If Signup, inject fully dynamic fields
            if (targetForm === 'signup' && signupDynamicContainer) {
                updateSignupFields(role);
                // Update Django hidden input
                if (roleInput) {
                    roleInput.value = role.toUpperCase();
                }
            }
        });
    });

    function updateSignupFields(role) {
        if (!signupDynamicContainer) return;
        signupDynamicContainer.style.opacity = '0';
        setTimeout(() => {
            signupDynamicContainer.innerHTML = roleFields[role] || '';
            signupDynamicContainer.style.opacity = '1';

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

        if (!passwordInput || !confirmInput) return;

        // Clear error when user starts typing again
        passwordInput.addEventListener('input', () => {
            if (passwordInput.classList.contains('input-error')) {
                const strengthError = signupDynamicContainer.querySelector('.password-strength-error');
                if (strengthError) strengthError.classList.remove('visible');
                passwordInput.classList.remove('input-error');
            }
        });

        confirmInput.addEventListener('input', () => {
            if (confirmInput.classList.contains('input-error')) {
                const matchError = signupDynamicContainer.querySelector('.password-match-error');
                if (matchError) matchError.classList.remove('visible');
                confirmInput.classList.remove('input-error');
            }
        });
    }

    // --- Form Submission Logic ---
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            // Note: We REMOVED the default preventDefault() to allow Django to work.
            // We only prevent default if validation fails.

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
                function checkStrength(password) {
                    let errors = [];
                    if (password.length < 8) errors.push("At least 8 characters");
                    if (!/[A-Z]/.test(password)) errors.push("1 uppercase letter");
                    if (!/[a-z]/.test(password)) errors.push("1 lowercase letter");
                    if (!/[0-9]/.test(password)) errors.push("1 number");
                    // if (!/[^A-Za-z0-9]/.test(password)) errors.push("and 1 special character");
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
                e.preventDefault(); // Stop submission ONLY if errors exist
            }
            // If valid, do nothing. Browser will submit form to Django.
        });
    }

});