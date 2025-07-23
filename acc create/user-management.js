document.addEventListener('DOMContentLoaded', function() {
    // Afficher les messages d'erreur/succès depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const message = urlParams.get('message');
    
    if (message && status) {
        const messageContainer = document.getElementById('message-container');
        if (messageContainer) {
            const alertClass = status === 'success' ? 'alert-success' : 'alert-danger';
            const icon = status === 'success' ? '<span class="icon icon-success"></span>' : '<span class="icon icon-warning"></span>';
            
            messageContainer.innerHTML = `<div class="alert ${alertClass}">${icon} ${decodeURIComponent(message)}</div>`;
            
            // Recharger les comptes après une action réussie
            if (status === 'success') {
                setTimeout(() => {
                    loadAccounts();
                }, 500);
            }
            
            // Auto-fermeture après 5 secondes
            setTimeout(() => {
                messageContainer.innerHTML = '';
                // Retirer les paramètres de l'URL
                const cleanUrl = window.location.pathname;
                window.history.replaceState({}, document.title, cleanUrl);
            }, 5000);
        }
    }
    
    // ----- Gestion des mots de passe -----
    const toggleButtons = document.querySelectorAll('.toggle-password');
    if (toggleButtons) {
        toggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input');
                if (input.type === 'password') {
                    input.type = 'text';
                    this.innerHTML = '<span class="icon icon-eye-slash"></span>';
                } else {
                    input.type = 'password';
                    this.innerHTML = '<span class="icon icon-eye"></span>';
                }
            });
        });
    }
    
    // Vérification de la correspondance des mots de passe
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    
    if (passwordInput && confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            if (passwordInput.value !== confirmPasswordInput.value) {
                confirmPasswordInput.setCustomValidity("Les mots de passe ne correspondent pas");
            } else {
                confirmPasswordInput.setCustomValidity("");
            }
        });
        
        passwordInput.addEventListener('input', function() {
            if (confirmPasswordInput.value) {
                if (passwordInput.value !== confirmPasswordInput.value) {
                    confirmPasswordInput.setCustomValidity("Les mots de passe ne correspondent pas");
                } else {
                    confirmPasswordInput.setCustomValidity("");
                }
            }
            
            // Force du mot de passe
            const strengthBar = document.querySelector('.strength-bar');
            const strengthText = document.querySelector('.strength-text');
            
            if (strengthBar && strengthText) {
                let strength = 0;
                const password = this.value;
                
                // Réinitialiser
                if (password.length === 0) {
                    strengthBar.style.width = '0%';
                    strengthBar.style.backgroundColor = '';
                    strengthText.textContent = 'Force du mot de passe';
                    return;
                }
                
                // Calculer la force
                if (password.length > 5) strength += 1;
                if (password.length > 8) strength += 1;
                if (/[A-Z]/.test(password)) strength += 1;
                if (/[0-9]/.test(password)) strength += 1;
                if (/[^A-Za-z0-9]/.test(password)) strength += 1;
                
                // Afficher la force
                switch(strength) {
                    case 0:
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
            }
        });
    }
    
    // ----- Gestion de l'affichage des comptes -----
    let accounts = [];
    let currentPage = 1;
    const accountsPerPage = 5;
    
    // Charger les comptes depuis l'API
    function loadAccounts() {
        const accountsList = document.getElementById('accounts-list');
        if (!accountsList) return;
        
        accountsList.innerHTML = '<tr><td colspan="6" class="loading-message">Chargement des comptes...</td></tr>';
        
        fetch('get_accounts.php')
            .then(response => response.json())
            .then(data => {
                accounts = data;
                displayAccounts();
                updatePagination();
            })
            .catch(error => {
                console.error('Erreur lors du chargement des comptes:', error);
                accountsList.innerHTML = '<tr><td colspan="6" class="error-message">Erreur lors du chargement des comptes.</td></tr>';
            });
    }
    
    // Afficher les comptes
    function displayAccounts() {
        const accountsList = document.getElementById('accounts-list');
        if (!accountsList) return;
        
        const searchTerm = document.getElementById('search-accounts')?.value.toLowerCase() || '';
        
        // Filtrer selon le terme de recherche
        const filteredAccounts = accounts.filter(account => {
            return account.username.toLowerCase().includes(searchTerm) ||
                   account.type_name.toLowerCase().includes(searchTerm);
        });
        
        // Calculer les limites pour la pagination
        const startIndex = (currentPage - 1) * accountsPerPage;
        const endIndex = startIndex + accountsPerPage;
        const accountsToShow = filteredAccounts.slice(startIndex, endIndex);
        
        if (accountsToShow.length === 0) {
            accountsList.innerHTML = searchTerm 
                ? '<tr><td colspan="6" class="error-message">Aucun compte ne correspond à votre recherche.</td></tr>'
                : '<tr><td colspan="6" class="error-message">Aucun compte disponible.</td></tr>';
            return;
        }
        
        let html = '';
        accountsToShow.forEach(account => {
            // Formater les dates
            const createdDate = new Date(account.created_at).toLocaleDateString('fr-FR');
            const lastLogin = account.last_login 
                ? new Date(account.last_login).toLocaleDateString('fr-FR')
                : 'Jamais';
            
            // Déterminer la classe du badge
            let badgeClass;
            let typeLabel;
            
            switch(account.type_name) {
                case 'admin':
                    badgeClass = 'badge-admin';
                    typeLabel = 'Administrateur';
                    break;
                case 'tier1':
                    badgeClass = 'badge-tier1';
                    typeLabel = 'Niveau 1';
                    break;
                case 'tier2':
                    badgeClass = 'badge-tier2';
                    typeLabel = 'Niveau 2';
                    break;
                case 'tier3':
                    badgeClass = 'badge-tier3';
                    typeLabel = 'Niveau 3';
                    break;
                default:
                    badgeClass = '';
                    typeLabel = account.type_name;
            }
            
            html += `
                <tr>
                    <td>${account.account_id}</td>
                    <td>${account.username}</td>
                    <td><span class="badge ${badgeClass}">${typeLabel}</span></td>
                    <td>${createdDate}</td>
                    <td>${lastLogin}</td>
                    <td class="actions">
                        <button class="edit-btn" data-id="${account.account_id}" title="Modifier">
                            <span class="icon icon-edit"></span>
                        </button>
                        <button class="delete-btn" data-id="${account.account_id}" title="Supprimer">
                            <span class="icon icon-delete"></span>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        accountsList.innerHTML = html;
        
        // Ajouter les événements aux boutons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', editAccount);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteAccount);
        });
    }
    
    // Mise à jour de la pagination
    function updatePagination() {
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const pageInfo = document.getElementById('page-info');
        
        if (!prevBtn || !nextBtn || !pageInfo) return;
        
        const searchTerm = document.getElementById('search-accounts')?.value.toLowerCase() || '';
        const filteredAccounts = accounts.filter(account => {
            return account.username.toLowerCase().includes(searchTerm) ||
                   account.type_name.toLowerCase().includes(searchTerm);
        });
        
        const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);
        
        pageInfo.textContent = `Page ${currentPage} sur ${totalPages || 1}`;
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
    }
    
    // Écouteurs pour la pagination
    document.getElementById('prev-page')?.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayAccounts();
            updatePagination();
        }
    });
    
    document.getElementById('next-page')?.addEventListener('click', () => {
        const searchTerm = document.getElementById('search-accounts')?.value.toLowerCase() || '';
        const filteredAccounts = accounts.filter(account => {
            return account.username.toLowerCase().includes(searchTerm) ||
                   account.type_name.toLowerCase().includes(searchTerm);
        });
        
        const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);
        
        if (currentPage < totalPages) {
            currentPage++;
            displayAccounts();
            updatePagination();
        }
    });
    
    // Recherche d'utilisateurs
    document.getElementById('search-accounts')?.addEventListener('input', () => {
        currentPage = 1;
        displayAccounts();
        updatePagination();
    });
    
    // ----- Gestion des modales -----
    const editModal = document.getElementById('edit-modal');
    const deleteModal = document.getElementById('delete-modal');
    
    // Afficher une modale
    function showModal(modal) {
        if (!modal) return;
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
    
    // Cacher une modale
    function hideModal(modal) {
        if (!modal) return;
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
    
    // Éditer un compte
    function editAccount() {
        if (!editModal) return;
        
        const accountId = this.getAttribute('data-id');
        const account = accounts.find(a => a.account_id === accountId);
        
        if (!account) return;
        
        // Remplir le formulaire avec les données du compte
        document.getElementById('edit-account-id').value = account.account_id;
        document.getElementById('edit-username').value = account.username;
        document.getElementById('edit-password').value = ''; // Laisser vide
        
        // Sélectionner le type de compte
        const typeSelect = document.getElementById('edit-acctype');
        if (typeSelect) {
            for (let i = 0; i < typeSelect.options.length; i++) {
                if (typeSelect.options[i].value == account.type_id) {
                    typeSelect.selectedIndex = i;
                    break;
                }
            }
        }
        
        showModal(editModal);
    }
    
    // Supprimer un compte
    function deleteAccount() {
        if (!deleteModal) return;
        
        const accountId = this.getAttribute('data-id');
        const account = accounts.find(a => a.account_id === accountId);
        
        if (!account) return;
        
        // Mise à jour du formulaire
        document.getElementById('delete-account-id').value = account.account_id;
        
        // Mise à jour du message de confirmation
        const userToDelete = deleteModal.querySelector('.user-to-delete');
        if (userToDelete) {
            userToDelete.textContent = `Utilisateur: ${account.username}`;
        }
        
        showModal(deleteModal);
    }
    
    // Fermer les modales avec les boutons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            hideModal(modal);
        });
    });
    
    document.querySelector('.cancel-edit')?.addEventListener('click', function() {
        hideModal(editModal);
    });
    
    document.querySelector('.cancel-delete')?.addEventListener('click', function() {
        hideModal(deleteModal);
    });
    
    // Fermer les modales en cliquant à l'extérieur
    window.addEventListener('click', function(e) {
        if (e.target === editModal) hideModal(editModal);
        if (e.target === deleteModal) hideModal(deleteModal);
    });
    
    // Intercepter la soumission des formulaires pour fermer les modales
    document.getElementById('create-account-form')?.addEventListener('submit', function() {
        // Le formulaire sera soumis normalement, réinitialiser après
        setTimeout(() => {
            this.reset();
        }, 100);
    });
    
    document.getElementById('edit-account-form')?.addEventListener('submit', function() {
        // Fermer la modale après soumission
        setTimeout(() => {
            hideModal(editModal);
        }, 100);
    });
    
    document.getElementById('delete-account-form')?.addEventListener('submit', function() {
        // Fermer la modale après soumission
        setTimeout(() => {
            hideModal(deleteModal);
        }, 100);
    });
    
    // Charger les comptes au chargement de la page
    loadAccounts();
});