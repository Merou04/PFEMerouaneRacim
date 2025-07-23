document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const processBtn = document.getElementById('process-btn');
    const resultMessage = document.getElementById('result-message');
    const recordsCount = document.querySelector('#records-count .count');
    const processedCount = document.querySelector('#processed-count .count');
    const recordsList = document.getElementById('records-list');
    
    // Filter elements
    const filiereFilter = document.getElementById('filiere-filter');
    const classeFilter = document.getElementById('classe-filter');
    const groupeFilter = document.getElementById('groupe-filter');
    const studentFilter = document.getElementById('student-filter');
    const statusFilter = document.getElementById('status-filter');
    const dateStartFilter = document.getElementById('date-start');
    const dateEndFilter = document.getElementById('date-end');
    const filterBtn = document.getElementById('filter-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    // Pagination elements
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    
    // Current page and filters state
    let currentPage = 1;
    let currentFilters = {};
    let filterData = {};
    
    // Fonction pour charger les statistiques
    function loadStats() {
        fetch('fetch_stats.php')
            .then(response => response.json())
            .then(data => {
                recordsCount.textContent = data.unprocessed;
                processedCount.textContent = data.processed;
                
                if (data.unprocessed === 0) {
                    processBtn.disabled = true;
                } else {
                    processBtn.disabled = false;
                }
            })
            .catch(error => {
                console.error('Erreur lors du chargement des statistiques:', error);
            });
    }
    
    // Fonction pour charger les options de filtres
    function loadFilterOptions() {
        fetch('fetch_filters.php')
            .then(response => response.json())
            .then(data => {
                filterData = data;
                
                // Populate filière dropdown
                data.filieres.forEach(filiere => {
                    const option = document.createElement('option');
                    option.value = filiere.idfiliere;
                    option.textContent = filiere.nom;
                    filiereFilter.appendChild(option);
                });
                
                // Initial population of student dropdown
                data.etudiants.forEach(etudiant => {
                    const option = document.createElement('option');
                    option.value = etudiant.idetu;
                    option.textContent = `${etudiant.prenom} ${etudiant.nom}`;
                    option.dataset.filiere = etudiant.idfiliere;
                    option.dataset.classe = etudiant.idclasse;
                    option.dataset.groupe = etudiant.idgroupe;
                    studentFilter.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Erreur lors du chargement des filtres:', error);
            });
    }
    
    // Fonction pour charger les enregistrements avec filtres et pagination
    function loadRecords() {
        // Build query string from filters
        const params = new URLSearchParams();
        
        if (currentFilters.filiere) params.append('filiere', currentFilters.filiere);
        if (currentFilters.classe) params.append('classe', currentFilters.classe);
        if (currentFilters.groupe) params.append('groupe', currentFilters.groupe);
        if (currentFilters.etudiant) params.append('etudiant', currentFilters.etudiant);
        if (currentFilters.statut !== undefined) params.append('statut', currentFilters.statut);
        if (currentFilters.date_start) params.append('date_start', currentFilters.date_start);
        if (currentFilters.date_end) params.append('date_end', currentFilters.date_end);
        
        params.append('page', currentPage);
        
        fetch(`fetch_presences.php?${params.toString()}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    recordsList.innerHTML = `<tr><td colspan="5">Erreur: ${data.message}</td></tr>`;
                    return;
                }
                
                const records = data.records;
                const pagination = data.pagination;
                
                if (records.length === 0) {
                    recordsList.innerHTML = '<tr><td colspan="5">Aucun enregistrement trouvé</td></tr>';
                } else {
                    let html = '';
                    records.forEach(record => {
                        const date = new Date(record.date_presence);
                        const formattedDate = date.toLocaleString();
                        
                        html += `
                            <tr>
                                <td>${record.id}</td>
                                <td>${record.idetu} - ${record.prenom_etudiant} ${record.nom_etudiant}</td>
                                <td>${record.idmodule} - ${record.nom_module}</td>
                                <td>${formattedDate}</td>
                                <td class="status-${record.statut}">${getStatusText(record.statut)}</td>
                            </tr>
                        `;
                    });
                    
                    recordsList.innerHTML = html;
                }
                
                // Update pagination
                updatePagination(pagination);
            })
            .catch(error => {
                console.error('Erreur lors du chargement des enregistrements:', error);
                recordsList.innerHTML = '<tr><td colspan="5">Erreur de chargement des données</td></tr>';
            });
    }
    
    // Update pagination controls
    function updatePagination(pagination) {
        pageInfo.textContent = `Page ${pagination.current_page} sur ${pagination.total_pages}`;
        
        prevPageBtn.disabled = pagination.current_page <= 1;
        nextPageBtn.disabled = pagination.current_page >= pagination.total_pages;
    }
    
    // Fonction pour obtenir le texte du statut
    function getStatusText(status) {
        switch (status) {
            case "0": return "Présent";
            case "1": return "Retard";
            case "2": return "Absent";
            default: return "Inconnu";
        }
    }
    
    // Update class dropdown based on selected filière
    filiereFilter.addEventListener('change', function() {
        const selectedFiliere = this.value;
        
        // Clear previous options
        classeFilter.innerHTML = '<option value="">Toutes les classes</option>';
        groupeFilter.innerHTML = '<option value="">Tous les groupes</option>';
        
        // Filter students by filière
        Array.from(studentFilter.options).forEach(option => {
            if (option.value === "") return; // Skip the default option
            
            if (!selectedFiliere || option.dataset.filiere === selectedFiliere) {
                option.style.display = '';
            } else {
                option.style.display = 'none';
            }
        });
        
        if (selectedFiliere) {
            // Add filtered classes
            filterData.classes
                .filter(classe => classe.idfiliere === selectedFiliere)
                .forEach(classe => {
                    const option = document.createElement('option');
                    option.value = classe.idclasse;
                    option.textContent = classe.idclasse;
                    classeFilter.appendChild(option);
                });
        }
    });
    
    // Update group dropdown based on selected class
    classeFilter.addEventListener('change', function() {
        const selectedClasse = this.value;
        const selectedFiliere = filiereFilter.value;
        
        // Clear previous options
        groupeFilter.innerHTML = '<option value="">Tous les groupes</option>';
        
        // Filter students by classe
        Array.from(studentFilter.options).forEach(option => {
            if (option.value === "") return; // Skip the default option
            
            if ((!selectedFiliere || option.dataset.filiere === selectedFiliere) && 
                (!selectedClasse || option.dataset.classe === selectedClasse)) {
                option.style.display = '';
            } else {
                option.style.display = 'none';
            }
        });
        
        if (selectedClasse) {
            // Add filtered groups
            filterData.groupes
                .filter(groupe => groupe.idclasse === selectedClasse)
                .forEach(groupe => {
                    const option = document.createElement('option');
                    option.value = groupe.idgroupe;
                    option.textContent = groupe.idgroupe;
                    groupeFilter.appendChild(option);
                });
        }
    });
    
    // Update student dropdown based on selected group
    groupeFilter.addEventListener('change', function() {
        const selectedGroupe = this.value;
        const selectedClasse = classeFilter.value;
        const selectedFiliere = filiereFilter.value;
        
        // Filter students by groupe
        Array.from(studentFilter.options).forEach(option => {
            if (option.value === "") return; // Skip the default option
            
            if ((!selectedFiliere || option.dataset.filiere === selectedFiliere) && 
                (!selectedClasse || option.dataset.classe === selectedClasse) && 
                (!selectedGroupe || option.dataset.groupe === selectedGroupe)) {
                option.style.display = '';
            } else {
                option.style.display = 'none';
            }
        });
    });
    
    // Apply filters
    filterBtn.addEventListener('click', function() {
        currentFilters = {
            filiere: filiereFilter.value,
            classe: classeFilter.value,
            groupe: groupeFilter.value,
            etudiant: studentFilter.value,
            statut: statusFilter.value,
            date_start: dateStartFilter.value,
            date_end: dateEndFilter.value
        };
        
        currentPage = 1; // Reset to first page
        loadRecords();
    });
    
    // Reset filters
    resetBtn.addEventListener('click', function() {
        filiereFilter.value = '';
        classeFilter.value = '';
        groupeFilter.value = '';
        studentFilter.value = '';
        statusFilter.value = '';
        dateStartFilter.value = '';
        dateEndFilter.value = '';
        
        // Show all student options
        Array.from(studentFilter.options).forEach(option => {
            option.style.display = '';
        });
        
        currentFilters = {};
        currentPage = 1;
        loadRecords();
    });
    
    // Pagination event listeners
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            loadRecords();
        }
    });
    
    nextPageBtn.addEventListener('click', function() {
        currentPage++;
        loadRecords();
    });
    
    // Traitement des enregistrements
    processBtn.addEventListener('click', function() {
        processBtn.disabled = true;
        resultMessage.textContent = "Traitement en cours...";
        resultMessage.className = "";
        
        fetch('process_records.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    resultMessage.textContent = `Traitement réussi: ${data.processed} enregistrement(s) transféré(s)`;
                    resultMessage.className = "success";
                } else {
                    resultMessage.textContent = `Erreur: ${data.message}`;
                    resultMessage.className = "error";
                }
                
                // Recharger les statistiques et les enregistrements
                loadStats();
                loadRecords();
            })
            .catch(error => {
                console.error('Erreur lors du traitement:', error);
                resultMessage.textContent = "Une erreur s'est produite lors du traitement";
                resultMessage.className = "error";
                processBtn.disabled = false;
            });
    });
    
    // Charger les données initiales
    loadStats();
    loadFilterOptions();
    loadRecords();
});