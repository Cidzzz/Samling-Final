document.addEventListener('DOMContentLoaded', () => {
    const CORRECT_PASSWORD = "admin";
    const AUTH_KEY = 'mitraPageAuthenticated';
    const AUTH_TIMESTAMP_KEY = 'mitraPageAuthTimestamp';
    const AUTH_TIMEOUT = 8 * 60 * 1000;

    const modal = document.getElementById('auth-modal');
    const pageContent = document.getElementById('page-content');
    const authForm = document.getElementById('auth-form');
    const passwordInput = document.getElementById('password-input');
    const authError = document.getElementById('auth-error');
    const togglePassword = document.getElementById('toggle-password');

    let authTimer = null;

    // Always show login on page load
    showLogin();

    // Handle form submission
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredPassword = passwordInput.value;

        if (enteredPassword === CORRECT_PASSWORD) {
            sessionStorage.setItem(AUTH_KEY, 'true');
            sessionStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
            showPageContent();
            
            // Clear any existing timer and start a new one
            if (authTimer) clearTimeout(authTimer);
            authTimer = setTimeout(logout, AUTH_TIMEOUT);

        } else {
            authError.classList.remove('hidden');
            passwordInput.classList.add('border-red-500', 'animate-shake');
            passwordInput.value = '';
            passwordInput.focus();
            // Remove animation class after it finishes
            setTimeout(() => {
                passwordInput.classList.remove('animate-shake');
            }, 500);
        }
    });

    // Toggle password visibility
    if(togglePassword) {
        togglePassword.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            togglePassword.classList.toggle('fa-eye');
            togglePassword.classList.toggle('fa-eye-slash');
        });
    }

    function showPageContent() {
        if (modal) modal.classList.add('hidden');
        if (pageContent) {
            pageContent.style.filter = 'none';
            pageContent.style.pointerEvents = 'auto';
        }
    }

    function showLogin() {
        if (modal) modal.classList.remove('hidden');
        if (pageContent) {
            pageContent.style.filter = 'blur(4px)';
            pageContent.style.pointerEvents = 'none';
        }
        if (passwordInput) {
            passwordInput.value = '';
            passwordInput.focus();
        }
    }
    
    function logout() {
        sessionStorage.removeItem(AUTH_KEY);
        sessionStorage.removeItem(AUTH_TIMESTAMP_KEY);
        if(authTimer) clearTimeout(authTimer);
        showLogin();
    }
});
