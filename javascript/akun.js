document.addEventListener('DOMContentLoaded', () => {
    const displayProfileName = document.getElementById("displayProfileName");
    const profileAvatar = document.getElementById("profileAvatar");

    // Load user data from localStorage
    const savedDisplayName = localStorage.getItem('userDisplayName');
    if (savedDisplayName) {
        displayProfileName.textContent = savedDisplayName;
    }

    const savedAvatarUrl = localStorage.getItem('userAvatarUrl');
    if (savedAvatarUrl) {
        profileAvatar.src = savedAvatarUrl;
    }

        // --- MODAL LOGIC HELPER ---
        function toggleModal(modalId, show) {
            const modal = document.getElementById(modalId);
            if (show) {
                modal.classList.remove("hidden");
                document.body.style.overflow = 'hidden';
            } else {
                modal.classList.add("hidden");
                document.body.style.overflow = 'auto';
            }
        }

        // --- 1. EDIT PROFIL MODAL ---
        const btnEditProfil = document.getElementById("btnEditProfil");
        const btnSimpanProfil = document.getElementById("btnSimpanProfil");
        const inputDisplayName = document.getElementById("inputDisplayName");
        const avatarRadios = document.querySelectorAll('input[name="avatarSelect"]');
        const modalPreviewAvatar = document.getElementById("modalPreviewAvatar");
        const fileInput = document.getElementById("fileInput");
        let tempAvatarUrl = ""; 

        btnEditProfil.addEventListener("click", () => {
            inputDisplayName.value = displayProfileName.textContent;
            tempAvatarUrl = profileAvatar.src;
            modalPreviewAvatar.src = tempAvatarUrl;
            avatarRadios.forEach(radio => {
                radio.checked = (radio.value === tempAvatarUrl);
            });
            toggleModal("editProfilModal", true);
        });

        document.getElementById("closeEditModal").addEventListener("click", () => toggleModal("editProfilModal", false));
        document.getElementById("editModalBackdrop").addEventListener("click", () => toggleModal("editProfilModal", false));

        // Avatar Change Logic
        avatarRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if(e.target.checked) {
                    tempAvatarUrl = e.target.value;
                    modalPreviewAvatar.src = tempAvatarUrl;
                }
            });
        });
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    tempAvatarUrl = event.target.result;
                    modalPreviewAvatar.src = tempAvatarUrl;
                    avatarRadios.forEach(r => r.checked = false);
                }
                reader.readAsDataURL(file);
            }
        });

        btnSimpanProfil.addEventListener("click", () => {
            const newName = inputDisplayName.value.trim();
            if(!newName) { alert("Nama tidak boleh kosong!"); return; }
            localStorage.setItem('userDisplayName', newName);
            localStorage.setItem('userAvatarUrl', tempAvatarUrl);
            displayProfileName.textContent = newName;
            profileAvatar.src = tempAvatarUrl;
            toggleModal("editProfilModal", false);
            alert("Profil berhasil disimpan!");
        });

        // --- 2. TENTANG SAMLING MODAL (BARU) ---
        const btnTentang = document.getElementById("btnTentang");
        btnTentang.addEventListener("click", () => toggleModal("tentangModal", true));
        document.getElementById("closeTentang").addEventListener("click", () => toggleModal("tentangModal", false));
        document.getElementById("tentangBackdrop").addEventListener("click", () => toggleModal("tentangModal", false));

        // --- 4. UBAH SANDI MODAL ---
        const btnUbahSandi = document.getElementById("btnUbahSandi");
        btnUbahSandi.addEventListener("click", () => toggleModal("ubahSandiModal", true));
        document.getElementById("closeUbahSandiModal").addEventListener("click", () => toggleModal("ubahSandiModal", false));
        document.getElementById("ubahSandiBackdrop").addEventListener("click", () => toggleModal("ubahSandiModal", false));

        const ubahSandiForm = document.getElementById("ubahSandiForm");
        ubahSandiForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const sandiLama = document.getElementById("sandiLama").value;
            const sandiBaru = document.getElementById("sandiBaru").value;
            const konfirmasiSandiBaru = document.getElementById("konfirmasiSandiBaru").value;

            if (!sandiLama || !sandiBaru || !konfirmasiSandiBaru) {
                alert("Semua field harus diisi!");
                return;
            }

            if (sandiBaru !== konfirmasiSandiBaru) {
                alert("Konfirmasi sandi baru tidak cocok!");
                return;
            }

            const loggedInUsername = localStorage.getItem('username');
            let users = JSON.parse(localStorage.getItem('appUsers'));
            const userIndex = users.findIndex(user => user.username === loggedInUsername);

            if (userIndex === -1) {
                alert("Error: Pengguna tidak ditemukan.");
                return;
            }

            if (users[userIndex].password !== sandiLama) {
                alert("Kata sandi lama salah!");
                return;
            }

            users[userIndex].password = sandiBaru;
            localStorage.setItem('appUsers', JSON.stringify(users));
            alert("Kata sandi berhasil diubah! Anda akan dialihkan ke halaman login.");
            window.location.href = 'login.html';
        });

        // --- 3. LOGOUT MODAL ---
        const logoutBtn = document.getElementById("logoutBtn");
        logoutBtn.addEventListener("click", () => toggleModal("logoutModal", true));
        document.getElementById("cancelLogout").addEventListener("click", () => toggleModal("logoutModal", false));
        document.getElementById("modalBackdrop").addEventListener("click", () => toggleModal("logoutModal", false));
});
