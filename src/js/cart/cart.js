/**
 * Sistema de Carrito de Compras - HuertoHogar
 * Maneja la funcionalidad del carrito con persistencia en localStorage
 */

class CartManager {
    constructor() {
        this.cartKey = 'huertohogar_cart';
        this.cart = this.loadCart();
        this.init();
    }

    // Inicializar el carrito
    init() {
        console.log('Inicializando CartManager...');
        console.log('Carrito inicial:', this.cart);
        this.updateCartDisplay();
        this.setupEventListeners();
        console.log('CartManager inicializado correctamente');
    }

    // Cargar carrito desde localStorage
    loadCart() {
        try {
            const savedCart = localStorage.getItem(this.cartKey);
            const cart = savedCart ? JSON.parse(savedCart) : [];
            console.log('Carrito cargado desde localStorage:', cart);
            return cart;
        } catch (error) {
            console.error('Error al cargar carrito:', error);
            return [];
        }
    }

    // Guardar carrito en localStorage
    saveCart() {
        try {
            localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
            console.log('Carrito guardado:', this.cart);
        } catch (error) {
            console.error('Error al guardar carrito:', error);
        }
    }

    // Agregar producto al carrito
    addProduct(product, quantity = 1) {
        if (!product || !product.id) {
            console.error('Producto inválido');
            return false;
        }

        console.log('Agregando producto al carrito:', product);
        
        const existingIndex = this.cart.findIndex(item => item.id === product.id);
        
        if (existingIndex !== -1) {
            // Si el producto ya existe, incrementar cantidad
            this.cart[existingIndex].quantity += quantity;
            console.log('Producto existente, nueva cantidad:', this.cart[existingIndex].quantity);
        } else {
            // Si es nuevo, agregarlo
            const newItem = {
                id: product.id,
                nombre: product.nombre,
                precio: product.precio,
                imagen: product.imagen,
                categoria: product.categoria,
                quantity: quantity
            };
            this.cart.push(newItem);
            console.log('Nuevo producto agregado:', newItem);
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showAddedMessage(product.nombre);
        return true;
    }

    // Remover producto del carrito
    removeProduct(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }

    // Actualizar cantidad de un producto
    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeProduct(productId);
            return;
        }

        const index = this.cart.findIndex(item => item.id === productId);
        if (index !== -1) {
            this.cart[index].quantity = newQuantity;
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    // Vaciar carrito
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartDisplay();
    }

    // Obtener cantidad total de productos
    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Obtener precio total
    getTotalPrice() {
        return this.cart.reduce((total, item) => total + (item.precio * item.quantity), 0);
    }

    // Obtener productos del carrito
    getCartItems() {
        return [...this.cart];
    }

    // Actualizar visualización del carrito en el navbar
    updateCartDisplay() {
        const cartCount = this.getTotalItems();
        const cartElements = document.querySelectorAll('.cart-count');
        
        console.log('Actualizando display del carrito. Items:', cartCount);
        
        cartElements.forEach(element => {
            element.textContent = cartCount;
            element.style.display = cartCount > 0 ? 'inline' : 'none';
        });

        // Actualizar icono del carrito
        const cartIcons = document.querySelectorAll('.cart-icon');
        cartIcons.forEach(icon => {
            if (cartCount > 0) {
                icon.classList.add('has-items');
            } else {
                icon.classList.remove('has-items');
            }
        });

        // Disparar evento personalizado
        document.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: {
                items: this.cart,
                totalItems: cartCount,
                totalPrice: this.getTotalPrice()
            }
        }));
    }

    // Mostrar mensaje de producto agregado
    showAddedMessage(productName) {
        // Crear o encontrar contenedor de mensajes
        let messageContainer = document.getElementById('messageContainer');
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.id = 'messageContainer';
            messageContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
            `;
            document.body.appendChild(messageContainer);
        }

        // Crear mensaje
        const message = document.createElement('div');
        message.className = 'alert alert-success alert-dismissible fade show';
        message.style.cssText = `
            margin-bottom: 10px;
            min-width: 300px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            animation: slideIn 0.3s ease;
        `;
        message.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            <strong>${productName}</strong> agregado al carrito
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        messageContainer.appendChild(message);

        // Auto-remover después de 4 segundos
        setTimeout(() => {
            if (message.parentNode) {
                message.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (message.parentNode) {
                        message.remove();
                    }
                }, 300);
            }
        }, 4000);
    }

    // Configurar event listeners
    setupEventListeners() {
        // Listener para botones "Agregar al carrito"
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-add-to-cart, .btn-add-to-cart *')) {
                console.log('Click en botón agregar carrito detectado en:', e.target);
                console.log('Página actual:', window.location.pathname);
                e.preventDefault();
                e.stopPropagation();
                
                let button = e.target;
                while (button && !button.classList.contains('btn-add-to-cart')) {
                    button = button.parentElement;
                }

                if (button) {
                    console.log('Botón encontrado:', button);
                    console.log('Classes del botón:', button.className);
                    const productData = button.dataset;
                    console.log('Datos del producto:', productData);
                    
                    const product = {
                        id: parseInt(productData.id),
                        nombre: productData.nombre,
                        precio: parseInt(productData.precio),
                        imagen: productData.imagen,
                        categoria: productData.categoria
                    };

                    console.log('Producto a agregar:', product);
                    this.addProduct(product);
                } else {
                    console.log('No se encontró botón con clase btn-add-to-cart');
                }
            }
        });

        // Listener para cambios en el carrito
        document.addEventListener('cartUpdated', (e) => {
            console.log('Carrito actualizado:', e.detail);
        });
    }

    // Crear modal del carrito
    createCartModal() {
        const modalHtml = `
            <div class="modal fade" id="cartModal" tabindex="-1" aria-labelledby="cartModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="cartModalLabel">
                                <i class="fas fa-shopping-cart me-2"></i>Mi Carrito
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body" id="cartModalBody">
                            <!-- Contenido dinámico del carrito -->
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Seguir comprando</button>
                            <button type="button" class="btn btn-primary" id="checkoutBtn">
                                <i class="fas fa-credit-card me-2"></i>Proceder al pago
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Agregar modal al DOM si no existe
        if (!document.getElementById('cartModal')) {
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        }
    }

    // Mostrar modal del carrito
    showCartModal() {
        this.createCartModal();
        this.updateCartModalContent();
        
        const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
        cartModal.show();
    }

    // Actualizar contenido del modal del carrito
    updateCartModalContent() {
        const modalBody = document.getElementById('cartModalBody');
        
        if (this.cart.length === 0) {
            modalBody.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-shopping-cart text-muted" style="font-size: 3rem;"></i>
                    <h4 class="mt-3 text-muted">Tu carrito está vacío</h4>
                    <p class="text-muted">Agrega algunos productos para comenzar</p>
                    <a href="productos.html" class="btn btn-primary">
                        <i class="fas fa-shopping-basket me-2"></i>Ver Productos
                    </a>
                </div>
            `;
            document.getElementById('checkoutBtn').style.display = 'none';
            return;
        }

        document.getElementById('checkoutBtn').style.display = 'block';
        
        const itemsHtml = this.cart.map(item => `
            <div class="cart-item border-bottom py-3" data-id="${item.id}">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.imagen}" alt="${item.nombre}" class="img-fluid rounded" style="max-height: 60px;">
                    </div>
                    <div class="col-md-4">
                        <h6 class="mb-1">${item.nombre}</h6>
                        <small class="text-muted">${this.getCategoriaDisplayName(item.categoria)}</small>
                    </div>
                    <div class="col-md-2">
                        <span class="fw-bold text-success">$${item.precio.toLocaleString('es-CL')}</span>
                    </div>
                    <div class="col-md-3">
                        <div class="input-group input-group-sm">
                            <button class="btn btn-outline-secondary quantity-btn" type="button" data-action="decrease" data-id="${item.id}">-</button>
                            <input type="number" class="form-control text-center quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                            <button class="btn btn-outline-secondary quantity-btn" type="button" data-action="increase" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-sm btn-outline-danger remove-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        modalBody.innerHTML = `
            <div class="cart-items">
                ${itemsHtml}
            </div>
            <div class="cart-summary mt-4 p-3 bg-light rounded">
                <div class="row">
                    <div class="col-md-6">
                        <strong>Total de productos: ${this.getTotalItems()}</strong>
                    </div>
                    <div class="col-md-6 text-end">
                        <strong>Total: $${this.getTotalPrice().toLocaleString('es-CL')}</strong>
                    </div>
                </div>
            </div>
        `;

        // Agregar event listeners para el modal
        this.setupModalEventListeners();
    }

    // Event listeners para el modal del carrito
    setupModalEventListeners() {
        const modalBody = document.getElementById('cartModalBody');
        
        modalBody.addEventListener('click', (e) => {
            if (e.target.matches('.remove-item, .remove-item *')) {
                const button = e.target.closest('.remove-item');
                const productId = parseInt(button.dataset.id);
                this.removeProduct(productId);
                this.updateCartModalContent();
            }

            if (e.target.matches('.quantity-btn')) {
                const productId = parseInt(e.target.dataset.id);
                const action = e.target.dataset.action;
                const currentQuantity = parseInt(document.querySelector(`.quantity-input[data-id="${productId}"]`).value);
                
                if (action === 'increase') {
                    this.updateQuantity(productId, currentQuantity + 1);
                } else if (action === 'decrease') {
                    this.updateQuantity(productId, Math.max(1, currentQuantity - 1));
                }
                this.updateCartModalContent();
            }
        });

        modalBody.addEventListener('change', (e) => {
            if (e.target.matches('.quantity-input')) {
                const productId = parseInt(e.target.dataset.id);
                const newQuantity = parseInt(e.target.value) || 1;
                this.updateQuantity(productId, Math.max(1, newQuantity));
                this.updateCartModalContent();
            }
        });
    }

    // Obtener nombre de categoría para mostrar
    getCategoriaDisplayName(categoria) {
        const displayNames = {
            'frutas frescas': 'Frutas Frescas',
            'verduras': 'Verduras Orgánicas',
            'organicos': 'Productos Orgánicos',
            'lacteos': 'Productos Lácteos'
        };
        return displayNames[categoria?.toLowerCase()] || categoria;
    }

    // Función de debug para verificar localStorage
    debugCart() {
        console.log('=== DEBUG CARRITO ===');
        console.log('Carrito en memoria:', this.cart);
        console.log('Carrito en localStorage:', localStorage.getItem(this.cartKey));
        console.log('Total items:', this.getTotalItems());
        console.log('Total precio:', this.getTotalPrice());
        console.log('==================');
    }
}

// Inicializar carrito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Crear instancia global del carrito
    window.cartManager = new CartManager();
    
    // Agregar icono del carrito al navbar si no existe (con un pequeño delay)
    setTimeout(() => {
        addCartToNavbar();
        // Forzar actualización del display después de agregar el navbar
        if (window.cartManager) {
            window.cartManager.updateCartDisplay();
        }
    }, 100);
});

// Función para agregar el icono del carrito al navbar
function addCartToNavbar() {
    const navbars = document.querySelectorAll('.navbar-nav');
    
    navbars.forEach(navbar => {
        // Verificar si ya existe el carrito
        if (navbar.querySelector('.cart-nav-item')) return;
        
        // Crear elemento del carrito
        const cartItem = document.createElement('li');
        cartItem.className = 'nav-item ms-3 cart-nav-item';
        cartItem.innerHTML = `
            <a href="carrito.html" class="btn btn-outline-success position-relative">
                <i class="fas fa-shopping-cart cart-icon"></i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cart-count" style="display: none;">
                    0
                </span>
            </a>
        `;
        
        // Insertar antes del último elemento (botones de login/registro)
        const loggedOutElements = navbar.querySelectorAll('.logged-out-only');
        if (loggedOutElements.length > 0) {
            navbar.insertBefore(cartItem, loggedOutElements[0]);
        } else {
            navbar.appendChild(cartItem);
        }
    });
}

// Estilos CSS para el carrito
const cartStyles = `
<style>
.cart-icon.has-items {
    color: #28a745;
    animation: pulse 1s infinite;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

.cart-item {
    transition: background-color 0.2s ease;
}

.cart-item:hover {
    background-color: #f8f9fa;
}

.quantity-input {
    max-width: 60px;
}

.quantity-btn {
    width: 35px;
    height: 31px;
}

#messageContainer {
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 9999;
}

.btn-add-to-cart {
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.btn-add-to-cart:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
}

.btn-add-to-cart:active {
    transform: translateY(0);
}

.btn-add-to-cart.adding {
    background: linear-gradient(135deg, #4caf50, #66bb6a) !important;
    border-color: #4caf50 !important;
    color: white !important;
}

.btn-add-to-cart.adding::after {
    content: '¡Agregado!';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.9);
    color: #28a745;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.8rem;
    font-weight: bold;
    animation: fadeInOut 2s ease;
}

@keyframes fadeInOut {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
}

@keyframes slideIn {
    from { 
        opacity: 0; 
        transform: translateX(100%); 
    }
    to { 
        opacity: 1; 
        transform: translateX(0); 
    }
}

@keyframes slideOut {
    from { 
        opacity: 1; 
        transform: translateX(0); 
    }
    to { 
        opacity: 0; 
        transform: translateX(100%); 
    }
}

/* Mejoras para el navbar del carrito */
.cart-nav-item .btn {
    border-radius: 50px;
    padding: 8px 15px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.cart-nav-item .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
}

.cart-count {
    font-size: 0.7rem;
    min-width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}
</style>
`;

// Agregar estilos al head
document.head.insertAdjacentHTML('beforeend', cartStyles);
