let filtersData = {filieres:[], classes:[], sections:[], groupes:[], modules:[]};
let deleteData = null;

// Filtres principaux
function fillFilieres() {
    const select = document.getElementById('filiere-select');
    select.innerHTML = '<option value="">Toutes</option>';
    filtersData.filieres.forEach(f => {
        select.innerHTML += `<option value="${f.idfiliere}">${f.nom}</option>`;
    });
}
function fillClasses() {
    const filiere = document.getElementById('filiere-select').value;
    const select = document.getElementById('classe-select');
    select.innerHTML = '<option value="">Toutes</option>';
    filtersData.classes
        .filter(c => !filiere || c.idfiliere === filiere)
        .forEach(c => {
            select.innerHTML += `<option value="${c.idclasse}">${c.idclasse}</option>`;
        });
}
function fillSections() {
    const filiere = document.getElementById('filiere-select').value;
    const classe = document.getElementById('classe-select').value;
    const select = document.getElementById('section-select');
    select.innerHTML = '<option value="">Toutes</option>';
    filtersData.sections
        .filter(s => (!filiere || s.idfiliere === filiere) && (!classe || s.idclasse === classe))
        .forEach(s => {
            select.innerHTML += `<option value="${s.idsection}">${s.idsection}</option>`;
        });
}
function fillGroupes() {
    const filiere = document.getElementById('filiere-select').value;
    const classe = document.getElementById('classe-select').value;
    const section = document.getElementById('section-select').value;
    const select = document.getElementById('groupe-select');
    select.innerHTML = '<option value="">Tous</option>';
    filtersData.groupes
        .filter(g =>
            (!filiere || g.idfiliere === filiere) &&
            (!classe || g.idclasse === classe) &&
            (!section || g.idsection === section)
        )
        .forEach(g => {
            select.innerHTML += `<option value="${g.idgroupe}">${g.idgroupe}</option>`;
        });
}

// Filtres popup ajout
function fillAddFilieres(selected) {
    const select = document.getElementById('add-filiere');
    select.innerHTML = '<option value="">Choisir</option>';
    filtersData.filieres.forEach(f => {
        select.innerHTML += `<option value="${f.idfiliere}">${f.nom}</option>`;
    });
    if (selected) select.value = selected;
}
function fillAddClasses(selectedFiliere, selectedClasse) {
    const select = document.getElementById('add-classe');
    select.innerHTML = '<option value="">Choisir</option>';
    filtersData.classes
        .filter(c => !selectedFiliere || c.idfiliere === selectedFiliere)
        .forEach(c => {
            select.innerHTML += `<option value="${c.idclasse}">${c.idclasse}</option>`;
        });
    if (selectedClasse) select.value = selectedClasse;
}
function fillAddSections(selectedFiliere, selectedClasse, selectedSection) {
    const select = document.getElementById('add-section');
    select.innerHTML = '<option value="">Choisir</option>';
    filtersData.sections
        .filter(s => (!selectedFiliere || s.idfiliere === selectedFiliere) && (!selectedClasse || s.idclasse === selectedClasse))
        .forEach(s => {
            select.innerHTML += `<option value="${s.idsection}">${s.idsection}</option>`;
        });
    if (selectedSection) select.value = selectedSection;
}
function fillAddGroupes(selectedFiliere, selectedClasse, selectedSection, selectedGroupe) {
    const select = document.getElementById('add-groupe');
    select.innerHTML = '<option value="">Choisir</option>';
    filtersData.groupes
        .filter(g =>
            (!selectedFiliere || g.idfiliere === selectedFiliere) &&
            (!selectedClasse || g.idclasse === selectedClasse) &&
            (!selectedSection || g.idsection === selectedSection)
        )
        .forEach(g => {
            select.innerHTML += `<option value="${g.idgroupe}">${g.idgroupe}</option>`;
        });
    if (selectedGroupe) select.value = selectedGroupe;
}
function fillAddModules(selectedFiliere, selectedClasse, selectedSection, selectedModule) {
    const select = document.getElementById('add-module');
    select.innerHTML = '<option value="">Choisir</option>';
    if (!filtersData.modules) return;
    filtersData.modules
        .filter(m => {
            if (!selectedFiliere || m.idfiliere !== selectedFiliere) return false;
            if (!selectedClasse || m.idclasse !== selectedClasse) return false;
            if (selectedSection) {
                // On vérifie que la section sélectionnée existe bien pour cette classe/filière
                return filtersData.sections.some(
                    s => s.idsection === selectedSection && s.idclasse === m.idclasse && s.idfiliere === m.idfiliere
                );
            }
            return true;
        })
        .forEach(m => {
            select.innerHTML += `<option value="${m.idmodule}">${m.idmodule} - ${m.nom}</option>`;
        });
    if (selectedModule) select.value = selectedModule;
}

function loadEDT() {
    const filiere = document.getElementById('filiere-select').value;
    const classe = document.getElementById('classe-select').value;
    const section = document.getElementById('section-select').value;
    const groupe = document.getElementById('groupe-select').value;
    const jour = document.getElementById('jour-select').value;
    const idmodule = document.getElementById('idmodule-input').value.trim();
    const nommodule = document.getElementById('nommodule-input').value.trim();

    let url = 'get_edt.php';
    const params = [];
    if (filiere) params.push('filiere=' + encodeURIComponent(filiere));
    if (classe) params.push('classe=' + encodeURIComponent(classe));
    if (section) params.push('section=' + encodeURIComponent(section));
    if (groupe) params.push('groupe=' + encodeURIComponent(groupe));
    if (jour) params.push('jour=' + encodeURIComponent(jour));
    if (idmodule) params.push('idmodule=' + encodeURIComponent(idmodule));
    if (nommodule) params.push('nommodule=' + encodeURIComponent(nommodule));
    if (params.length) url += '?' + params.join('&');

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#edt-table tbody');
            tbody.innerHTML = '';
            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7">Aucune donnée</td></tr>';
            } else {
                data.forEach(row => {
                    tbody.innerHTML += `
                        <tr>
                            <td>${row.idmodule}</td>
                            <td>${row.module_nom}</td>
                            <td>${row.idgroupe}</td>
                            <td>${row.jour_semaine}</td>
                            <td>${row.heure_debut}</td>
                            <td>${row.heure_fin}</td>
                            <td>
                                <button class="delete-btn" data-idmodule="${row.idmodule}" data-idgroupe="${row.idgroupe}" data-jour="${row.jour_semaine}" data-debut="${row.heure_debut}">Supprimer</button>
                            </td>
                        </tr>
                    `;
                });

                // Actions suppression
                document.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        deleteData = {
                            idmodule: btn.dataset.idmodule,
                            idgroupe: btn.dataset.idgroupe,
                            jour_semaine: btn.dataset.jour,
                            heure_debut: btn.dataset.debut
                        };
                        document.getElementById('delete-modal').style.display = 'flex';
                    });
                });
            }
        });
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('get_filters.php')
        .then(r=>r.json())
        .then(data=>{
            filtersData = data;
            fillFilieres();
            fillClasses();
            fillSections();
            fillGroupes();
        });

    document.getElementById('filiere-select').addEventListener('change', function() {
        fillClasses();
        fillSections();
        fillGroupes();
        loadEDT();
    });
    document.getElementById('classe-select').addEventListener('change', function() {
        fillSections();
        fillGroupes();
        loadEDT();
    });
    document.getElementById('section-select').addEventListener('change', function() {
        fillGroupes();
        loadEDT();
    });
    document.getElementById('groupe-select').addEventListener('change', loadEDT);
    document.getElementById('jour-select').addEventListener('change', loadEDT);
    document.getElementById('idmodule-input').addEventListener('input', loadEDT);
    document.getElementById('nommodule-input').addEventListener('input', loadEDT);
    document.getElementById('reset-filters').addEventListener('click', function() {
        document.getElementById('filiere-select').value = '';
        fillClasses();
        fillSections();
        fillGroupes();
        document.getElementById('jour-select').value = '';
        document.getElementById('idmodule-input').value = '';
        document.getElementById('nommodule-input').value = '';
        loadEDT();
    });

    // Gestion du modal suppression
    document.getElementById('close-delete-modal').onclick = () => document.getElementById('delete-modal').style.display = 'none';
    document.getElementById('cancel-delete-btn').onclick = () => document.getElementById('delete-modal').style.display = 'none';

    // Soumission suppression
    document.getElementById('confirm-delete-btn').onclick = function() {
        if(!deleteData) return;
        fetch('delete_edt.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(deleteData)
        })
        .then(r=>r.json())
        .then(res=>{
            document.getElementById('delete-modal').style.display = 'none';
            if(res.success) {
                loadEDT();
            } else {
                alert('Erreur lors de la suppression');
            }
        });
    };

    // Gestion du modal ajout
    document.getElementById('add-edt-btn').onclick = function() {
        fillAddFilieres();
        fillAddClasses();
        fillAddSections();
        fillAddGroupes();
        fillAddModules();
        document.getElementById('add-filiere').onchange = function() {
            fillAddClasses(this.value, '');
            fillAddSections(this.value, '', '');
            fillAddGroupes(this.value, '', '', '');
            fillAddModules(this.value, '', '', '');
        };
        document.getElementById('add-classe').onchange = function() {
            const filiere = document.getElementById('add-filiere').value;
            fillAddSections(filiere, this.value, '');
            fillAddGroupes(filiere, this.value, '', '');
            fillAddModules(filiere, this.value, '', '');
        };
        document.getElementById('add-section').onchange = function() {
            const filiere = document.getElementById('add-filiere').value;
            const classe = document.getElementById('add-classe').value;
            fillAddGroupes(filiere, classe, this.value, '');
            fillAddModules(filiere, classe, this.value, '');
        };
        document.getElementById('add-edt-modal').style.display = 'flex';
    };
    document.getElementById('close-add-edt-modal').onclick = () => document.getElementById('add-edt-modal').style.display = 'none';

    // Soumission du formulaire d'ajout
    document.getElementById('add-edt-form').onsubmit = function(e) {
        e.preventDefault();
        fetch('add_edt.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                idmodule: document.getElementById('add-module').value,
                idgroupe: document.getElementById('add-groupe').value,
                jour_semaine: document.getElementById('add-jour').value,
                heure_debut: document.getElementById('add-debut').value,
                heure_fin: document.getElementById('add-fin').value
            })
        })
        .then(r=>r.json())
        .then(res=>{
            if(res.success) {
                document.getElementById('add-edt-modal').style.display = 'none';
                loadEDT();
            } else {
                alert('Erreur lors de l\'ajout');
            }
        });
    };

    setTimeout(loadEDT, 500);
});