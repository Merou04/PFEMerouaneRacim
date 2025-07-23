/**
 * Gestion de la barre latérale responsive
 */
document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const body = document.body;
    
    if (!sidebarToggle || !sidebar) return;
    
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
    sidebarToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        if (sidebar.classList.contains('active')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });
    
    // Fermer la sidebar lorsqu'on clique à l'extérieur sur mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 992 && sidebar.classList.contains('active')) {
            // Vérifier si le clic est en dehors de la sidebar et du bouton toggle
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnToggle = sidebarToggle.contains(event.target);
            
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
});