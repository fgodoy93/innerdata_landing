document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                // Close menu if open (on mobile)
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }

                // Scroll
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Modals
    const modalButtons = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal-overlay');
    const closeButtons = document.querySelectorAll('.modal-close');

    // Open Modal
    modalButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default if inside a link, though here they are buttons
            const modalId = btn.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.classList.add('modal-open');
            }
        });
    });

    // Close Modal via X button
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-overlay');
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
        });
    });

    // Close Modal via Clicking Outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });
    });


    // Scroll Animations (Intersection Observer)
    const fadeElems = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    fadeElems.forEach(elem => {
        appearOnScroll.observe(elem);
    });

    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const empresa = document.getElementById('empresa_cargo').value;
            const mensaje = document.getElementById('mensaje').value;

            // Simple validation check (HTML attributes handles most)
            if (!nombre || !email || !mensaje) {
                showToast('Por favor, complete todos los campos obligatorios.', 'error');
                return;
            }

            const subject = `Nuevo contacto desde web: ${nombre} - ${empresa}`;
            const body = `Nombre: ${nombre}%0D%0ACorreo: ${email}%0D%0AEmpresa/Cargo: ${empresa}%0D%0A%0D%0AMensaje:%0D%0A${mensaje}`;

            // Construct the mailto URL
            const mailtoUrl = `mailto:contacto@innerdata.cl?subject=${encodeURIComponent(subject)}&body=${body}`;

            // Show feedback immediately
            showToast('Abriendo su cliente de correo para enviar mensaje...', 'success');
            contactForm.reset();

            // Delay the mailto action slightly to ensure UI updates and doesn't block
            setTimeout(() => {
                window.location.href = mailtoUrl;
            }, 1000);
        });
    }

    // Toast Notification Function
    function showToast(message, type = 'success') {
        // Create container if not exists
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';

        toast.innerHTML = `
            <div class="toast-icon"><i class="fas ${iconClass}"></i></div>
            <div class="toast-message">${message}</div>
        `;

        // Add to container
        container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('active');
        });

        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => {
                toast.remove();
                if (container.children.length === 0) {
                    container.remove();
                }
            }, 400); // Wait for transition
        }, 4000);
    }
});
