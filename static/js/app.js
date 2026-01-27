document.addEventListener('DOMContentLoaded', () => {

    // --- HELPER: GET CSRF TOKEN FROM COOKIE ---
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');

    // --- 1. GLOBAL CONFIG & STATE ---
    const API_BASE = '/auth';
    const accessToken = localStorage.getItem('accessToken');

    // --- 2. AUTHENTICATION HANDLERS ---
    function updateUIState() {
        const guestLinks = document.getElementById('guest-nav-links');
        const userLinks = document.getElementById('user-nav-links');
        const heroCta = document.getElementById('hero-cta-btn');

        if (accessToken) {
            if (guestLinks) guestLinks.style.display = 'none';
            if (userLinks) userLinks.style.display = 'flex';
            if (heroCta) {
                heroCta.textContent = "Go to Dashboard";
                heroCta.href = "/admin/";
            }
        } else {
            if (guestLinks) guestLinks.style.display = 'flex';
            if (userLinks) userLinks.style.display = 'none';
        }
    }
    updateUIState();

    // LOGOUT LOGIC
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
    let currentRole = 'organizer';

    if (signupDynamicContainer) {
        updateSignupFields('organizer');
        roleTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tab.parentElement.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
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
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('accessToken', data.access);
                    localStorage.setItem('refreshToken', data.refresh);
                    window.location.href = '/';
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

            // 1. Gather Basic Data (Required for ALL roles)
            let formData = {
                email: document.getElementById('field-email')?.value,
                username: document.getElementById('field-username')?.value || document.getElementById('field-email')?.value.split('@')[0],
                password: document.getElementById('field-password')?.value,
                re_password: document.getElementById('field-re_password')?.value
            };

            // 2. Add Extra Fields ONLY if NOT an Attendee
            // This ensures Attendees send strictly minimal data
            if (currentRole !== 'attendee') {
                formData.role = currentRole.toUpperCase();
                formData.phone_number = document.getElementById('field-phone')?.value || '';
                formData.first_name = document.getElementById('field-name')?.value || '';
            }

            try {
                const response = await fetch(`${API_BASE}/users/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Account Created! Please Log In.');
                    window.location.href = '/login/';
                } else {
                    const data = await response.json();
                    let errorMsg = 'Signup Failed:\n';
                    for (const [key, value] of Object.entries(data)) {
                        errorMsg += `${key}: ${value}\n`;
                    }
                    alert(errorMsg);
                }
            } catch (error) {
                console.error(error);
                alert('Network Error during Signup');
            } finally {
                btn.disabled = false;
            }
        });
    }
});