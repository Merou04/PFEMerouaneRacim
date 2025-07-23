let allModules = [];

function fetchOptions(type, selectId, labelDefault, extraParams = '', selectedValue = '') {
    fetch('fetch_options.php?type=' + type + extraParams)
        .then(res => res.json())
        .then(options => {
            const select = document.getElementById(selectId);
            select.innerHTML = `<option value="">${labelDefault}</option>`;
            options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.value;
                option.textContent = opt.label;
                if (opt.value == selectedValue) option.selected = true;
                select.appendChild(option);
            });
        });
}

function renderModules(modules) {
    const tbody = document.querySelector('#modules-table tbody');
    tbody.innerHTML = '';
    if (modules.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">Aucun module trouvé</td></tr>';
    } else {
        modules.forEach(module => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${module.idmodule}</td>
                <td>${module.nom}</td>
                <td>${module.idfiliere}</td>
                <td>${module.idclasse}</td>
                <td>${module.prof}</td>
                <td>
                    <button class="btn-edit" data-id="${module.idmodule}">✏️ Modifier</button>
                    <button class="btn-delete" data-id="${module.idmodule}">🗑️ Supprimer</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Actions
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const module = allModules.find(m => m.idmodule == id);
                if (!module) return;
                document.getElementById('edit-idmodule').value = module.idmodule;
                document.getElementById('edit-nom').value = module.nom;
                fetchOptions('filiere', 'edit-idfiliere', 'Choisir filière', '', module.idfiliere);
                fetchOptions('classe', 'edit-idclasse', 'Choisir classe', '&idfiliere=' + encodeURIComponent(module.idfiliere), module.idclasse);
                fetchOptions('prof', 'edit-prof', 'Choisir professeur', '', module.idprof);
                document.getElementById('edit-modal').style.display = 'flex';
            });
        });
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                if (confirm('Voulez-vous vraiment supprimer ce module ?')) {
                    fetch('delete_module.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: 'idmodule=' + encodeURIComponent(id)
                    })
                    .then(res => res.json())
                    .then(resp => {
                        if (resp.success) {
                            allModules = allModules.filter(m => m.idmodule != id);
                            renderModules(allModules);
                        } else {
                            alert(resp.error || "Erreur lors de la suppression");
                        }
                    })
                    .catch(() => alert("Erreur lors de la suppression"));
                }
            });
        });
    }
}

function filterModules() {
    const search = document.getElementById('search-input').value.trim().toLowerCase();
    const filiere = document.getElementById('filiere-filter').value;
    const classe = document.getElementById('classe-filter').value;
    const prof = document.getElementById('prof-filter').value;

    let filtered = allModules.filter(m => {
        let ok = true;
        if (filiere && m.idfiliere !== filiere) ok = false;
        if (classe && m.idclasse !== classe) ok = false;
        if (prof && m.idprof !== prof) ok = false;
        if (search) {
            const values = [m.idmodule, m.nom, m.idfiliere, m.idclasse, m.prof].join(' ').toLowerCase();
            if (!values.includes(search)) ok = false;
        }
        return ok;
    });
    renderModules(filtered);
}

document.addEventListener('DOMContentLoaded', function() {
    // Filtres principaux
    fetchOptions('filiere', 'filiere-filter', 'Toutes filières');
    fetchOptions('classe', 'classe-filter', 'Toutes classes');
    fetchOptions('prof', 'prof-filter', 'Tous professeurs');

    fetch('get_modules.php')
        .then(response => response.json())
        .then(data => {
            allModules = data;
            renderModules(allModules);
        });

    document.getElementById('search-input').addEventListener('input', filterModules);
    document.getElementById('filiere-filter').addEventListener('change', function() {
        const filiere = this.value;
        if (filiere) {
            fetchOptions('classe', 'classe-filter', 'Toutes classes', '&idfiliere=' + encodeURIComponent(filiere));
        } else {
            fetchOptions('classe', 'classe-filter', 'Toutes classes');
        }
        document.getElementById('classe-filter').value = '';
        filterModules();
    });
    document.getElementById('classe-filter').addEventListener('change', filterModules);
    document.getElementById('prof-filter').addEventListener('change', filterModules);

    // Réinitialisation des filtres
    document.getElementById('reset-filters').addEventListener('click', function() {
        document.getElementById('search-input').value = '';
        document.getElementById('filiere-filter').value = '';
        fetchOptions('classe', 'classe-filter', 'Toutes classes');
        document.getElementById('classe-filter').value = '';
        document.getElementById('prof-filter').value = '';
        renderModules(allModules);
    });

    // Formulaire d'ajout déployable
    document.getElementById('toggle-add-form').addEventListener('click', function() {
        const form = document.getElementById('add-form');
        if (form.style.display === 'none' || form.style.display === '') {
            form.style.display = 'block';
            this.textContent = '➖ Réduire le formulaire';
        } else {
            form.style.display = 'none';
            this.textContent = '➕ Ajouter un module';
        }
    });

    // Remplir les selects du formulaire d'ajout
    fetchOptions('filiere', 'add-idfiliere', 'Filière');
    fetchOptions('classe', 'add-idclasse', 'Classe');
    fetchOptions('prof', 'add-prof', 'Professeur');

    // Dynamique : changer la liste des classes selon la filière choisie dans l'ajout
    document.getElementById('add-idfiliere').addEventListener('change', function() {
        fetchOptions('classe', 'add-idclasse', 'Classe', '&idfiliere=' + encodeURIComponent(this.value));
    });

    // Soumission du formulaire d'ajout
    document.getElementById('add-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        fetch('add_module.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(resp => {
            if (resp.success) {
                fetch('get_modules.php')
                    .then(response => response.json())
                    .then(data => {
                        allModules = data;
                        renderModules(allModules);
                    });
                this.reset();
                document.getElementById('toggle-add-form').click();
            } else {
                alert(resp.error || "Erreur lors de l'ajout");
            }
        })
        .catch(() => alert("Erreur lors de l'ajout"));
    });

    // Modal events
    document.getElementById('close-modal').onclick = function() {
        document.getElementById('edit-modal').style.display = 'none';
    };
    window.onclick = function(event) {
        if (event.target === document.getElementById('edit-modal')) {
            document.getElementById('edit-modal').style.display = 'none';
        }
    };

    // Dynamique: changer la liste des classes dans le modal si filière change
    document.getElementById('edit-idfiliere').addEventListener('change', function() {
        fetchOptions('classe', 'edit-idclasse', 'Choisir classe', '&idfiliere=' + encodeURIComponent(this.value));
    });

    // Soumission du formulaire de modification
    document.getElementById('edit-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        fetch('update_module.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(resp => {
            if (resp.success) {
                document.getElementById('edit-modal').style.display = 'none';
                fetch('get_modules.php')
                    .then(response => response.json())
                    .then(data => {
                        allModules = data;
                        renderModules(allModules);
                    });
            } else {
                alert(resp.error || "Erreur lors de la mise à jour");
            }
        })
        .catch(() => alert("Erreur lors de la mise à jour"));
    });
});