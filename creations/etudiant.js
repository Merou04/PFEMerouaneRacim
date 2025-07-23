document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let students = [];
    let filteredStudents = [];
    let filieres = [];
    let classes = [];
    let sections = [];
    let groupes = [];
    let currentPage = 1;
    const studentsPerPage = 10;
    let studentToDelete = null;
    let studentToEdit = null;

    // Éléments du DOM
    const toggleFormBtn = document.getElementById('toggle-form-btn');
    const formContainer = document.getElementById('student-form-container');
    const studentForm = document.getElementById('student-form');
    const messageDiv = document.getElementById('message');
    const studentsList = document.getElementById('students-list');
    const searchInput = document.getElementById('search-input');
    const filterFiliere = document.getElementById('filter-filiere');
    const filterClasse = document.getElementById('filter-classe');
    const filterSection = document.getElementById('filter-section');
    const filterGroupe = document.getElementById('filter-groupe');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    
    // Selects du formulaire d'ajout
    const filiereSelect = document.getElementById('filiere-select');
    const classeSelect = document.getElementById('classe-select');
    const sectionSelect = document.getElementById('section-select');
    const groupeSelect = document.getElementById('groupe-select');
    
    // Modal de suppression
    const deleteModal = document.getElementById('delete-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    
    // Modal de modification
    const editModal = document.getElementById('edit-modal');
    const editStudentForm = document.getElementById('edit-student-form');
    const cancelEditBtn = document.getElementById('cancel-edit');
    
    // Selects du formulaire de modification
    const editFiliereSelect = document.getElementById('edit-filiere-select');
    const editClasseSelect = document.getElementById('edit-classe-select');
    const editSectionSelect = document.getElementById('edit-section-select');
    const editGroupeSelect = document.getElementById('edit-groupe-select');

    // Initialisation
    init();

    async function init() {
        await loadAllData();
        setupEventListeners();
        displayStudents();
    }

    async function loadAllData() {
        try {
            await Promise.all([
                loadFilieres(),
                loadClasses(),
                loadSections(),
                loadGroupes(),
                loadStudents()
            ]);
            populateSelects();
            populateFilters();
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            showMessage('Erreur lors du chargement des données', 'error');
        }
    }

    async function loadFilieres() {
        try {
            const response = await fetch('apietu.php?action=getFilieres');
            filieres = await response.json();
            console.log('Filières chargées:', filieres);
        } catch (error) {
            console.error('Erreur chargement filières:', error);
            filieres = [];
        }
    }

    async function loadClasses() {
        try {
            const response = await fetch('apietu.php?action=getClasses');
            classes = await response.json();
            console.log('Classes chargées:', classes);
        } catch (error) {
            console.error('Erreur chargement classes:', error);
            classes = [];
        }
    }

    async function loadSections() {
        try {
            const response = await fetch('apietu.php?action=getSections');
            sections = await response.json();
            console.log('Sections chargées:', sections);
        } catch (error) {
            console.error('Erreur chargement sections:', error);
            sections = [];
        }
    }

    async function loadGroupes() {
        try {
            const response = await fetch('apietu.php?action=getGroupes');
            groupes = await response.json();
            console.log('Groupes chargés:', groupes);
        } catch (error) {
            console.error('Erreur chargement groupes:', error);
            groupes = [];
        }
    }

    async function loadStudents() {
        try {
            const response = await fetch('apietu.php?action=getStudents');
            students = await response.json();
            filteredStudents = [...students];
            console.log('Étudiants chargés:', students);
        } catch (error) {
            console.error('Erreur chargement étudiants:', error);
            students = [];
            filteredStudents = [];
        }
    }

    function populateSelects() {
        // Filières du formulaire d'ajout
        filiereSelect.innerHTML = '<option value="">Sélectionner une filière</option>';
        filieres.forEach(filiere => {
            filiereSelect.innerHTML += `<option value="${filiere.idfiliere}">${filiere.nom}</option>`;
        });
        
        // Filières du formulaire de modification
        editFiliereSelect.innerHTML = '<option value="">Sélectionner une filière</option>';
        filieres.forEach(filiere => {
            editFiliereSelect.innerHTML += `<option value="${filiere.idfiliere}">${filiere.nom}</option>`;
        });
    }

    function populateFilters() {
        // Filière filter
        filterFiliere.innerHTML = '<option value="">Toutes les filières</option>';
        filieres.forEach(filiere => {
            filterFiliere.innerHTML += `<option value="${filiere.idfiliere}">${filiere.nom}</option>`;
        });

        // Classe filter (initialement toutes les classes)
        filterClasse.innerHTML = '<option value="">Toutes les classes</option>';
        classes.forEach(classe => {
            filterClasse.innerHTML += `<option value="${classe.idclasse}">${classe.idclasse}</option>`;
        });

        // Section filter (initialement toutes les sections)
        if (filterSection) {
            filterSection.innerHTML = '<option value="">Toutes les sections</option>';
            sections.forEach(section => {
                filterSection.innerHTML += `<option value="${section.idsection}">${section.idsection}</option>`;
            });
        }

        // Groupe filter (initialement tous les groupes)
        if (filterGroupe) {
            filterGroupe.innerHTML = '<option value="">Tous les groupes</option>';
            groupes.forEach(groupe => {
                filterGroupe.innerHTML += `<option value="${groupe.idgroupe}">${groupe.idgroupe}</option>`;
            });
        }
    }

    function setupEventListeners() {
        toggleFormBtn.addEventListener('click', toggleForm);
        studentForm.addEventListener('submit', handleFormSubmit);
        editStudentForm.addEventListener('submit', handleEditFormSubmit);

        // Cascade du formulaire d'ajout
        filiereSelect.addEventListener('change', updateClasseSelect);
        classeSelect.addEventListener('change', updateSectionSelect);
        sectionSelect.addEventListener('change', updateGroupeSelect);
        
        // Cascade du formulaire de modification
        editFiliereSelect.addEventListener('change', updateEditClasseSelect);
        editClasseSelect.addEventListener('change', updateEditSectionSelect);
        editSectionSelect.addEventListener('change', updateEditGroupeSelect);

        // Cascade des filtres
        filterFiliere.addEventListener('change', () => {
            updateFilterClasse();
            applyFilters();
        });
        filterClasse.addEventListener('change', () => {
            updateFilterSection();
            applyFilters();
        });
        if (filterSection) {
            filterSection.addEventListener('change', () => {
                updateFilterGroupe();
                applyFilters();
            });
        }
        if (filterGroupe) {
            filterGroupe.addEventListener('change', applyFilters);
        }

        // Recherche
        searchInput.addEventListener('input', applyFilters);

        // Pagination
        prevPageBtn.addEventListener('click', () => changePage(-1));
        nextPageBtn.addEventListener('click', () => changePage(1));

        // Modals
        confirmDeleteBtn.addEventListener('click', confirmDelete);
        cancelDeleteBtn.addEventListener('click', () => hideModal(deleteModal));
        cancelEditBtn.addEventListener('click', () => hideModal(editModal));
        deleteModal.addEventListener('click', (e) => {
            if (e.target === deleteModal) hideModal(deleteModal);
        });
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) hideModal(editModal);
        });
    }

    function toggleForm() {
        const isVisible = formContainer.style.display !== 'none';
        formContainer.style.display = isVisible ? 'none' : 'block';
        toggleFormBtn.innerHTML = isVisible ? 
            '<span class="icon">➕</span>Afficher le formulaire' : 
            '<span class="icon">➖</span>Masquer le formulaire';
    }

    // Cascade du formulaire d'ajout
    async function updateClasseSelect() {
        const selectedFiliere = filiereSelect.value;
        classeSelect.innerHTML = '<option value="">Sélectionner une classe</option>';
        sectionSelect.innerHTML = '<option value="">Sélectionner une section</option>';
        groupeSelect.innerHTML = '<option value="">Sélectionner un groupe</option>';

        if (selectedFiliere) {
            try {
                const response = await fetch(`apietu.php?action=getClassesByFiliere&idfiliere=${selectedFiliere}`);
                const filteredClasses = await response.json();
                filteredClasses.forEach(classe => {
                    classeSelect.innerHTML += `<option value="${classe.idclasse}">${classe.idclasse}</option>`;
                });
            } catch (error) {
                console.error('Erreur lors du chargement des classes:', error);
            }
        }
    }

    async function updateSectionSelect() {
        const selectedClasse = classeSelect.value;
        sectionSelect.innerHTML = '<option value="">Sélectionner une section</option>';
        groupeSelect.innerHTML = '<option value="">Sélectionner un groupe</option>';

        if (selectedClasse) {
            try {
                const response = await fetch(`apietu.php?action=getSectionsByClasse&idclasse=${selectedClasse}`);
                const filteredSections = await response.json();
                filteredSections.forEach(section => {
                    sectionSelect.innerHTML += `<option value="${section.idsection}">${section.idsection}</option>`;
                });
            } catch (error) {
                console.error('Erreur lors du chargement des sections:', error);
            }
        }
    }

    async function updateGroupeSelect() {
        const selectedSection = sectionSelect.value;
        groupeSelect.innerHTML = '<option value="">Sélectionner un groupe</option>';

        if (selectedSection) {
            try {
                const response = await fetch(`apietu.php?action=getGroupesBySection&idsection=${selectedSection}`);
                const filteredGroupes = await response.json();
                filteredGroupes.forEach(groupe => {
                    groupeSelect.innerHTML += `<option value="${groupe.idgroupe}">${groupe.idgroupe}</option>`;
                });
            } catch (error) {
                console.error('Erreur lors du chargement des groupes:', error);
            }
        }
    }

    // Cascade du formulaire de modification
    async function updateEditClasseSelect() {
        const selectedFiliere = editFiliereSelect.value;
        editClasseSelect.innerHTML = '<option value="">Sélectionner une classe</option>';
        editSectionSelect.innerHTML = '<option value="">Sélectionner une section</option>';
        editGroupeSelect.innerHTML = '<option value="">Sélectionner un groupe</option>';

        if (selectedFiliere) {
            try {
                const response = await fetch(`apietu.php?action=getClassesByFiliere&idfiliere=${selectedFiliere}`);
                const filteredClasses = await response.json();
                filteredClasses.forEach(classe => {
                    editClasseSelect.innerHTML += `<option value="${classe.idclasse}">${classe.idclasse}</option>`;
                });
                
                // Si on modifie un étudiant existant, sélectionner sa classe
                if (studentToEdit && studentToEdit.idclasse) {
                    editClasseSelect.value = studentToEdit.idclasse;
                    await updateEditSectionSelect();
                }
            } catch (error) {
                console.error('Erreur lors du chargement des classes:', error);
            }
        }
    }

    async function updateEditSectionSelect() {
        const selectedClasse = editClasseSelect.value;
        editSectionSelect.innerHTML = '<option value="">Sélectionner une section</option>';
        editGroupeSelect.innerHTML = '<option value="">Sélectionner un groupe</option>';

        if (selectedClasse) {
            try {
                const response = await fetch(`apietu.php?action=getSectionsByClasse&idclasse=${selectedClasse}`);
                const filteredSections = await response.json();
                filteredSections.forEach(section => {
                    editSectionSelect.innerHTML += `<option value="${section.idsection}">${section.idsection}</option>`;
                });
                
                // Si on modifie un étudiant existant, sélectionner sa section
                if (studentToEdit && studentToEdit.idsection) {
                    editSectionSelect.value = studentToEdit.idsection;
                    await updateEditGroupeSelect();
                }
            } catch (error) {
                console.error('Erreur lors du chargement des sections:', error);
            }
        }
    }

    async function updateEditGroupeSelect() {
        const selectedSection = editSectionSelect.value;
        editGroupeSelect.innerHTML = '<option value="">Sélectionner un groupe</option>';

        if (selectedSection) {
            try {
                const response = await fetch(`apietu.php?action=getGroupesBySection&idsection=${selectedSection}`);
                const filteredGroupes = await response.json();
                filteredGroupes.forEach(groupe => {
                    editGroupeSelect.innerHTML += `<option value="${groupe.idgroupe}">${groupe.idgroupe}</option>`;
                });
                
                // Si on modifie un étudiant existant, sélectionner son groupe
                if (studentToEdit && studentToEdit.idgroupe) {
                    editGroupeSelect.value = studentToEdit.idgroupe;
                }
            } catch (error) {
                console.error('Erreur lors du chargement des groupes:', error);
            }
        }
    }

    // Cascade des filtres
    async function updateFilterClasse() {
        const selectedFiliere = filterFiliere.value;
        filterClasse.innerHTML = '<option value="">Toutes les classes</option>';
        if (filterSection) filterSection.innerHTML = '<option value="">Toutes les sections</option>';
        if (filterGroupe) filterGroupe.innerHTML = '<option value="">Tous les groupes</option>';

        if (selectedFiliere) {
            try {
                const response = await fetch(`apietu.php?action=getClassesByFiliere&idfiliere=${selectedFiliere}`);
                const filteredClasses = await response.json();
                filteredClasses.forEach(classe => {
                    filterClasse.innerHTML += `<option value="${classe.idclasse}">${classe.idclasse}</option>`;
                });
            } catch (error) {
                console.error('Erreur lors du chargement des classes:', error);
            }
        } else {
            classes.forEach(classe => {
                filterClasse.innerHTML += `<option value="${classe.idclasse}">${classe.idclasse}</option>`;
            });
            
            if (filterSection) {
                sections.forEach(section => {
                    filterSection.innerHTML += `<option value="${section.idsection}">${section.idsection}</option>`;
                });
            }
            
            if (filterGroupe) {
                groupes.forEach(groupe => {
                    filterGroupe.innerHTML += `<option value="${groupe.idgroupe}">${groupe.idgroupe}</option>`;
                });
            }
        }
    }

    async function updateFilterSection() {
        if (!filterSection) return;

        const selectedClasse = filterClasse.value;
        const selectedFiliere = filterFiliere.value;
        filterSection.innerHTML = '<option value="">Toutes les sections</option>';
        if (filterGroupe) filterGroupe.innerHTML = '<option value="">Tous les groupes</option>';

        if (selectedClasse) {
            try {
                const response = await fetch(`apietu.php?action=getSectionsByClasse&idclasse=${selectedClasse}`);
                const filteredSections = await response.json();
                filteredSections.forEach(section => {
                    filterSection.innerHTML += `<option value="${section.idsection}">${section.idsection}</option>`;
                });
            } catch (error) {
                console.error('Erreur lors du chargement des sections:', error);
            }
        } else if (selectedFiliere) {
            const filteredSections = sections.filter(s => s.idfiliere === selectedFiliere);
            filteredSections.forEach(section => {
                filterSection.innerHTML += `<option value="${section.idsection}">${section.idsection}</option>`;
            });
            
            if (filterGroupe) {
                const filteredGroupes = groupes.filter(g => g.idfiliere === selectedFiliere);
                filteredGroupes.forEach(groupe => {
                    filterGroupe.innerHTML += `<option value="${groupe.idgroupe}">${groupe.idgroupe}</option>`;
                });
            }
        } else {
            sections.forEach(section => {
                filterSection.innerHTML += `<option value="${section.idsection}">${section.idsection}</option>`;
            });
            
            if (filterGroupe) {
                groupes.forEach(groupe => {
                    filterGroupe.innerHTML += `<option value="${groupe.idgroupe}">${groupe.idgroupe}</option>`;
                });
            }
        }
    }

    async function updateFilterGroupe() {
        if (!filterGroupe) return;

        const selectedSection = filterSection.value;
        const selectedClasse = filterClasse.value;
        const selectedFiliere = filterFiliere.value;
        filterGroupe.innerHTML = '<option value="">Tous les groupes</option>';

        if (selectedSection) {
            try {
                const response = await fetch(`apietu.php?action=getGroupesBySection&idsection=${selectedSection}`);
                const filteredGroupes = await response.json();
                filteredGroupes.forEach(groupe => {
                    filterGroupe.innerHTML += `<option value="${groupe.idgroupe}">${groupe.idgroupe}</option>`;
                });
            } catch (error) {
                console.error('Erreur lors du chargement des groupes:', error);
            }
        } else {
            let filteredGroupes = groupes;
            
            if (selectedFiliere) {
                filteredGroupes = filteredGroupes.filter(g => g.idfiliere === selectedFiliere);
            }
            
            if (selectedClasse) {
                filteredGroupes = filteredGroupes.filter(g => g.idclasse === selectedClasse);
            }
            
            filteredGroupes.forEach(groupe => {
                filterGroupe.innerHTML += `<option value="${groupe.idgroupe}">${groupe.idgroupe}</option>`;
            });
        }
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(studentForm);
        formData.append('action', 'addStudent');

        try {
            const response = await fetch('apietu.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                showMessage('Étudiant ajouté avec succès!', 'success');
                studentForm.reset();
                await loadStudents();
                applyFilters();
                formContainer.style.display = 'none';
                toggleFormBtn.innerHTML = '<span class="icon">➕</span>Afficher le formulaire';
            } else {
                showMessage('Erreur: ' + result.message, 'error');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showMessage('Erreur lors de l\'ajout de l\'étudiant', 'error');
        }
    }

    async function handleEditFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(editStudentForm);
        formData.append('action', 'updateStudent');

        try {
            const response = await fetch('apietu.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                showMessage('Étudiant modifié avec succès!', 'success');
                hideModal(editModal);
                await loadStudents();
                applyFilters();
                studentToEdit = null;
            } else {
                showMessage('Erreur: ' + result.message, 'error');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showMessage('Erreur lors de la modification de l\'étudiant', 'error');
        }
    }

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }

    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedFiliere = filterFiliere.value.trim();
        const selectedClasse = filterClasse.value.trim();
        const selectedSection = filterSection ? filterSection.value.trim() : '';
        const selectedGroupe = filterGroupe ? filterGroupe.value.trim() : '';

        filteredStudents = students.filter(student => {
            const nom = student.nom ? student.nom.toLowerCase() : '';
            const prenom = student.prenom ? student.prenom.toLowerCase() : '';
            const idetu = student.idetu ? student.idetu.toLowerCase() : '';
            const numcarteetu = student.numcarteetu ? student.numcarteetu.toLowerCase() : '';
            
            const matchesSearch = !searchTerm || 
                nom.includes(searchTerm) ||
                prenom.includes(searchTerm) ||
                idetu.includes(searchTerm) ||
                numcarteetu.includes(searchTerm);
            
            const matchesFiliere = !selectedFiliere || student.idfiliere === selectedFiliere;
            const matchesClasse = !selectedClasse || student.idclasse === selectedClasse;
            const matchesSection = !selectedSection || student.idsection === selectedSection;
            const matchesGroupe = !selectedGroupe || student.idgroupe === selectedGroupe;

            return matchesSearch && matchesFiliere && matchesClasse && matchesSection && matchesGroupe;
        });

        currentPage = 1;
        displayStudents();
    }

    function displayStudents() {
        if (filteredStudents.length === 0) {
            studentsList.innerHTML = '<tr><td colspan="9" class="no-data">Aucun étudiant trouvé</td></tr>';
            updatePagination();
            return;
        }

        const startIndex = (currentPage - 1) * studentsPerPage;
        const endIndex = startIndex + studentsPerPage;
        const studentsToShow = filteredStudents.slice(startIndex, endIndex);

        let html = '';
        studentsToShow.forEach(student => {
            const filiere = filieres.find(f => f.idfiliere === student.idfiliere);
            const filiereDisplay = filiere ? `${student.idfiliere} (${filiere.nom})` : student.idfiliere;
            
            html += `
                <tr>
                    <td>${student.idetu}</td>
                    <td>${student.nom}</td>
                    <td>${student.prenom}</td>
                    <td>${student.numcarteetu}</td>
                    <td title="${filiereDisplay}">${student.idfiliere}</td>
                    <td>${student.idclasse}</td>
                    <td>${student.idsection}</td>
                    <td>${student.idgroupe}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-edit" onclick="editStudent(${student.id})">
                                <span class="icon">✏️</span>Modifier
                            </button>
                            <button class="btn-delete" onclick="deleteStudent(${student.id})">
                                <span class="icon">🗑️</span>Supprimer
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        studentsList.innerHTML = html;
        updatePagination();
    }

    function updatePagination() {
        const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
        
        prevPageBtn.disabled = currentPage <= 1;
        nextPageBtn.disabled = currentPage >= totalPages;
        
        pageInfo.textContent = `Page ${currentPage} sur ${totalPages || 1} (${filteredStudents.length} étudiant${filteredStudents.length > 1 ? 's' : ''})`;
    }

    function changePage(direction) {
        const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
        const newPage = currentPage + direction;
        
        if (newPage >= 1 && newPage <= totalPages) {
            currentPage = newPage;
            displayStudents();
        }
    }

    window.deleteStudent = function(id) {
        studentToDelete = id;
        showModal(deleteModal);
    };

    window.editStudent = async function(id) {
        try {
            const response = await fetch(`apietu.php?action=getStudent&id=${id}`);
            const result = await response.json();
            
            if (result.success) {
                studentToEdit = result.data;
                
                // Remplir le formulaire
                document.getElementById('edit-student-id').value = studentToEdit.id;
                document.getElementById('edit-idetu').value = studentToEdit.idetu;
                document.getElementById('edit-numcarteetu').value = studentToEdit.numcarteetu;
                document.getElementById('edit-nom').value = studentToEdit.nom;
                document.getElementById('edit-prenom').value = studentToEdit.prenom;
                
                // Sélectionner la filière et déclencher la cascade
                editFiliereSelect.value = studentToEdit.idfiliere;
                await updateEditClasseSelect();
                
                showModal(editModal);
            } else {
                showMessage('Erreur: ' + result.message, 'error');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showMessage('Erreur lors de la récupération des données de l\'étudiant', 'error');
        }
    };

    async function confirmDelete() {
        if (!studentToDelete) return;

        try {
            const formData = new FormData();
            formData.append('action', 'deleteStudent');
            formData.append('id', studentToDelete);

            const response = await fetch('apietu.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                showMessage('Étudiant supprimé avec succès!', 'success');
                await loadStudents();
                applyFilters();
            } else {
                showMessage('Erreur: ' + result.message, 'error');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showMessage('Erreur lors de la suppression', 'error');
        }
        
        hideModal(deleteModal);
        studentToDelete = null;
    }

    function showModal(modal) {
        modal.style.display = 'flex';
    }

    function hideModal(modal) {
        modal.style.display = 'none';
    }

    window.resetFilters = function() {
        searchInput.value = '';
        filterFiliere.value = '';
        filterClasse.value = '';
        if (filterSection) filterSection.value = '';
        if (filterGroupe) filterGroupe.value = '';
        
        populateFilters();
        applyFilters();
    };
});