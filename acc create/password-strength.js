/**
 * Indicateur de force du mot de passe et validation
 */
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    // Toggle pour afficher/masquer les mots de passe
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
    if (passwordInput && confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            if (passwordInput.value !== confirmPasswordInput.value) {
                confirmPasswordInput.setCustomValidity("Les mots de passe ne correspondent pas");
            } else {
                confirmPasswordInput.setCustomValidity("");
            }
        });
        
        // Vérifier à nouveau lorsque le mot de passe principal change
        passwordInput.addEventListener('input', function() {
            if (confirmPasswordInput.value) {
                if (passwordInput.value !== confirmPasswordInput.value) {
                    confirmPasswordInput.setCustomValidity("Les mots de passe ne correspondent pas");
                } else {
                    confirmPasswordInput.setCustomValidity("");
                }
            }
        });
    }
    
    // Indicateur de force du mot de passe
    if (passwordInput && strengthBar && strengthText) {
        passwordInput.addEventListener('input', function() {
            const password = passwordInput.value;
            let strength = 0;
            
            if (password.length === 0) {
                strengthBar.style.width = '0%';
                strengthBar.style.backgroundColor = '';
                strengthText.textContent = 'Force du mot de passe';
                return;
            }
            
            // Longueur
            if (password.length > 6) strength += 1;
            if (password.length > 10) strength += 1;
            
            // Complexité
            if (/[A-Z]/.test(password)) strength += 1;
            if (/[0-9]/.test(password)) strength += 1;
            if (/[^A-Za-z0-9]/.test(password)) strength += 1;
            
            // Mise à jour de l'indicateur visuel
            switch (strength) {
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
        });
    }
});