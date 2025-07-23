// Afficher/masquer le formulaire d'ajout
function showAddProfForm() {
    document.getElementById('profAddForm').style.display = 'block';
}
function hideAddProfForm() {
    document.getElementById('profAddForm').style.display = 'none';
}

// Soumission du formulaire d'ajout
document.addEventListener('DOMContentLoaded', function() {
    const profForm = document.getElementById('profForm');
    if (profForm) {
        profForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(profForm);
            formData.append('action', 'addProf');
            const response = await fetch('api_prof.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                alert('Professeur ajouté avec succès');
                hideAddProfForm();
                profForm.reset();
                loadProfs();
            } else {
                alert('Erreur: ' + result.message);
            }
        });
        loadProfs();
    }
});

// Charger et afficher les professeurs
async function loadProfs() {
    const response = await fetch('api_prof.php?action=list');
    const profs = await response.json();
    const tbody = document.getElementById('profTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    profs.forEach(prof => {
        tbody.innerHTML += `
            <tr>
                <td>${prof.idprof}</td>
                <td>${prof.nom}</td>
                <td>${prof.prenom}</td>
                <td>${prof.numcarteprof}</td>
            </tr>
        `;
    });
}