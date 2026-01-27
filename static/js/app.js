document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. GLOBAL CONFIG & STATE ---
    const API_BASE = '/auth'; // Relative path since frontend is inside Django
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    // --- 2. AUTHENTICATION HANDLERS ---

    // A. UPDATE UI BASED ON AUTH STATE
    function updateUIState() {
        const guestLinks = document.getElementById('guest-nav-links');
        const userLinks = document.getElementById('user-nav-links');
        const heroCta = document.getElementById('hero-cta-btn');

        if (accessToken) {
            // User is Logged In
            if (guestLinks) guestLinks.style.display = 'none';
            if (userLinks) {
                userLinks.style.display = 'flex';
                // Optional: Decode token to get username if you want
            }
            if (heroCta) {
                heroCta.textContent = "Go to Dashboard";
                heroCta.href = "#"; // Dashboard link
            }
        } else {
            // User is Guest
            if (guestLinks) guestLinks.style.display = 'flex';
            if (userLinks) userLinks.style.display = 'none';
        }
    }
    
    // Run UI update immediately
    updateUIState();

    // B. LOGOUT LOGIC
    const logoutBtn = document.getElementById('nav-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/';
        });
    }

    // --- 3. DYNAMIC FORMS (SIGNUP) ---
    // (Keep your existing HTML strings for roleFields here, just ensured they have name attributes or classes for selection)
    
    const roleFields = {
        organizer: `
            <div class="input-group">
                <label>Full Name</label>
                <input type="text" id="field-name" placeholder="Abdulrahman Alghanmi" required>
            </div>
            <div class="input-group">
                <label>Phone Number</label>
                <input type="tel" id="field-phone" placeholder="+966 5x xxx xxxx" required>
            </div>
            <div class="input-group">
                <label>Email Address</label>
                <input type="email" class="signup-email" id="field-email" placeholder="name@company.com" required>
            </div>
            <div class="input-group">
                <label>Password</label>
                <input type="password" class="signup-password" id="field-password" placeholder="Create a strong password" required>
            </div>
            <div class="input-group">
                <label>Confirm Password</label>
                <input type="password" class="signup-confirm-password" id="field-re_password" placeholder="Re-enter password" required>
            </div>
        `,
        vendor: `
            <div class="input-group">
                <label>Organization Name</label>
                <input type="text" id="field-name" placeholder="Event Services Ltd." required>
            </div>
            <div class="input-group">
                <label>Service Type</label>
                <select id="field-service_type" style="width: 100%; padding: 0.8rem;">
                    <option value="catering">Catering</option>
                    <option value="venue">Venue</option>
                </select>
            </div>
             <div class="input-group">
                <label>Email Address</label>
                <input type="email" class="signup-email" id="field-email" placeholder="name@company.com" required>
            </div>
            <div class="input-group">
                <label>Password</label>
                <input type="password" class="signup-password" id="field-password" placeholder="Create a strong password" required>
            </div>
            <div class="input-group">
                <label>Confirm Password</label>
                <input type="password" class="signup-confirm-password" id="field-re_password" placeholder="Re-enter password" required>
            </div>
        `,
        attendee: `
            <div class="input-group">
                <label>Username</label>
                <input type="text" id="field-username" placeholder="abdulrahman123" required>
            </div>
            <div class="input-group">
                <label>Email Address</label>
                <input type="email" class="signup-email" id="field-email" placeholder="abdulrahman@example.com" required>
            </div>
            <div class="input-group">
                <label>Password</label>
                <input type="password" class="signup-password" id="field-password" placeholder="Create a strong password" required>
            </div>
            <div class="input-group">
                <label>Confirm Password</label>
                <input type="password" class="signup-confirm-password" id="field-re_password" placeholder="Re-enter password" required>
            </div>
        `
    };

    const signupDynamicContainer = document.getElementById('signup-dynamic-fields');
    const roleTabs = document.querySelectorAll('.role-tab');
    let currentRole = 'organizer'; // Default

    // Initialize Signup
    if (signupDynamicContainer) {
        updateSignupFields('organizer');
        
        // Tab Switching Logic
        roleTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update Visuals
                tab.parentElement.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update State & Content
                currentRole = tab.dataset.role;
                if (tab.dataset.target === 'signup') {
                    updateSignupFields(currentRole);
                    const btnSpan = document.querySelector('#signup-form-container .current-role-text');
                    if(btnSpan) btnSpan.textContent = currentRole.charAt(0).toUpperCase() + currentRole.slice(1);
                }
            });
        });
    }

    function updateSignupFields(role) {
        if (!signupDynamicContainer) return;
        signupDynamicContainer.innerHTML = roleFields[role] || '';
    }


    // --- 4. FORM SUBMISSION LOGIC ---

    // A. LOGIN SUBMIT
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = loginForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = "Signing In...";
            btn.disabled = true;

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch(`${API_BASE}/jwt/create/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }) // Note: Djoser usually requires 'username' unless configured for email
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('accessToken', data.access);
                    localStorage.setItem('refreshToken', data.refresh);
                    window.location.href = '/'; // Redirect Home
                } else {
                    alert('Login Failed: ' + (data.detail || 'Invalid credentials'));
                }
            } catch (error) {
                console.error(error);
                alert('Network Error');
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }

    // B. SIGNUP SUBMIT
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = signupForm.querySelector('button[type="submit"]');
            btn.disabled = true;

            // 1. Gather Data based on Dynamic Inputs
            // We select elements by the IDs we added in the HTML strings above
            const formData = {
                email: document.getElementById('field-email')?.value,
                password: document.getElementById('field-password')?.value,
                re_password: document.getElementById('field-re_password')?.value,
                username: document.getElementById('field-username')?.value || document.getElementById('field-email')?.value.split('@')[0], // Fallback username
                // Extra fields (These will be ignored by default Djoser User model unless you customized it)
                role: currentRole, 
                phone: document.getElementById('field-phone')?.value || '',
                full_name: document.getElementById('field-name')?.value || ''
            };

            try {
                const response = await fetch(`${API_BASE}/users/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Account Created! Please Log In.');
                    window.location.href = '/login/';
                } else {
                    const data = await response.json();
                    let errorMsg = 'Signup Failed:\n';
                    // Parse Django Error Object
                    for (const [key, value] of Object.entries(data)) {
                        errorMsg += `${key}: ${value}\n`;
                    }
                    alert(errorMsg);
                }
            } catch (error) {
                alert('Network Error during Signup');
            } finally {
                btn.disabled = false;
            }
        });
    }
});