document.addEventListener('DOMContentLoaded', function() {
    // Toggle sidebar on mobile
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const body = document.body;
    
    // Fonction pour fermer la sidebar
    function closeSidebar() {
        sidebar.classList.remove('active');
        body.classList.remove('sidebar-open');
    }
    
    // Fonction pour ouvrir la sidebar
    function openSidebar() {
        sidebar.classList.add('active');
        body.classList.add('sidebar-open');
    }
    
    // Toggle sidebar
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (sidebar.classList.contains('active')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }
    
    // Fermer la sidebar lorsqu'on clique à l'extérieur sur mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 992 && sidebar.classList.contains('active')) {
            // Vérifier si le clic est en dehors de la sidebar et du bouton toggle
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnToggle = sidebarToggle && sidebarToggle.contains(event.target);
            
            if (!isClickInsideSidebar && !isClickOnToggle) {
                closeSidebar();
            }
        }
    });
    
    // Fermer la sidebar lorsqu'on redimensionne la fenêtre au-delà de 992px
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });
    
    // Password strength indicator
    const passwordInput = document.getElementById('password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (passwordInput && strengthBar && strengthText) {
        passwordInput.addEventListener('input', function() {
            const password = passwordInput.value;
            let strength = 0;
            
            if (password.length > 6) strength += 1;
            if (password.length > 10) strength += 1;
            if (/[A-Z]/.test(password)) strength += 1;
            if (/[0-9]/.test(password)) strength += 1;
            if (/[^A-Za-z0-9]/.test(password)) strength += 1;
            
            switch (strength) {
                case 0:
                    strengthBar.style.width = '0%';
                    strengthBar.style.backgroundColor = '';
                    strengthText.textContent = 'Force du mot de passe';
                    break;
                case 1:
                    strengthBar.style.width = '20%';
                    strengthBar.style.backgroundColor = '#f44336';
                    strengthText.textContent = 'Très faible';
                    break;
                case 2:
                    strengthBar.style.width = '40%';
                    strengthBar.style.backgroundColor = '#ff9800';
                    strengthText.textContent = 'Faible';
                    break;
                case 3:
                    strengthBar.style.width = '60%';
                    strengthBar.style.backgroundColor = '#ffeb3b';
                    strengthText.textContent = 'Moyen';
                    break;
                case 4:
                    strengthBar.style.width = '80%';
                    strengthBar.style.backgroundColor = '#8bc34a';
                    strengthText.textContent = 'Fort';
                    break;
                case 5:
                    strengthBar.style.width = '100%';
                    strengthBar.style.backgroundColor = '#4caf50';
                    strengthText.textContent = 'Très fort';
                    break;
            }
        });
    }

    // Modal handling
    const editBtns = document.querySelectorAll('.edit-btn');
    const editModal = document.getElementById('edit-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelEditBtn = document.querySelector('.cancel-edit');
    
    if (editBtns.length && editModal) {
        editBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                editModal.style.display = 'flex';
                
                // Get row data to pre-fill form
                const row = this.closest('tr');
                if (row) {
                    const lastname = row.cells[0].textContent;
                    const firstname = row.cells[1].textContent;
                    const username = row.cells[2].textContent;
                    const acctype = row.cells[3].textContent;
                    const department = row.cells[4].textContent;
                    
                    // Fill the edit form
                    const lastnameInput = document.getElementById('edit-lastname');
                    const firstnameInput = document.getElementById('edit-firstname');
                    const usernameInput = document.getElementById('edit-username');
                    const acctypeSelect = document.getElementById('edit-acctype');
                    const departmentSelect = document.getElementById('edit-department');
                    
                    if (lastnameInput) lastnameInput.value = lastname;
                    if (firstnameInput) firstnameInput.value = firstname;
                    if (usernameInput) usernameInput.value = username;
                    
                    // Select the correct option based on the text content
                    if (acctypeSelect) {
                        for (let i = 0; i < acctypeSelect.options.length; i++) {
                            if (acctypeSelect.options[i].text.includes(acctype)) {
                                acctypeSelect.selectedIndex = i;
                                break;
                            }
                        }
                    }
                    
                    // Select the correct department
                    if (departmentSelect) {
                        for (let i = 0; i < departmentSelect.options.length; i++) {
                            if (departmentSelect.options[i].text === department) {
                                departmentSelect.selectedIndex = i;
                                break;
                            }
                        }
                    }
                }
            });
        });
        
        // Close modal functions
        const closeModal = function() {
            editModal.style.display = 'none';
        };
        
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }
        
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', closeModal);
        }
        
        // Close when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === editModal) {
                closeModal();
            }
        });
    }
    
    // Light control buttons
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    if (toggleBtns.length > 0) {
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const deviceCard = this.closest('.device-card');
                const statusElement = deviceCard.querySelector('.device-status');
                const statusText = deviceCard.querySelector('.status-text');
                const brightnessControl = deviceCard.querySelector('.brightness-control');
                
                if (this.classList.contains('on')) {
                    // Change to off
                    this.classList.remove('on');
                    this.classList.add('off');
                    this.textContent = 'Allumer';
                    statusElement.classList.remove('active');
                    statusElement.classList.add('inactive');
                    statusText.textContent = 'Éteinte';
                    brightnessControl.disabled = true;
                } else {
                    // Change to on
                    this.classList.remove('off');
                    this.classList.add('on');
                    this.textContent = 'Éteindre';
                    statusElement.classList.remove('inactive');
                    statusElement.classList.add('active');
                    statusText.textContent = 'Allumée';
                    brightnessControl.disabled = false;
                }
            });
        });
    }
    
    // Door control buttons
    const lockBtns = document.querySelectorAll('.lock-btn');
    if (lockBtns.length > 0) {
        lockBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const deviceCard = this.closest('.device-card');
                const statusElement = deviceCard.querySelector('.device-status');
                const statusText = deviceCard.querySelector('.status-text');
                
                if (this.classList.contains('unlocked')) {
                    // Change to locked
                    this.classList.remove('unlocked');
                    this.classList.add('locked');
                    this.textContent = 'Déverrouiller';
                    statusElement.classList.remove('unlocked');
                    statusElement.classList.add('locked');
                    statusText.textContent = 'Verrouillée';
                } else {
                    // Change to unlocked
                    this.classList.remove('locked');
                    this.classList.add('unlocked');
                    this.textContent = 'Verrouiller';
                    statusElement.classList.remove('locked');
                    statusElement.classList.add('unlocked');
                    statusText.textContent = 'Déverrouillée';
                }
            });
        });
    }
    
    // Global control buttons for lights
    const allOnBtn = document.getElementById('all-on-btn');
    const allOffBtn = document.getElementById('all-off-btn');
    
    if (allOnBtn) {
        allOnBtn.addEventListener('click', function() {
            const toggleBtns = document.querySelectorAll('.toggle-btn.off');
            toggleBtns.forEach(btn => btn.click());
        });
    }
    
    if (allOffBtn) {
        allOffBtn.addEventListener('click', function() {
            const toggleBtns = document.querySelectorAll('.toggle-btn.on');
            toggleBtns.forEach(btn => btn.click());
        });
    }
    
    // Global control buttons for doors
    const allLockBtn = document.getElementById('all-lock-btn');
    const allUnlockBtn = document.getElementById('all-unlock-btn');
    const emergencyUnlockBtn = document.getElementById('emergency-unlock-btn');
    
    if (allLockBtn) {
        allLockBtn.addEventListener('click', function() {
            const lockBtns = document.querySelectorAll('.lock-btn.unlocked');
            lockBtns.forEach(btn => btn.click());
        });
    }
    
    if (allUnlockBtn) {
        allUnlockBtn.addEventListener('click', function() {
            const lockBtns = document.querySelectorAll('.lock-btn.locked');
            lockBtns.forEach(btn => btn.click());
        });
    }
    
    if (emergencyUnlockBtn) {
        emergencyUnlockBtn.addEventListener('click', function() {
            if (confirm('Êtes-vous sûr de vouloir déverrouiller toutes les portes en urgence ?')) {
                const lockBtns = document.querySelectorAll('.lock-btn.locked');
                lockBtns.forEach(btn => btn.click());
                alert('Toutes les portes ont été déverrouillées en mode urgence.');
            }
        });
    }
});