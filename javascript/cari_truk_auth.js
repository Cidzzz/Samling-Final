// FUNGSI UNTUK MENGELOLA OTENTIKASI PADA HALAMAN CARI TRUK

const CORRECT_PASSWORD_TRUK = "admin"; 

// Inisialisasi variabel-variabel terkait otentikasi
let authModal;
let pageContent;
let authForm;
let passwordInput;
let authError;
let togglePassword;
let afterAuthCallback = null;

// Event listener yang dijalankan setelah semua elemen DOM dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Mengambil elemen-elemen dari DOM
    authModal = document.getElementById('auth-modal');
    pageContent = document.querySelector('main'); 
    authForm = document.getElementById('auth-form');
    passwordInput = document.getElementById('password-input');
    authError = document.getElementById('auth-error');
    togglePassword = document.getElementById('toggle-password');

    // Mencegah otentikasi otomatis saat halaman dimuat
    // Fungsi otentikasi akan dipanggil secara manual
});

// Fungsi untuk menangani proses otentikasi
function handleCariTrukAuth(callback) {
    afterAuthCallback = callback; // Simpan callback untuk dieksekusi setelah login berhasil
    showLoginModal();
}

// Menampilkan modal login
function showLoginModal() {
    if (authModal) authModal.classList.remove('hidden');
    if (pageContent) {
        pageContent.style.filter = 'blur(4px)';
        pageContent.style.pointerEvents = 'none';
    }
    if (passwordInput) {
        passwordInput.value = '';
        passwordInput.focus();
    }

    // Tambahkan event listener untuk form hanya saat modal ditampilkan
    if (authForm) {
        authForm.onsubmit = handleFormSubmit;
    }
    if (togglePassword) {
        togglePassword.onclick = handleTogglePassword;
    }
}

// Menyembunyikan modal login dan menampilkan konten halaman
function showPageContent() {
    if (authModal) authModal.classList.add('hidden');
    if (pageContent) {
        pageContent.style.filter = 'none';
        pageContent.style.pointerEvents = 'auto';
    }
}

// Menangani submit form login
function handleFormSubmit(e) {
    e.preventDefault();
    const enteredPassword = passwordInput.value;

    if (enteredPassword === CORRECT_PASSWORD_TRUK) {
        // Jika password benar
        showPageContent();
        
        // Eksekusi callback jika ada
        if (afterAuthCallback) {
            afterAuthCallback();
            afterAuthCallback = null; // Hapus callback
        }
        
    } else {
        // Jika password salah
        authError.classList.remove('hidden');
        passwordInput.classList.add('border-red-500', 'animate-shake');
        passwordInput.value = '';
        passwordInput.focus();
        setTimeout(() => {
            passwordInput.classList.remove('animate-shake');
        }, 500);
    }
}

// Mengatur visibilitas password
function handleTogglePassword() {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');
}