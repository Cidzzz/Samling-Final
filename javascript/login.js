
        // Mendapatkan elemen form
        const loginForm = document.getElementById('loginForm');
        const loginButton = document.getElementById('loginButton');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const errorMessageElement = document.getElementById('errorMessage');

        // Fungsi untuk menangani proses login
        async function handleLogin(event) {
            event.preventDefault();

            // Reset UI
            errorMessageElement.textContent = '';
            loginForm.classList.remove('shake');
            loginButton.disabled = true;
            loginButton.innerHTML = '<span class="spinner"></span>'; // Tampilkan spinner

            const enteredUser = emailInput.value.trim();
            const enteredPassword = passwordInput.value.trim();

            // 1. Cek jika ada input yang kosong
            if (enteredUser === '' || enteredPassword === '') {
                errorMessageElement.textContent = 'Harap masukkan Email/Nama Pengguna dan Katasandi.';
                loginForm.classList.add('shake');
                if (enteredUser === '') emailInput.focus();
                else passwordInput.focus();
                
                // Kembalikan tombol ke state semula
                loginButton.disabled = false;
                loginButton.innerHTML = 'Masuk';
                return;
            }

            // Simulasi delay untuk UX
            await new Promise(resolve => setTimeout(resolve, 500));

            // 2. Cek kredensial
            const users = JSON.parse(localStorage.getItem('appUsers')) || [];
            const userFound = users.find(user => 
                (user.email === enteredUser || user.username === enteredUser) && user.password === enteredPassword
            );

            if (userFound) {
                // --- KREDENSIAL BENAR ---
                errorMessageElement.textContent = 'Login berhasil! Mengalihkan...';
                errorMessageElement.classList.remove('text-red-500');
                errorMessageElement.classList.add('text-green-500');
                
                // Simpan nama tampilan pengguna di localStorage
                localStorage.setItem('userDisplayName', userFound.displayName);
                localStorage.setItem('username', userFound.username);

                // Alihkan ke halaman beranda setelah jeda singkat
                setTimeout(() => {
                    window.location.href = 'beranda.html'; 
                }, 800);

            } else {
                // --- KREDENSIAL SALAH ---
                errorMessageElement.classList.remove('text-green-500');
                errorMessageElement.classList.add('text-red-500');
                errorMessageElement.textContent = 'Email/Nama Pengguna atau Katasandi salah. Silakan coba lagi.';
                
                // Tambahkan animasi getar pada form
                loginForm.classList.add('shake');

                // Kembalikan tombol ke state semula
                loginButton.disabled = false;
                loginButton.innerHTML = 'Masuk';
                
                // Kosongkan input dan fokus kembali
                emailInput.value = '';
                passwordInput.value = '';
                emailInput.focus();
            }
        }

        // Menambahkan event listener ke form
        loginForm.addEventListener('submit', handleLogin);
        