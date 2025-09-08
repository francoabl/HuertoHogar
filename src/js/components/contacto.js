// Contacto.js - Manejo del formulario de contacto

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');

    // Validación en tiempo real
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearValidation);
    });

    // Manejo del envío del formulario
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });

    function validateField(e) {
        const field = e.target;
        const fieldType = field.type;
        const value = field.value.trim();
        
        // Limpiar validaciones anteriores
        field.classList.remove('is-invalid', 'is-valid');
        
        let isValid = true;
        
        // Validaciones específicas por campo
        switch(field.id) {
            case 'nombre':
                isValid = value.length >= 2;
                break;
            case 'correo':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                break;
            case 'mensaje':
                isValid = value.length >= 10;
                break;
            case 'acepto-terminos':
                isValid = field.checked;
                break;
        }
        
        // Aplicar clases de validación
        if (field.required && value === '') {
            // Campo requerido vacío
            field.classList.add('is-invalid');
        } else if (field.required || value !== '') {
            // Campo con valor o requerido
            field.classList.add(isValid ? 'is-valid' : 'is-invalid');
        }
    }

    function clearValidation(e) {
        const field = e.target;
        if (field.classList.contains('is-invalid')) {
            field.classList.remove('is-invalid');
        }
    }

    function validateForm() {
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            validateField({ target: field });
            if (field.classList.contains('is-invalid')) {
                isValid = false;
            }
        });

        return isValid;
    }

    function submitForm() {
        // Mostrar estado de carga
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
        
        // Ocultar mensajes anteriores
        successMessage.classList.add('d-none');
        errorMessage.classList.add('d-none');
        
        // Simular envío del formulario (aquí conectarías con tu backend)
        setTimeout(() => {
            // Simular éxito (cambiar por lógica real)
            const success = Math.random() > 0.2; // 80% de éxito para demo
            
            if (success) {
                showSuccessMessage();
                resetForm();
            } else {
                showErrorMessage();
            }
            
            // Restaurar botón
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }, 2000);
    }

    function showSuccessMessage() {
        successMessage.classList.remove('d-none');
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Vibración en dispositivos móviles (si está disponible)
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
    }

    function showErrorMessage() {
        errorMessage.classList.remove('d-none');
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function resetForm() {
        contactForm.reset();
        
        // Limpiar clases de validación
        const fields = contactForm.querySelectorAll('.is-valid, .is-invalid');
        fields.forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });
    }

    // Scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Contador de caracteres para el textarea
    const messageTextarea = document.getElementById('mensaje');
    if (messageTextarea) {
        const charCounter = document.createElement('div');
        charCounter.className = 'form-text text-end mt-1';
        charCounter.id = 'char-counter';
        messageTextarea.parentNode.appendChild(charCounter);

        messageTextarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            const minLength = 10;
            const maxLength = 500;
            
            charCounter.textContent = `${currentLength}/${maxLength} caracteres`;
            
            if (currentLength < minLength) {
                charCounter.className = 'form-text text-end mt-1 text-warning';
                charCounter.textContent += ` (mínimo ${minLength})`;
            } else if (currentLength > maxLength) {
                charCounter.className = 'form-text text-end mt-1 text-danger';
                this.value = this.value.substring(0, maxLength);
            } else {
                charCounter.className = 'form-text text-end mt-1 text-success';
            }
        });

        // Inicializar contador
        messageTextarea.dispatchEvent(new Event('input'));
    }
});
