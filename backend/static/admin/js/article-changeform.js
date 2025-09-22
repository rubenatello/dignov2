// Warn user before leaving if there are unsaved changes
(function() {
    var form = document.querySelector('form');
    var isDirty = false;
    if (!form) return;
    form.addEventListener('input', function() {
        isDirty = true;
    });
    window.addEventListener('beforeunload', function(e) {
        if (isDirty) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
    // Warn on navigation via admin sidebar
    var links = document.querySelectorAll('#nav-sidebar a, .breadcrumbs a');
    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            if (isDirty && !link.classList.contains('active')) {
                if (!confirm('You have unsaved changes. Are you sure you want to leave this page?')) {
                    e.preventDefault();
                }
            }
        });
    });
})();
