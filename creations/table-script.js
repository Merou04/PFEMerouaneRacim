// Variables globales
let allData = {
    filieres: [],
    classes: [],
    sections: [],
    groupes: []
};

let selectedFilieres = new Set();
let selectedClasses = new Set();
let selectedSections = new Set();
let selectedGroupes = new Set();

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    loadAllData();
    setupFormHandlers();
});

// Charger toutes les données
async function loadAllData() {
    try {
        await Promise.all([
            loadFilieres(),
            loadClasses(),
            loadSections(),
            loadGroupes()
        ]);
        displayAllTables();
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    }
}

// Charger les filières
async function loadFilieres() {
    try {
        const response = await fetch('api.php?action=getFilieres');
        allData.filieres = await response.json();
        updateFiliereSelects();
    } catch (error) {
        console.error('Erreur lors du chargement des filières:', error);
    }
}

// Charger les classes
async function loadClasses() {
    try {
        const response = await fetch('api.php?action=getClasses');
        allData.classes = await response.json();
    } catch (error) {
        console.error('Erreur lors du chargement des classes:', error);
    }
}

// Charger les sections
async function loadSections() {
    try {
        const response = await fetch('api.php?action=getSections');
        allData.sections = await response.json();
    } catch (error) {
        console.error('Erreur lors du chargement des sections:', error);
    }
}

// Charger les groupes
async function loadGroupes() {
    try {
        const response = await fetch('api.php?action=getGroupes');
        allData.groupes = await response.json();
    } catch (error) {
        console.error('Erreur lors du chargement des groupes:', error);
    }
}

// Mettre à jour les selects de filières
function updateFiliereSelects() {
    const selects = ['classeSelectFiliere', 'sectionSelectFiliere', 'groupeSelectFiliere'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Sélectionner une filière</option>';
            
            allData.filieres.forEach(filiere => {
                select.innerHTML += `<option value="${filiere.idfiliere}">${filiere.nom}</option>`;
            });
            
            select.value = currentValue;
        }
    });
}

// Fonctions de filtrage avec logique bidirectionnelle
function onFiliereCheck(filiereId, checkbox) {
    if (checkbox.checked) {
        selectedFilieres.add(filiereId);
    } else {
        selectedFilieres.delete(filiereId);
        // Décocher les classes et sections liées
        uncheckRelatedItems(filiereId);
    }
    applyFilters();
}

function onClasseCheck(classeId, checkbox) {
    if (checkbox.checked) {
        selectedClasses.add(classeId);
        // Auto-sélectionner la filière parente
        const classe = allData.classes.find(c => c.idclasse === classeId);
        if (classe) {
            selectedFilieres.add(classe.idfiliere);
        }
    } else {
        selectedClasses.delete(classeId);
        // Décocher les sections liées
        uncheckRelatedSections(classeId);
        // Vérifier si on peut décocher la filière
        checkParentDeselection();
    }
    applyFilters();
}

function onSectionCheck(sectionId, checkbox) {
    if (checkbox.checked) {
        selectedSections.add(sectionId);
        // Auto-sélectionner les parents
        const section = allData.sections.find(s => s.idsection === sectionId);
        if (section) {
            selectedFilieres.add(section.idfiliere);
            selectedClasses.add(section.idclasse);
        }
    } else {
        selectedSections.delete(sectionId);
        // Décocher les groupes liés
        uncheckRelatedGroupes(sectionId);
        // Vérifier si on peut décocher les parents
        checkParentDeselection();
    }
    applyFilters();
}

function onGroupeCheck(groupeId, checkbox) {
    if (checkbox.checked) {
        selectedGroupes.add(groupeId);
        // Auto-sélectionner tous les parents
        const groupe = allData.groupes.find(g => g.idgroupe === groupeId);
        if (groupe) {
            selectedFilieres.add(groupe.idfiliere);
            selectedClasses.add(groupe.idclasse);
            selectedSections.add(groupe.idsection);
        }
    } else {
        selectedGroupes.delete(groupeId);
        // Vérifier si on peut décocher les parents
        checkParentDeselection();
    }
    applyFilters();
}

// Vérifier si on peut décocher les parents
function checkParentDeselection() {
    // Vérifier les filières
    const filieresToKeep = new Set();
    selectedClasses.forEach(classeId => {
        const classe = allData.classes.find(c => c.idclasse === classeId);
        if (classe) filieresToKeep.add(classe.idfiliere);
    });
    selectedSections.forEach(sectionId => {
        const section = allData.sections.find(s => s.idsection === sectionId);
        if (section) filieresToKeep.add(section.idfiliere);
    });
    selectedGroupes.forEach(groupeId => {
        const groupe = allData.groupes.find(g => g.idgroupe === groupeId);
        if (groupe) filieresToKeep.add(groupe.idfiliere);
    });
    
    // Supprimer les filières qui ne sont plus nécessaires
    selectedFilieres.forEach(filiereId => {
        if (!filieresToKeep.has(filiereId)) {
            selectedFilieres.delete(filiereId);
        }
    });
    
    // Vérifier les classes
    const classesToKeep = new Set();
    selectedSections.forEach(sectionId => {
        const section = allData.sections.find(s => s.idsection === sectionId);
        if (section) classesToKeep.add(section.idclasse);
    });
    selectedGroupes.forEach(groupeId => {
        const groupe = allData.groupes.find(g => g.idgroupe === groupeId);
        if (groupe) classesToKeep.add(groupe.idclasse);
    });
    
    // Supprimer les classes qui ne sont plus nécessaires
    selectedClasses.forEach(classeId => {
        if (!classesToKeep.has(classeId)) {
            selectedClasses.delete(classeId);
        }
    });
    
    // Vérifier les sections
    const sectionsToKeep = new Set();
    selectedGroupes.forEach(groupeId => {
        const groupe = allData.groupes.find(g => g.idgroupe === groupeId);
        if (groupe) sectionsToKeep.add(groupe.idsection);
    });
    
    // Supprimer les sections qui ne sont plus nécessaires
    selectedSections.forEach(sectionId => {
        if (!sectionsToKeep.has(sectionId)) {
            selectedSections.delete(sectionId);
        }
    });
}

function uncheckRelatedItems(filiereId) {
    // Décocher les classes de cette filière
    const classesToRemove = [];
    selectedClasses.forEach(classeId => {
        const classe = allData.classes.find(c => c.idclasse === classeId);
        if (classe && classe.idfiliere === filiereId) {
            classesToRemove.push(classeId);
        }
    });
    
    classesToRemove.forEach(classeId => {
        selectedClasses.delete(classeId);
        uncheckRelatedSections(classeId);
    });
    
    // Décocher les sections de cette filière
    const sectionsToRemove = [];
    selectedSections.forEach(sectionId => {
        const section = allData.sections.find(s => s.idsection === sectionId);
        if (section && section.idfiliere === filiereId) {
            sectionsToRemove.push(sectionId);
        }
    });
    
    sectionsToRemove.forEach(sectionId => {
        selectedSections.delete(sectionId);
        uncheckRelatedGroupes(sectionId);
    });
    
    // Décocher les groupes de cette filière
    const groupesToRemove = [];
    selectedGroupes.forEach(groupeId => {
        const groupe = allData.groupes.find(g => g.idgroupe === groupeId);
        if (groupe && groupe.idfiliere === filiereId) {
            groupesToRemove.push(groupeId);
        }
    });
    
    groupesToRemove.forEach(groupeId => {
        selectedGroupes.delete(groupeId);
    });
}

function uncheckRelatedSections(classeId) {
    // Décocher les sections qui ne correspondent plus à la classe
    const sectionsToRemove = [];
    selectedSections.forEach(sectionId => {
        const section = allData.sections.find(s => s.idsection === sectionId);
        if (section && section.idclasse === classeId) {
            sectionsToRemove.push(sectionId);
        }
    });
    
    sectionsToRemove.forEach(sectionId => {
        selectedSections.delete(sectionId);
        uncheckRelatedGroupes(sectionId);
    });
    
    // Décocher les groupes de cette classe
    const groupesToRemove = [];
    selectedGroupes.forEach(groupeId => {
        const groupe = allData.groupes.find(g => g.idgroupe === groupeId);
        if (groupe && groupe.idclasse === classeId) {
            groupesToRemove.push(groupeId);
        }
    });
    
    groupesToRemove.forEach(groupeId => {
        selectedGroupes.delete(groupeId);
    });
}

function uncheckRelatedGroupes(sectionId) {
    // Décocher les groupes qui ne correspondent plus à la section
    const groupesToRemove = [];
    selectedGroupes.forEach(groupeId => {
        const groupe = allData.groupes.find(g => g.idgroupe === groupeId);
        if (groupe && groupe.idsection === sectionId) {
            groupesToRemove.push(groupeId);
        }
    });
    
    groupesToRemove.forEach(groupeId => {
        selectedGroupes.delete(groupeId);
    });
}

function resetAllFilters() {
    selectedFilieres.clear();
    selectedClasses.clear();
    selectedSections.clear();
    selectedGroupes.clear();
    
    // Décocher toutes les checkboxes
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    applyFilters();
}

//function showAll() {
//    resetAllFilters();
//}

// Appliquer les filtres
function applyFilters() {
    displayAllTables();
}

// Afficher tous les tableaux
function displayAllTables() {
    displayFiliereTable();
    displayClasseTable();
    displaySectionTable();
    displayGroupeTable();
}

// Afficher le tableau des filières
function displayFiliereTable() {
    const tbody = document.getElementById('filiereTableBody');
    
    if (allData.filieres.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-message">Aucune filière trouvée</td></tr>';
        return;
    }
    
    let html = '';
    allData.filieres.forEach(filiere => {
        const isSelected = selectedFilieres.has(filiere.idfiliere);
        const rowClass = isSelected ? 'filtered-row' : '';
        
        html += `
            <tr class="${rowClass}">
                <td class="checkbox-container">
                    <input type="checkbox" class="filter-checkbox" 
                           ${isSelected ? 'checked' : ''} 
                           onchange="onFiliereCheck('${filiere.idfiliere}', this)">
                </td>
                <td class="highlight-id">${filiere.idfiliere}</td>
                <td>${filiere.nom}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-delete" onclick="deleteEntity('filiere', ${filiere.id})">Supprimer</button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

// Afficher le tableau des classes
function displayClasseTable() {
    const tbody = document.getElementById('classeTableBody');
    let displayData = allData.classes;
    
    // Si aucune sélection spécifique, afficher toutes les classes
    // Si des filières sont sélectionnées, afficher leurs classes
    if (selectedFilieres.size > 0) {
        displayData = displayData.filter(c => selectedFilieres.has(c.idfiliere));
    }
    
    if (displayData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-message">Aucune classe trouvée</td></tr>';
        return;
    }
    
    let html = '';
    displayData.forEach(classe => {
        const isSelected = selectedClasses.has(classe.idclasse);
        const isFromSelectedFiliere = selectedFilieres.has(classe.idfiliere);
        const rowClass = isSelected ? 'filtered-row' : (isFromSelectedFiliere ? 'related-row' : '');
        
        html += `
            <tr class="${rowClass}">
                <td class="checkbox-container">
                    <input type="checkbox" class="filter-checkbox" 
                           ${isSelected ? 'checked' : ''} 
                           onchange="onClasseCheck('${classe.idclasse}', this)">
                </td>
                <td class="highlight-id">${classe.idclasse}</td>
                <td>${classe.idfiliere}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-delete" onclick="deleteEntity('classe', ${classe.id})">Supprimer</button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

// Afficher le tableau des sections
function displaySectionTable() {
    const tbody = document.getElementById('sectionTableBody');
    let displayData = allData.sections;
    
    // Filtrer selon les sélections actives
    if (selectedFilieres.size > 0) {
        displayData = displayData.filter(s => selectedFilieres.has(s.idfiliere));
    }
    if (selectedClasses.size > 0) {
        displayData = displayData.filter(s => selectedClasses.has(s.idclasse));
    }
    
    if (displayData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-message">Aucune section trouvée</td></tr>';
        return;
    }
    
    let html = '';
    displayData.forEach(section => {
        const isSelected = selectedSections.has(section.idsection);
        const isFromSelectedClasse = selectedClasses.has(section.idclasse);
        const isFromSelectedFiliere = selectedFilieres.has(section.idfiliere);
        const rowClass = isSelected ? 'filtered-row' : 
                        (isFromSelectedClasse || isFromSelectedFiliere ? 'related-row' : '');
        
        html += `
            <tr class="${rowClass}">
                <td class="checkbox-container">
                    <input type="checkbox" class="filter-checkbox" 
                           ${isSelected ? 'checked' : ''} 
                           onchange="onSectionCheck('${section.idsection}', this)">
                </td>
                <td class="highlight-id">${section.idsection}</td>
                <td>${section.idclasse}</td>
                <td>${section.idfiliere}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-delete" onclick="deleteEntity('section', ${section.id})">Supprimer</button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

// Afficher le tableau des groupes
function displayGroupeTable() {
    const tbody = document.getElementById('groupeTableBody');
    let displayData = allData.groupes;
    
    // Filtrer selon les sélections actives
    if (selectedFilieres.size > 0) {
        displayData = displayData.filter(g => selectedFilieres.has(g.idfiliere));
    }
    if (selectedClasses.size > 0) {
        displayData = displayData.filter(g => selectedClasses.has(g.idclasse));
    }
    if (selectedSections.size > 0) {
        displayData = displayData.filter(g => selectedSections.has(g.idsection));
    }
    
    if (displayData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-message">Aucun groupe trouvé</td></tr>';
        return;
    }
    
    let html = '';
    displayData.forEach(groupe => {
        const isSelected = selectedGroupes.has(groupe.idgroupe);
        const isFromSelectedSection = selectedSections.has(groupe.idsection);
        const isFromSelectedClasse = selectedClasses.has(groupe.idclasse);
        const isFromSelectedFiliere = selectedFilieres.has(groupe.idfiliere);
        const rowClass = isSelected ? 'filtered-row' : 
                        (isFromSelectedSection || isFromSelectedClasse || isFromSelectedFiliere ? 'related-row' : '');
        
        html += `
            <tr class="${rowClass}">
                <td class="checkbox-container">
                    <input type="checkbox" class="filter-checkbox" 
                           ${isSelected ? 'checked' : ''} 
                           onchange="onGroupeCheck('${groupe.idgroupe}', this)">
                </td>
                <td class="highlight-id">${groupe.idgroupe}</td>
                <td>${groupe.idsection}</td>
                <td>${groupe.idclasse}</td>
                <td>${groupe.idfiliere}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-delete" onclick="deleteEntity('groupe', ${groupe.id})">Supprimer</button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

// Afficher/masquer les formulaires d'ajout
function showAddForm(type) {
    document.getElementById(type + 'AddForm').style.display = 'block';
    updateFiliereSelects();
}

function hideAddForm(type) {
    document.getElementById(type + 'AddForm').style.display = 'none';
    document.getElementById(type + 'Form').reset();
}

// Fonctions pour mettre à jour les champs cachés
function updateClasseFiliere() {
    const select = document.getElementById('classeSelectFiliere');
    document.getElementById('classeFiliere').value = select.value;
}

function updateSectionSelects() {
    const filiereId = document.getElementById('sectionSelectFiliere').value;
    document.getElementById('sectionFiliere').value = filiereId;
    
    const classeSelect = document.getElementById('sectionSelectClasse');
    classeSelect.innerHTML = '<option value="">Sélectionner une classe</option>';
    
    if (filiereId) {
        const filteredClasses = allData.classes.filter(classe => classe.idfiliere === filiereId);
        filteredClasses.forEach(classe => {
            classeSelect.innerHTML += `<option value="${classe.idclasse}">${classe.idclasse}</option>`;
        });
    }
}

function updateSectionClasse() {
    const select = document.getElementById('sectionSelectClasse');
    document.getElementById('sectionClasse').value = select.value;
}

function updateGroupeSelects() {
    const filiereId = document.getElementById('groupeSelectFiliere').value;
    document.getElementById('groupeFiliere').value = filiereId;
    
    const classeSelect = document.getElementById('groupeSelectClasse');
    const sectionSelect = document.getElementById('groupeSelectSection');
    
    classeSelect.innerHTML = '<option value="">Sélectionner une classe</option>';
    sectionSelect.innerHTML = '<option value="">Sélectionner une section</option>';
    
    if (filiereId) {
        const filteredClasses = allData.classes.filter(classe => classe.idfiliere === filiereId);
        filteredClasses.forEach(classe => {
            classeSelect.innerHTML += `<option value="${classe.idclasse}">${classe.idclasse}</option>`;
        });
    }
}

function updateGroupeClasse() {
    const classeId = document.getElementById('groupeSelectClasse').value;
    const filiereId = document.getElementById('groupeSelectFiliere').value;
    
    document.getElementById('groupeClasse').value = classeId;
    
    const sectionSelect = document.getElementById('groupeSelectSection');
    sectionSelect.innerHTML = '<option value="">Sélectionner une section</option>';
    
    if (classeId && filiereId) {
        const filteredSections = allData.sections.filter(section => 
            section.idfiliere === filiereId && section.idclasse === classeId
        );
        filteredSections.forEach(section => {
            sectionSelect.innerHTML += `<option value="${section.idsection}">${section.idsection}</option>`;
        });
    }
}

function updateGroupeSection() {
    const select = document.getElementById('groupeSelectSection');
    document.getElementById('groupeSection').value = select.value;
}

// Supprimer une entité
async function deleteEntity(type, id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
        return;
    }
    
    try {
        const response = await fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=delete${type.charAt(0).toUpperCase() + type.slice(1)}&id=${id}`
        });
        
        const result = await response.json();
        if (result.success) {
            alert('Élément supprimé avec succès');
            loadAllData();
        } else {
            alert('Erreur lors de la suppression: ' + result.message);
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
    }
}

// Configuration des gestionnaires de formulaires
function setupFormHandlers() {
    // Filière Form
    document.getElementById('filiereForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        formData.append('action', 'addFiliere');
        
        try {
            const response = await fetch('api.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            if (result.success) {
                alert('Filière ajoutée avec succès');
                hideAddForm('filiere');
                loadAllData();
            } else {
                alert('Erreur: ' + result.message);
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'enregistrement');
        }
    });

    // Classe Form
    document.getElementById('classeForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        formData.append('action', 'addClasse');
        
        try {
            const response = await fetch('api.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            if (result.success) {
                alert('Classe ajoutée avec succès');
                hideAddForm('classe');
                loadAllData();
            } else {
                alert('Erreur: ' + result.message);
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'enregistrement');
        }
    });

    // Section Form
    document.getElementById('sectionForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        formData.append('action', 'addSection');
        
        try {
            const response = await fetch('api.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            if (result.success) {
                alert('Section ajoutée avec succès');
                hideAddForm('section');
                loadAllData();
            } else {
                alert('Erreur: ' + result.message);
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'enregistrement');
        }
    });

    // Groupe Form
    document.getElementById('groupeForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        formData.append('action', 'addGroupe');
        
        try {
            const response = await fetch('api.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            if (result.success) {
                alert('Groupe ajouté avec succès');
                hideAddForm('groupe');
                loadAllData();
            } else {
                alert('Erreur: ' + result.message);
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'enregistrement');
        }
    });
}