
// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize admin panel
    initializeSidebar();
    initializeCharts();
    initializeModals();
    initializeTables();
    
    // Show dashboard by default
    showSection('dashboard');
});

// Sidebar Navigation
function initializeSidebar() {
    const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get section to show
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
}

// Show/Hide Sections
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Initialize Charts
function initializeCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Ventas ($)',
                    data: [65000, 59000, 80000, 81000, 56000, 95000, 87000],
                    borderColor: '#7cb342',
                    backgroundColor: 'rgba(124, 179, 66, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#7cb342',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                elements: {
                    point: {
                        hoverBackgroundColor: '#7cb342',
                        hoverBorderColor: '#ffffff'
                    }
                }
            }
        });
    }
}

// Initialize Modals
function initializeModals() {
    // Add Product Modal
    const addProductModal = document.getElementById('addProductModal');
    if (addProductModal) {
        addProductModal.addEventListener('show.bs.modal', function() {
            // Reset form when modal opens
            const form = this.querySelector('form');
            if (form) {
                form.reset();
            }
        });
    }
}

// Initialize Tables
function initializeTables() {
    // Product table functionality
    initializeProductTable();
    initializeOrdersTable();
    initializeUsersTable();
}

function initializeProductTable() {
    // Select all checkbox functionality
    const selectAllCheckbox = document.querySelector('thead input[type="checkbox"]');
    const rowCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
    
    // Individual checkbox change
    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedBoxes = document.querySelectorAll('tbody input[type="checkbox"]:checked');
            selectAllCheckbox.checked = checkedBoxes.length === rowCheckboxes.length;
            selectAllCheckbox.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < rowCheckboxes.length;
        });
    });
    
    // Edit product buttons
    const editButtons = document.querySelectorAll('.btn-outline-primary');
    editButtons.forEach(button => {
        if (button.querySelector('.fa-edit')) {
            button.addEventListener('click', function() {
                // Get product data from row
                const row = this.closest('tr');
                const productName = row.cells[2].textContent;
                
                // Show edit modal or redirect to edit page
                showNotification('Editando: ' + productName, 'info');
            });
        }
    });
    
    // Delete product buttons
    const deleteButtons = document.querySelectorAll('.btn-outline-danger');
    deleteButtons.forEach(button => {
        if (button.querySelector('.fa-trash')) {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const productName = row.cells[2].textContent;
                
                if (confirm('¿Estás seguro de que quieres eliminar ' + productName + '?')) {
                    // Simulate delete
                    row.style.opacity = '0.5';
                    setTimeout(() => {
                        row.remove();
                        showNotification('Producto eliminado correctamente', 'success');
                    }, 300);
                }
            });
        }
    });
}

function initializeOrdersTable() {
    // Order action buttons
    const viewButtons = document.querySelectorAll('.fa-eye');
    const checkButtons = document.querySelectorAll('.fa-check');
    const printButtons = document.querySelectorAll('.fa-print');
    
    viewButtons.forEach(button => {
        button.closest('.btn').addEventListener('click', function() {
            const row = this.closest('tr');
            const orderId = row.cells[0].textContent;
            showNotification('Viendo detalles del pedido ' + orderId, 'info');
        });
    });
    
    checkButtons.forEach(button => {
        button.closest('.btn').addEventListener('click', function() {
            const row = this.closest('tr');
            const orderId = row.cells[0].textContent;
            const statusCell = row.cells[4];
            
            if (confirm('¿Marcar pedido ' + orderId + ' como completado?')) {
                statusCell.innerHTML = '<span class="badge bg-success">Completado</span>';
                showNotification('Pedido ' + orderId + ' marcado como completado', 'success');
            }
        });
    });
    
    printButtons.forEach(button => {
        button.closest('.btn').addEventListener('click', function() {
            const row = this.closest('tr');
            const orderId = row.cells[0].textContent;
            showNotification('Imprimiendo pedido ' + orderId, 'info');
        });
    });
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('es-CL', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

// Search and Filter Functions
function initializeFilters() {
    const searchInputs = document.querySelectorAll('input[type="text"]');
    const selectFilters = document.querySelectorAll('select.form-select');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', debounce(performSearch, 300));
    });
    
    selectFilters.forEach(select => {
        select.addEventListener('change', performFilter);
    });
}

function performSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const table = event.target.closest('.admin-card').querySelector('table tbody');
    
    if (table) {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }
}

function performFilter(event) {
    const filterValue = event.target.value;
    const filterType = event.target.getAttribute('data-filter');
    
    // Implement filtering logic based on filter type
    showNotification(`Aplicando filtro: ${filterValue}`, 'info');
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Dashboard Stats Animation
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number based on original format
            if (stat.textContent.includes('$')) {
                stat.textContent = '$' + Math.floor(current).toLocaleString() + 'K';
            } else {
                stat.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    });
}

// Initialize animations when dashboard is shown
document.addEventListener('DOMContentLoaded', function() {
    // Animate stats when page loads
    setTimeout(animateStats, 500);
});

// Users Management Functions
function initializeUsersTable() {
    // Bulk selection functionality
    const selectAllCheckbox = document.querySelector('#usuarios-section thead input[type="checkbox"]');
    const rowCheckboxes = document.querySelectorAll('#usuarios-section tbody input[type="checkbox"]');
    const bulkActionsDiv = document.querySelector('#usuarios-section .bulk-actions');
    const selectedCountSpan = document.querySelector('#selectedCount');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateBulkActions();
        });
    }
    
    // Individual checkbox change
    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedBoxes = document.querySelectorAll('#usuarios-section tbody input[type="checkbox"]:checked');
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = checkedBoxes.length === rowCheckboxes.length;
                selectAllCheckbox.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < rowCheckboxes.length;
            }
            updateBulkActions();
        });
    });
    
    function updateBulkActions() {
        const checkedBoxes = document.querySelectorAll('#usuarios-section tbody input[type="checkbox"]:checked');
        if (bulkActionsDiv && selectedCountSpan) {
            if (checkedBoxes.length > 0) {
                bulkActionsDiv.classList.remove('d-none');
                selectedCountSpan.textContent = checkedBoxes.length;
            } else {
                bulkActionsDiv.classList.add('d-none');
            }
        }
    }
    
    // User action buttons
    initializeUserActionButtons();
}

function initializeUserActionButtons() {
    // View user buttons
    const viewButtons = document.querySelectorAll('#usuarios-section .btn-outline-primary[title="Ver Perfil"]');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const userName = row.querySelector('strong').textContent;
            const userId = row.querySelector('small').textContent;
            showNotification(`Viendo perfil de ${userName} (${userId})`, 'info');
        });
    });
    
    // Edit user buttons
    const editButtons = document.querySelectorAll('#usuarios-section .btn-outline-warning[title="Editar"]');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const userName = row.querySelector('strong').textContent;
            showNotification(`Editando usuario: ${userName}`, 'info');
        });
    });
    
    // Suspend/Ban user buttons
    const suspendButtons = document.querySelectorAll('#usuarios-section .btn-outline-danger[title="Suspender"]');
    suspendButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const userName = row.querySelector('strong').textContent;
            
            if (confirm(`¿Estás seguro de que quieres suspender a ${userName}?`)) {
                const statusCell = row.cells[6];
                statusCell.innerHTML = '<span class="badge bg-warning">Suspendido</span>';
                showNotification(`Usuario ${userName} suspendido`, 'warning');
            }
        });
    });
    
    // Activate user buttons
    const activateButtons = document.querySelectorAll('#usuarios-section .btn-outline-success[title="Activar"]');
    activateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const userName = row.querySelector('strong').textContent;
            
            const statusCell = row.cells[6];
            statusCell.innerHTML = '<span class="badge bg-success">Activo</span>';
            showNotification(`Usuario ${userName} activado`, 'success');
        });
    });
    
    // Delete user buttons
    const deleteButtons = document.querySelectorAll('#usuarios-section .btn-outline-danger[title="Eliminar"]');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const userName = row.querySelector('strong').textContent;
            
            if (confirm(`¿ADVERTENCIA: Esta acción eliminará permanentemente a ${userName}.\n\n¿Estás completamente seguro?`)) {
                row.style.opacity = '0.5';
                setTimeout(() => {
                    row.remove();
                    showNotification(`Usuario ${userName} eliminado permanentemente`, 'danger');
                }, 300);
            }
        });
    });
    
    // Commission buttons (for sellers)
    const commissionButtons = document.querySelectorAll('#usuarios-section .btn-outline-info[title="Comisiones"]');
    commissionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const userName = row.querySelector('strong').textContent;
            showNotification(`Viendo comisiones de ${userName}`, 'info');
        });
    });
    
    // History/Logs buttons
    const historyButtons = document.querySelectorAll('#usuarios-section .btn-outline-secondary[title="Logs"]');
    historyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const userName = row.querySelector('strong').textContent;
            showNotification(`Viendo historial de actividad de ${userName}`, 'info');
        });
    });
}

// Save new user function
function saveUser() {
    const form = document.getElementById('addUserForm');
    const formData = new FormData(form);
    const userData = Object.fromEntries(formData.entries());
    
    // Basic validation
    if (!userData.fullName || !userData.email || !userData.userType || !userData.password) {
        showNotification('Por favor completa todos los campos obligatorios', 'danger');
        return;
    }
    
    // Password confirmation
    if (userData.password !== userData.confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'danger');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
        showNotification('Por favor ingresa un email válido', 'danger');
        return;
    }
    
    // Show loading state
    const saveButton = document.querySelector('#addUserModal .btn-primary');
    const originalText = saveButton.innerHTML;
    saveButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creando Usuario...';
    saveButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        saveButton.innerHTML = originalText;
        saveButton.disabled = false;
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
        modal.hide();
        
        // Reset form
        form.reset();
        
        // Show success message
        showNotification(`Usuario ${userData.fullName} creado exitosamente`, 'success');
        
        // Optionally add to table (in a real app, you'd refresh the data)
        addUserToTable(userData);
    }, 2000);
}

function addUserToTable(userData) {
    const tbody = document.querySelector('#usuarios-section tbody');
    if (!tbody) return;
    
    const newRow = document.createElement('tr');
    const userId = '#' + (1000 + Math.floor(Math.random() * 9000));
    const userTypeColors = {
        cliente: 'info',
        vendedor: 'warning', 
        admin: 'danger'
    };
    
    newRow.innerHTML = `
        <td><input type="checkbox" class="form-check-input"></td>
        <td>
            <div class="user-avatar">
                <i class="fas fa-user"></i>
            </div>
        </td>
        <td>
            <div>
                <strong>${userData.fullName}</strong>
                <br><small class="text-muted">ID: ${userId}</small>
            </div>
        </td>
        <td>${userData.email}</td>
        <td>${userData.phone || 'No especificado'}</td>
        <td><span class="badge bg-${userTypeColors[userData.userType]}">${userData.userType.charAt(0).toUpperCase() + userData.userType.slice(1)}</span></td>
        <td><span class="badge bg-success">Activo</span></td>
        <td>${new Date().toLocaleDateString('es-CL')}</td>
        <td>Recién creado</td>
        <td>
            <div class="btn-group" role="group">
                <button class="btn btn-sm btn-outline-primary" title="Ver Perfil">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" title="Suspender">
                    <i class="fas fa-ban"></i>
                </button>
            </div>
        </td>
    `;
    
    tbody.insertBefore(newRow, tbody.firstChild);
    
    // Reinitialize event listeners for the new row
    initializeUserActionButtons();
}

// Export functions for external use
window.AdminPanel = {
    showSection,
    showNotification,
    formatCurrency,
    formatDate,
    saveUser
};

// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize admin panel
    initializeSidebar();
    initializeCharts();
    initializeModals();
    initializeTables();
    
    // Show dashboard by default
    showSection('dashboard');
});

// Sidebar Navigation
function initializeSidebar() {
    const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get section to show
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
}

// Show/Hide Sections
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Initialize Charts
function initializeCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Ventas ($)',
                    data: [65000, 59000, 80000, 81000, 56000, 95000, 87000],
                    borderColor: '#7cb342',
                    backgroundColor: 'rgba(124, 179, 66, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#7cb342',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                elements: {
                    point: {
                        hoverBackgroundColor: '#7cb342',
                        hoverBorderColor: '#ffffff'
                    }
                }
            }
        });
    }
}

// Initialize Modals
function initializeModals() {
    // Add Product Modal
    const addProductModal = document.getElementById('addProductModal');
    if (addProductModal) {
        addProductModal.addEventListener('show.bs.modal', function() {
            // Reset form when modal opens
            const form = this.querySelector('form');
            if (form) {
                form.reset();
            }
        });
    }
}

// Initialize Tables
function initializeTables() {
    // Product table functionality
    initializeProductTable();
    initializeOrdersTable();
    initializeUsersTable();
}

function initializeProductTable() {
    // Select all checkbox functionality
    const selectAllCheckbox = document.querySelector('thead input[type="checkbox"]');
    const rowCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
    
    // Individual checkbox change
    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedBoxes = document.querySelectorAll('tbody input[type="checkbox"]:checked');
            selectAllCheckbox.checked = checkedBoxes.length === rowCheckboxes.length;
            selectAllCheckbox.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < rowCheckboxes.length;
        });
    });
    
    // Edit product buttons
    const editButtons = document.querySelectorAll('.btn-outline-primary');
    editButtons.forEach(button => {
        if (button.querySelector('.fa-edit')) {
            button.addEventListener('click', function() {
                // Get product data from row
                const row = this.closest('tr');
                const productName = row.cells[2].textContent;
                
                // Show edit modal or redirect to edit page
                showNotification('Editando: ' + productName, 'info');
            });
        }
    });
    
    // Delete product buttons
    const deleteButtons = document.querySelectorAll('.btn-outline-danger');
    deleteButtons.forEach(button => {
        if (button.querySelector('.fa-trash')) {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const productName = row.cells[2].textContent;
                
                if (confirm('¿Estás seguro de que quieres eliminar ' + productName + '?')) {
                    // Simulate delete
                    row.style.opacity = '0.5';
                    setTimeout(() => {
                        row.remove();
                        showNotification('Producto eliminado correctamente', 'success');
                    }, 300);
                }
            });
        }
    });
}

function initializeOrdersTable() {
    // Order action buttons
    const viewButtons = document.querySelectorAll('.fa-eye');
    const checkButtons = document.querySelectorAll('.fa-check');
    const printButtons = document.querySelectorAll('.fa-print');
    
    viewButtons.forEach(button => {
        button.closest('.btn').addEventListener('click', function() {
            const row = this.closest('tr');
            const orderId = row.cells[0].textContent;
            showNotification('Viendo detalles del pedido ' + orderId, 'info');
        });
    });
    
    checkButtons.forEach(button => {
        button.closest('.btn').addEventListener('click', function() {
            const row = this.closest('tr');
            const orderId = row.cells[0].textContent;
            const statusCell = row.cells[4];
            
            if (confirm('¿Marcar pedido ' + orderId + ' como completado?')) {
                statusCell.innerHTML = '<span class="badge bg-success">Completado</span>';
                showNotification('Pedido ' + orderId + ' marcado como completado', 'success');
            }
        });
    });
    
    printButtons.forEach(button => {
        button.closest('.btn').addEventListener('click', function() {
            const row = this.closest('tr');
            const orderId = row.cells[0].textContent;
            showNotification('Imprimiendo pedido ' + orderId, 'info');
        });
    });
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('es-CL', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

// Search and Filter Functions
function initializeFilters() {
    const searchInputs = document.querySelectorAll('input[type="text"]');
    const selectFilters = document.querySelectorAll('select.form-select');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', debounce(performSearch, 300));
    });
    
    selectFilters.forEach(select => {
        select.addEventListener('change', performFilter);
    });
}

function performSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const table = event.target.closest('.admin-card').querySelector('table tbody');
    
    if (table) {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }
}

function performFilter(event) {
    const filterValue = event.target.value;
    const filterType = event.target.getAttribute('data-filter');
    
    // Implement filtering logic based on filter type
    showNotification(`Aplicando filtro: ${filterValue}`, 'info');
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Dashboard Stats Animation
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number based on original format
            if (stat.textContent.includes('$')) {
                stat.textContent = '$' + Math.floor(current).toLocaleString() + 'K';
            } else {
                stat.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    });
}

// Initialize animations when dashboard is shown
document.addEventListener('DOMContentLoaded', function() {
    // Animate stats when page loads
    setTimeout(animateStats, 500);
});

// Users Management Functions
function initializeUsersTable() {
    // Bulk selection functionality
    const selectAllCheckbox = document.querySelector('#usuarios-section thead input[type="checkbox"]');
    const rowCheckboxes = document.querySelectorAll('#usuarios-section tbody input[type="checkbox"]');
    const bulkActionsDiv = document.querySelector('#usuarios-section .bulk-actions');
    const selectedCountSpan = document.querySelector('#selectedCount');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateBulkActions();
        });
    }
    
    // Individual checkbox change
    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedBoxes = document.querySelectorAll('#usuarios-section tbody input[type="checkbox"]:checked');
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = checkedBoxes.length === rowCheckboxes.length;
                selectAllCheckbox.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < rowCheckboxes.length;
            }
            updateBulkActions();
        });
    });
    
    function updateBulkActions() {
        const checkedBoxes = document.querySelectorAll('#usuarios-section tbody input[type="checkbox"]:checked');
        if (bulkActionsDiv && selectedCountSpan) {
            if (checkedBoxes.length > 0) {
                bulkActionsDiv.classList.remove('d-none');
                selectedCountSpan.textContent = checkedBoxes.length;
            } else {
                bulkActionsDiv.classList.add('d-none');
            }
        }
    }
    
    // User action buttons
    initializeUserActionButtons();
}

function initializeUserActionButtons() {
    // View user buttons
    const viewButtons = document.querySelectorAll('#usuarios-section .btn-outline-primary[title="Ver Perfil"]');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const userName = row.querySelector('strong').textContent;
            const userId = row.querySelector('small').textContent;
            showNotification(`Viendo perfil de ${userName} (${userId})`, 'info');
        });
    });
    
    // Edit user buttons
    const editButtons = document.querySelectorAll('#usuarios-section .btn-outline-warning[title="Editar"]');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const userName = row.querySelector('strong').textContent;
            showNotification(`Editando usuario: ${userName}`, 'info');
        });
    });
    
    // Suspend/Ban user buttons
    const suspendButtons = document.querySelectorAll('#usuarios-section .btn-outline-danger[title="Suspender"]');
    suspendButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const userName = row.querySelector('strong').textContent;
            
            if (confirm(`¿Estás seguro de que quieres suspender a ${userName}?`)) {
                const statusCell = row.cells[6];
                statusCell.innerHTML = '<span class="badge bg-warning">Suspendido</span>';
                showNotification(`Usuario ${userName} suspendido`, 'warning');
            }
        });
    });
    
    // Activate user buttons
    const activateButtons = document.querySelectorAll('#usuarios-section .btn-outline-success[title="Activar"]');
    activateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const userName = row.querySelector('strong').textContent;
            
            const statusCell = row.cells[6];
            statusCell.innerHTML = '<span class="badge bg-success">Activo</span>';
            showNotification(`Usuario ${userName} activado`, 'success');
        });
    });
    
    // Delete user buttons
    const deleteButtons = document.querySelectorAll('#usuarios-section .btn-outline-danger[title="Eliminar"]');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const userName = row.querySelector('strong').textContent;
            
            if (confirm(`¿ADVERTENCIA: Esta acción eliminará permanentemente a ${userName}.\n\n¿Estás completamente seguro?`)) {
                row.style.opacity = '0.5';
                setTimeout(() => {
                    row.remove();
                    showNotification(`Usuario ${userName} eliminado permanentemente`, 'danger');
                }, 300);
            }
        });
    });
    
    // Commission buttons (for sellers)
    const commissionButtons = document.querySelectorAll('#usuarios-section .btn-outline-info[title="Comisiones"]');
    commissionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const userName = row.querySelector('strong').textContent;
            showNotification(`Viendo comisiones de ${userName}`, 'info');
        });
    });
    
    // History/Logs buttons
    const historyButtons = document.querySelectorAll('#usuarios-section .btn-outline-secondary[title="Logs"]');
    historyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const userName = row.querySelector('strong').textContent;
            showNotification(`Viendo historial de actividad de ${userName}`, 'info');
        });
    });
}

// Save new user function
function saveUser() {
    const form = document.getElementById('addUserForm');
    const formData = new FormData(form);
    const userData = Object.fromEntries(formData.entries());
    
    // Basic validation
    if (!userData.fullName || !userData.email || !userData.userType || !userData.password) {
        showNotification('Por favor completa todos los campos obligatorios', 'danger');
        return;
    }
    
    // Password confirmation
    if (userData.password !== userData.confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'danger');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
        showNotification('Por favor ingresa un email válido', 'danger');
        return;
    }
    
    // Show loading state
    const saveButton = document.querySelector('#addUserModal .btn-primary');
    const originalText = saveButton.innerHTML;
    saveButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creando Usuario...';
    saveButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        saveButton.innerHTML = originalText;
        saveButton.disabled = false;
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
        modal.hide();
        
        // Reset form
        form.reset();
        
        // Show success message
        showNotification(`Usuario ${userData.fullName} creado exitosamente`, 'success');
        
        // Optionally add to table (in a real app, you'd refresh the data)
        addUserToTable(userData);
    }, 2000);
}

function addUserToTable(userData) {
    const tbody = document.querySelector('#usuarios-section tbody');
    if (!tbody) return;
    
    const newRow = document.createElement('tr');
    const userId = '#' + (1000 + Math.floor(Math.random() * 9000));
    const userTypeColors = {
        cliente: 'info',
        vendedor: 'warning', 
        admin: 'danger'
    };
    
    newRow.innerHTML = `
        <td><input type="checkbox" class="form-check-input"></td>
        <td>
            <div class="user-avatar">
                <i class="fas fa-user"></i>
            </div>
        </td>
        <td>
            <div>
                <strong>${userData.fullName}</strong>
                <br><small class="text-muted">ID: ${userId}</small>
            </div>
        </td>
        <td>${userData.email}</td>
        <td>${userData.phone || 'No especificado'}</td>
        <td><span class="badge bg-${userTypeColors[userData.userType]}">${userData.userType.charAt(0).toUpperCase() + userData.userType.slice(1)}</span></td>
        <td><span class="badge bg-success">Activo</span></td>
        <td>${new Date().toLocaleDateString('es-CL')}</td>
        <td>Recién creado</td>
        <td>
            <div class="btn-group" role="group">
                <button class="btn btn-sm btn-outline-primary" title="Ver Perfil">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" title="Suspender">
                    <i class="fas fa-ban"></i>
                </button>
            </div>
        </td>
    `;
    
    tbody.insertBefore(newRow, tbody.firstChild);
    
    // Reinitialize event listeners for the new row
    initializeUserActionButtons();
}

// Export functions for external use
window.AdminPanel = {
    showSection,
    showNotification,
    formatCurrency,
    formatDate,
    saveUser
};

