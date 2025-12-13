document.addEventListener('DOMContentLoaded', () => {
    // --- LOGIC UNTUK FORM LOGIN PETUGAS ---
    const loginForm = document.getElementById('loginForm');

    // Guard clause jika form login tidak ada di halaman ini
    if (!loginForm) {
        return;
    }

    const loginButton = document.getElementById('loginButton');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessageElement = document.getElementById('errorMessage');

    const handleLogin = async (event) => {
        event.preventDefault();

        errorMessageElement.textContent = '';
        loginForm.classList.remove('shake');
        loginButton.disabled = true;
        loginButton.textContent = 'Memproses...';

        const enteredUser = emailInput.value.trim();
        const enteredPassword = passwordInput.value.trim();

        if (enteredUser === '' || enteredPassword === '') {
            errorMessageElement.textContent = 'Harap masukkan Email dan Katasandi.';
            loginForm.classList.add('shake');
            loginButton.disabled = false;
            loginButton.textContent = 'Masuk Dashboard';
            return;
        }

        // Simulasi delay jaringan
        await new Promise(resolve => setTimeout(resolve, 500));

        // Cek kredensial dari localStorage
        try {
            const users = JSON.parse(localStorage.getItem('appUsers')) || [];
            const userFound = users.find(user => 
                (user.email === enteredUser || user.username === enteredUser) && user.password === enteredPassword
            );

            if (userFound) {
                errorMessageElement.textContent = 'Login berhasil! Mengalihkan...';
                errorMessageElement.classList.remove('text-red-500');
                errorMessageElement.classList.add('text-green-500');
                
                localStorage.setItem('userDisplayName', userFound.displayName);
                localStorage.setItem('username', userFound.username);

                setTimeout(() => { window.location.href = 'beranda.html'; }, 800);
            } else {
                errorMessageElement.textContent = 'Email atau Katasandi salah.';
                loginForm.classList.add('shake');
                loginButton.disabled = false;
                loginButton.textContent = 'Masuk Dashboard';
            }
        } catch (e) {
            errorMessageElement.textContent = 'Gagal memuat data pengguna.';
            loginButton.disabled = false;
            loginButton.textContent = 'Masuk Dashboard';
            console.error("Gagal memproses data login:", e);
        }
    };

    loginForm.addEventListener('submit', handleLogin);
});